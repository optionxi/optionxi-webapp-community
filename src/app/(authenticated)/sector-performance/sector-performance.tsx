"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StockRow {
  id: number;
  stckname: string;
  sym_key: string | null;
  close: number;
  vol: number;
  pcnt_1d: number | null;
  pcnt_1w: number | null;
  pcnt_1m: number | null;
  pcnt_3m: number | null;
  pcnt_6m: number | null;
  pcnt_1y: number | null;
  ema10: number | null;
  ema20: number | null;
  ema50: number | null;
  ema100: number | null;
  ema150: number | null;
  ema200: number | null;
  sma50: number | null;
  sma100: number | null;
  sma150: number | null;
  sma200: number | null;
  rsi14: number | null;
  week52_high: number | null;
  week52_low: number | null;
  sec: string | null;
}

interface SectorMetrics {
  sector: string;
  stocks: StockRow[];
  stockCount: number;
  aboveEma20: number;
  aboveEma50: number;
  aboveEma200: number;
  avgRsi: number;
  avgReturn1d: number;
  avgReturn1w: number;
  avgReturn1m: number;
  avgReturn3m: number;
  breadthPct: number;
  wilsonScore: number;
  stage: 1 | 2 | 3 | 4;
  compositeScore: number;
  confidenceLevel: "High" | "Medium" | "Low";
  trend: "up" | "down" | "neutral";
  nearHighPct: number;
}

// ─── Supabase fetch ────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const FIELDS = [
  "id","stckname","sym_key","close","vol",
  "pcnt_1d","pcnt_1w","pcnt_1m","pcnt_3m","pcnt_6m","pcnt_1y",
  "ema10","ema20","ema50","ema100","ema150","ema200",
  "sma50","sma100","sma150","sma200",
  "rsi14","week52_high","week52_low","sec",
].join(",");

async function fetchStocks(): Promise<StockRow[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/stock_performance?select=${FIELDS}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    }
  );
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
}

// ─── Maths ────────────────────────────────────────────────────────────────────

function wilsonScore(k: number, n: number): number {
  if (n === 0) return 0;
  const p = k / n;
  const z = 1.96;
  const denom = 1 + (z * z) / n;
  const num =
    p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  return Math.max(0, num / denom);
}

function detectStage(r: StockRow): 1 | 2 | 3 | 4 {
  const ma200 = r.ema200 ?? r.sma200;
  const ma50 = r.ema50 ?? r.sma50;
  if (!ma50 || !ma200) return 1;
  if (r.close > ma50 && r.close > ma200 && ma50 > ma200) return 2;
  if (r.close < ma50 && r.close < ma200 && ma50 < ma200) return 4;
  if (r.close > ma200 && ma50 < r.close) return 3;
  return 1;
}

function norm(val: number, min: number, max: number): number {
  if (max === min) return 50;
  return Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
}

function computeSectors(stocks: StockRow[]): SectorMetrics[] {
  const grouped = new Map<string, StockRow[]>();
  for (const s of stocks) {
    const sec = s.sec?.trim() || "Unknown";
    if (!grouped.has(sec)) grouped.set(sec, []);
    grouped.get(sec)!.push(s);
  }

  const raw: SectorMetrics[] = [];

for (const [sector, rows] of Array.from(grouped.entries())) {
    const n = rows.length;
    const aboveEma20 = rows.filter((r) => r.ema20 != null && r.close > r.ema20).length;
    const aboveEma50 = rows.filter((r) => (r.ema50 ?? r.sma50) != null && r.close > (r.ema50 ?? r.sma50)!).length;
    const aboveEma200 = rows.filter((r) => (r.ema200 ?? r.sma200) != null && r.close > (r.ema200 ?? r.sma200)!).length;

    const rsiVals = rows.map((r) => r.rsi14).filter((v): v is number => v != null);
    const avgRsi = rsiVals.length ? rsiVals.reduce((a, b) => a + b) / rsiVals.length : 50;

    const avg = (fn: (r: StockRow) => number) => rows.reduce((a, r) => a + fn(r), 0) / n;
    const avgReturn1d = avg((r) => r.pcnt_1d ?? 0);
    const avgReturn1w = avg((r) => r.pcnt_1w ?? 0);
    const avgReturn1m = avg((r) => r.pcnt_1m ?? 0);
    const avgReturn3m = avg((r) => r.pcnt_3m ?? 0);

    const breadthPct = (aboveEma50 / n) * 100;
    const ws = wilsonScore(aboveEma50, n);

    const nearHigh = rows.filter((r) => {
      if (!r.week52_high || r.week52_high === 0) return false;
      return (r.week52_high - r.close) / r.week52_high < 0.1;
    }).length;
    const nearHighPct = (nearHigh / n) * 100;

    const stageCounts = [0, 0, 0, 0, 0];
    for (const r of rows) stageCounts[detectStage(r)]++;
    const stage = stageCounts.indexOf(Math.max(...stageCounts.slice(1))) as 1 | 2 | 3 | 4;

    const confidenceLevel: "High" | "Medium" | "Low" = n >= 10 ? "High" : n >= 5 ? "Medium" : "Low";
    const trend = avgReturn1m > 1 ? "up" : avgReturn1m < -1 ? "down" : "neutral";

    raw.push({
      sector, stocks: rows, stockCount: n,
      aboveEma20, aboveEma50, aboveEma200,
      avgRsi, avgReturn1d, avgReturn1w, avgReturn1m, avgReturn3m,
      breadthPct, wilsonScore: ws, stage,
      compositeScore: 0, confidenceLevel, trend, nearHighPct,
    });
  }

  const wArr = raw.map((r) => r.wilsonScore);
  const r1mArr = raw.map((r) => r.avgReturn1m);
  const r3mArr = raw.map((r) => r.avgReturn3m);
  const nhArr = raw.map((r) => r.nearHighPct);
  const minMax = (arr: number[]) => [Math.min(...arr), Math.max(...arr)] as const;
  const [minW, maxW] = minMax(wArr);
  const [min1m, max1m] = minMax(r1mArr);
  const [min3m, max3m] = minMax(r3mArr);
  const [minNH, maxNH] = minMax(nhArr);

  for (const r of raw) {
    const stageN = r.stage === 2 ? 100 : r.stage === 1 ? 55 : r.stage === 3 ? 30 : 0;
    r.compositeScore = Math.round(
      norm(r.wilsonScore, minW, maxW) * 0.30 +
      norm(r.avgReturn1m, min1m, max1m) * 0.25 +
      norm(r.avgReturn3m, min3m, max3m) * 0.20 +
      norm(r.nearHighPct, minNH, maxNH) * 0.15 +
      stageN * 0.10
    );
  }

  return raw.sort((a, b) => b.compositeScore - a.compositeScore);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number, dp = 2) => (v >= 0 ? "+" : "") + v.toFixed(dp) + "%";

const retColor = (v: number) =>
  v > 0 ? "text-emerald-600 dark:text-emerald-400" : v < 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-400 dark:text-slate-500";

const scoreColor = (s: number) =>
  s >= 70 ? "text-emerald-600 dark:text-emerald-400" : s >= 45 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400";

const scoreBarColor = (s: number) =>
  s >= 70 ? "bg-emerald-500" : s >= 45 ? "bg-amber-500" : "bg-rose-500";


const STAGE_META = {
  1: { label: "Stage 1", short: "S1", color: "bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-500/30", desc: "Basing / Accumulation" },
  2: { label: "Stage 2", short: "S2", color: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30", desc: "Uptrend — Ideal Entry" },
  3: { label: "Stage 3", short: "S3", color: "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30", desc: "Topping / Distribution" },
  4: { label: "Stage 4", short: "S4", color: "bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30", desc: "Downtrend — Avoid" },
} as const;

function parseSymbol(stckname: string): { display: string; slug: string } {
  const withoutExchange = stckname.replace(/^(NSE:|BSE:|MCX:)/, "");
  const slug = withoutExchange.replace(/-(EQ|BE|SM|N1|N2)$/, "");
  return { display: slug, slug };
}

const STOCKS_PER_PAGE = 15;

// ─── Info Modal ───────────────────────────────────────────────────────────────

function InfoModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  dark:bg-black/70 bg-slate-900/50 backdrop-blur-sm p-4">
      <div
        ref={ref}
        className="relative w-full max-w-lg bg-white dark:bg-[#0f1117] border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide">How Scoring Works</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Composite Score */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-3">Composite Score (0–100)</p>
            <div className="space-y-2">
              {[
                { w: "30%", label: "Breadth (Wilson CI)", desc: "Proportion of stocks above EMA50, adjusted for sample size using a 95% confidence interval lower bound. Penalises sectors with few stocks." },
                { w: "25%", label: "1M Return", desc: "Average 1-month price return across all stocks in the sector. Captures recent momentum." },
                { w: "20%", label: "3M Return", desc: "Average 3-month price return. Confirms the trend over a longer window." },
                { w: "15%", label: "Near 52W High", desc: "Percentage of stocks within 10% of their 52-week high. Measures price strength vs history." },
                { w: "10%", label: "Weinstein Stage", desc: "Stage 2 (uptrend) = 100pts. Stage 1 (basing) = 55. Stage 3 (top) = 30. Stage 4 (decline) = 0. Majority-vote across all sector stocks." },
              ].map((x) => (
                <div key={x.label} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/40">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center">
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{x.w}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{x.label}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5 leading-relaxed">{x.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weinstein Stages */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-3">Weinstein Stages</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STAGE_META).map(([s, meta]) => (
                <div key={s} className={`p-2.5 rounded-xl border ${meta.color}`}>
                  <p className="text-xs font-bold">{meta.label}</p>
                  <p className="text-[10px] mt-0.5 opacity-80">{meta.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-3">Confidence Levels</p>
            <div className="space-y-1.5">
              {[
                { dot: "bg-emerald-500", label: "High (10+ stocks)", desc: "Statistically reliable. Trade with conviction." },
                { dot: "bg-amber-500", label: "Medium (5–9 stocks)", desc: "Decent sample. Use with supporting signals." },
                { dot: "bg-rose-500", label: "Low (<5 stocks)", desc: "Small sample. Sector signal may be misleading." },
              ].map((x) => (
                <div key={x.label} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${x.dot}`} />
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{x.label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-500">{x.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 dark:text-slate-600 pb-1">
            All scores are cross-sector normalised — a score of 80 means this sector ranks in the top ~20% of the current universe. Scores update with each data refresh (~5 min).
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Sector Detail Panel ──────────────────────────────────────────────────────

function SectorDetail({
  m,
  onClose,
  isMobile,
}: {
  m: SectorMetrics;
  onClose: () => void;
  isMobile: boolean;
}) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<"close" | "pcnt_1d" | "pcnt_1w" | "pcnt_1m" | "pcnt_3m" | "rsi14">("pcnt_1m");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [search, setSearch] = useState("");

  const stage = STAGE_META[m.stage];

  const sorted = useMemo(() => {
    let s = [...m.stocks];
    if (search.trim()) {
      const q = search.toLowerCase();
      s = s.filter((r) => parseSymbol(r.stckname).display.toLowerCase().includes(q));
    }
    return s.sort((a, b) => {
      const av = a[sortKey] ?? -Infinity;
      const bv = b[sortKey] ?? -Infinity;
      return sortDir === "desc" ? (bv as number) - (av as number) : (av as number) - (bv as number);
    });
  }, [m.stocks, sortKey, sortDir, search]);

  const totalPages = Math.ceil(sorted.length / STOCKS_PER_PAGE);
  const pageStocks = sorted.slice((page - 1) * STOCKS_PER_PAGE, page * STOCKS_PER_PAGE);

  const handleSort = (key: typeof sortKey) => {
    if (key === sortKey) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  };

  const arrow = (key: typeof sortKey) =>
    sortKey === key ? (sortDir === "desc" ? " ↓" : " ↑") : "";

  const cols: { key: typeof sortKey; label: string }[] = [
    { key: "close", label: "Price" },
    { key: "pcnt_1d", label: "1D" },
    { key: "pcnt_1w", label: "1W" },
    { key: "pcnt_1m", label: "1M" },
    { key: "pcnt_3m", label: "3M" },
    { key: "rsi14", label: "RSI" },
  ];

  const panelClass = isMobile
    ? "fixed inset-x-0 bottom-0 z-40 bg-white dark:bg-[#0f1117] border-t border-slate-200 dark:border-slate-700/60 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
    : "flex flex-col bg-white dark:bg-[#0f1117] border-l border-slate-200 dark:border-slate-800 h-full overflow-hidden";

  return (
    <div className={panelClass}>
      {/* Mobile drag handle */}
      {isMobile && (
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>
      )}

      {/* Panel header */}
      <div className="px-4 pt-3 pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${stage.color}`}>{stage.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                m.confidenceLevel === "High" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                : m.confidenceLevel === "Medium" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
              }`}>
                {m.confidenceLevel === "High" ? "●" : m.confidenceLevel === "Medium" ? "◑" : "○"} {m.confidenceLevel}
              </span>
            </div>
            <h2 className="font-black text-slate-900 dark:text-slate-100 text-base leading-tight truncate">{m.sector}</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">{m.stockCount} stocks · breadth {m.breadthPct.toFixed(0)}%</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <p className={`text-2xl font-black tabular-nums ${scoreColor(m.compositeScore)}`}>{m.compositeScore}</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-600">score</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-2.5 h-1 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div className={`h-full rounded-full ${scoreBarColor(m.compositeScore)}`} style={{ width: `${m.compositeScore}%` }} />
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Returns grid */}
        <div className="grid grid-cols-4 divide-x divide-slate-200 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800">
          {[
            { l: "1D", v: m.avgReturn1d },
            { l: "1W", v: m.avgReturn1w },
            { l: "1M", v: m.avgReturn1m },
            { l: "3M", v: m.avgReturn3m },
          ].map(({ l, v }) => (
            <div key={l} className="py-3 flex flex-col items-center gap-0.5">
              <span className={`text-sm font-bold tabular-nums ${retColor(v)}`}>{fmt(v)}</span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-600">{l}</span>
            </div>
          ))}
        </div>

        {/* Breadth + RSI row */}
        <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800">
          <div className="py-3 px-3">
            <p className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-1">EMA 20</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{m.aboveEma20}/{m.stockCount}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-500">{((m.aboveEma20/m.stockCount)*100).toFixed(0)}%</span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className={`h-full rounded-full ${((m.aboveEma20/m.stockCount)*100) >= 60 ? "bg-emerald-500" : ((m.aboveEma20/m.stockCount)*100) >= 40 ? "bg-amber-500" : "bg-rose-500"}`}
                style={{ width: `${(m.aboveEma20/m.stockCount)*100}%` }} />
            </div>
          </div>
          <div className="py-3 px-3">
            <p className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-1">EMA 50</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{m.aboveEma50}/{m.stockCount}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-500">{m.breadthPct.toFixed(0)}%</span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className={`h-full rounded-full ${m.breadthPct >= 60 ? "bg-emerald-500" : m.breadthPct >= 40 ? "bg-amber-500" : "bg-rose-500"}`}
                style={{ width: `${m.breadthPct}%` }} />
            </div>
          </div>
          <div className="py-3 px-3">
            <p className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-1">Avg RSI</p>
            <span className={`text-sm font-bold tabular-nums ${m.avgRsi > 70 ? "text-rose-600 dark:text-rose-400" : m.avgRsi < 40 ? "text-sky-600 dark:text-sky-400" : "text-slate-800 dark:text-slate-200"}`}>
              {m.avgRsi.toFixed(1)}{m.avgRsi > 70 ? " OB" : m.avgRsi < 40 ? " OS" : ""}
            </span>
          </div>
        </div>

        {/* Wilson + Near High */}
        <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800">
          <div className="py-3 px-3">
            <p className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-0.5">Wilson Score</p>
            <span className={`text-base font-black ${scoreColor(m.wilsonScore * 100)}`}>{(m.wilsonScore * 100).toFixed(1)}</span>
            <p className="text-[9px] text-slate-400 dark:text-slate-600 mt-0.5">Adj. breadth CI</p>
          </div>
          <div className="py-3 px-3">
            <p className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-0.5">Near 52W High</p>
            <span className="text-base font-black text-slate-800 dark:text-slate-200">{m.nearHighPct.toFixed(0)}%</span>
            <p className="text-[9px] text-slate-400 dark:text-slate-600 mt-0.5">Within 10% of high</p>
          </div>
        </div>

        {/* Stock search */}
        <div className="px-3 py-2.5 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Filter stocks…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-500/30"
            />
          </div>
        </div>

        {/* Stock table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-600 font-semibold sticky left-0 bg-slate-50 dark:bg-slate-900/60">Stock</th>
                {cols.map((c) => (
                  <th
                    key={c.key}
                    onClick={() => handleSort(c.key)}
                    className="text-right py-2 px-2.5 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-600 font-semibold cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 select-none whitespace-nowrap transition-colors"
                  >
                    {c.label}{arrow(c.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {pageStocks.map((s, i) => {
                const { display, slug } = parseSymbol(s.stckname);
                return (
                  <tr
                    key={s.id}
                    onClick={() => router.push(`/stocks/${slug}`)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-2 px-3 sticky left-0 bg-white dark:bg-[#0f1117] group-hover:bg-slate-50 dark:group-hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-slate-300 dark:text-slate-700 tabular-nums w-4 shrink-0">
                          {(page - 1) * STOCKS_PER_PAGE + i + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                            {display}
                          </p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-600">{s.sym_key?.replace(".NS","").replace(".BO","") ?? ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      ₹{s.close.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </td>
                    {(["pcnt_1d","pcnt_1w","pcnt_1m","pcnt_3m"] as const).map((k) => (
                      <td key={k} className={`py-2 px-2.5 text-right font-mono ${retColor(s[k] ?? 0)}`}>
                        {s[k] != null ? fmt(s[k]!) : "—"}
                      </td>
                    ))}
                    <td className={`py-2 px-2.5 text-right font-mono ${
                      s.rsi14 != null
                        ? s.rsi14 > 70 ? "text-rose-600 dark:text-rose-400" : s.rsi14 < 40 ? "text-sky-600 dark:text-sky-400" : "text-slate-500 dark:text-slate-400"
                        : "text-slate-400 dark:text-slate-600"
                    }`}>
                      {s.rsi14 != null ? s.rsi14.toFixed(1) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-3 py-2.5 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[10px] text-slate-500 dark:text-slate-600">
              {(page - 1) * STOCKS_PER_PAGE + 1}–{Math.min(page * STOCKS_PER_PAGE, sorted.length)} of {sorted.length}
            </p>
            <div className="flex gap-1">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                className="w-7 h-7 rounded-lg text-xs flex items-center justify-center disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">‹</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 5) {
                  if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                }
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${page === p ? "bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                    {p}
                  </button>
                );
              })}
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
                className="w-7 h-7 rounded-lg text-xs flex items-center justify-center disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">›</button>
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}

// ─── Sector Row (table) — FIXED ──────────────────────────────────────────────
// Drop-in replacement for the SectorRow component + table wrapper inside the page.
// Changes:
//  • Removed hidden-at-wrong-breakpoint columns so nothing overlaps
//  • Table min-w bumped so horizontal scroll kicks in cleanly
//  • Sector name column constrained with max-w + truncate
//  • Column header order matches row cell order exactly
//  • Confidence dot + label kept visible even on small screens via single compact cell

function SectorRow({
  m, rank, selected, onClick,
}: {
  m: SectorMetrics;
  rank: number;
  selected: boolean;
  onClick: () => void;
}) {
  const stage = STAGE_META[m.stage];
  return (
    <tr
      onClick={onClick}
      className={`border-b border-slate-100 dark:border-slate-800/60 cursor-pointer transition-all group ${
        selected ? "bg-slate-50 dark:bg-slate-800/60" : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
      }`}
    >
      {/* Rank */}
      <td className="py-3 pl-4 pr-2 w-8 shrink-0">
        <span className={`text-xs font-black tabular-nums ${selected ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-600"}`}>
          {rank <= 3 ? ["🥇","🥈","🥉"][rank-1] : rank}
        </span>
      </td>

      {/* Sector name — fixed width, truncates */}
      <td className="py-3 px-2 w-48 min-w-[160px] max-w-[192px]">
        <div className="flex items-center gap-2">
          <div className={`w-0.5 h-8 rounded-full shrink-0 ${scoreBarColor(m.compositeScore)}`} />
          <div className="min-w-0">
            <p className={`text-xs font-bold leading-tight truncate ${selected ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100"} transition-colors`}>
              {m.sector}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border shrink-0 ${stage.color}`}>{stage.short}</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-600 whitespace-nowrap">{m.stockCount} stk</span>
            </div>
          </div>
        </div>
      </td>

      {/* Confidence */}
      <td className="py-3 px-2 w-24">
        <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg border whitespace-nowrap ${
          m.confidenceLevel === "High"
            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
            : m.confidenceLevel === "Medium"
            ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
            : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
        }`}>
          {m.confidenceLevel === "High" ? "● " : m.confidenceLevel === "Medium" ? "◑ " : "○ "}
          {m.confidenceLevel}
        </span>
      </td>

      {/* Stage */}
      <td className="py-3 px-2 w-20">
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border whitespace-nowrap ${stage.color}`}>
          {stage.label}
        </span>
      </td>

      {/* 1M Return */}
      <td className="py-3 px-2 w-20 text-right">
        <span className={`text-xs font-bold tabular-nums ${retColor(m.avgReturn1m)}`}>
          {fmt(m.avgReturn1m)}
        </span>
      </td>

      {/* Strength Score + bar */}
      <td className="py-3 px-2 w-32">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${scoreBarColor(m.compositeScore)}`}
              style={{ width: `${m.compositeScore}%` }}
            />
          </div>
          <span className={`text-xs font-black tabular-nums w-7 text-right shrink-0 ${scoreColor(m.compositeScore)}`}>
            {m.compositeScore}
          </span>
        </div>
      </td>

      {/* Breadth */}
      <td className="py-3 px-2 pr-4 w-16 text-right">
        <span className={`text-xs font-semibold tabular-nums ${
          m.breadthPct >= 60
            ? "text-emerald-600 dark:text-emerald-400"
            : m.breadthPct >= 40
            ? "text-amber-600 dark:text-amber-400"
            : "text-rose-600 dark:text-rose-400"
        }`}>
          {m.breadthPct.toFixed(0)}%
        </span>
      </td>
    </tr>
  );
}

// ─── Summary strip ────────────────────────────────────────────────────────────

function SummaryStrip({ sectors }: { sectors: SectorMetrics[] }) {
  const strong = sectors.filter((s) => s.compositeScore >= 70).length;
  const neutral = sectors.filter((s) => s.compositeScore >= 45 && s.compositeScore < 70).length;
  const weak = sectors.filter((s) => s.compositeScore < 45).length;
  const stage2 = sectors.filter((s) => s.stage === 2).length;

  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {[
        { val: strong, label: "Strong", sub: "≥70", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
        { val: neutral, label: "Neutral", sub: "45–70", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
        { val: weak, label: "Weak", sub: "<45", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" },
        { val: stage2, label: "Stage 2", sub: "Uptrend", color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20" },
      ].map((x) => (
        <div key={x.label} className={`rounded-xl border p-3 ${x.bg}`}>
          <p className={`text-2xl font-black tabular-nums leading-none ${x.color}`}>{x.val}</p>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">{x.label}</p>
          <p className="text-[9px] text-slate-400 dark:text-slate-600">{x.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type FilterMode = "all" | "strong" | "neutral" | "weak" | "stage2";
type SortMode = "score" | "return1m" | "return3m" | "breadth" | "rsi";

const FILTER_OPTS: { id: FilterMode; label: string }[] = [
  { id: "all", label: "All" },
  { id: "strong", label: "Strong" },
  { id: "neutral", label: "Neutral" },
  { id: "weak", label: "Weak" },
  { id: "stage2", label: "Stage 2" },
];

const SORT_OPTS: { id: SortMode; label: string }[] = [
  { id: "score", label: "Score" },
  { id: "return1m", label: "1M Return" },
  { id: "return3m", label: "3M Return" },
  { id: "breadth", label: "Breadth" },
  { id: "rsi", label: "RSI" },
];

const SECTORS_PER_PAGE = 20;

export default function SectorStrengthPage() {
  const [stocks, setStocks] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sort, setSort] = useState<SortMode>("score");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sectorPage, setSectorPage] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetchStocks()
      .then((data) => {
        setStocks(data);
        setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const sectors = useMemo(() => computeSectors(stocks), [stocks]);

  const filtered = useMemo(() => {
    let s = [...sectors];
    if (filter === "strong") s = s.filter((x) => x.compositeScore >= 70);
    else if (filter === "neutral") s = s.filter((x) => x.compositeScore >= 45 && x.compositeScore < 70);
    else if (filter === "weak") s = s.filter((x) => x.compositeScore < 45);
    else if (filter === "stage2") s = s.filter((x) => x.stage === 2);
    if (search.trim()) {
      const q = search.toLowerCase();
      s = s.filter((x) => x.sector.toLowerCase().includes(q));
    }
    s.sort((a, b) => {
      switch (sort) {
        case "return1m": return b.avgReturn1m - a.avgReturn1m;
        case "return3m": return b.avgReturn3m - a.avgReturn3m;
        case "breadth": return b.breadthPct - a.breadthPct;
        case "rsi": return b.avgRsi - a.avgRsi;
        default: return b.compositeScore - a.compositeScore;
      }
    });
    return s;
  }, [sectors, filter, sort, search]);

  useEffect(() => { setSectorPage(1); setSelectedSector(null); }, [filter, sort, search]);

  const totalSectorPages = Math.ceil(filtered.length / SECTORS_PER_PAGE);
  const displayed = filtered.slice((sectorPage - 1) * SECTORS_PER_PAGE, sectorPage * SECTORS_PER_PAGE);
  const selectedMetrics = selectedSector ? sectors.find((s) => s.sector === selectedSector) : null;

  const panelOpen = !!selectedMetrics;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b10] text-slate-800 dark:text-slate-200" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      {/* Mobile bottom sheet overlay backdrop */}
      {panelOpen && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedSector(null)}
        />
      )}

      <div className={`flex flex-col lg:flex-row min-h-screen transition-all duration-300`}>
        {/* LEFT: Main table column */}
        <div className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${panelOpen && !isMobile ? "lg:max-w-[calc(100%-440px)]" : ""}`}>

          {/* Top bar */}
          <div className="sticky top-14 z-20 bg-slate-50/95 dark:bg-[#080b10]/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800/60 px-4 py-3">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">Sector Strength</h1>
                  <button
                    onClick={() => setShowInfo(true)}
                    className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all hover:scale-110"
                    title="How scoring works"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-0.5">Wilson · Momentum · Weinstein Stage</p>
              </div>
              {lastUpdated && (
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-2.5 py-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {lastUpdated}
                </div>
              )}
            </div>

            {/* Controls row */}
            <div className="flex gap-2 items-center overflow-x-auto pb-0.5">
              {/* Search */}
              <div className="relative shrink-0">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-7 pr-3 py-1.5 w-32 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
                />
              </div>

              {/* Filter pills */}
              <div className="flex gap-1 shrink-0">
                {FILTER_OPTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                      filter === f.id
                        ? "bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900"
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="ml-auto shrink-0 px-2.5 py-1.5 text-[10px] rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 focus:outline-none"
              >
                {SORT_OPTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-3 py-4">
            {loading && (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-800 border-t-emerald-500 animate-spin" />
                <p className="text-xs text-slate-500">Calculating sector scores…</p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 p-6 text-center">
                <p className="text-rose-600 dark:text-rose-400 font-semibold text-sm">{error}</p>
                <p className="text-xs text-rose-500 dark:text-rose-600 mt-1">Check Supabase environment variables</p>
              </div>
            )}

            {!loading && !error && (
              <>
                <SummaryStrip sectors={sectors} />

                {/* Count */}
                <p className="text-[10px] text-slate-400 dark:text-slate-600 mb-2 px-0.5">
                  {filtered.length} sectors · {stocks.length} stocks
                </p>

                {/* Table wrapper with horizontal scroll */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800/60 overflow-x-auto bg-white dark:bg-[#0a0d14]">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                        <th className="text-left py-2 pl-4 pr-2 w-10">
                          <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-600 font-semibold">#</span>
                        </th>
                        <th className="text-left py-2 px-2">
                          <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-600 font-semibold">Industry</span>
                        </th>
                        <th className="text-left py-2 px-2 hidden sm:table-cell">
                          <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-600 font-semibold">Confidence</span>
                        </th>
                        <th className="text-right py-2 px-2">
                          <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-600 font-semibold">1M Return</span>
                        </th>
                        <th className="text-right py-2 px-2 hidden md:table-cell">
                          <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-600 font-semibold">Strength Score</span>
                        </th>
                        <th className="text-left py-2 px-2 hidden sm:table-cell">
                          <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-600 font-semibold">Stage</span>
                        </th>
                        <th className="text-right py-2 px-2 pr-4">
                          <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-600 font-semibold">Breadth</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayed.map((m, i) => (
                        <SectorRow
                          key={m.sector}
                          m={m}
                          rank={(sectorPage - 1) * SECTORS_PER_PAGE + i + 1}
                          selected={selectedSector === m.sector}
                          onClick={() => setSelectedSector((prev) => prev === m.sector ? null : m.sector)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Sector pagination */}
                {totalSectorPages > 1 && (
                  <div className="flex items-center justify-between mt-4 px-0.5">
                    <p className="text-[10px] text-slate-500 dark:text-slate-600">
                      {(sectorPage-1)*SECTORS_PER_PAGE+1}–{Math.min(sectorPage*SECTORS_PER_PAGE, filtered.length)} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-1">
                      <button disabled={sectorPage===1} onClick={() => setSectorPage(p => p-1)}
                        className="w-7 h-7 rounded-lg text-xs flex items-center justify-center disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">‹</button>
                      {Array.from({ length: Math.min(5, totalSectorPages) }, (_, i) => {
                        let p = i+1;
                        if (totalSectorPages > 5) {
                          if (sectorPage <= 3) p = i+1;
                          else if (sectorPage >= totalSectorPages-2) p = totalSectorPages-4+i;
                          else p = sectorPage-2+i;
                        }
                        return (
                          <button key={p} onClick={() => setSectorPage(p)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${sectorPage===p ? "bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                            {p}
                          </button>
                        );
                      })}
                      <button disabled={sectorPage===totalSectorPages} onClick={() => setSectorPage(p => p+1)}
                        className="w-7 h-7 rounded-lg text-xs flex items-center justify-center disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">›</button>
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60">
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(STAGE_META).map(([s, meta]) => (
                      <span key={s} className={`text-[10px] px-2 py-1 rounded-lg font-semibold border ${meta.color}`}>
                        {meta.label} — {meta.desc}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Detail panel (desktop) */}
        {panelOpen && !isMobile && selectedMetrics && (
          <div className="hidden lg:flex w-[440px] shrink-0 border-l border-slate-200 dark:border-slate-800/60 sticky top-14 h-screen overflow-hidden flex-col">
            <SectorDetail
              m={selectedMetrics}
              onClose={() => setSelectedSector(null)}
              isMobile={false}
            />
          </div>
        )}
      </div>

      {/* BOTTOM: Detail sheet (mobile) */}
      {panelOpen && isMobile && selectedMetrics && (
        <SectorDetail
          m={selectedMetrics}
          onClose={() => setSelectedSector(null)}
          isMobile={true}
        />
      )}
    </div>
  );
}