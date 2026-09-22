"use client";

/**
 * AiStockPicksCard
 * -----------------
 * Drop-in card that surfaces the latest AI-flagged stock picks from Supabase.
 * Mirrors the Flutter `MarketSentimentSection_Stocks` widget: same states
 * (loading / no picks / has picks / error), same "walk back to the last
 * trading day with picks" logic, same IST trading-window math.
 *
 * Usage:
 *   <AiStockPicksCard />
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Requires a Supabase table (default name "ai_picked_stocks") with columns:
 *   symbol text, snapshot_time timestamptz, sentiment text,
 *   breakout_close numeric, sector text
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  LineChart,
  Info,
  RefreshCw,
  SearchX,
  CheckCircle2,
  XCircle,
  Radar,
  Clock,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// CONFIG — adjust to match your schema / routes
// ---------------------------------------------------------------------------

const PICKS_TABLE = "ai_picked_stocks";
const MAX_LOOKBACK_DAYS = 7;
const MAX_ITEMS_SHOWN = 5;

// Trading window in IST, expressed as UTC bounds (9:30 AM – 3:15 PM IST)
const WINDOW_START_UTC = { h: 4, m: 0 };
const WINDOW_END_UTC = { h: 9, m: 45 };

const ROUTE_VIEW_ALL = "/ai-picked-stocks";
const ROUTE_ACCURACY = "/backtest/ai-picks";
const routeForStock = (symbol: string) => {
  const cleanSymbol = symbol
    .replace(/^NSE:/i, '')
    .replace(/-EQ$/i, '');

  return `/stocks/${cleanSymbol}`;
};

// ---------------------------------------------------------------------------
// TIME HELPERS (IST-aware, no extra deps)
// ---------------------------------------------------------------------------

function nowIST(): Date {
  const now = new Date();
  return new Date(now.getTime() + (5.5 * 60 + now.getTimezoneOffset()) * 60000);
}

function todayIST(): Date {
  const n = nowIST();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

function isWeekend(d: Date) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function prevWeekday(d: Date) {
  let x = new Date(d);
  do {
    x = new Date(x.getFullYear(), x.getMonth(), x.getDate() - 1);
  } while (isWeekend(x));
  return x;
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function cleanSymbol(raw: string) {
  return raw.replace(/^(NSE|BSE):/, "").replace("-EQ", "");
}

function dayLabel(date: Date) {
  if (isSameDate(date, todayIST())) return "Today";
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function pickDateTimeLabel(t: Date) {
  const today = todayIST();
  const tDate = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  const datePart = isSameDate(tDate, today)
    ? "Today"
    : t.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const timePart = t.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

function timeAgo(t: Date) {
  const diffMs = Date.now() - t.getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

type RawEntry = {
  symbol: string;
  snapshot_time: string;
  sentiment: string | null;
  breakout_close: number | null;
  sector: string | null;
};

type Pick = {
  symbol: string;
  cleanSymbol: string;
  sentiment: "BULLISH" | "BEARISH";
  pickTime: Date;
  startPrice: number;
  latestPrice: number;
  gainPcnt: number;
  isSuccess: boolean;
};

type Status = "loading" | "hasPicks" | "noPicks" | "error";

// ---------------------------------------------------------------------------
// DATA FETCH
// ---------------------------------------------------------------------------

async function fetchForDate(date: Date): Promise<Pick[]> {
  const start = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), WINDOW_START_UTC.h, WINDOW_START_UTC.m)
  );
  const end = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), WINDOW_END_UTC.h, WINDOW_END_UTC.m)
  );

  const { data, error } = await supabase
    .from(PICKS_TABLE)
    .select("symbol,snapshot_time,sentiment,breakout_close,sector")
    .gte("snapshot_time", start.toISOString())
    .lte("snapshot_time", end.toISOString())
    .order("snapshot_time", { ascending: true });

  if (error) throw error;

  const entries = (data ?? []) as RawEntry[];
  if (entries.length === 0) return [];

  const bySymbol = new Map<string, RawEntry[]>();
  for (const e of entries) {
    const arr = bySymbol.get(e.symbol) ?? [];
    arr.push(e);
    bySymbol.set(e.symbol, arr);
  }

  const picks: Pick[] = [];
  for (const list of bySymbol.values()) {
    list.sort((a, b) => new Date(a.snapshot_time).getTime() - new Date(b.snapshot_time).getTime());
    const first = list[0];
    const last = list[list.length - 1];
    const startPrice = first.breakout_close ?? 0;
    const latestPrice = last.breakout_close ?? 0;
    const gain = startPrice > 0 ? ((latestPrice - startPrice) / startPrice) * 100 : 0;
    const sentiment = ((first.sentiment ?? "BULLISH").toUpperCase() as "BULLISH" | "BEARISH");
    const isSuccess = sentiment === "BEARISH" ? gain <= 0 : gain > 0;

    picks.push({
      symbol: first.symbol,
      cleanSymbol: cleanSymbol(first.symbol),
      sentiment,
      pickTime: new Date(first.snapshot_time),
      startPrice,
      latestPrice,
      gainPcnt: gain,
      isSuccess,
    });
  }

  picks.sort((a, b) => b.gainPcnt - a.gainPcnt);
  return picks;
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export default function AiStockPicksCard({
  className = "",
}: {
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("loading");
  const [picks, setPicks] = useState<Pick[]>([]);
  const [pickDate, setPickDate] = useState<Date | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    setStatus("loading");
    try {
      let date = todayIST();
      let found = await fetchForDate(date);

      let guard = 0;
      while (found.length === 0 && guard < MAX_LOOKBACK_DAYS) {
        date = prevWeekday(date);
        found = await fetchForDate(date);
        guard++;
      }

      setPickDate(date);
      setPicks(found);
      setStatus(found.length === 0 ? "noPicks" : "hasPicks");
    } catch (e) {
      console.error("AiStockPicksCard fetch failed", e);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    refresh();
    pollRef.current = setInterval(refresh, 2 * 60 * 1000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refresh]);

  const isMarketClosedForDate = useMemo(() => {
    if (!pickDate) return true;
    const today = todayIST();
    if (pickDate.getTime() < today.getTime()) return true;
    const n = nowIST();
    return n.getHours() > 15 || (n.getHours() === 15 && n.getMinutes() >= 30);
  }, [pickDate]);

  const isLive = useMemo(() => {
    if (!pickDate || !isSameDate(pickDate, todayIST())) return false;
    const n = nowIST();
    const afterOpen = n.getHours() > 9 || (n.getHours() === 9 && n.getMinutes() >= 15);
    const beforeClose = n.getHours() < 15 || (n.getHours() === 15 && n.getMinutes() < 30);
    return afterOpen && beforeClose && !isWeekend(n);
  }, [pickDate]);

  const canOpenDetails = status === "hasPicks" || status === "noPicks";
  const shownPicks = picks.slice(0, MAX_ITEMS_SHOWN);
  const effectiveDate = pickDate ?? todayIST();

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
          picks={shownPicks}
          totalCount={picks.length}
          dayLabel={dayLabel(effectiveDate)}
          isLive={isLive}
          isClosed={isMarketClosedForDate}
          onRetry={(e) => {
            e.stopPropagation();
            refresh();
          }}
          onViewAll={(e) => e.stopPropagation()}
          onAccuracy={(e) => e.stopPropagation()}
          viewAllHref={`${ROUTE_VIEW_ALL}?date=${toDateParam(effectiveDate)}`}
          accuracyHref={`${ROUTE_ACCURACY}?date=${toDateParam(effectiveDate)}`}
        />
      </div>

      {sheetOpen && (
        <PicksSheet
          picks={picks}
          dayLabel={dayLabel(effectiveDate)}
          isClosed={isMarketClosedForDate}
          viewAllHref={`${ROUTE_VIEW_ALL}?date=${toDateParam(effectiveDate)}`}
          accuracyHref={`${ROUTE_ACCURACY}?date=${toDateParam(effectiveDate)}`}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  );
}

function toDateParam(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ---------------------------------------------------------------------------
// HEADER
// ---------------------------------------------------------------------------

function Header({ live, tag }: { live: boolean; tag?: string | null }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-[#6366f1] dark:bg-[#818cf8]" />
      <span className="text-[11px] font-bold tracking-wide text-[#8b96a5]">
        STOCK PICKS
      </span>
      <div className="flex-1" />
      {live ? (
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#12a375] dark:bg-[#34d399] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#12a375] dark:bg-[#34d399]" />
          </span>
          <span className="text-[10px] font-extrabold tracking-wide text-[#12a375] dark:text-[#34d399]">
            LIVE
          </span>
        </span>
      ) : tag ? (
        <span className="rounded-md bg-black/[0.04] dark:bg-white/[0.08] px-1.5 py-0.5 text-[9.5px] font-extrabold tracking-wide text-[#8a8fa0] dark:text-[#7b8194]">
          {tag}
        </span>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ACTION BUTTONS
// ---------------------------------------------------------------------------

function ActionButtons({
  viewAllHref,
  accuracyHref,
  onViewAll,
  onAccuracy,
}: {
  viewAllHref: string;
  accuracyHref: string;
  onViewAll?: (e: React.MouseEvent) => void;
  onAccuracy?: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={viewAllHref}
        onClick={onViewAll}
        className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#b8862f] dark:bg-[#f5c451] text-[12.5px] font-extrabold text-white dark:text-black transition-opacity hover:opacity-90"
      >
        <LayoutGrid size={15} />
        View all
      </Link>
      <Link
        href={accuracyHref}
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
    <div className="flex items-start gap-1.5 rounded-lg border border-[#b8862f]/15 dark:border-[#f5c451]/15 bg-[#b8862f]/[0.06] dark:bg-[#f5c451]/[0.06] px-2.5 py-1.5">
      <Info size={13} className="mt-0.5 shrink-0 text-[#b8862f]/70 dark:text-[#f5c451]/70" />
      <p className="text-[10.5px] leading-snug text-[#8a8fa0] dark:text-[#7b8194]">
        AI-picked stocks are for informational purposes only, not investment advice.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PICK ROW
// ---------------------------------------------------------------------------

function PickRow({
  pick,
  showOutcome,
  isLast,
  href,
  onClick,
}: {
  pick: Pick;
  showOutcome: boolean;
  isLast: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const bullish = pick.sentiment === "BULLISH";
  const gainColor = pick.gainPcnt >= 0
    ? "text-[#12a375] dark:text-[#34d399]"
    : "text-[#d8404c] dark:text-[#f25f6b]";

  const content = (
    <div
      className={[
        "flex items-center gap-2.5 py-2.5",
        isLast ? "" : "border-b border-[#c7962c]/10 dark:border-[#f5c451]/10",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]",
          bullish ? "bg-[#12a375]/10 dark:bg-[#34d399]/10" : "bg-[#d8404c]/10 dark:bg-[#f25f6b]/10",
        ].join(" ")}
      >
        {bullish ? (
          <TrendingUp size={16} className="text-[#12a375] dark:text-[#34d399]" />
        ) : (
          <TrendingDown size={16} className="text-[#d8404c] dark:text-[#f25f6b]" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-extrabold text-[#1b1d24] dark:text-[#f5f6fa]">
          {pick.cleanSymbol}
        </p>
        <p className="truncate text-[11px] text-[#8a8fa0] dark:text-[#7b8194]">
          {pickDateTimeLabel(pick.pickTime)} · {timeAgo(pick.pickTime)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className={`text-[13px] font-extrabold ${gainColor}`}>
          {pick.gainPcnt >= 0 ? "+" : ""}
          {pick.gainPcnt.toFixed(2)}%
        </span>
        {showOutcome && (
          <span className="flex items-center gap-0.5">
            {pick.isSuccess ? (
              <CheckCircle2 size={11} className="text-[#12a375] dark:text-[#34d399]" />
            ) : (
              <XCircle size={11} className="text-[#d8404c] dark:text-[#f25f6b]" />
            )}
            <span
              className={`text-[10.5px] font-bold ${
                pick.isSuccess
                  ? "text-[#12a375] dark:text-[#34d399]"
                  : "text-[#d8404c] dark:text-[#f25f6b]"
              }`}
            >
              {pick.isSuccess ? "Right" : "Wrong"}
            </span>
          </span>
        )}
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} onClick={onClick} className="block rounded-lg hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
      {content}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// CARD BODY (state switch)
// ---------------------------------------------------------------------------

function CardBody({
  status,
  picks,
  totalCount,
  dayLabel: label,
  isLive,
  isClosed,
  onRetry,
  onViewAll,
  onAccuracy,
  viewAllHref,
  accuracyHref,
}: {
  status: Status;
  picks: Pick[];
  totalCount: number;
  dayLabel: string;
  isLive: boolean;
  isClosed: boolean;
  onRetry: (e: React.MouseEvent) => void;
  onViewAll: (e: React.MouseEvent) => void;
  onAccuracy: (e: React.MouseEvent) => void;
  viewAllHref: string;
  accuracyHref: string;
}) {
  if (status === "loading") return <SkeletonBody />;

  if (status === "error") {
    return (
      <div className="space-y-3">
        <Header live={false} />
        <p className="text-[13px] font-bold text-[#565b6b] dark:text-[#aeb4c2]">
          Couldn&apos;t load stock picks
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

  if (status === "noPicks") {
    return (
      <div className="space-y-3">
        <Header live={false} />
        <div className="flex items-start gap-2">
          <SearchX size={18} className="mt-0.5 shrink-0 text-[#8a8fa0] dark:text-[#7b8194]" />
          <div>
            <p className="text-[14px] font-bold text-[#565b6b] dark:text-[#aeb4c2]">
              No picks flagged recently
            </p>
            <p className="mt-1 text-[12px] text-[#8a8fa0] dark:text-[#7b8194]">
              The AI scanned the market but hasn&apos;t flagged any breakout candidates in
              the last few trading days.
            </p>
          </div>
        </div>
        {/* <ActionButtons
          viewAllHref={viewAllHref}
          accuracyHref={accuracyHref}
          onViewAll={onViewAll}
          onAccuracy={onAccuracy}
        /> */}
      </div>
    );
  }

  // hasPicks
  return (
    <div className="space-y-1.5">
      <Header live={isLive} tag={isLive ? null : isClosed ? "CLOSED" : null} />
      <p className="text-[12px] font-bold text-[#565b6b] dark:text-[#aeb4c2]">
        {label} · {totalCount} stock{totalCount === 1 ? "" : "s"} flagged
      </p>
      <div>
        {picks.map((p, i) => (
          <PickRow key={p.symbol} pick={p} showOutcome={isClosed} isLast={i === picks.length - 1} />
        ))}
      </div>
      <div className="pt-1.5">
        {/* <ActionButtons
          viewAllHref={viewAllHref}
          accuracyHref={accuracyHref}
          onViewAll={onViewAll}
          onAccuracy={onAccuracy}
        /> */}
      </div>
      <div className="pt-1">
        <Disclaimer />
      </div>
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
  const row = (isLast: boolean) => (
    <div
      className={[
        "flex items-center gap-2.5 py-2.5",
        isLast ? "" : "border-b border-[#c7962c]/10 dark:border-[#f5c451]/10",
      ].join(" ")}
    >
      <div className="h-8 w-8 shrink-0 animate-pulse rounded-[9px] bg-black/[0.04] dark:bg-white/[0.08]" />
      <div className="flex-1 space-y-1.5">
        {bar("w-16", "h-3")}
        {bar("w-24", "h-2.5")}
      </div>
      {bar("w-10", "h-3")}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        {bar("w-24", "h-3")}
        <div className="flex-1" />
        {bar("w-10", "h-3")}
      </div>
      {bar("w-36", "h-2.5")}
      <div className="pt-1">
        {row(false)}
        {row(false)}
        {row(true)}
      </div>
      {bar("w-full", "h-9", "rounded-[10px]")}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FULL-DETAIL SHEET (bottom sheet on mobile, centered modal on desktop)
// ---------------------------------------------------------------------------

function PicksSheet({
  picks,
  dayLabel: label,
  isClosed,
  viewAllHref,
  accuracyHref,
  onClose,
}: {
  picks: Pick[];
  dayLabel: string;
  isClosed: boolean;
  viewAllHref: string;
  accuracyHref: string;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
            <div className="rounded-[10px] bg-[#6366f1]/10 dark:bg-[#818cf8]/10 p-2">
              <LineChart size={18} className="text-[#6366f1] dark:text-[#818cf8]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-extrabold text-[#1b1d24] dark:text-[#f5f6fa]">
                Stock Picks
              </p>
              <p className="text-[12px] text-[#8a8fa0] dark:text-[#7b8194]">
                {picks.length === 0
                  ? label
                  : `${label} · ${picks.length} stock${picks.length === 1 ? "" : "s"} flagged`}
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
          <div className="rounded-[10px] bg-black/[0.02] dark:bg-white/[0.03] p-3">
            <p className="text-[10.5px] font-extrabold tracking-wide text-[#8a8fa0] dark:text-[#7b8194]">
              HOW THIS WORKS
            </p>
            <div className="mt-2 space-y-2.5">
              <ExplainLine
                icon={<Radar size={15} />}
                text="A few of our market scanners flag stocks independently — when they overlap on the same stock, it gets picked."
              />
              <ExplainLine
                icon={<TrendingUp size={15} />}
                text="Stocks breaking above recent highs (bullish) or below recent lows (bearish) are tracked in real time."
              />
              <ExplainLine
                icon={<Clock size={15} />}
                text="Runs on live 5-minute price data while the market is open, so picks can move as the day goes on."
              />
            </div>
          </div>

          <div className="mt-3.5">
            {picks.length === 0 ? (
              <p className="pb-2 text-[12.5px] leading-relaxed text-[#565b6b] dark:text-[#aeb4c2]">
                The AI scanned the market but hasn&apos;t flagged any breakout candidates in the
                last few trading days.
              </p>
            ) : (
              picks.map((p, i) => (
                <PickRow
                  key={p.symbol}
                  pick={p}
                  showOutcome={isClosed}
                  isLast={i === picks.length - 1}
                  href={routeForStock(p.symbol)}
                  onClick={onClose}
                />
              ))
            )}
          </div>

          <div className="mt-3.5">
            {/* <ActionButtons
              viewAllHref={viewAllHref}
              accuracyHref={accuracyHref}
              onViewAll={onClose}
              onAccuracy={onClose}
            /> */}
          </div>
          <div className="mt-2.5">
            <Disclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExplainLine({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-[#8a8fa0] dark:text-[#7b8194]">{icon}</span>
      <p className="text-[12.5px] leading-relaxed text-[#565b6b] dark:text-[#aeb4c2]">{text}</p>
    </div>
  );
}