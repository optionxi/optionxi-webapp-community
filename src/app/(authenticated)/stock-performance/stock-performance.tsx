"use client";

/**
 * Stock Dashboard — redesigned around PROGRESSIVE DISCLOSURE
 *
 *   Level 1  Table      → only what you scan: name, price, change (for the chosen period),
 *                          52W position, volume. RSI shows up only when it's notable.
 *   Level 2  Drawer     → click a row: returns grid, day range, trend verdict.
 *   Level 3  Accordions → inside the drawer: momentum, moving averages, weekly/monthly candles.
 *   Level 4  Full page  → "View full analysis".
 *
 * Animation toolkit (no libraries):
 *   - Sliding segmented control : one indicator, moved with transform: translateX()
 *   - Count-up numbers          : requestAnimationFrame + ease-out cubic
 *   - Staggered rows            : CSS keyframe + per-row animation-delay
 *   - Drawer                    : mounts off-screen, next frame flips a class → CSS transition
 *   - Accordions                : grid-template-rows 0fr → 1fr (animates to "auto" height)
 *   - Range / breadth bars      : width / left transitions
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StockPerformance {
  id: number;
  stckname: string;
  sym_key: string | null;
  open: number;
  high: number;
  low: number;
  close: number;
  vol: number;
  pcnt_1d: number | null;
  pcnt_1w: number | null;
  pcnt_1m: number | null;
  pcnt_3m: number | null;
  pcnt_6m: number | null;
  pcnt_1y: number | null;
  pcnt_2y: number | null;
  pcnt_3y: number | null;
  ema10: number | null; ema20: number | null; ema50: number | null;
  ema100: number | null; ema150: number | null; ema200: number | null;
  sma10: number | null; sma20: number | null; sma50: number | null;
  sma100: number | null; sma150: number | null; sma200: number | null;
  rsi14: number | null;
  curr_week_open: number | null; curr_week_high: number | null;
  curr_week_low: number | null; curr_week_close: number | null; curr_week_vol: number | null;
  prev_week_open: number | null; prev_week_high: number | null;
  prev_week_low: number | null; prev_week_close: number | null;
  curr_month_open: number | null; curr_month_high: number | null;
  curr_month_low: number | null; curr_month_close: number | null; curr_month_vol: number | null;
  prev_month_open: number | null; prev_month_high: number | null;
  prev_month_low: number | null; prev_month_close: number | null;
  week52_high: number | null; week52_low: number | null;
  sec: string | null;
  updated_at: string;
}

type PeriodMode = "1d" | "1w" | "1m" | "3m" | "6m" | "1y" | "2y" | "3y";
type PctCol = "pcnt_1d" | "pcnt_1w" | "pcnt_1m" | "pcnt_3m" | "pcnt_6m" | "pcnt_1y" | "pcnt_2y" | "pcnt_3y";
type SortKey = "change" | "close" | "vol" | "rsi14" | "stckname";
type SortDir = "asc" | "desc";
type RsiMode = "all" | "overbought" | "neutral" | "oversold";
type TrendMode = "all" | "bullish" | "bearish";

interface SectorRow extends Record<PctCol, number | null> { sec: string | null }
interface SectorStat { sec: string; avg: number; count: number }

const PAGE_SIZE = 25;
const PERIODS: PeriodMode[] = ["1d", "1w", "1m", "3m", "6m", "1y", "2y", "3y"];
const PERIOD_COL: Record<PeriodMode, PctCol> = {
  "1d": "pcnt_1d", "1w": "pcnt_1w", "1m": "pcnt_1m", "3m": "pcnt_3m",
  "6m": "pcnt_6m", "1y": "pcnt_1y", "2y": "pcnt_2y", "3y": "pcnt_3y",
};
const MA_LENGTHS = [10, 20, 50, 100, 150, 200] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number | null | undefined, d = 2) =>
  n == null ? "—" : n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const fmtVol = (n: number | null) => {
  if (!n) return "—";
  if (n >= 1_00_00_000) return `${(n / 1_00_00_000).toFixed(2)}Cr`;
  if (n >= 1_00_000) return `${(n / 1_00_000).toFixed(2)}L`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

const ticker = (s: string) => s.replace(/^(NSE|BSE):/, "").replace(/-(EQ|BE|SM)$/, "");
const cleanSlug = (s: string) => ticker(s).toLowerCase().replace(/[^a-z0-9]/g, "-");
const signed = (v: number, d = 1) => `${v > 0 ? "+" : ""}${v.toFixed(d)}%`;
const tone = (v: number | null) =>
  v == null || v === 0 ? "text-zinc-400" : v > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";

const maOf = (s: StockPerformance, kind: "ema" | "sma", n: number) =>
  s[`${kind}${n}` as keyof StockPerformance] as number | null;

// ─── Animation hooks ──────────────────────────────────────────────────────────
/** Smoothly tweens a number toward `target` (ease-out cubic). */
function useCountUp(target: number, duration = 500) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const begin = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = begin + (target - begin) * eased;
      from.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

const AnimStyles = () => (
  <style>{`
    @keyframes sd-fade-up { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
    @keyframes sd-pop     { from { opacity: 0; transform: translateY(-6px) scale(.97) } to { opacity: 1; transform: none } }
    @keyframes sd-grow    { from { transform: scaleX(0) } to { transform: scaleX(1) } }
    .sd-row  { animation: sd-fade-up .35s ease-out both }
    .sd-pop  { animation: sd-pop .18s ease-out both; transform-origin: top right }
    .sd-fade { animation: sd-fade-up .3s ease-out both }
    .sd-grow { animation: sd-grow .6s cubic-bezier(.2,.8,.2,1) both; transform-origin: left }
    @media (prefers-reduced-motion: reduce) {
      .sd-row, .sd-pop, .sd-fade, .sd-grow { animation: none }
      * { transition-duration: 0s !important }
    }
  `}</style>
);

// ─── Small building blocks ────────────────────────────────────────────────────
function PctBadge({ value, big = false }: { value: number | null; big?: boolean }) {
  if (value == null) return <span className="text-xs text-zinc-300 dark:text-zinc-600">—</span>;
  const color =
    value === 0
      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
      : value > 0
      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
      : "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-bold tabular-nums ${color} ${
        big ? "px-2.5 py-1 text-sm" : "px-2 py-0.5 text-xs"
      }`}
    >
      <span className="text-[8px]">{value > 0 ? "▲" : value < 0 ? "▼" : ""}</span>
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

/** Segmented control with a single sliding indicator. */
function Segmented<T extends string>({
  options, value, onChange, className = "",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  const n = options.length;
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div
      className={`relative grid rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 ${className}`}
      style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
    >
      {/* The indicator never remounts — only its translateX changes, so the CSS transition animates it. */}
      <span
        aria-hidden
        className="absolute top-1 bottom-1 left-1 rounded-lg bg-white dark:bg-zinc-600 shadow-sm transition-transform duration-300 ease-out"
        style={{ width: `calc((100% - 8px) / ${n})`, transform: `translateX(${idx * 100}%)` }}
      />
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`relative z-10 px-2.5 py-1.5 text-xs font-bold transition-colors ${
            o.value === value ? "text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Height-animating accordion (grid-template-rows trick). */
function Collapse({
  title, hint, defaultOpen = false, children,
}: { title: string; hint?: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-3.5 py-3 text-left">
        <span>
          <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-100">{title}</span>
          {hint && <span className="block text-[11px] text-zinc-400">{hint}</span>}
        </span>
        <svg
          className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="px-3.5 pb-3.5">{children}</div>
        </div>
      </div>
    </div>
  );
}

function RangeBar({ close, low, high, label }: { close: number; low: number | null; high: number | null; label?: string }) {
  const pct = high != null && low != null && high !== low ? Math.min(Math.max(((close - low) / (high - low)) * 100, 0), 100) : null;
  return (
    <div className="w-full">
      {label && <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>}
      <div className="relative h-1.5 rounded-full bg-gradient-to-r from-red-300 via-zinc-200 to-emerald-300 dark:from-red-900 dark:via-zinc-700 dark:to-emerald-900">
        {pct != null && (
          <span
            className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-blue-600 shadow transition-all duration-700 ease-out dark:border-zinc-900"
            style={{ left: `${pct}%` }}
          />
        )}
      </div>
      <div className="mt-1 flex justify-between text-[10px] tabular-nums text-zinc-400">
        <span>₹{fmt(low)}</span>
        <span>₹{fmt(high)}</span>
      </div>
    </div>
  );
}

function RsiMeter({ value }: { value: number | null }) {
  const v = value ?? 50;
  const label = value == null ? "—" : v >= 70 ? "Overbought" : v <= 30 ? "Oversold" : "Neutral";
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-100">{value?.toFixed(1) ?? "—"}</span>
        <span className={`text-[11px] font-bold ${v >= 70 ? "text-red-500" : v <= 30 ? "text-emerald-500" : "text-zinc-400"}`}>{label}</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700">
        {/* zones: 0–30 oversold, 70–100 overbought */}
        <span className="absolute inset-y-0 left-0 w-[30%] rounded-l-full bg-emerald-200/70 dark:bg-emerald-900/60" />
        <span className="absolute inset-y-0 right-0 w-[30%] rounded-r-full bg-red-200/70 dark:bg-red-900/60" />
        <span
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-blue-600 shadow transition-all duration-700 dark:border-zinc-900"
          style={{ left: `${Math.min(Math.max(v, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

// ─── Detail drawer (right side on desktop, bottom sheet on mobile) ────────────
function Drawer({
  stock, period, onClose, onNavigate, onPickSector,
}: {
  stock: StockPerformance;
  period: PeriodMode;
  onClose: () => void;
  onNavigate: (delta: number) => void;
  onPickSector: (sec: string) => void;
}) {
  const router = useRouter();
  const [shown, setShown] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only render the portal after mount (SSR safety).
  useEffect(() => { setMounted(true); }, []);

  // Mount off-screen, then flip on the next frame so the CSS transition has a start state.
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const close = useCallback(() => {
    setShown(false);
    setTimeout(onClose, 250); // wait for the slide-out before unmounting
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName)) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown") { e.preventDefault(); onNavigate(1); }
      if (e.key === "ArrowUp") { e.preventDefault(); onNavigate(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, onNavigate]);

  // Trend verdict from how many moving averages price sits above
  const mas = MA_LENGTHS.map((n) => maOf(stock, "ema", n)).filter((v): v is number => v != null);
  const above = mas.filter((v) => stock.close > v).length;
  const ratio = mas.length ? above / mas.length : null;
  const verdict =
    ratio == null ? null
    : ratio >= 0.83 ? { text: "Strong uptrend", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400" }
    : ratio >= 0.5 ? { text: "Leaning up", cls: "bg-emerald-50/60 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" }
    : ratio >= 0.17 ? { text: "Leaning down", cls: "bg-red-50/60 text-red-600 dark:bg-red-950/40 dark:text-red-400" }
    : { text: "Strong downtrend", cls: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400" };

  const price = useCountUp(stock.close, 450);

  const returns: [string, number | null][] = [
    ["1D", stock.pcnt_1d], ["1W", stock.pcnt_1w], ["1M", stock.pcnt_1m], ["3M", stock.pcnt_3m],
    ["6M", stock.pcnt_6m], ["1Y", stock.pcnt_1y], ["2Y", stock.pcnt_2y], ["3Y", stock.pcnt_3y],
  ];

  const candles: [string, (number | null)[], number | null][] = [
    ["This week", [stock.curr_week_open, stock.curr_week_high, stock.curr_week_low, stock.curr_week_close], stock.curr_week_vol],
    ["Last week", [stock.prev_week_open, stock.prev_week_high, stock.prev_week_low, stock.prev_week_close], null],
    ["This month", [stock.curr_month_open, stock.curr_month_high, stock.curr_month_low, stock.curr_month_close], stock.curr_month_vol],
    ["Last month", [stock.prev_month_open, stock.prev_month_high, stock.prev_month_low, stock.prev_month_close], null],
  ];

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label={`${ticker(stock.stckname)} details`}
        className={`fixed z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-zinc-900
          inset-x-0 bottom-0 max-h-[88vh] rounded-t-2xl border-t border-zinc-200 dark:border-zinc-800
          md:inset-x-auto md:top-0 md:right-0 md:bottom-0 md:max-h-none md:w-[440px] md:rounded-none md:border-t-0 md:border-l
          ${shown ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}`}
      >
        <div className="flex justify-center pt-2.5 md:hidden">
          <span className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-5 pb-4 pt-4 dark:border-zinc-800">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-mono text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">{ticker(stock.stckname)}</h2>
              {verdict && <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${verdict.cls}`}>{verdict.text}</span>}
            </div>
            {stock.sec && (
              <button
                onClick={() => { onPickSector(stock.sec!); close(); }}
                className="mt-1 text-[11px] text-zinc-400 underline-offset-2 hover:text-blue-600 hover:underline"
              >
                {stock.sec} · see sector
              </button>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button onClick={() => onNavigate(-1)} title="Previous (↑)" className="h-8 w-8 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">↑</button>
            <button onClick={() => onNavigate(1)} title="Next (↓)" className="h-8 w-8 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">↓</button>
            <button onClick={close} title="Close (Esc)" className="h-8 w-8 rounded-lg text-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">×</button>
          </div>
        </div>

        {/* Body — keyed so content fades when you step to another stock */}
        <div key={stock.id} className="sd-fade flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div className="flex items-end gap-3">
            <span className="font-mono text-3xl font-black tabular-nums text-zinc-900 dark:text-zinc-50">₹{fmt(price)}</span>
            <PctBadge value={stock.pcnt_1d} big />
            <span className="mb-1 text-[11px] text-zinc-400">today</span>
          </div>

          {/* Returns */}
          <section>
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Returns</h3>
            <div className="grid grid-cols-4 gap-2">
              {returns.map(([l, v]) => {
                const active = l.toLowerCase() === period;
                return (
                  <div
                    key={l}
                    className={`rounded-lg border px-2 py-2 text-center ${
                      active ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-zinc-100 dark:border-zinc-800"
                    }`}
                  >
                    <p className="text-[10px] font-bold text-zinc-400">{l}</p>
                    <p className={`font-mono text-xs font-bold tabular-nums ${tone(v)}`}>{v == null ? "—" : signed(v)}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Ranges */}
          <section className="space-y-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
            <RangeBar label="52-week range" close={stock.close} low={stock.week52_low} high={stock.week52_high} />
            <RangeBar label="Today's range" close={stock.close} low={stock.low} high={stock.high} />
            <div className="grid grid-cols-3 gap-2 text-center">
              {[["Open", `₹${fmt(stock.open)}`], ["Prev stats", `Vol ${fmtVol(stock.vol)}`], ["Close", `₹${fmt(stock.close)}`]].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] text-zinc-400">{k}</p>
                  <p className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-200">{v}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Level 3: accordions */}
          <Collapse title="Momentum" hint="RSI and where price sits vs EMAs" defaultOpen>
            <div className="space-y-4">
              <RsiMeter value={stock.rsi14} />
              <div>
                <p className="mb-1.5 text-[11px] text-zinc-400">
                  Above {above} of {mas.length} EMAs
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {MA_LENGTHS.map((n) => {
                    const v = maOf(stock, "ema", n);
                    if (!v) return null;
                    const up = stock.close > v;
                    return (
                      <span
                        key={n}
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                          up ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                             : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                        }`}
                      >
                        EMA{n} {up ? "▲" : "▼"}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </Collapse>

          <Collapse title="Moving averages" hint="Exact EMA & SMA values">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-zinc-400">
                  <th className="pb-1 text-left font-bold">Length</th>
                  <th className="pb-1 text-right font-bold">EMA</th>
                  <th className="pb-1 text-right font-bold">SMA</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {MA_LENGTHS.map((n) => {
                  const e = maOf(stock, "ema", n), s = maOf(stock, "sma", n);
                  return (
                    <tr key={n} className="border-t border-zinc-100 dark:border-zinc-800">
                      <td className="py-1.5 text-zinc-400">{n}</td>
                      <td className={`py-1.5 text-right ${e ? (stock.close > e ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400") : ""}`}>{e ? fmt(e) : "—"}</td>
                      <td className={`py-1.5 text-right ${s ? (stock.close > s ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400") : ""}`}>{s ? fmt(s) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Collapse>

          <Collapse title="Weekly & monthly candles" hint="Open · High · Low · Close · Volume">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-zinc-400">
                    <th className="pb-1 text-left font-bold" />
                    {["O", "H", "L", "C", "Vol"].map((h) => <th key={h} className="pb-1 text-right font-bold">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {candles.map(([label, [o, h, l, c], v]) => (
                    <tr key={label} className="border-t border-zinc-100 dark:border-zinc-800">
                      <td className="whitespace-nowrap py-1.5 pr-2 font-sans text-zinc-400">{label}</td>
                      <td className="py-1.5 text-right">{fmt(o)}</td>
                      <td className="py-1.5 text-right text-emerald-600 dark:text-emerald-400">{fmt(h)}</td>
                      <td className="py-1.5 text-right text-red-600 dark:text-red-400">{fmt(l)}</td>
                      <td className="py-1.5 text-right font-bold">{fmt(c)}</td>
                      <td className="py-1.5 text-right text-zinc-400">{v ? fmtVol(v) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapse>
        </div>

        {/* Footer CTA */}
        <div className="flex items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-800/60">
          <p className="text-[10px] text-zinc-400">
            Updated {new Date(stock.updated_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </p>
          <button
            onClick={() => router.push(`/stocks/${cleanSlug(stock.stckname)}`)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
          >
            View full analysis →
          </button>
        </div>
      </aside>
    </>,
    document.body
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function StockDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // data
  const [stocks, setStocks] = useState<StockPerformance[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0); // bumps every successful fetch → rows re-animate
  const [reloadKey, setReloadKey] = useState(0);
  const [sectorRows, setSectorRows] = useState<SectorRow[]>([]);

  // filters (all server-side)
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sector, setSector] = useState(() => searchParams?.get("sector") || "All");
  const [period, setPeriod] = useState<PeriodMode>("1d");
  const [rsiMode, setRsiMode] = useState<RsiMode>("all");
  const [trendMode, setTrendMode] = useState<TrendMode>("all");
  const [sortKey, setSortKey] = useState<SortKey>("change");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  // ui
  const [selected, setSelected] = useState<StockPerformance | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sectorsExpanded, setSectorsExpanded] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const filterWrapRef = useRef<HTMLDivElement>(null);
  const reqId = useRef(0);

  // one-time tip
  useEffect(() => {
    try { if (!localStorage.getItem("sd-hint-dismissed")) setShowHint(true); } catch { setShowHint(true); }
  }, []);
  const dismissHint = () => {
    setShowHint(false);
    try { localStorage.setItem("sd-hint-dismissed", "1"); } catch { /* ignore */ }
  };

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // "/" focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // close filter popover on outside click
  useEffect(() => {
    if (!filtersOpen) return;
    const onDown = (e: MouseEvent) => {
      if (filterWrapRef.current && !filterWrapRef.current.contains(e.target as Node)) setFiltersOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [filtersOpen]);

  // ── Sector + market breadth source (fetched once) ──────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("stock_performance")
          .select("sec, pcnt_1d, pcnt_1w, pcnt_1m, pcnt_3m, pcnt_6m, pcnt_1y, pcnt_2y, pcnt_3y")
          .limit(5000);
        if (error) throw error;
        setSectorRows((data as SectorRow[]) ?? []);
      } catch (e) {
        console.error("Sector fetch error:", e);
      }
    })();
  }, []);

  const sectorStats: SectorStat[] = useMemo(() => {
    const col = PERIOD_COL[period];
    const map = new Map<string, { sum: number; n: number }>();
    for (const r of sectorRows) {
      const v = r[col];
      if (!r.sec || v == null) continue;
      const m = map.get(r.sec) ?? { sum: 0, n: 0 };
      m.sum += v; m.n += 1;
      map.set(r.sec, m);
    }
    return [...map.entries()]
      .map(([sec, m]) => ({ sec, avg: m.sum / m.n, count: m.n }))
      .sort((a, b) => b.avg - a.avg);
  }, [sectorRows, period]);

  const breadth = useMemo(() => {
    let up = 0, down = 0, flat = 0;
    for (const r of sectorRows) {
      const v = r.pcnt_1d;
      if (v == null) continue;
      if (v > 0) up++; else if (v < 0) down++; else flat++;
    }
    const t = up + down + flat;
    return { up, down, flat, upPct: t ? (up / t) * 100 : 50 };
  }, [sectorRows]);

  // ── Stock fetch: one effect, driven by state. A request id drops stale responses. ──
  useEffect(() => {
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const from = page * PAGE_SIZE;
        const periodCol = PERIOD_COL[period];
        const sortCol = sortKey === "change" ? periodCol : sortKey;

        let q = supabase.from("stock_performance").select("*", { count: "exact" });

        const term = debouncedSearch.replace(/[,()%*]/g, " ").trim();
        if (term) q = q.or(`stckname.ilike.%${term}%,sec.ilike.%${term}%`);
        if (sector !== "All") q = q.eq("sec", sector);

        if (rsiMode === "overbought") q = q.gte("rsi14", 70);
        else if (rsiMode === "oversold") q = q.lte("rsi14", 30);
        else if (rsiMode === "neutral") q = q.gt("rsi14", 30).lt("rsi14", 70);

        if (trendMode === "bullish") q = q.gt(periodCol, 0);
        else if (trendMode === "bearish") q = q.lt(periodCol, 0);

        if (sortCol !== "stckname") q = q.not(sortCol, "is", null);

        q = q
          .order(sortCol, { ascending: sortDir === "asc", nullsFirst: false })
          .range(from, from + PAGE_SIZE - 1);

        const { data, count, error: err } = await q;
        if (id !== reqId.current) return;
        if (err) throw err;
        setStocks((data as StockPerformance[]) ?? []);
        setTotal(count ?? 0);
        setVersion((v) => v + 1);
      } catch (e) {
        if (id !== reqId.current) return;
        setError(e instanceof Error ? e.message : "Failed to load stocks");
        setStocks([]);
        setTotal(0);
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    })();
  }, [debouncedSearch, sector, period, rsiMode, trendMode, sortKey, sortDir, page, reloadKey]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const pickSector = (v: string) => {
    setSector(v); setPage(0); setSelected(null);
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (v === "All") params.delete("sector"); else params.set("sector", v);
    const qs = params.toString();
    const path = pathname ?? "/stock-performance";
    router.replace(qs ? `${path}?${qs}` : path, { scroll: false });
  };

  const pickPeriod = (p: PeriodMode) => {
    setPeriod(p); setPage(0);
    setSortKey("change"); setSortDir("desc"); // switching period = "show me the top movers in this period"
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir(key === "stckname" ? "asc" : "desc"); }
    setPage(0);
  };

  const clearAll = () => {
    setSearch(""); setDebouncedSearch(""); setRsiMode("all"); setTrendMode("all");
    pickSector("All");
  };

  const navigateSelected = useCallback(
    (delta: number) => {
      setSelected((cur) => {
        if (!cur) return cur;
        const i = stocks.findIndex((s) => s.id === cur.id);
        return stocks[i + delta] ?? cur;
      });
    },
    [stocks]
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const animatedTotal = Math.round(useCountUp(total, 450));
  const filterCount = (rsiMode !== "all" ? 1 : 0) + (trendMode !== "all" ? 1 : 0);
  const hasAnyFilter = filterCount > 0 || sector !== "All" || debouncedSearch.trim() !== "";

  const SortTh = ({ label, k, className = "" }: { label: string; k: SortKey; className?: string }) => {
    const active = sortKey === k;
    return (
      <th
        onClick={() => toggleSort(k)}
        className={`cursor-pointer select-none whitespace-nowrap px-3 py-3 text-left text-[10px] font-bold uppercase tracking-widest transition-colors ${
          active ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        } ${className}`}
      >
        {label} <span className={active ? "" : "opacity-30"}>{active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
      </th>
    );
  };

  const visibleSectors = sectorStats;

  return (
    <div className="min-h-screen">
      <AnimStyles />
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-3 py-5 sm:px-4">

        {/* ── Header: title + market breadth ─────────────────────────────── */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Market performance</h1>
            <p className="text-xs text-zinc-400">
              <span className="font-mono">{animatedTotal.toLocaleString("en-IN")}</span> stocks
              {sector !== "All" && <> in <b className="text-zinc-600 dark:text-zinc-300">{sector}</b></>}
            </p>
          </div>

          {breadth.up + breadth.down > 0 && (
            <div className="w-full sm:w-64">
              <div className="mb-1 flex justify-between text-[11px] font-bold tabular-nums">
                <span className="text-emerald-600 dark:text-emerald-400">▲ {breadth.up.toLocaleString("en-IN")}</span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">Today</span>
                <span className="text-red-600 dark:text-red-400">{breadth.down.toLocaleString("en-IN")} ▼</span>
              </div>
              <div className="flex h-1.5 overflow-hidden rounded-full bg-red-400/80">
                <div className="h-full bg-emerald-500 transition-all duration-700 ease-out" style={{ width: `${breadth.upPct}%` }} />
              </div>
            </div>
          )}
        </header>

        {/* ── Controls ───────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stock or sector"
                className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-10 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-zinc-200 px-1.5 text-[10px] text-zinc-400 dark:border-zinc-700 sm:block">/</kbd>
            </div>

            {/* Filters popover */}
            <div ref={filterWrapRef} className="relative">
              <button
                onClick={() => setFiltersOpen((o) => !o)}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  filterCount || filtersOpen
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M7 12h10M10 18h4" />
                </svg>
                Filters
                {filterCount > 0 && <span className="rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">{filterCount}</span>}
              </button>

              {filtersOpen && (
                <div className="sd-pop absolute right-0 z-30 mt-2 w-[300px] space-y-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                  <div>
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">RSI zone</p>
                    <Segmented<RsiMode>
                      value={rsiMode}
                      onChange={(v) => { setRsiMode(v); setPage(0); }}
                      options={[
                        { value: "all", label: "All" },
                        { value: "oversold", label: "≤ 30" },
                        { value: "neutral", label: "Mid" },
                        { value: "overbought", label: "≥ 70" },
                      ]}
                    />
                  </div>
                  <div>
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Trend ({period.toUpperCase()})
                    </p>
                    <Segmented<TrendMode>
                      value={trendMode}
                      onChange={(v) => { setTrendMode(v); setPage(0); }}
                      options={[
                        { value: "all", label: "All" },
                        { value: "bullish", label: "▲ Gainers" },
                        { value: "bearish", label: "▼ Losers" },
                      ]}
                    />
                  </div>
                  <div>
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Sort by</p>
                    <div className="flex flex-wrap gap-1.5">
                      {([["change", `${period.toUpperCase()} change`], ["close", "Price"], ["vol", "Volume"], ["rsi14", "RSI"], ["stckname", "Name"]] as [SortKey, string][]).map(([k, l]) => (
                        <button
                          key={k}
                          onClick={() => toggleSort(k)}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
                            sortKey === k
                              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                              : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700"
                          }`}
                        >
                          {l} {sortKey === k && (sortDir === "asc" ? "↑" : "↓")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Period — the main control, so it's always visible */}
          <div className="overflow-x-auto">
            <Segmented<PeriodMode>
              className="min-w-[360px] sm:max-w-md"
              value={period}
              onChange={pickPeriod}
              options={PERIODS.map((p) => ({ value: p, label: p.toUpperCase() }))}
            />
          </div>

          {/* Sector chips: 2 rows, expand on demand. Averages follow the chosen period. */}
          {visibleSectors.length > 0 && (
            <div>
              <div
                className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
                style={{ maxHeight: sectorsExpanded ? 600 : 64 }}
              >
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => pickSector("All")}
                    className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                      sector === "All" ? "border-blue-600 bg-blue-600 text-white" : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    All sectors
                  </button>
                  {visibleSectors.map((s) => (
                    <button
                      key={s.sec}
                      onClick={() => pickSector(sector === s.sec ? "All" : s.sec)}
                      title={`${s.count} stocks`}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                        sector === s.sec
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                      }`}
                    >
                      <span className="max-w-[150px] truncate">{s.sec}</span>
                      <span className={`font-mono text-[11px] tabular-nums ${sector === s.sec ? "text-white/90" : tone(s.avg)}`}>{signed(s.avg)}</span>
                    </button>
                  ))}
                </div>
              </div>
              {visibleSectors.length > 8 && (
                <button
                  onClick={() => setSectorsExpanded((e) => !e)}
                  className="mt-1.5 text-[11px] font-bold text-blue-600 hover:underline dark:text-blue-400"
                >
                  {sectorsExpanded ? "Show fewer" : `Show all ${visibleSectors.length} sectors`}
                </button>
              )}
            </div>
          )}

          {/* Active filter chips */}
          {hasAnyFilter && (
            <div className="sd-fade flex flex-wrap items-center gap-2">
              {sector !== "All" && <ActiveChip label={sector} onClear={() => pickSector("All")} />}
              {debouncedSearch.trim() && <ActiveChip label={`“${debouncedSearch.trim()}”`} onClear={() => { setSearch(""); setDebouncedSearch(""); }} />}
              {rsiMode !== "all" && <ActiveChip label={`RSI ${rsiMode}`} onClear={() => setRsiMode("all")} />}
              {trendMode !== "all" && <ActiveChip label={trendMode === "bullish" ? "Gainers" : "Losers"} onClear={() => setTrendMode("all")} />}
              <button onClick={clearAll} className="text-[11px] font-bold text-zinc-400 underline-offset-2 hover:text-zinc-600 hover:underline">
                Clear all
              </button>
            </div>
          )}
        </div>

        {showHint && (
          <div className="sd-fade flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
            <span>Tip: click any stock for details · <b>↑ ↓</b> to browse · <b>Esc</b> to close · <b>/</b> to search</span>
            <button onClick={dismissHint} className="font-bold opacity-70 hover:opacity-100">Got it</button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            <span>⚠ {error}</span>
            <button onClick={() => setReloadKey((k) => k + 1)} className="ml-auto text-xs font-bold underline">Retry</button>
          </div>
        )}

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className={`w-full border-collapse text-sm transition-opacity duration-200 ${loading && stocks.length ? "opacity-50" : "opacity-100"}`}>
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80">
                  <SortTh label="Stock" k="stckname" className="pl-4" />
                  <SortTh label="Price" k="close" />
                  <SortTh label={`${period.toUpperCase()} change`} k="change" />
                  <th className="hidden px-3 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400 md:table-cell">52W range</th>
                  <SortTh label="Volume" k="vol" className="hidden lg:table-cell" />
                </tr>
              </thead>
              <tbody>
                {loading && stocks.length === 0 ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className={`px-3 py-4 ${j === 3 ? "hidden md:table-cell" : ""} ${j === 4 ? "hidden lg:table-cell" : ""}`}>
                          <div className="h-3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" style={{ animationDelay: `${i * 50 + j * 30}ms` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : stocks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <p className="text-sm text-zinc-400">{error ? "Couldn't load data." : "No stocks match these filters."}</p>
                      {hasAnyFilter && (
                        <button onClick={clearAll} className="mt-2 text-xs font-bold text-blue-600 hover:underline">Clear filters</button>
                      )}
                    </td>
                  </tr>
                ) : (
                  stocks.map((s, i) => {
                    const isSel = selected?.id === s.id;
                    const rsi = s.rsi14;
                    return (
                      <tr
                        key={`${version}-${s.id}`}
                        onClick={() => setSelected(s)}
                        style={{ animationDelay: `${Math.min(i, 14) * 18}ms` }}
                        className={`sd-row cursor-pointer border-b border-zinc-100 transition-colors dark:border-zinc-800 ${
                          isSel ? "bg-blue-50 shadow-[inset_3px_0_0_#2563eb] dark:bg-blue-950/20" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        <td className="py-3 pl-4 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-black text-zinc-900 dark:text-zinc-50">{ticker(s.stckname)}</span>
                            {/* RSI only appears when it's notable — everything else lives in the drawer */}
                            {rsi != null && rsi >= 70 && <span className="rounded bg-red-50 px-1.5 text-[10px] font-bold text-red-600 dark:bg-red-950/60 dark:text-red-400">RSI {rsi.toFixed(0)}</span>}
                            {rsi != null && rsi <= 30 && <span className="rounded bg-emerald-50 px-1.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">RSI {rsi.toFixed(0)}</span>}
                          </div>
                          {s.sec && (
                            <button
                              onClick={(e) => { e.stopPropagation(); pickSector(s.sec!); }}
                              className="mt-0.5 block max-w-[180px] truncate text-left text-[11px] text-zinc-400 hover:text-blue-600 hover:underline"
                            >
                              {s.sec}
                            </button>
                          )}
                        </td>
                        <td className="px-3 py-3 font-mono text-sm font-bold tabular-nums text-zinc-800 dark:text-zinc-100">₹{fmt(s.close)}</td>
                        <td className="px-3 py-3"><PctBadge value={s[PERIOD_COL[period]]} /></td>
                        <td className="hidden w-48 px-3 py-3 md:table-cell"><MiniRange close={s.close} low={s.week52_low} high={s.week52_high} /></td>
                        <td className="hidden px-3 py-3 font-mono text-xs text-zinc-500 lg:table-cell">{fmtVol(s.vol)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > PAGE_SIZE && (
            <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/40">
              <span className="font-mono text-xs text-zinc-400">
                {(page * PAGE_SIZE + 1).toLocaleString("en-IN")}–{Math.min((page + 1) * PAGE_SIZE, total).toLocaleString("en-IN")} of {total.toLocaleString("en-IN")}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  ← Prev
                </button>
                <span className="text-xs text-zinc-400">{page + 1} / {totalPages}</span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <Drawer
          stock={selected}
          period={period}
          onClose={() => setSelected(null)}
          onNavigate={navigateSelected}
          onPickSector={pickSector}
        />
      )}
    </div>
  );
}

function ActiveChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      onClick={onClear}
      className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
    >
      {label} <span className="opacity-60">×</span>
    </button>
  );
}

function MiniRange({ close, low, high }: { close: number; low: number | null; high: number | null }) {
  const pct = high != null && low != null && high !== low ? Math.min(Math.max(((close - low) / (high - low)) * 100, 0), 100) : null;
  if (pct == null) return <span className="text-xs text-zinc-300">—</span>;
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700">
        {/* grows from the left on mount (sd-grow), colored by position in the range */}
        <div
          className={`sd-grow absolute inset-y-0 left-0 rounded-full ${pct > 66 ? "bg-emerald-500" : pct < 33 ? "bg-red-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right font-mono text-[10px] tabular-nums text-zinc-400">{pct.toFixed(0)}%</span>
    </div>
  );
}

// useSearchParams requires a Suspense boundary in the Next.js app router
export default function Page() {
  return (
    <Suspense fallback={null}>
      <StockDashboard />
    </Suspense>
  );
}