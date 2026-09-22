"use client";

/**
 * MarketSentimentCard
 * --------------------
 * Surfaces the day's first qualifying NIFTY entry signal (bull/bear,
 * confidence-gated), verifies whether price actually moved that way within
 * a 15-minute window, and shows live trend while the market's open.
 * Mirrors the Flutter `MarketSentimentSection_Index` widget: same states
 * (loading / no signal / has signal / error), same lookback + verification
 * + trend logic.
 *
 * Usage:
 *   <MarketSentimentCard />
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Requires Supabase tables:
 *   atlas_output(created_at timestamptz, probability numeric, entry bool,
 *                upbreakout bool, type text)
 *   nifty_ohlcv(symbol text, ts timestamptz, open numeric, close numeric,
 *               low numeric, high numeric)
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  TrendingUp,
  TrendingDown,
  CandlestickChart,
  LineChart,
  Info,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  HourglassIcon,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Moon,
  Sofa,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// CONFIG — adjust to match your schema / routes
// ---------------------------------------------------------------------------

const CANDLE_TABLE = "nifty_ohlcv";
const CANDLE_SYMBOL_COL = "symbol";
const CANDLE_SYMBOL = "NIFTY";
const CANDLE_TIME_COL = "ts";
const CANDLE_OPEN_COL = "open";
const CANDLE_CLOSE_COL = "close";

const MIN_ENTRY_PROBABILITY = 72.0;

const SIGNAL_WINDOW_START = { h: 9, m: 20 };
const SIGNAL_WINDOW_END = { h: 15, m: 20 };

const VERIFY_WINDOW_MINUTES = 15;
const MAX_LOOKBACK_DAYS = 7;

const ROUTE_CHART = "/market-sentiments-chart";
const ROUTE_ACCURACY = "/backtest/nifty";

// ---------------------------------------------------------------------------
// TIME HELPERS (IST-aware, no extra deps)
// ---------------------------------------------------------------------------

function nowIST(): Date {
  const now = new Date();
  return new Date(now.getTime() + (5.5 * 60 + now.getTimezoneOffset()) * 60000);
}

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isWeekend(d: Date) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function latestWeekdayOnOrBefore(d: Date) {
  let x = stripTime(d);
  while (isWeekend(x)) {
    x = new Date(x.getFullYear(), x.getMonth(), x.getDate() - 1);
  }
  return x;
}

function prevWeekday(d: Date) {
  let x = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
  while (isWeekend(x)) {
    x = new Date(x.getFullYear(), x.getMonth(), x.getDate() - 1);
  }
  return x;
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function withinSignalWindow(localIST: Date) {
  const mins = localIST.getHours() * 60 + localIST.getMinutes();
  const start = SIGNAL_WINDOW_START.h * 60 + SIGNAL_WINDOW_START.m;
  const end = SIGNAL_WINDOW_END.h * 60 + SIGNAL_WINDOW_END.m;
  return mins >= start && mins <= end;
}

function fmtTime(d: Date) {
  // formats using the IST wall-clock Date object already shifted by nowIST()
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
}

function fmtDay(d: Date) {
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

// IST wall-clock UTC bounds for a given IST calendar date
function istDayUtcBounds(date: Date) {
  const startUtc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0) - (5.5 * 60 * 60000));
  const endUtc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59) - (5.5 * 60 * 60000));
  return { startUtc, endUtc };
}

function toIST(utcDate: Date) {
  return new Date(utcDate.getTime() + 5.5 * 60 * 60000 + utcDate.getTimezoneOffset() * 60000);
}

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

type Status = "loading" | "hasSignal" | "noSignal" | "error";
type MarketPhase = "beforeOpen" | "open" | "afterClose" | "weekend";
type VerifyResult = "correct" | "incorrect" | "pending" | "unavailable";
type Trend = "up" | "down" | "flat";

type QualifyingSignal = {
  ts: Date; // UTC instant
  probability: number;
  isBull: boolean;
};

// ---------------------------------------------------------------------------
// DATA FETCH
// ---------------------------------------------------------------------------

async function fetchFirstQualifyingSignal(istDate: Date): Promise<QualifyingSignal | null> {
  const { startUtc, endUtc } = istDayUtcBounds(istDate);

  const { data, error } = await supabase
    .from("atlas_output")
    .select("created_at,probability,upbreakout,type")
    .eq("entry", true)
    .gte("probability", MIN_ENTRY_PROBABILITY)
    .gte("created_at", startUtc.toISOString())
    .lte("created_at", endUtc.toISOString())
    .order("created_at", { ascending: true });

  if (error) throw error;

  for (const row of data ?? []) {
    const tsUtc = new Date(row.created_at as string);
    const tsIST = toIST(tsUtc);
    if (!withinSignalWindow(tsIST)) continue;
    const isBull = row.type === "Bull" || row.upbreakout === true;
    return { ts: tsUtc, probability: Number(row.probability), isBull };
  }
  return null;
}

async function verifySignal(signalTsUtc: Date, isBull: boolean): Promise<VerifyResult> {
  const windowEndUtc = new Date(signalTsUtc.getTime() + VERIFY_WINDOW_MINUTES * 60000);
  const searchStartUtc = new Date(signalTsUtc.getTime() - 5 * 60000);
  const now = new Date();

  try {
    const { data, error } = await supabase
      .from(CANDLE_TABLE)
      .select(`${CANDLE_TIME_COL},${CANDLE_OPEN_COL},${CANDLE_CLOSE_COL}`)
      .eq(CANDLE_SYMBOL_COL, CANDLE_SYMBOL)
      .gte(CANDLE_TIME_COL, searchStartUtc.toISOString())
      .lte(CANDLE_TIME_COL, windowEndUtc.toISOString())
      .order(CANDLE_TIME_COL, { ascending: true });

    if (error) throw error;
    const list = data ?? [];

    if (list.length === 0) {
      return now.getTime() < signalTsUtc.getTime() + VERIFY_WINDOW_MINUTES * 60000
        ? "pending"
        : "unavailable";
    }

    // Entry price = close of the last candle at or before the signal time.
    let entryCandle: any = null;
    for (const row of list) {
      const ts = new Date(row[CANDLE_TIME_COL] as string);
      if (ts.getTime() <= signalTsUtc.getTime()) {
        entryCandle = row;
      } else {
        break;
      }
    }
    entryCandle = entryCandle ?? list[0];
    const entryPrice = Number(entryCandle[CANDLE_CLOSE_COL]);

    const afterSignal = list.filter((row) => {
      const ts = new Date(row[CANDLE_TIME_COL] as string);
      return ts.getTime() > signalTsUtc.getTime() && ts.getTime() <= windowEndUtc.getTime();
    });

    const windowElapsed = now.getTime() >= windowEndUtc.getTime();

    if (afterSignal.length === 0) {
      return windowElapsed ? "unavailable" : "pending";
    }
    if (!windowElapsed) return "pending";

    const endPrice = Number(afterSignal[afterSignal.length - 1][CANDLE_CLOSE_COL]);

    if (isBull) return endPrice > entryPrice ? "correct" : "incorrect";
    return endPrice < entryPrice ? "correct" : "incorrect";
  } catch {
    return "unavailable";
  }
}

async function fetchTrend(): Promise<Trend | null> {
  try {
    const ist = nowIST();
    const ds = `${ist.getFullYear()}-${String(ist.getMonth() + 1).padStart(2, "0")}-${String(
      ist.getDate()
    ).padStart(2, "0")}`;
    const { startUtc } = istDayUtcBounds(stripTime(ist));
    void ds;

    const [{ data: openRows, error: e1 }, { data: latestRows, error: e2 }] = await Promise.all([
      supabase
        .from(CANDLE_TABLE)
        .select(CANDLE_OPEN_COL)
        .eq(CANDLE_SYMBOL_COL, CANDLE_SYMBOL)
        .gte(CANDLE_TIME_COL, startUtc.toISOString())
        .order(CANDLE_TIME_COL, { ascending: true })
        .limit(1),
      supabase
        .from(CANDLE_TABLE)
        .select(CANDLE_CLOSE_COL)
        .eq(CANDLE_SYMBOL_COL, CANDLE_SYMBOL)
        .gte(CANDLE_TIME_COL, startUtc.toISOString())
        .order(CANDLE_TIME_COL, { ascending: false })
        .limit(1),
    ]);

    if (e1 || e2) throw e1 ?? e2;
    if (!openRows?.length || !latestRows?.length) return null;

    const dayOpen = Number(openRows[0][CANDLE_OPEN_COL]);
    const latestClose = Number(latestRows[0][CANDLE_CLOSE_COL]);

    if (latestClose > dayOpen) return "up";
    if (latestClose < dayOpen) return "down";
    return "flat";
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export default function MarketSentimentCard({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [signal, setSignal] = useState<QualifyingSignal | null>(null);
  const [signalIsToday, setSignalIsToday] = useState(true);
  const [signalDateIST, setSignalDateIST] = useState<Date | null>(null);
  const [verify, setVerify] = useState<VerifyResult | null>(null);
  const [trend, setTrend] = useState<Trend | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phase: MarketPhase = useMemo(() => {
    const n = nowIST();
    if (isWeekend(n)) return "weekend";
    const openMins = 9 * 60 + 15;
    const closeMins = 15 * 60 + 30;
    const mins = n.getHours() * 60 + n.getMinutes();
    if (mins < openMins) return "beforeOpen";
    if (mins > closeMins) return "afterClose";
    return "open";
  }, [status]); // recompute alongside refresh cadence

  const isLive = phase === "open";
  const isMarketClosedNow = phase === "afterClose" || phase === "weekend";
  const isWeekendNow = phase === "weekend";

  const refresh = useCallback(async () => {
    setStatus("loading");
    try {
      let day = latestWeekdayOnOrBefore(nowIST());
      let isToday = isSameDate(day, stripTime(nowIST()));
      let found = await fetchFirstQualifyingSignal(day);

      let guard = 0;
      while (!found && guard < MAX_LOOKBACK_DAYS) {
        day = prevWeekday(day);
        isToday = false;
        found = await fetchFirstQualifyingSignal(day);
        guard++;
      }

      if (!found) {
        setSignal(null);
        setVerify(null);
        setTrend(null);
        setStatus("noSignal");
        return;
      }

      setSignal(found);
      setSignalIsToday(isToday);
      setSignalDateIST(day);
      const v = await verifySignal(found.ts, found.isBull);
      setVerify(v);
      const t = phase === "open" ? await fetchTrend() : null;
      setTrend(t);
      setStatus("hasSignal");
    } catch (e) {
      console.error("MarketSentimentCard fetch failed", e);
      setStatus("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, 60 * 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [refresh]);

  const canOpenDetails = status === "hasSignal" || status === "noSignal";

  return (
    <>
      <div
        className={[
          "relative w-full rounded-[22px] border p-4 sm:p-5",
          "border-[#c7962c]/20 dark:border-[#f5c451]/20",
          "bg-gradient-to-br from-white to-[#f6f3ec] dark:from-[#171a24] dark:to-[#0e1016]",
          "shadow-[0_10px_24px_rgba(26,26,46,0.1)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.4)]",
          canOpenDetails ? "cursor-pointer" : "",
          "transition-transform active:scale-[0.99]",
          className,
        ].join(" ")}
        onClick={() => canOpenDetails && setSheetOpen(true)}
      >
        <CardBody
          status={status}
          signal={signal}
          verify={verify}
          signalIsToday={signalIsToday}
          signalDateIST={signalDateIST}
          isClosed={isMarketClosedNow}
          isWeekend={isWeekendNow}
          isLive={isLive}
          trend={trend}
          onRetry={(e) => {
            e.stopPropagation();
            refresh();
          }}
          onChart={(e) => e.stopPropagation()}
          onAccuracy={(e) => e.stopPropagation()}
        />
      </div>

      {sheetOpen && (
        <DetailSheet
          signal={signal}
          verify={verify}
          signalIsToday={signalIsToday}
          signalDateIST={signalDateIST}
          isMarketClosedNow={isMarketClosedNow}
          isWeekend={isWeekendNow}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// HEADER
// ---------------------------------------------------------------------------

function Header({
  live,
  tag,
  trend,
}: {
  live: boolean;
  tag?: string | null;
  trend?: Trend | null;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-[#f5c544]" />
      <span className="text-[11px] font-bold tracking-wide text-[#8b96a5]">
        MARKET SENTIMENTS
      </span>
      <div className="flex-1" />
      {trend && trend !== "flat" && <TrendChip trend={trend} />}
      {live ? (
        <span className="ml-1.5 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#12a375] dark:bg-[#34d399] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#12a375] dark:bg-[#34d399]" />
          </span>
          <span className="text-[10px] font-extrabold tracking-wide text-[#12a375] dark:text-[#34d399]">
            LIVE
          </span>
        </span>
      ) : tag ? (
        <span className="ml-1.5 rounded-md bg-black/[0.04] dark:bg-white/[0.08] px-1.5 py-0.5 text-[9.5px] font-extrabold tracking-wide text-[#8a8fa0] dark:text-[#7b8194]">
          {tag}
        </span>
      ) : null}
    </div>
  );
}

function TrendChip({ trend }: { trend: Trend }) {
  const up = trend === "up";
  const color = up
    ? "text-[#12a375] dark:text-[#34d399] bg-[#12a375]/10 dark:bg-[#34d399]/10"
    : "text-[#d8404c] dark:text-[#f25f6b] bg-[#d8404c]/10 dark:bg-[#f25f6b]/10";
  return (
    <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${color}`}>
      {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
      {up ? "Trending up" : "Trending down"}
    </span>
  );
}

// ---------------------------------------------------------------------------
// VERIFY CHIP
// ---------------------------------------------------------------------------

function verifyMeta(result: VerifyResult) {
  switch (result) {
    case "correct":
      return {
        icon: <CheckCircle2 size={13} />,
        label: "Played out right",
        color: "text-[#12a375] dark:text-[#34d399] bg-[#12a375]/12 dark:bg-[#34d399]/12 border-[#12a375]/35 dark:border-[#34d399]/35",
      };
    case "incorrect":
      return {
        icon: <XCircle size={13} />,
        label: "Didn't play out",
        color: "text-[#d8404c] dark:text-[#f25f6b] bg-[#d8404c]/12 dark:bg-[#f25f6b]/12 border-[#d8404c]/35 dark:border-[#f25f6b]/35",
      };
    case "pending":
      return {
        icon: <HourglassIcon size={13} />,
        label: "Still checking",
        color: "text-[#b8862f] dark:text-[#f5c451] bg-[#b8862f]/12 dark:bg-[#f5c451]/12 border-[#b8862f]/35 dark:border-[#f5c451]/35",
      };
    case "unavailable":
    default:
      return {
        icon: <HelpCircle size={13} />,
        label: "Not verified",
        color: "text-[#8a8fa0] dark:text-[#7b8194] bg-[#8a8fa0]/12 dark:bg-[#7b8194]/12 border-[#8a8fa0]/35 dark:border-[#7b8194]/35",
      };
  }
}

function VerifyChip({ result }: { result: VerifyResult }) {
  const m = verifyMeta(result);
  return (
    <span className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-extrabold ${m.color}`}>
      {m.icon}
      {m.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// ACTION BUTTONS
// ---------------------------------------------------------------------------

function ActionButtons({
  onChart,
  onAccuracy,
}: {
  onChart?: (e: React.MouseEvent) => void;
  onAccuracy?: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={ROUTE_CHART}
        onClick={onChart}
        className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#b8862f] dark:bg-[#f5c451] text-[12.5px] font-extrabold text-white dark:text-black transition-opacity hover:opacity-90"
      >
        <CandlestickChart size={15} />
        View chart
      </Link>
      <Link
        href={ROUTE_ACCURACY}
        onClick={onAccuracy}
        className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-[#b8862f]/45 dark:border-[#f5c451]/45 text-[12.5px] font-extrabold text-[#b8862f] dark:text-[#f5c451] transition-colors hover:bg-[#b8862f]/5 dark:hover:bg-[#f5c451]/5"
      >
        <LineChart size={15} />
        Accuracy
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DISCLAIMER
// ---------------------------------------------------------------------------

function Disclaimer() {
  return (
    <div className="flex items-start gap-1.5 rounded-lg border border-[#b8862f]/15 dark:border-[#f5c451]/15 bg-[#b8862f]/[0.06] dark:bg-[#f5c451]/[0.06] px-2.5 py-2">
      <Info size={13} className="mt-0.5 shrink-0 text-[#b8862f]/70 dark:text-[#f5c451]/70" />
      <p className="text-[11px] leading-relaxed text-[#8a8fa0] dark:text-[#7b8194]">
        This is a statistically derived signal, not investment advice. Markets can be
        unpredictable — always do your own research before trading.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CARD BODY (state switch)
// ---------------------------------------------------------------------------

function CardBody({
  status,
  signal,
  verify,
  signalIsToday,
  signalDateIST,
  isClosed,
  isWeekend: weekend,
  isLive,
  trend,
  onRetry,
  onChart,
  onAccuracy,
}: {
  status: Status;
  signal: QualifyingSignal | null;
  verify: VerifyResult | null;
  signalIsToday: boolean;
  signalDateIST: Date | null;
  isClosed: boolean;
  isWeekend: boolean;
  isLive: boolean;
  trend: Trend | null;
  onRetry: (e: React.MouseEvent) => void;
  onChart: (e: React.MouseEvent) => void;
  onAccuracy: (e: React.MouseEvent) => void;
}) {
  if (status === "loading") return <SkeletonBody />;

  if (status === "error") {
    return (
      <div className="space-y-3">
        <Header live={false} />
        <p className="text-[13px] font-bold text-[#565b6b] dark:text-[#aeb4c2]">
          Couldn&apos;t load signal data
        </p>
        <button
          onClick={onRetry}
          className="flex items-center gap-1 text-[12px] font-bold text-[#b8862f] dark:text-[#f5c451]"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      </div>
    );
  }

  if (status === "noSignal") {
    return (
      <div className="space-y-3">
        <Header live={isLive} tag={isClosed ? "CLOSED" : null} />
        <div className="flex items-start gap-2">
          <Eye size={18} className="mt-0.5 shrink-0 text-[#8a8fa0] dark:text-[#7b8194]" />
          <div>
            <p className="text-[14px] font-bold text-[#565b6b] dark:text-[#aeb4c2]">
              No strong signal recently
            </p>
            <p className="mt-1 text-[12px] text-[#8a8fa0] dark:text-[#7b8194]">
              Nothing has crossed the {MIN_ENTRY_PROBABILITY.toFixed(0)}% confidence bar in
              the last few trading days.
            </p>
          </div>
        </div>
        {/* <ActionButtons onChart={onChart} onAccuracy={onAccuracy} /> */}
      </div>
    );
  }

  // hasSignal
  if (!signal) return null;
  const dirColor = signal.isBull
    ? "text-[#12a375] dark:text-[#34d399] bg-[#12a375]/12 dark:bg-[#34d399]/12"
    : "text-[#d8404c] dark:text-[#f25f6b] bg-[#d8404c]/12 dark:bg-[#f25f6b]/12";
  const dayLbl = signalIsToday ? "Today" : signalDateIST ? fmtDay(signalDateIST) : "";
  const tsIST = toIST(signal.ts);

  return (
    <div className="space-y-3">
      <Header live={isLive} tag={weekend ? "WEEKEND" : isClosed ? "CLOSED" : null} trend={trend} />

      <div className="flex items-start gap-2.5">
        <div className={`shrink-0 rounded-[10px] p-1.5 ${dirColor}`}>
          {signal.isBull ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-extrabold text-[#1b1d24] dark:text-[#f5f6fa]">
            {signal.isBull ? "Bull" : "Bear"} entry · {signal.probability.toFixed(0)}% confidence
          </p>
          <p className="mt-0.5 text-[12px] text-[#8a8fa0] dark:text-[#7b8194]">
            {dayLbl} · {fmtTime(tsIST)}
          </p>
        </div>
        {verify === "correct" && (
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#12a375] dark:text-[#34d399]" />
        )}
        {verify === "incorrect" && (
          <XCircle size={20} className="mt-0.5 shrink-0 text-[#d8404c] dark:text-[#f25f6b]" />
        )}
      </div>

      <Disclaimer />
      {/* <ActionButtons onChart={onChart} onAccuracy={onAccuracy} /> */}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SKELETON
// ---------------------------------------------------------------------------

function SkeletonBody() {
  const bar = (w: string, h: string, extra = "") => (
    <div className={`animate-pulse rounded-md bg-black/[0.04] dark:bg-white/[0.08] ${w} ${h} ${extra}`} />
  );

  return (
    <div className="flex h-[118px] flex-col justify-between">
      <div className="flex items-center gap-2.5">
        <div className="h-[34px] w-[34px] animate-pulse rounded-[10px] bg-black/[0.04] dark:bg-white/[0.08]" />
        {bar("w-36", "h-4")}
      </div>
      {bar("w-56", "h-3")}
      {bar("w-full", "h-9", "rounded-[10px]")}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FULL-DETAIL SHEET (bottom sheet on mobile, centered modal on desktop)
// ---------------------------------------------------------------------------

function verifyExplanation(r: VerifyResult, isBull: boolean) {
  const dir = isBull ? "up" : "down";
  switch (r) {
    case "correct":
      return `Within 15 minutes of this signal, price actually moved ${dir} as predicted.`;
    case "incorrect":
      return `Price hadn't moved ${dir} within 15 minutes, so this call is marked as missed.`;
    case "pending":
      return `We'll know within 15 minutes of the signal whether price moved ${dir} as expected.`;
    case "unavailable":
    default:
      return "We couldn't check the price data for this signal right now.";
  }
}

function DetailSheet({
  signal,
  verify,
  signalIsToday,
  signalDateIST,
  isMarketClosedNow,
  isWeekend: weekend,
  onClose,
}: {
  signal: QualifyingSignal | null;
  verify: VerifyResult | null;
  signalIsToday: boolean;
  signalDateIST: Date | null;
  isMarketClosedNow: boolean;
  isWeekend: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const has = !!signal;
  const dayLbl = has ? (signalIsToday ? "Today" : signalDateIST ? fmtDay(signalDateIST) : "") : "";
  const tsIST = signal ? toIST(signal.ts) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        className={[
          "relative z-10 flex w-full max-h-[92vh] flex-col overflow-hidden",
          "rounded-t-[28px] sm:rounded-[24px]",
          "bg-white dark:bg-[#13151d]",
          "sm:max-w-md sm:mx-4",
        ].join(" ")}
      >
        {/* Header */}
        <div className="shrink-0 px-5 pb-3.5 pt-3">
          <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-[#c7962c]/20 dark:bg-[#f5c451]/20 sm:hidden" />
          <div className="flex items-start gap-2.5">
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-extrabold text-[#1b1d24] dark:text-[#f5f6fa]">
                {has ? "Signal Details" : "No Recent Signal"}
              </p>
              <p className="text-[12px] text-[#8a8fa0] dark:text-[#7b8194]">
                Market sentiment verification
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-[#8a8fa0] dark:text-[#7b8194] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="h-px shrink-0 bg-[#c7962c]/10 dark:bg-[#f5c451]/10" />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-3.5">
          {isMarketClosedNow && (
            <div className="mb-3 flex items-center gap-2 rounded-[10px] bg-black/[0.02] dark:bg-white/[0.03] px-3 py-2.5">
              {weekend ? (
                <Sofa size={16} className="text-[#8a8fa0] dark:text-[#7b8194]" />
              ) : (
                <Moon size={16} className="text-[#8a8fa0] dark:text-[#7b8194]" />
              )}
              <p className="text-[12.5px] font-semibold text-[#565b6b] dark:text-[#aeb4c2]">
                {weekend ? "Markets are closed for the weekend." : "Market is closed for the day."}
              </p>
            </div>
          )}

          {has && signal && tsIST ? (
            <>
              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.03] p-3">
                <div className="flex items-start gap-2.5">
                  {signal.isBull ? (
                    <TrendingUp size={20} className="mt-0.5 shrink-0 text-[#12a375] dark:text-[#34d399]" />
                  ) : (
                    <TrendingDown size={20} className="mt-0.5 shrink-0 text-[#d8404c] dark:text-[#f25f6b]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-[#1b1d24] dark:text-[#f5f6fa]">
                      Predicted price would go {signal.isBull ? "UP" : "DOWN"}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#8a8fa0] dark:text-[#7b8194]">
                      {dayLbl} · {fmtTime(tsIST)} · {signal.probability.toFixed(0)}% confident
                    </p>
                  </div>
                </div>
              </div>

              {verify && (
                <div className="mt-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-extrabold text-[#1b1d24] dark:text-[#f5f6fa]">
                      Was it right?
                    </p>
                    <VerifyChip result={verify} />
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#565b6b] dark:text-[#aeb4c2]">
                    {verifyExplanation(verify, signal.isBull)}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.03] p-3">
              <p className="text-[12.5px] leading-relaxed text-[#565b6b] dark:text-[#aeb4c2]">
                Nothing has cleared the {MIN_ENTRY_PROBABILITY.toFixed(0)}% confidence bar in the
                last few trading days.
              </p>
            </div>
          )}

          <div className="mt-3 flex items-center gap-1.5">
            <Zap size={15} className="text-[#b8862f] dark:text-[#f5c451]" />
            <p className="text-[12px] text-[#565b6b] dark:text-[#aeb4c2]">
              {MIN_ENTRY_PROBABILITY.toFixed(0)}%+ confidence is flagged as a signal
            </p>
          </div>

          <div className="mt-4">
            <ActionButtons onChart={onClose} onAccuracy={onClose} />
          </div>
          <div className="mt-2.5">
            <Disclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}