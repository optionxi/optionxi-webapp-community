"use client";

import { useEffect, useMemo, useState } from "react";
import { X, TrendingUp, TrendingDown, Loader2, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

/* ------------------------------------------------------------------ */
/* Types — mirrors the shape used in PortfolioSection                  */
/* ------------------------------------------------------------------ */

type PickStatus = "pending" | "win" | "loss";

export interface ChartPick {
  symbol: string; // e.g. "NSE:POLICYBZR-EQ"
  pick_date: string; // yyyy-mm-dd
  sentiment: "BULLISH" | "BEARISH";
  entry_time: string;
  entry_price: number;
  eval_time: string;
  eval_price: number;
  pnl_pcnt: number;
  status: PickStatus;
}

interface Candle {
  candle_time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number | null;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function parseSymbol(value: string) {
  const [exchange = "", rest = ""] = value.split(":");
  const [symbol = "", segment = ""] = rest.split("-");
  return { exchange, symbol, segment };
}

// stock_candles_5m.ticker uses a Yahoo-style suffix (SYMBOL.NS / SYMBOL.BO).
function toTicker(exchange: string, symbol: string) {
  const suffix = exchange === "BSE" ? ".BO" : ".NS";
  return `${symbol}${suffix}`;
}

function timeIST(t: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(t).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
    ...opts,
  });
}

// External deep-link to OptionXi stock page.
function stockDetailsUrl(symbol: string) {
  return `https://app.optionxi.com/stocks/${encodeURIComponent(symbol)}`;
}

/* ------------------------------------------------------------------ */
/* Chart geometry                                                       */
/* ------------------------------------------------------------------ */

const CHART_W = 680;
const CHART_H = 220;
const PAD_L = 44;
const PAD_R = 12;
const PAD_T = 16;
const PAD_B = 26;

function buildChartGeometry(candles: Candle[], pick: ChartPick) {
  const times = candles.map((c) => new Date(c.candle_time).getTime());
  const tMin = Math.min(...times);
  const tMax = Math.max(...times);
  const tSpan = Math.max(tMax - tMin, 1);

  const lows = candles.map((c) => c.low);
  const highs = candles.map((c) => c.high);
  let pMin = Math.min(...lows, pick.entry_price, pick.eval_price);
  let pMax = Math.max(...highs, pick.entry_price, pick.eval_price);
  const pPad = (pMax - pMin) * 0.08 || 1;
  pMin -= pPad;
  pMax += pPad;
  const pSpan = Math.max(pMax - pMin, 0.0001);

  const innerW = CHART_W - PAD_L - PAD_R;
  const innerH = CHART_H - PAD_T - PAD_B;

  const x = (t: number) => PAD_L + ((t - tMin) / tSpan) * innerW;
  const y = (p: number) => PAD_T + innerH - ((p - pMin) / pSpan) * innerH;

  const barW = Math.max(2, Math.min(10, (innerW / Math.max(candles.length, 1)) * 0.6));

  return { x, y, barW, pMin, pMax, tMin, tMax };
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export default function PriceChartSheet({
  pick,
  onClose,
}: {
  pick: ChartPick | null;
  onClose: () => void;
}) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (!pick) return;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setErrored(false);
      setCandles([]);
      try {
        const { exchange, symbol } = parseSymbol(pick.symbol);
        const ticker = toTicker(exchange, symbol);

        const { data, error } = await supabase
          .from("stock_candles_5m")
          .select("candle_time, open, high, low, close, volume")
          .eq("ticker", ticker)
          .eq("trading_day", pick.pick_date)
          .order("candle_time", { ascending: true });

        if (error) throw error;
        if (!cancelled) setCandles((data as Candle[]) ?? []);
      } catch (err) {
        console.error("PriceChartSheet load failed", err);
        if (!cancelled) setErrored(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [pick]);

  const geometry = useMemo(() => {
    if (!pick || candles.length === 0) return null;
    return buildChartGeometry(candles, pick);
  }, [candles, pick]);

  if (!pick) return null;

  const { symbol } = parseSymbol(pick.symbol);
  const bullish = pick.sentiment === "BULLISH";
  const profitable = pick.pnl_pcnt >= 0;
  const entryT = new Date(pick.entry_time).getTime();
  const evalT = new Date(pick.eval_time).getTime();

  // ✅ Declared inside the component, before the return.
  const detailsUrl = stockDetailsUrl(symbol);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] w-full overflow-y-auto rounded-t-3xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:max-w-xl sm:rounded-3xl sm:p-6"
      >
        {/* Drag handle, mobile only */}
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 sm:hidden" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
              {new Date(`${pick.pick_date}T00:00:00`).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </p>
            <h3 className="mt-1 flex items-center gap-2 text-lg font-semibold sm:text-xl">
              <a
                href={detailsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-lg transition hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {symbol}
                <ArrowUpRight
                  size={16}
                  className="opacity-0 transition group-hover:opacity-100"
                />
              </a>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  bullish
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-500 dark:text-red-400"
                }`}
              >
                {bullish ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {bullish ? "Long" : "Short"}
              </span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chart */}
        <div className="mt-4 rounded-2xl border border-zinc-200 p-3 dark:border-zinc-800 sm:p-4">
          {loading && (
            <div className="flex h-56 items-center justify-center text-zinc-400 dark:text-zinc-500">
              <Loader2 size={20} className="animate-spin" />
            </div>
          )}

          {!loading && errored && (
            <div className="flex h-56 items-center justify-center text-center text-xs text-zinc-500 dark:text-zinc-400">
              Couldn&apos;t load the candle data for this pick.
            </div>
          )}

          {!loading && !errored && candles.length === 0 && (
            <div className="flex h-56 items-center justify-center text-center text-xs text-zinc-500 dark:text-zinc-400">
              No candle data recorded for this day yet.
            </div>
          )}

          {!loading && !errored && geometry && (
            <svg
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              className="h-56 w-full sm:h-64"
              preserveAspectRatio="none"
            >
              {/* Y-axis gridlines + labels */}
              {[geometry.pMax, (geometry.pMax + geometry.pMin) / 2, geometry.pMin].map(
                (p, i) => (
                  <g key={i}>
                    <line
                      x1={PAD_L}
                      x2={CHART_W - PAD_R}
                      y1={geometry.y(p)}
                      y2={geometry.y(p)}
                      className="stroke-zinc-100 dark:stroke-zinc-800"
                      strokeWidth={1}
                    />
                    <text
                      x={2}
                      y={geometry.y(p) + 3}
                      className="fill-zinc-400 text-[8px] dark:fill-zinc-500"
                    >
                      {p.toFixed(1)}
                    </text>
                  </g>
                )
              )}

              {/* Profit/loss shaded zone between entry and exit */}
              <rect
                x={geometry.x(Math.min(entryT, evalT))}
                y={PAD_T}
                width={Math.max(
                  geometry.x(Math.max(entryT, evalT)) -
                    geometry.x(Math.min(entryT, evalT)),
                  0
                )}
                height={CHART_H - PAD_T - PAD_B}
                className={profitable ? "fill-emerald-500/10" : "fill-red-500/10"}
              />

              {/* Candlesticks */}
              {candles.map((c, i) => {
                const t = new Date(c.candle_time).getTime();
                const cx = geometry.x(t);
                const up = c.close >= c.open;
                const bodyTop = geometry.y(Math.max(c.open, c.close));
                const bodyBottom = geometry.y(Math.min(c.open, c.close));
                return (
                  <g key={i}>
                    <line
                      x1={cx}
                      x2={cx}
                      y1={geometry.y(c.high)}
                      y2={geometry.y(c.low)}
                      className={up ? "stroke-emerald-500" : "stroke-red-400"}
                      strokeWidth={1}
                    />
                    <rect
                      x={cx - geometry.barW / 2}
                      y={bodyTop}
                      width={geometry.barW}
                      height={Math.max(bodyBottom - bodyTop, 1)}
                      className={up ? "fill-emerald-500" : "fill-red-400"}
                    />
                  </g>
                );
              })}

              {/* Entry marker */}
              <g>
                <line
                  x1={geometry.x(entryT)}
                  x2={geometry.x(entryT)}
                  y1={PAD_T}
                  y2={CHART_H - PAD_B}
                  className="stroke-zinc-400 dark:stroke-zinc-500"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
                <circle
                  cx={geometry.x(entryT)}
                  cy={geometry.y(pick.entry_price)}
                  r={4}
                  className="fill-zinc-900 dark:fill-white"
                />
                <text
                  x={geometry.x(entryT) + 5}
                  y={PAD_T + 8}
                  className="fill-zinc-500 text-[8px] font-semibold uppercase tracking-wide dark:fill-zinc-400"
                >
                  Entry
                </text>
              </g>

              {/* Exit marker */}
              <g>
                <line
                  x1={geometry.x(evalT)}
                  x2={geometry.x(evalT)}
                  y1={PAD_T}
                  y2={CHART_H - PAD_B}
                  className="stroke-zinc-400 dark:stroke-zinc-500"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
                <circle
                  cx={geometry.x(evalT)}
                  cy={geometry.y(pick.eval_price)}
                  r={4}
                  className={profitable ? "fill-emerald-500" : "fill-red-500"}
                />
                <text
                  x={geometry.x(evalT) + 5}
                  y={PAD_T + 18}
                  className="fill-zinc-500 text-[8px] font-semibold uppercase tracking-wide dark:fill-zinc-400"
                >
                  Exit
                </text>
              </g>

              {/* X-axis time labels */}
              {[geometry.tMin, entryT, evalT, geometry.tMax].map((t, i) => (
                <text
                  key={i}
                  x={Math.min(Math.max(geometry.x(t), PAD_L + 10), CHART_W - PAD_R - 10)}
                  y={CHART_H - 8}
                  textAnchor="middle"
                  className="fill-zinc-400 text-[8px] dark:fill-zinc-500"
                >
                  {timeIST(new Date(t).toISOString())}
                </text>
              ))}
            </svg>
          )}
        </div>

        {/* Entry / exit / P&L summary */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center sm:gap-3">
          <div className="rounded-xl border border-zinc-200 px-2 py-2.5 dark:border-zinc-800 sm:rounded-2xl">
            <p className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Entry · {timeIST(pick.entry_time)}
            </p>
            <p className="mt-1 text-sm font-semibold tabular-nums sm:text-base">
              ₹{pick.entry_price.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 px-2 py-2.5 dark:border-zinc-800 sm:rounded-2xl">
            <p className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Exit · {timeIST(pick.eval_time)}
            </p>
            <p className="mt-1 text-sm font-semibold tabular-nums sm:text-base">
              ₹{pick.eval_price.toFixed(2)}
            </p>
          </div>
          <div
            className={`rounded-xl border px-2 py-2.5 sm:rounded-2xl ${
              profitable
                ? "border-emerald-200 bg-emerald-500/5 dark:border-emerald-900"
                : "border-red-200 bg-red-500/5 dark:border-red-900"
            }`}
          >
            <p className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              If you&apos;d followed it
            </p>
            <p
              className={`mt-1 text-sm font-semibold tabular-nums sm:text-base ${
                profitable
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {profitable ? "+" : ""}
              {pick.pnl_pcnt.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* View details CTA — external link to OptionXi */}
        <a
        href={detailsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
        >
        View Full Details
        <ArrowUpRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
        </a>

        <p className="mt-4 text-center text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          For education only — this shows how the pick actually played out, not
          a recommendation to trade it.
        </p>
      </div>
    </div>
  );
}