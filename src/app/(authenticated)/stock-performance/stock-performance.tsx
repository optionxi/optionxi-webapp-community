"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from '@/lib/supabase/client';
import { useRouter, usePathname, useSearchParams } from "next/navigation";


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
  pcnt_1d: number | null;   // ← NEW
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

interface SectorStat {
  sec: string;
  avg_1d: number;
  avg_1w: number;
  avg_1m: number;
  count: number;
}

type SortCol =
  | "pcnt_1d" | "pcnt_1w" | "pcnt_1m" | "pcnt_3m" | "pcnt_6m" | "pcnt_1y" 
  | "pcnt_2y" | "pcnt_3y"  // ← Add these
  | "close" | "vol" | "rsi14" | "stckname";
type SortDir = "asc" | "desc";
type RsiMode = "all" | "overbought" | "oversold" | "neutral";
type TrendMode = "all" | "bullish" | "bearish";
type PeriodMode = "1d" | "1w" | "1m" | "3m" | "6m" | "1y" | "2y" | "3y";  // ← Add "2y" 
type DetailTab = "overview" | "technicals" | "periodic";

const PAGE_SIZE = 25;



const PERIOD_COL: Record<PeriodMode, SortCol> = {
  "1d": "pcnt_1d",
  "1w": "pcnt_1w",
  "1m": "pcnt_1m",
  "3m": "pcnt_3m",
  "6m": "pcnt_6m",
  "1y": "pcnt_1y",
  "2y": "pcnt_2y",  // ← Add
  "3y": "pcnt_3y",  // ← Add
};

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

const ticker = (s: string) =>
  s.replace(/^NSE:|BSE:/, "").replace(/-EQ$|-BE$|-SM$/, "");

const getCleanStockName = (s: string) =>
  ticker(s).toLowerCase().replace(/[^a-z0-9]/g, "-");

const getRsiLabel = (v: number | null) => {
  if (v == null) return { label: "—", cls: "text-zinc-400" };
  if (v >= 70) return { label: "Overbought", cls: "text-red-500 dark:text-red-400" };
  if (v <= 30) return { label: "Oversold", cls: "text-emerald-500 dark:text-emerald-400" };
  return { label: "Neutral", cls: "text-zinc-400" };
};

// ─── Micro components ─────────────────────────────────────────────────────────
function PctBadge({ value }: { value: number | null }) {
  if (value == null) return <span className="text-xs text-zinc-400">—</span>;
  const base = "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-bold tabular-nums";
  const pos = value > 0;
  const zero = value === 0;
  const color = zero
    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
    : pos
    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
    : "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400";
  return (
    <span className={`${base} ${color}`}>
      {pos ? "▲" : value < 0 ? "▼" : ""}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

function RsiBar({ value }: { value: number | null }) {
  const { label, cls } = getRsiLabel(value);
  const pos = Math.min(Math.max(value ?? 50, 0), 100);
  const barColor =
    (value ?? 50) >= 70 ? "bg-red-500"
    : (value ?? 50) <= 30 ? "bg-emerald-500"
    : "bg-blue-500";
  return (
    <div className="flex flex-col gap-1 min-w-[80px]">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {value?.toFixed(1) ?? "—"}
        </span>
        <span className={`text-[10px] font-bold ${cls}`}>{label}</span>
      </div>
      <div className="h-1 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pos}%` }}
        />
      </div>
    </div>
  );
}

function Week52Bar({ close, high, low }: { close: number; high: number | null; low: number | null }) {
  const pct = high && low && high !== low ? ((close - low) / (high - low)) * 100 : null;
  return (
    <div className="flex flex-col gap-1 min-w-[100px]">
      <div className="flex justify-between text-[10px] text-zinc-400 tabular-nums">
        <span>{fmt(low)}</span>
        <span>{fmt(high)}</span>
      </div>
      <div className="relative h-1 rounded-full bg-zinc-200 dark:bg-zinc-700">
        {pct != null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-zinc-900 shadow"
            style={{ left: `calc(${pct}% - 5px)` }}
          />
        )}
      </div>
    </div>
  );
}

function EmaChip({ label, price, ema }: { label: string; price: number; ema: number | null }) {
  if (!ema) return null;
  const above = price > ema;
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
      above
        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
        : "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400"
    }`}>
      {label} {above ? "▲" : "▼"}
    </span>
  );
}

function Skeleton() {
  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800">
      {Array.from({ length: 14 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Sector Card ──────────────────────────────────────────────────────────────
function SectorCard({ stat, active, onClick }: { stat: SectorStat; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group flex-shrink-0 text-left rounded-xl p-3 border transition-all duration-150 cursor-pointer w-[160px]
        ${active
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-500/30"
          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
        }`}
    >
      {/* Sector name: wrap up to 2 lines, then ellipsis */}
      <p
        className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2 leading-tight"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "2.2em",
        }}
      >
        {stat.sec}
      </p>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div>
          <p className="text-[9px] text-zinc-400 mb-0.5">1D</p>
          <PctBadge value={stat.avg_1d} />
        </div>
        <div className="text-right">
          <p className="text-[9px] text-zinc-400 mb-0.5">1W</p>
          <PctBadge value={stat.avg_1w} />
        </div>
      </div>
      <p className="text-[10px] text-zinc-400">{stat.count} stocks</p>
    </button>
  );
}

// ─── Bottom Sheet Detail Panel (Mobile) ──────────────────────────────────────
function DRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className={`text-xs font-mono font-semibold ${valueClass ?? "text-zinc-800 dark:text-zinc-100"}`}>{value}</span>
    </div>
  );
}

function DSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-2">{title}</h4>
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg px-3 py-1">
        {children}
      </div>
    </div>
  );
}

function DetailPanelContent({ stock, tab }: { stock: StockPerformance; tab: DetailTab }) {
  return (
    <>
      {tab === "overview" && (
        <>
          <DSection title="OHLCV">
            <DRow label="Open" value={`₹${fmt(stock.open)}`} />
            <DRow label="High" value={`₹${fmt(stock.high)}`} valueClass="text-emerald-600 dark:text-emerald-400 font-mono font-semibold" />
            <DRow label="Low" value={`₹${fmt(stock.low)}`} valueClass="text-red-600 dark:text-red-400 font-mono font-semibold" />
            <DRow label="Close" value={`₹${fmt(stock.close)}`} valueClass="text-zinc-800 dark:text-zinc-100 font-mono font-bold" />
            <DRow label="Volume" value={fmtVol(stock.vol)} />
          </DSection>
          <DSection title="52-WEEK RANGE">
            <DRow label="High" value={`₹${fmt(stock.week52_high)}`} valueClass="text-emerald-600 dark:text-emerald-400 font-mono font-semibold" />
            <DRow label="Low" value={`₹${fmt(stock.week52_low)}`} valueClass="text-red-600 dark:text-red-400 font-mono font-semibold" />
            <div className="pt-2 pb-1">
              <Week52Bar close={stock.close} high={stock.week52_high} low={stock.week52_low} />
            </div>
          </DSection>
          <DSection title="PERFORMANCE">
            {([
              ["1D", stock.pcnt_1d],
              ["1W", stock.pcnt_1w],
              ["1M", stock.pcnt_1m],
              ["3M", stock.pcnt_3m],
              ["6M", stock.pcnt_6m],
              ["1Y", stock.pcnt_1y],
              ["2Y", stock.pcnt_2y],
              ["3Y", stock.pcnt_3y],
            ] as [string, number | null][]).map(([l, v]) => (
              <div key={l} className="flex justify-between items-center py-1.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                <span className="text-xs text-zinc-400">{l}</span>
                <PctBadge value={v} />
              </div>
            ))}
          </DSection>
        </>
      )}

      {tab === "technicals" && (
        <>
          <DSection title="RSI (14)">
            <div className="py-2">
              <RsiBar value={stock.rsi14} />
            </div>
          </DSection>
          <DSection title="EMA SIGNALS">
            <div className="flex flex-wrap gap-1.5 py-2">
              {[10, 20, 50, 100, 150, 200].map((n) => (
                <EmaChip key={n} label={`EMA${n}`} price={stock.close}
                  ema={stock[`ema${n}` as keyof StockPerformance] as number | null} />
              ))}
            </div>
          </DSection>
          <DSection title="EMA VALUES">
            {[10, 20, 50, 100, 150, 200].map((n) => {
              const v = stock[`ema${n}` as keyof StockPerformance] as number | null;
              return <DRow key={n} label={`EMA ${n}`} value={v ? `₹${fmt(v)}` : "—"} />;
            })}
          </DSection>
          <DSection title="SMA VALUES">
            {[10, 20, 50, 100, 150, 200].map((n) => {
              const v = stock[`sma${n}` as keyof StockPerformance] as number | null;
              return <DRow key={n} label={`SMA ${n}`} value={v ? `₹${fmt(v)}` : "—"} />;
            })}
          </DSection>
        </>
      )}

      {tab === "periodic" && (
        <>
          <DSection title="CURRENT WEEK">
            <DRow label="Open" value={`₹${fmt(stock.curr_week_open)}`} />
            <DRow label="High" value={`₹${fmt(stock.curr_week_high)}`} valueClass="text-emerald-600 dark:text-emerald-400 font-mono font-semibold" />
            <DRow label="Low" value={`₹${fmt(stock.curr_week_low)}`} valueClass="text-red-600 dark:text-red-400 font-mono font-semibold" />
            <DRow label="Close" value={`₹${fmt(stock.curr_week_close)}`} />
            <DRow label="Volume" value={fmtVol(stock.curr_week_vol)} />
          </DSection>
          <DSection title="PREV WEEK">
            <DRow label="Open" value={`₹${fmt(stock.prev_week_open)}`} />
            <DRow label="High" value={`₹${fmt(stock.prev_week_high)}`} valueClass="text-emerald-600 dark:text-emerald-400 font-mono font-semibold" />
            <DRow label="Low" value={`₹${fmt(stock.prev_week_low)}`} valueClass="text-red-600 dark:text-red-400 font-mono font-semibold" />
            <DRow label="Close" value={`₹${fmt(stock.prev_week_close)}`} />
          </DSection>
          <DSection title="CURRENT MONTH">
            <DRow label="Open" value={`₹${fmt(stock.curr_month_open)}`} />
            <DRow label="High" value={`₹${fmt(stock.curr_month_high)}`} valueClass="text-emerald-600 dark:text-emerald-400 font-mono font-semibold" />
            <DRow label="Low" value={`₹${fmt(stock.curr_month_low)}`} valueClass="text-red-600 dark:text-red-400 font-mono font-semibold" />
            <DRow label="Close" value={`₹${fmt(stock.curr_month_close)}`} />
            <DRow label="Volume" value={fmtVol(stock.curr_month_vol)} />
          </DSection>
          <DSection title="PREV MONTH">
            <DRow label="Open" value={`₹${fmt(stock.prev_month_open)}`} />
            <DRow label="High" value={`₹${fmt(stock.prev_month_high)}`} valueClass="text-emerald-600 dark:text-emerald-400 font-mono font-semibold" />
            <DRow label="Low" value={`₹${fmt(stock.prev_month_low)}`} valueClass="text-red-600 dark:text-red-400 font-mono font-semibold" />
            <DRow label="Close" value={`₹${fmt(stock.prev_month_close)}`} />
          </DSection>
        </>
      )}
    </>
  );
}

function DetailHeader({
  stock,
  onClose,
  onMoreDetails,
}: {
  stock: StockPerformance;
  onClose: () => void;
  onMoreDetails: () => void;
}) {
  return (
    <div className="px-4 py-4 bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-100 dark:border-zinc-800">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="font-mono font-black text-lg text-blue-600 dark:text-blue-400 tracking-tight">
            {ticker(stock.stckname)}
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">{stock.sym_key}</p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors flex items-center justify-center text-base font-bold"
        >
          ×
        </button>
      </div>
      <div className="flex items-end gap-2 mb-3">
        <span className="font-mono font-black text-2xl text-zinc-800 dark:text-zinc-100">₹{fmt(stock.close)}</span>
        <PctBadge value={stock.pcnt_1d} />
        <PctBadge value={stock.pcnt_1w} />
      </div>
      <button
        onClick={onMoreDetails}
        className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5"
      >
        <span>More Details</span>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </button>
      {stock.sec && (
        <span className="inline-block mt-2 text-[10px] px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 font-medium">
          {stock.sec}
        </span>
      )}
    </div>
  );
}

// ─── Bottom Sheet (Mobile) ────────────────────────────────────────────────────
function BottomSheet({ stock, onClose }: { stock: StockPerformance; onClose: () => void }) {
  const [tab, setTab] = useState<DetailTab>("overview");
  const router = useRouter();
  const handleMoreDetails = () => router.push(`/stocks/${getCleanStockName(stock.stckname)}`);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
        <DetailHeader stock={stock} onClose={onClose} onMoreDetails={handleMoreDetails} />
        <div className="flex border-b border-zinc-100 dark:border-zinc-800 px-4">
          {(["overview", "technicals", "periodic"] as DetailTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-[11px] font-bold capitalize tracking-wide transition-all
                ${tab === t ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <DetailPanelContent stock={stock} tab={tab} />
        </div>
        <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60">
          <p className="text-[10px] text-zinc-400">
            Updated {new Date(stock.updated_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Side Panel (Desktop) — sticky relative to viewport ──────────────────────
// navbarHeight: the height of your outer sticky navbar so the panel starts below it
const NAVBAR_HEIGHT = 64; // px — adjust to match your actual navbar height

function DetailPanel({
  stock,
  onClose,
}: {
  stock: StockPerformance;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<DetailTab>("overview");
  const router = useRouter();
  const handleMoreDetails = () => router.push(`/stocks/${getCleanStockName(stock.stckname)}`);

  return (
    <div
      className="hidden md:flex w-80 flex-shrink-0 flex-col bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden"
      style={{
        // Sticky: sticks BELOW the navbar
        position: "sticky",
        top: NAVBAR_HEIGHT + 20, // 20px gap below navbar
        // Max height so it doesn't overflow viewport; internal content scrolls
        maxHeight: `calc(100vh - ${NAVBAR_HEIGHT + 40}px)`,
        alignSelf: "flex-start",
      }}
    >
      <DetailHeader stock={stock} onClose={onClose} onMoreDetails={handleMoreDetails} />
      {/* Tabs */}
      <div className="flex border-b border-zinc-100 dark:border-zinc-800">
        {(["overview", "technicals", "periodic"] as DetailTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-[11px] font-bold capitalize tracking-wide transition-all
              ${tab === t ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
          >
            {t}
          </button>
        ))}
      </div>
      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700">
        <DetailPanelContent stock={stock} tab={tab} />
      </div>
      <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60">
        <p className="text-[10px] text-zinc-400">
          Updated {new Date(stock.updated_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </div>
    </div>
  );
}

// ─── Filter Pill ──────────────────────────────────────────────────────────────
function Pill({
  children, active, onClick, activeClass = "bg-blue-600 text-white",
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  activeClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 font-mono
        ${active ? activeClass : "bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"}`}
    >
      {children}
    </button>
  );
}

// ─── Sort Header ──────────────────────────────────────────────────────────────
function SortTh({
  label, col, current, dir, onSort,
}: {
  label: string; col: SortCol; current: SortCol; dir: SortDir; onSort: (c: SortCol) => void;
}) {
  const active = current === col;
  return (
    <th
      onClick={() => onSort(col)}
      className={`px-3 py-3 text-left text-[10px] font-bold uppercase tracking-widest cursor-pointer select-none whitespace-nowrap
        bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 transition-colors
        ${active ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
    >
      {label} {active ? (dir === "asc" ? "↑" : "↓") : <span className="opacity-30">↕</span>}
    </th>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StockDashboard() {
  const [stocks, setStocks] = useState<StockPerformance[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sectors, setSectors] = useState<SectorStat[]>([]);
  const [sectorList, setSectorList] = useState<string[]>(["All"]);
  const [search, setSearch] = useState("");
  const [rsiMode, setRsiMode] = useState<RsiMode>("all");
  const [trendMode, setTrendMode] = useState<TrendMode>("all");
  const [sortCol, setSortCol] = useState<SortCol>("pcnt_1d");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [period, setPeriod] = useState<PeriodMode>("1d");
  const [selected, setSelected] = useState<StockPerformance | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const sectorScrollRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // seed the filter straight from the URL on first render
  const [sector, setSector] = useState(() => searchParams?.get("sector") || "All");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  interface FetchOpts {
    search: string; sector: string; rsiMode: RsiMode; trendMode: TrendMode;
    sortCol: SortCol; sortDir: SortDir; period: PeriodMode;
  }

  // ── Sector analytics ────────────────────────────────────────────────────
  const fetchSectors = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("stock_performance")
        .select("sec, pcnt_1d, pcnt_1w, pcnt_1m")
        .not("sec", "is", null)
        .not("pcnt_1w", "is", null);

      if (error) throw error;
      if (!data) return;

      const map: Record<string, { s1d: number; s1w: number; s1m: number; cnt: number }> = {};
      for (const r of data) {
        if (!r.sec) continue;
        if (!map[r.sec]) map[r.sec] = { s1d: 0, s1w: 0, s1m: 0, cnt: 0 };
        map[r.sec].s1d += r.pcnt_1d ?? 0;
        map[r.sec].s1w += r.pcnt_1w ?? 0;
        map[r.sec].s1m += r.pcnt_1m ?? 0;
        map[r.sec].cnt += 1;
      }

      const sorted: SectorStat[] = Object.entries(map)
        .map(([sec, v]) => ({
          sec,
          avg_1d: parseFloat((v.s1d / v.cnt).toFixed(2)),
          avg_1w: parseFloat((v.s1w / v.cnt).toFixed(2)),
          avg_1m: parseFloat((v.s1m / v.cnt).toFixed(2)),
          count: v.cnt,
        }))
        .sort((a, b) => b.avg_1d - a.avg_1d);

      setSectors(sorted);
      setSectorList(["All", ...sorted.map((s) => s.sec)]);
    } catch (e) {
      console.error("Sectors fetch error:", e);
    }
  }, []);

  // ── Stock fetch ─────────────────────────────────────────────────────────
  const fetchStocks = useCallback(async (pageNum: number, opts: FetchOpts) => {
    setLoading(true);
    setError(null);
    try {
      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const periodCol = PERIOD_COL[opts.period];

      let q = supabase.from("stock_performance").select("*", { count: "exact" });

      if (opts.search.trim()) {
        q = q.or(`stckname.ilike.%${opts.search.trim()}%,sec.ilike.%${opts.search.trim()}%`);
      }
      if (opts.sector !== "All") q = q.eq("sec", opts.sector);

      if (opts.rsiMode === "overbought") q = q.gte("rsi14", 70);
      else if (opts.rsiMode === "oversold") q = q.lte("rsi14", 30);
      else if (opts.rsiMode === "neutral") q = q.gt("rsi14", 30).lt("rsi14", 70);

      if (opts.trendMode === "bullish") q = q.gt(periodCol, 0);
      else if (opts.trendMode === "bearish") q = q.lt(periodCol, 0);

      if (opts.sortCol !== "stckname") q = q.not(opts.sortCol, "is", null);

      q = q
        .order(opts.sortCol, { ascending: opts.sortDir === "asc", nullsFirst: false })
        .range(from, to);

      const { data, count, error: fetchError } = await q;
      if (fetchError) throw fetchError;

      setStocks((data as StockPerformance[]) ?? []);
      setTotal(count ?? 0);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load stocks";
      setError(msg);
      setStocks([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSectors();
    fetchStocks(0, {
      search: "", sector, rsiMode: "all", trendMode: "all",
      sortCol: "pcnt_1d", sortDir: "desc", period: "1d",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSectors, fetchStocks]);

  const refetch = useCallback(
    (p: number, overrides: Partial<FetchOpts> = {}) => {
      fetchStocks(p, { search, sector, rsiMode, trendMode, sortCol, sortDir, period, ...overrides });
    },
    [fetchStocks, search, sector, rsiMode, trendMode, sortCol, sortDir, period]
  );

  const handleSearch = (v: string) => {
    setSearch(v); setPage(0);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => refetch(0, { search: v }), 350);
  };

  const handleSector = (v: string) => {
    setSector(v); setPage(0); setSelected(null);
    refetch(0, { sector: v });

    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (v === "All") params.delete("sector");
    else params.set("sector", v);
    const qs = params.toString();
    const path = pathname ?? "/stock-performance";
    router.replace(qs ? `${path}?${qs}` : path, { scroll: false });
  };

  const handleRsi = (v: RsiMode) => { setRsiMode(v); setPage(0); refetch(0, { rsiMode: v }); };
  const handleTrend = (v: TrendMode) => { setTrendMode(v); setPage(0); refetch(0, { trendMode: v }); };

  const handlePeriod = (v: PeriodMode) => {
    const col = PERIOD_COL[v];
    setPeriod(v); setSortCol(col); setSortDir("desc"); setPage(0);
    refetch(0, { period: v, sortCol: col, sortDir: "desc" });
  };

  const handleSort = (col: SortCol) => {
    const dir: SortDir = sortCol === col && sortDir === "desc" ? "asc" : "desc";
    setSortCol(col); setSortDir(dir); setPage(0);
    refetch(0, { sortCol: col, sortDir: dir });
  };

  const handlePage = (p: number) => {
    setPage(p); refetch(p);
    tableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const pageNums = (): number[] => {
    const tot = totalPages;
    if (tot <= 7) return Array.from({ length: tot }, (_, i) => i);
    if (page < 4) return [0, 1, 2, 3, 4, -1, tot - 1];
    if (page > tot - 5) return [0, -1, tot - 5, tot - 4, tot - 3, tot - 2, tot - 1];
    return [0, -1, page - 1, page, page + 1, -2, tot - 1];
  };

  const scrollSectors = (dir: "left" | "right") => {
    sectorScrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-screen-2xl mx-auto py-4 px-2 sm:px-4 flex flex-col gap-4">

        {/* ── Sector Scroll ─────────────────────────────────────────────── */}
        {sectors.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                Sectors
                <span className="font-normal opacity-60 ml-1 hidden sm:inline">· click to filter</span>
              </p>
              <div className="flex items-center gap-1">
                {/* Clear sector */}
                {sector !== "All" && (
                  <button
                    onClick={() => handleSector("All")}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors mr-1"
                  >
                    <span>Clear</span>
                    <span>×</span>
                  </button>
                )}
                <button
                  onClick={() => scrollSectors("left")}
                  className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >‹</button>
                <button
                  onClick={() => scrollSectors("right")}
                  className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >›</button>
              </div>
            </div>
            <div
              ref={sectorScrollRef}
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent"
            >
              {sectors.map((s) => (
                <SectorCard
                  key={s.sec}
                  stat={s}
                  active={sector === s.sec}
                  onClick={() => handleSector(sector === s.sec ? "All" : s.sec)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Filters ───────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search…"
              className="w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>

          {/* Period */}
          <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1 gap-0.5 overflow-x-auto">
            {(["1d", "1w", "1m", "3m", "6m", "1y", "2y", "3y"] as PeriodMode[]).map((p) => (
              <Pill key={p} active={period === p} onClick={() => handlePeriod(p)}>
                {p.toUpperCase()}
              </Pill>
            ))}
          </div>

          {/* Sector select (mobile fallback) */}
          <select
            value={sector}
            onChange={(e) => handleSector(e.target.value)}
            className="py-2 px-3 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 max-w-[180px] hidden sm:block"
          >
            {sectorList.map((s) => <option key={s}>{s}</option>)}
          </select>

          {/* RSI */}
          <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1 gap-0.5 overflow-x-auto">
            <span className="text-[10px] text-zinc-400 font-bold px-2 uppercase tracking-wider">RSI</span>
            {([["all", "All"], ["oversold", "≤30"], ["neutral", "Mid"], ["overbought", "≥70"]] as [RsiMode, string][]).map(([v, l]) => (
              <Pill key={v} active={rsiMode === v} onClick={() => handleRsi(v)}
                activeClass={v === "overbought" ? "bg-red-600 text-white" : v === "oversold" ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"}>
                {l}
              </Pill>
            ))}
          </div>

          {/* Trend */}
          <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1 gap-0.5">
            {([["all", "All"], ["bullish", "▲"], ["bearish", "▼"]] as [TrendMode, string][]).map(([v, l]) => (
              <Pill key={v} active={trendMode === v} onClick={() => handleTrend(v)}
                activeClass={v === "bullish" ? "bg-emerald-600 text-white" : v === "bearish" ? "bg-red-600 text-white" : "bg-blue-600 text-white"}>
                {l}
              </Pill>
            ))}
          </div>

          {/* Result count */}
          <span className="text-xs font-mono text-zinc-400 ml-auto hidden sm:block">
            {total.toLocaleString("en-IN")} results
          </span>
        </div>

        {/* ── Error ─────────────────────────────────────────────────────── */}
        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
            <span>⚠</span><span>{error}</span>
            <button onClick={() => refetch(page)} className="ml-auto text-xs underline">Retry</button>
          </div>
        )}

        {/* ── Table + Panel ─────────────────────────────────────────────── */}
        {/*
          The outer flex container does NOT have overflow:hidden so that the
          sticky panel can stick relative to the viewport.
        */}
        <div className="flex gap-4 items-start">
          {/* Table */}
          <div className="flex-1 min-w-0 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
            <div ref={tableRef} className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <SortTh label="Symbol" col="stckname" current={sortCol} dir={sortDir} onSort={handleSort} />
                    <SortTh label="Close ₹" col="close" current={sortCol} dir={sortDir} onSort={handleSort} />
                    <SortTh label="1D" col="pcnt_1d" current={sortCol} dir={sortDir} onSort={handleSort} />
                    <SortTh label="1W" col="pcnt_1w" current={sortCol} dir={sortDir} onSort={handleSort} />
                    <SortTh label="1M" col="pcnt_1m" current={sortCol} dir={sortDir} onSort={handleSort} />
                    <SortTh label="3M" col="pcnt_3m" current={sortCol} dir={sortDir} onSort={handleSort} />
                    <SortTh label="6M" col="pcnt_6m" current={sortCol} dir={sortDir} onSort={handleSort} />
                    <SortTh label="1Y" col="pcnt_1y" current={sortCol} dir={sortDir} onSort={handleSort} />
                    <SortTh label="2Y" col="pcnt_2y" current={sortCol} dir={sortDir} onSort={handleSort} />
                    <SortTh label="3Y" col="pcnt_3y" current={sortCol} dir={sortDir} onSort={handleSort} />
                    <SortTh label="RSI" col="rsi14" current={sortCol} dir={sortDir} onSort={handleSort} />
                    <SortTh label="Vol" col="vol" current={sortCol} dir={sortDir} onSort={handleSort} />
                    <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                      52W Range
                    </th>
                    <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
                      Sector
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && stocks.length === 0
                    ? Array.from({ length: 15 }).map((_, i) => <Skeleton key={i} />)
                    : stocks.length === 0
                    ? (
                      <tr>
                        <td colSpan={16} className="text-center py-20 text-zinc-400 text-sm">
                          {error ? "Failed to load data." : "No stocks match your filters."}
                        </td>
                      </tr>
                    )
                    : stocks.map((s) => (
                      <tr
                        key={s.id}
                        onClick={() => setSelected(selected?.id === s.id ? null : s)}
                        className={`border-b border-zinc-100 dark:border-zinc-800 cursor-pointer transition-colors
                          ${selected?.id === s.id
                            ? "bg-blue-50 dark:bg-blue-950/20"
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                          }`}
                      >
                        {/* Symbol */}
                        <td className="px-3 py-2.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                              {ticker(s.stckname)}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {s.sym_key?.replace(".NS", "") ?? ""}
                            </span>
                          </div>
                        </td>
                        {/* Close */}
                        <td className="px-3 py-2.5">
                          <div className="font-mono font-bold text-sm text-zinc-800 dark:text-zinc-100">
                            ₹{fmt(s.close)}
                          </div>
                          <div className="text-[10px] text-zinc-400 hidden sm:block">
                            H:{fmt(s.high)} L:{fmt(s.low)}
                          </div>
                        </td>
                         {/* 1D */}
                        <td className="px-3 py-2.5"><PctBadge value={s.pcnt_1d} /></td>
                        {/* 1W */}
                        <td className="px-3 py-2.5"><PctBadge value={s.pcnt_1w} /></td>
                        {/* 1M */}
                        <td className="px-3 py-2.5"><PctBadge value={s.pcnt_1m} /></td>
                        {/* 3M */}
                        <td className="px-3 py-2.5"><PctBadge value={s.pcnt_3m} /></td>
                        {/* 6M */}
                        <td className="px-3 py-2.5"><PctBadge value={s.pcnt_6m} /></td>
                        {/* 1Y */}
                        <td className="px-3 py-2.5"><PctBadge value={s.pcnt_1y} /></td>
                        {/* 2Y */}
                        <td className="px-3 py-2.5"><PctBadge value={s.pcnt_2y} /></td>
                        {/* 3Y */}
                        <td className="px-3 py-2.5"><PctBadge value={s.pcnt_3y} /></td>
                        {/* RSI */}
                        <td className="px-3 py-2.5"><RsiBar value={s.rsi14} /></td>
                        {/* Vol */}
                        <td className="px-3 py-2.5">
                          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                            {fmtVol(s.vol)}
                          </span>
                        </td>
                        {/* 52W */}
                        <td className="px-3 py-2.5">
                          <Week52Bar close={s.close} high={s.week52_high} low={s.week52_low} />
                        </td>
                        {/* Sector */}
                        <td className="px-3 py-2.5">
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (s.sec) handleSector(s.sec);
                            }}
                          >
                            {s.sec ?? "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
                <span className="text-xs font-mono text-zinc-400">
                  {(page * PAGE_SIZE + 1).toLocaleString("en-IN")}–
                  {Math.min((page + 1) * PAGE_SIZE, total).toLocaleString("en-IN")} / {total.toLocaleString("en-IN")}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page === 0}
                    onClick={() => handlePage(page - 1)}
                    className="w-7 h-7 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-bold transition-colors"
                  >‹</button>
                  {pageNums().map((p, i) =>
                    p < 0 ? (
                      <span key={`e${i}`} className="w-7 text-center text-zinc-400 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => handlePage(p)}
                        className={`w-7 h-7 rounded-md border text-xs font-bold font-mono transition-colors
                          ${p === page
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }`}
                      >
                        {p + 1}
                      </button>
                    )
                  )}
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => handlePage(page + 1)}
                    className="w-7 h-7 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-bold transition-colors"
                  >›</button>
                </div>
              </div>
            )}
          </div>

          {/* Detail panel - Desktop only, sticky */}
          {selected && !isMobile && (
            <DetailPanel stock={selected} onClose={() => setSelected(null)} />
          )}
        </div>

        {/* Bottom Sheet - Mobile only */}
        {selected && isMobile && (
          <BottomSheet stock={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}