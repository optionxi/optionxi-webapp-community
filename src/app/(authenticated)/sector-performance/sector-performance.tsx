"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* ════════════════════════════════════════════════════════════════════════════
   SECTOR STRENGTH — v2
   Design idea: progressive disclosure.
     Level 1  Pulse + ranked list      (score, trend, 1M)
     Level 2  Expand a row             (why that score, top movers)
     Level 3  Drawer                   (every stock, sortable)
   ════════════════════════════════════════════════════════════════════════════ */

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

type Stage = 1 | 2 | 3 | 4;

/** One ingredient of the composite score — powers the "why this score" view */
interface Part {
  key: "breadth" | "m1" | "m3" | "high" | "stage";
  label: string;
  weight: number; // max points
  norm: number; // 0–100 vs other sectors
  points: number; // norm * weight / 100
  fact: string; // plain-language raw reading
  how: string; // how it is calculated
  color: string;
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
  stage: Stage;
  compositeScore: number;
  confidenceLevel: "High" | "Medium" | "Low";
  nearHighPct: number;
  parts: Part[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const FIELDS = [
  "id", "stckname", "sym_key", "close", "vol",
  "pcnt_1d", "pcnt_1w", "pcnt_1m", "pcnt_3m", "pcnt_6m", "pcnt_1y",
  "ema10", "ema20", "ema50", "ema100", "ema150", "ema200",
  "sma50", "sma100", "sma150", "sma200",
  "rsi14", "week52_high", "week52_low", "sec",
].join(",");

async function fetchStocks(): Promise<StockRow[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/stock_performance?select=${FIELDS}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
}

// ─── Maths ────────────────────────────────────────────────────────────────────

function wilsonScore(k: number, n: number): number {
  if (n === 0) return 0;
  const p = k / n;
  const z = 1.96;
  const denom = 1 + (z * z) / n;
  const num = p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  return Math.max(0, num / denom);
}

function detectStage(r: StockRow): Stage {
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

const fmt = (v: number, dp = 2) => (v >= 0 ? "+" : "") + v.toFixed(dp) + "%";

const STAGE_META = {
  1: { label: "Stage 1", name: "Basing", desc: "Building a base — not trending yet", chip: "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/25" },
  2: { label: "Stage 2", name: "Uptrend", desc: "Healthy uptrend — the sweet spot", chip: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/25" },
  3: { label: "Stage 3", name: "Topping", desc: "Momentum fading — distribution", chip: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/25" },
  4: { label: "Stage 4", name: "Downtrend", desc: "Falling below key averages — avoid", chip: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/25" },
} as const;

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
    const nearHigh = rows.filter((r) => r.week52_high && (r.week52_high - r.close) / r.week52_high < 0.1).length;

    const stageCounts = [0, 0, 0, 0, 0];
    for (const r of rows) stageCounts[detectStage(r)]++;

    raw.push({
      sector, stocks: rows, stockCount: n,
      aboveEma20, aboveEma50, aboveEma200, avgRsi,
      avgReturn1d: avg((r) => r.pcnt_1d ?? 0),
      avgReturn1w: avg((r) => r.pcnt_1w ?? 0),
      avgReturn1m: avg((r) => r.pcnt_1m ?? 0),
      avgReturn3m: avg((r) => r.pcnt_3m ?? 0),
      breadthPct: (aboveEma50 / n) * 100,
      wilsonScore: wilsonScore(aboveEma50, n),
      stage: stageCounts.indexOf(Math.max(...stageCounts.slice(1))) as Stage,
      compositeScore: 0,
      confidenceLevel: n >= 10 ? "High" : n >= 5 ? "Medium" : "Low",
      nearHighPct: (nearHigh / n) * 100,
      parts: [],
    });
  }

  const mm = (arr: number[]) => [Math.min(...arr), Math.max(...arr)] as const;
  const [minW, maxW] = mm(raw.map((r) => r.wilsonScore));
  const [min1m, max1m] = mm(raw.map((r) => r.avgReturn1m));
  const [min3m, max3m] = mm(raw.map((r) => r.avgReturn3m));
  const [minNH, maxNH] = mm(raw.map((r) => r.nearHighPct));

  for (const r of raw) {
    const stageN = r.stage === 2 ? 100 : r.stage === 1 ? 55 : r.stage === 3 ? 30 : 0;
    const mk = (p: Omit<Part, "points">): Part => ({ ...p, points: (p.norm * p.weight) / 100 });
    r.parts = [
      mk({ key: "breadth", label: "Breadth", weight: 30, norm: norm(r.wilsonScore, minW, maxW), color: "#6366f1",
        fact: `${r.aboveEma50} of ${r.stockCount} stocks trade above their 50-day average`,
        how: "We count the stocks above their 50-day EMA, then apply a Wilson confidence bound. That stops a 3-stock sector from looking as trustworthy as a 30-stock one." }),
      mk({ key: "m1", label: "1-month return", weight: 25, norm: norm(r.avgReturn1m, min1m, max1m), color: "#8b5cf6",
        fact: `Average stock ${fmt(r.avgReturn1m)} over 1 month`,
        how: "Average 1-month return of every stock in the sector, then stretched onto 0–100: the best sector gets 100, the worst gets 0." }),
      mk({ key: "m3", label: "3-month return", weight: 20, norm: norm(r.avgReturn3m, min3m, max3m), color: "#a78bfa",
        fact: `Average stock ${fmt(r.avgReturn3m)} over 3 months`,
        how: "Same idea over a longer window. It confirms that a 1-month pop is part of a real trend." }),
      mk({ key: "high", label: "Near 52-week high", weight: 15, norm: norm(r.nearHighPct, minNH, maxNH), color: "#38bdf8",
        fact: `${r.nearHighPct.toFixed(0)}% of stocks are within 10% of their yearly high`,
        how: "Strong sectors keep most of their stocks close to their highs. We measure the share within 10% of the 52-week peak." }),
      mk({ key: "stage", label: "Trend stage", weight: 10, norm: stageN, color: "#2dd4bf",
        fact: `Most stocks sit in ${STAGE_META[r.stage].label} · ${STAGE_META[r.stage].name}`,
        how: "Each stock is placed in a Weinstein stage using its 50- and 200-day averages. The sector takes the majority stage: Stage 2 = 100, Stage 1 = 55, Stage 3 = 30, Stage 4 = 0." }),
    ];
    r.compositeScore = Math.round(r.parts.reduce((a, p) => a + p.points, 0));
  }

  return raw.sort((a, b) => b.compositeScore - a.compositeScore);
}

// ─── Small helpers ────────────────────────────────────────────────────────────

type Tone = "strong" | "neutral" | "weak";
const toneOf = (s: number): Tone => (s >= 70 ? "strong" : s >= 45 ? "neutral" : "weak");

const TONE = {
  strong: { text: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500", hex: "#10b981", soft: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20", label: "Strong" },
  neutral: { text: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500", hex: "#f59e0b", soft: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20", label: "Neutral" },
  weak: { text: "text-rose-600 dark:text-rose-400", bar: "bg-rose-500", hex: "#f43f5e", soft: "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20", label: "Weak" },
} as const;

const retColor = (v: number) =>
  v > 0 ? "text-emerald-600 dark:text-emerald-400" : v < 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-400";

function parseSymbol(stckname: string) {
  const slug = stckname.replace(/^(NSE:|BSE:|MCX:)/, "").replace(/-(EQ|BE|SM|N1|N2)$/, "");
  return { display: slug, slug };
}

function verdict(m: SectorMetrics): { title: string; text: string; tone: Tone } {
  const tone = toneOf(m.compositeScore);
  const participation = m.breadthPct >= 60 ? "broad participation" : m.breadthPct >= 40 ? "mixed participation" : "narrow participation";
  const mom = m.avgReturn1m > 1 ? "rising over the last month" : m.avgReturn1m < -1 ? "falling over the last month" : "flat over the last month";
  const title =
    m.stage === 2 && tone === "strong" ? "Leading sector"
    : m.stage === 4 ? "Sector in a downtrend"
    : m.stage === 3 ? "Losing steam"
    : m.stage === 1 ? "Basing — watch for a breakout"
    : tone === "strong" ? "Healthy strength" : tone === "neutral" ? "Mixed picture" : "Under pressure";
  let text = `${m.breadthPct.toFixed(0)}% of stocks are above their 50-day average (${participation}), and the sector is ${mom}.`;
  if (m.avgRsi > 70) text += " Average RSI is overbought, so chasing here carries risk.";
  else if (m.avgRsi < 40) text += " Average RSI is oversold — watch for stabilisation.";
  if (m.confidenceLevel !== "High") text += ` Only ${m.stockCount} stocks, so treat this with caution.`;
  return { title, text, tone };
}

// ─── Motion primitives ────────────────────────────────────────────────────────

const CSS = `
@keyframes ss-fade-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes ss-pop{from{opacity:0;transform:scale(.97) translateY(6px)}to{opacity:1;transform:none}}
@keyframes ss-fade{from{opacity:0}to{opacity:1}}
@keyframes ss-slide-right{from{transform:translateX(100%)}to{transform:none}}
@keyframes ss-slide-up{from{transform:translateY(100%)}to{transform:none}}
@keyframes ss-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes ss-gather{from{transform:translate(var(--sx),var(--sy))}to{transform:translate(0,0)}}
@keyframes ss-stretch{from{left:var(--from)}to{left:var(--to)}}
@keyframes ss-shimmer{from{background-position:-200% 0}to{background-position:200% 0}}
@keyframes ss-pulse-ring{0%{transform:scale(.8);opacity:.7}100%{transform:scale(2.2);opacity:0}}
.ss-in{animation:ss-fade-up .45s cubic-bezier(.2,.8,.2,1) both}
.ss-pop{animation:ss-pop .3s cubic-bezier(.2,.8,.2,1) both}
.ss-fade{animation:ss-fade .25s ease both}
.ss-right{animation:ss-slide-right .35s cubic-bezier(.2,.8,.2,1) both}
.ss-up{animation:ss-slide-up .35s cubic-bezier(.2,.8,.2,1) both}
.ss-grow{transform-origin:left;animation:ss-grow .8s cubic-bezier(.2,.8,.2,1) both}
.ss-gather{animation:ss-gather .9s cubic-bezier(.2,.8,.2,1) both}
.ss-stretch{animation:ss-stretch 1s cubic-bezier(.65,0,.35,1) .3s both}
.ss-shimmer{background-image:linear-gradient(90deg,transparent,rgba(148,163,184,.18),transparent);background-size:200% 100%;animation:ss-shimmer 1.4s linear infinite}
.ss-ping{animation:ss-pulse-ring 1.8s ease-out infinite}
@media (prefers-reduced-motion:reduce){.ss-root *{animation-duration:.01ms!important;animation-delay:0s!important;transition-duration:.01ms!important}}
`;

function useCountUp(target: number, duration = 800) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function CountUp({ value, dp = 0, suffix = "" }: { value: number; dp?: number; suffix?: string }) {
  const v = useCountUp(value);
  return <>{v.toFixed(dp)}{suffix}</>;
}

/** Flips to true one frame after mount, so CSS width transitions play */
function useMounted() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    return () => cancelAnimationFrame(id);
  }, []);
  return on;
}

function Bar({ pct, color, delay = 0, h = "h-1.5", className = "" }: { pct: number; color: string; delay?: number; h?: string; className?: string }) {
  const on = useMounted();
  return (
    <div className={`${h} rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden ${className}`}>
      <div className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: on ? `${Math.max(0, Math.min(100, pct))}%` : "0%", background: color, transitionDelay: `${delay}ms` }} />
    </div>
  );
}

/** Smooth height animation for expand/collapse; content only mounts while needed */
function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 320);
    return () => clearTimeout(t);
  }, [open]);
  return (
    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${shown ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
      <div className="overflow-hidden min-h-0">{mounted && children}</div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, className = "w-4 h-4", sw = 2 }: { d: string; className?: string; sw?: number }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const IcClose = (p: { className?: string }) => <Ico d="M6 6l12 12M18 6L6 18" {...p} />;
const IcSearch = (p: { className?: string }) => <Ico d="M20 20l-4.2-4.2M11 17.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" {...p} />;
const IcChevron = (p: { className?: string }) => <Ico d="M6 9l6 6 6-6" {...p} />;
const IcRight = (p: { className?: string }) => <Ico d="M5 12h14M13 6l6 6-6 6" {...p} />;
const IcRefresh = (p: { className?: string }) => <Ico d="M20 12a8 8 0 11-2.3-5.6M20 4v5h-5" {...p} />;
const IcHelp = (p: { className?: string }) => <Ico d="M9.5 9a2.5 2.5 0 114 2c-.9.7-1.5 1.1-1.5 2.2M12 17h.01M12 21a9 9 0 110-18 9 9 0 010 18z" {...p} />;
const IcWarn = (p: { className?: string }) => <Ico d="M12 3l10 18H2L12 3zM12 10v5M12 18h.01" {...p} />;

const StageGlyph = ({ stage, className = "w-4 h-3" }: { stage: Stage; className?: string }) => (
  <svg className={className} viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {stage === 1 && <path d="M1 7c3 1 4-2 7-1s4 2 6 0 3 0 5 0" />}
    {stage === 2 && <path d="M1 10l5-3 3 1 5-5 5-1" />}
    {stage === 3 && <path d="M1 9l5-4 4-1 3 1 3 3 4 2" />}
    {stage === 4 && <path d="M1 2l4 1 3 3 4 1 3 3 5 1" />}
  </svg>
);

function StageChip({ stage }: { stage: Stage }) {
  const s = STAGE_META[stage];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap ${s.chip}`} title={s.desc}>
      <StageGlyph stage={stage} /> {s.name}
    </span>
  );
}

// ─── Charts ───────────────────────────────────────────────────────────────────

function ReturnsChart({ items }: { items: { l: string; v: number }[] }) {
  const maxAbs = Math.max(1, ...items.map((i) => Math.abs(i.v)));
  const W = 300, H = 96, mid = 46, maxBar = 30, bw = 40, gap = (W - bw * items.length) / (items.length + 1);
  const on = useMounted();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Average returns by period">
      <line x1={0} x2={W} y1={mid} y2={mid} className="stroke-slate-200 dark:stroke-slate-700" strokeDasharray="3 3" />
      {items.map((it, i) => {
        const h = Math.max(2, (Math.abs(it.v) / maxAbs) * maxBar);
        const x = gap + i * (bw + gap);
        const up = it.v >= 0;
        return (
          <g key={it.l}>
            <rect x={x} y={up ? mid - h : mid} width={bw} height={h} rx={5} fill={up ? "#10b981" : "#f43f5e"} opacity={0.9}
              style={{ transformOrigin: `${x + bw / 2}px ${mid}px`, transform: on ? "scaleY(1)" : "scaleY(0)", transition: `transform .6s cubic-bezier(.2,.8,.2,1) ${i * 80}ms` }} />
            <text x={x + bw / 2} y={up ? mid - h - 4 : mid + h + 11} textAnchor="middle"
              className={`text-[10px] font-bold tabular-nums ${up ? "fill-emerald-600 dark:fill-emerald-400" : "fill-rose-600 dark:fill-rose-400"}`}
              style={{ opacity: on ? 1 : 0, transition: `opacity .4s ease ${300 + i * 80}ms` }}>
              {fmt(it.v, 1)}
            </text>
            <text x={x + bw / 2} y={H - 3} textAnchor="middle" className="text-[9px] font-semibold fill-slate-400 dark:fill-slate-500">{it.l}</text>
          </g>
        );
      })}
    </svg>
  );
}

function RsiGauge({ value }: { value: number }) {
  const on = useMounted();
  const x = Math.min(100, Math.max(0, value)) * 3;
  return (
    <svg viewBox="0 0 300 30" className="w-full h-auto" role="img" aria-label={`Average RSI ${value.toFixed(0)}`}>
      <rect x={0} y={10} width={90} height={8} rx={4} fill="#0ea5e9" opacity={0.25} />
      <rect x={90} y={10} width={120} height={8} fill="#94a3b8" opacity={0.25} />
      <rect x={210} y={10} width={90} height={8} rx={4} fill="#f43f5e" opacity={0.25} />
      <circle cy={14} r={6} className="fill-slate-900 dark:fill-slate-100 stroke-white dark:stroke-[#0b0e14]" strokeWidth={2}
        style={{ cx: on ? x : 150, transition: "cx .8s cubic-bezier(.2,.8,.2,1)" }} cx={x} />
      <text x={90} y={29} textAnchor="middle" className="text-[8px] fill-slate-400">30</text>
      <text x={210} y={29} textAnchor="middle" className="text-[8px] fill-slate-400">70</text>
    </svg>
  );
}

// ─── "How it works" walkthrough ───────────────────────────────────────────────

const STEPS = [
  { title: "1 · Group the stocks", text: "Every stock is placed into its sector. Each sector is judged by what its stocks do together, not by any single name." },
  { title: "2 · Measure five things", text: "Breadth (how many stocks are in an uptrend), 1- and 3-month returns, closeness to 52-week highs, and the trend stage." },
  { title: "3 · Compare fairly", text: "Raw numbers are stretched onto a 0–100 scale across sectors. The best sector on a metric scores 100, the weakest scores 0." },
  { title: "4 · Weigh and add up", text: "Breadth counts most (30%), then 1M return (25%), 3M return (20%), 52W highs (15%) and stage (10%). The sum is the score." },
];

function StepVisual({ step }: { step: number }) {
  if (step === 0) {
    const clusters = [
      { cx: 50, cy: 38, c: "#6366f1", pts: [[-9, -5], [0, 7], [9, -3], [-2, -11]] },
      { cx: 150, cy: 56, c: "#10b981", pts: [[-8, -2], [3, 8], [9, -6], [-1, -10], [-10, 8]] },
      { cx: 250, cy: 36, c: "#f59e0b", pts: [[-6, 4], [7, 5], [0, -8]] },
    ];
    return (
      <svg viewBox="0 0 300 100" className="w-full h-auto">
        {clusters.map((cl, ci) => (
          <g key={ci}>
            <circle cx={cl.cx} cy={cl.cy} r={24} fill={cl.c} opacity={0.08} stroke={cl.c} strokeOpacity={0.35} strokeDasharray="3 3" />
            {cl.pts.map(([dx, dy], i) => (
              <circle key={i} cx={cl.cx + dx} cy={cl.cy + dy} r={4.5} fill={cl.c} className="ss-gather"
                style={{ ["--sx" as string]: `${(i % 2 ? 1 : -1) * (40 + ci * 15)}px`, ["--sy" as string]: `${(i % 3 - 1) * 30 + 22}px`, animationDelay: `${i * 70 + ci * 120}ms` }} />
            ))}
            <text x={cl.cx} y={cl.cy + 40} textAnchor="middle" className="text-[9px] font-semibold fill-slate-500">Sector {"ABC"[ci]}</text>
          </g>
        ))}
      </svg>
    );
  }
  if (step === 1) {
    const rows = [["Breadth", 72, "#6366f1"], ["1M return", 55, "#8b5cf6"], ["3M return", 64, "#a78bfa"], ["Near 52W high", 40, "#38bdf8"], ["Stage", 100, "#2dd4bf"]] as const;
    return (
      <div className="space-y-2 py-1">
        {rows.map(([l, p, c], i) => (
          <div key={l} className="flex items-center gap-3">
            <span className="w-24 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{l}</span>
            <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full ss-grow" style={{ width: `${p}%`, background: c, animationDelay: `${i * 120}ms` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (step === 2) {
    const dots = [["Sector A", 38, 0, "#f43f5e"], ["Sector B", 46, 34, "#f59e0b"], ["Sector C", 54, 71, "#84cc16"], ["Sector D", 62, 100, "#10b981"]] as const;
    return (
      <div className="relative h-24 mx-2">
        <div className="absolute left-0 right-0 top-9 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
        {dots.map(([l, from, to, c]) => (
          <div key={l} className="absolute ss-stretch" style={{ top: 22, ["--from" as string]: `${from}%`, ["--to" as string]: `${to}%`, transform: "translateX(-50%)" }}>
            <div className="w-5 h-5 rounded-full border-2 border-white dark:border-[#0b0e14] shadow" style={{ background: c }} />
            <span className="absolute left-1/2 -translate-x-1/2 top-7 text-[9px] font-semibold text-slate-500 whitespace-nowrap">{l.replace("Sector ", "")}</span>
          </div>
        ))}
        <span className="absolute left-0 bottom-0 text-[10px] text-slate-400">0 · weakest</span>
        <span className="absolute right-0 bottom-0 text-[10px] text-slate-400">100 · strongest</span>
      </div>
    );
  }
  const segs = [["30", 30, "#6366f1"], ["25", 25, "#8b5cf6"], ["20", 20, "#a78bfa"], ["15", 15, "#38bdf8"], ["10", 10, "#2dd4bf"]] as const;
  return (
    <div className="py-3">
      <div className="flex h-5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
        {segs.map(([l, w, c], i) => (
          <div key={l} className="h-full ss-grow flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${w}%`, background: c, animationDelay: `${i * 220}ms` }}>{l}%</div>
        ))}
      </div>
      <p className="text-center mt-4 text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums"><CountUp value={78} /></p>
      <p className="text-center text-[10px] uppercase tracking-widest text-slate-400">example score</p>
    </div>
  );
}

function HowItWorks({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setStep((s) => Math.min(STEPS.length - 1, s + 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);

  const last = step === STEPS.length - 1;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm ss-fade" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-label="How the score works">
      <div className="w-full sm:max-w-md bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden ss-pop">
        <div className="flex items-center justify-between px-5 pt-4">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">How the score works</p>
          <button onClick={onClose} aria-label="Close" className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"><IcClose /></button>
        </div>
        <div className="px-5 pt-4 pb-5">
          <div className="min-h-[120px] flex items-center"><div key={step} className="w-full"><StepVisual step={step} /></div></div>
          <div key={`t${step}`} className="ss-in mt-3">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">{STEPS[step].title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{STEPS[step].text}</p>
          </div>
          <div className="flex items-center justify-between mt-5">
            <div className="flex gap-1.5" aria-hidden="true">
              {STEPS.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-indigo-500" : "w-1.5 bg-slate-300 dark:bg-slate-700"}`} />)}
            </div>
            <div className="flex gap-2">
              {step > 0 && <button onClick={() => setStep(step - 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Back</button>}
              <button onClick={() => (last ? onClose() : setStep(step + 1))} className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90">
                {last ? "Got it" : "Next"}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-4">Scores are relative to today&apos;s sectors and refresh with the data. For research, not investment advice.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Stocks drawer (level 3) ──────────────────────────────────────────────────

type SortKey = "close" | "pcnt_1d" | "pcnt_1w" | "pcnt_1m" | "pcnt_3m" | "rsi14";
const DRAWER_PAGE = 15;

function StocksDrawer({ m, isMobile, onClose }: { m: SectorMetrics; isMobile: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [key, setKey] = useState<SortKey>("pcnt_1m");
  const [dir, setDir] = useState<"desc" | "asc">("desc");
  const [shown, setShown] = useState(DRAWER_PAGE);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [onClose]);

  const list = useMemo(() => {
    let s = [...m.stocks];
    if (q.trim()) s = s.filter((r) => parseSymbol(r.stckname).display.toLowerCase().includes(q.toLowerCase()));
    return s.sort((a, b) => {
      const av = (a[key] ?? -Infinity) as number;
      const bv = (b[key] ?? -Infinity) as number;
      return dir === "desc" ? bv - av : av - bv;
    });
  }, [m.stocks, q, key, dir]);

  const cols: { k: SortKey; l: string }[] = [
    { k: "pcnt_1d", l: "1D" }, { k: "pcnt_1w", l: "1W" }, { k: "pcnt_1m", l: "1M" }, { k: "pcnt_3m", l: "3M" }, { k: "rsi14", l: "RSI" },
  ];
  const sortBy = (k: SortKey) => { if (k === key) setDir((d) => (d === "desc" ? "asc" : "desc")); else { setKey(k); setDir("desc"); } setShown(DRAWER_PAGE); };

  return (
    <div className="fixed inset-0 z-50 ss-fade" role="dialog" aria-modal="true" aria-label={`${m.sector} stocks`}>
      <div className="absolute inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`absolute bg-white dark:bg-[#0b0e14] shadow-2xl flex flex-col ${isMobile ? "inset-x-0 bottom-0 max-h-[90vh] rounded-t-3xl ss-up" : "right-0 top-0 h-full w-[520px] border-l border-slate-200 dark:border-slate-800 ss-right"}`}>
        <div className="px-4 pt-4 pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">All stocks</p>
              <h2 className="text-base font-black text-slate-900 dark:text-slate-100 truncate">{m.sector}</h2>
              <p className="text-[11px] text-slate-500">{m.stockCount} stocks · tap a stock to open it</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"><IcClose /></button>
          </div>
          <div className="relative mt-3">
            <IcSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setShown(DRAWER_PAGE); }} placeholder="Find a stock" aria-label="Find a stock"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20" />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Stock</th>
                {cols.map((c) => (
                  <th key={c.k} className="p-0 text-right">
                    <button onClick={() => sortBy(c.k)} className={`w-full py-2 px-2 text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap transition-colors ${key === c.k ? "text-slate-900 dark:text-slate-100" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}>
                      {c.l}{key === c.k ? (dir === "desc" ? " ↓" : " ↑") : ""}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {list.slice(0, shown).map((s) => {
                const { display, slug } = parseSymbol(s.stckname);
                return (
                  <tr key={s.id} tabIndex={0} onClick={() => router.push(`/stocks/${slug}`)} onKeyDown={(e) => { if (e.key === "Enter") router.push(`/stocks/${slug}`); }}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 focus-visible:bg-indigo-50 dark:focus-visible:bg-indigo-500/10 outline-none transition-colors group">
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 leading-tight">{display}</p>
                      <p className="text-[10px] text-slate-400 font-mono">₹{s.close.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
                    </td>
                    {(["pcnt_1d", "pcnt_1w", "pcnt_1m", "pcnt_3m"] as const).map((k) => (
                      <td key={k} className={`py-2.5 px-2 text-right font-mono ${retColor(s[k] ?? 0)}`}>{s[k] != null ? fmt(s[k]!, 1) : "—"}</td>
                    ))}
                    <td className={`py-2.5 px-2 text-right font-mono ${s.rsi14 == null ? "text-slate-400" : s.rsi14 > 70 ? "text-rose-600 dark:text-rose-400" : s.rsi14 < 40 ? "text-sky-600 dark:text-sky-400" : "text-slate-500"}`}>{s.rsi14 != null ? s.rsi14.toFixed(0) : "—"}</td>
                  </tr>
                );
              })}
              {list.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-slate-400">No stock matches &ldquo;{q}&rdquo;</td></tr>}
            </tbody>
          </table>
          {shown < list.length && (
            <div className="p-3">
              <button onClick={() => setShown((n) => n + DRAWER_PAGE)} className="w-full py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Show {Math.min(DRAWER_PAGE, list.length - shown)} more · {list.length - shown} left
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sector item (levels 1 + 2) ───────────────────────────────────────────────

function WhyScore({ m }: { m: SectorMetrics }) {
  const [info, setInfo] = useState<string | null>(null);
  const on = useMounted();
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Why {m.compositeScore} out of 100?</p>
        <p className="text-[10px] text-slate-400">tap <IcHelp className="inline w-3 h-3 -mt-0.5" /> to see how it&apos;s calculated</p>
      </div>

      {/* stacked contribution bar */}
      <div className="flex h-3 rounded-full overflow-hidden bg-slate-200/80 dark:bg-slate-800 mb-4" role="img" aria-label="Score made of five contributions">
        {m.parts.map((p, i) => (
          <div key={p.key} className="h-full transition-[width] duration-700 ease-out first:rounded-l-full"
            style={{ width: on ? `${p.points}%` : "0%", background: p.color, transitionDelay: `${i * 90}ms` }} title={`${p.label}: +${p.points.toFixed(1)}`} />
        ))}
      </div>

      <ul className="space-y-3">
        {m.parts.map((p, i) => (
          <li key={p.key}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{p.label}</span>
              <button onClick={() => setInfo(info === p.key ? null : p.key)} aria-label={`How ${p.label} is calculated`} aria-expanded={info === p.key}
                className={`rounded-full transition-colors ${info === p.key ? "text-indigo-500" : "text-slate-300 dark:text-slate-600 hover:text-slate-500"}`}>
                <IcHelp className="w-3.5 h-3.5" />
              </button>
              <span className="ml-auto text-xs tabular-nums text-slate-500"><span className="font-black text-slate-800 dark:text-slate-100">+{p.points.toFixed(1)}</span> / {p.weight}</span>
            </div>
            <Bar pct={(p.points / p.weight) * 100} color={p.color} delay={i * 90} h="h-1" />
            <p className="text-[11px] text-slate-500 mt-1">{p.fact}</p>
            <Collapse open={info === p.key}>
              <p className="mt-1.5 text-[11px] leading-relaxed text-indigo-900/80 dark:text-indigo-200/80 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-lg px-3 py-2">
                <span className="font-bold">How it&apos;s done · </span>{p.how} <span className="opacity-70">This sector scored {p.norm.toFixed(0)}/100 here.</span>
              </p>
            </Collapse>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MoreMetrics({ m }: { m: SectorMetrics }) {
  const rows = [
    { l: "Above EMA 20", s: "short-term", n: m.aboveEma20 },
    { l: "Above EMA 50", s: "medium-term", n: m.aboveEma50 },
    { l: "Above EMA 200", s: "long-term", n: m.aboveEma200 },
  ];
  return (
    <div className="space-y-3.5">
      {rows.map((r, i) => {
        const pct = (r.n / m.stockCount) * 100;
        return (
          <div key={r.l}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{r.l} <span className="font-normal text-slate-400">· {r.s}</span></span>
              <span className="tabular-nums text-slate-500"><b className="text-slate-800 dark:text-slate-100">{r.n}</b>/{m.stockCount}</span>
            </div>
            <Bar pct={pct} color={pct >= 60 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#f43f5e"} delay={i * 80} h="h-1" />
          </div>
        );
      })}
      <div>
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Average RSI</span>
          <span className="tabular-nums font-bold text-slate-800 dark:text-slate-100">{m.avgRsi.toFixed(0)}{m.avgRsi > 70 ? " · overbought" : m.avgRsi < 40 ? " · oversold" : ""}</span>
        </div>
        <RsiGauge value={m.avgRsi} />
      </div>
    </div>
  );
}

function SectorItem({ m, rank, index, open, onToggle, onAllStocks }: {
  m: SectorMetrics; rank: number; index: number; open: boolean; onToggle: () => void; onAllStocks: () => void;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);
  const tone = TONE[toneOf(m.compositeScore)];
  const v = verdict(m);
  const vt = TONE[v.tone];

  useEffect(() => {
    if (!open) { setMore(false); return; }
    const t = setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 120);
    return () => clearTimeout(t);
  }, [open]);

  const movers = useMemo(
    () => [...m.stocks].filter((s) => s.pcnt_1m != null).sort((a, b) => (b.pcnt_1m ?? 0) - (a.pcnt_1m ?? 0)).slice(0, 5),
    [m.stocks]
  );

  return (
    <div ref={ref} className="ss-in scroll-mt-40" style={{ animationDelay: `${Math.min(index, 10) * 35}ms` }}>
      <div className={`rounded-2xl border transition-all duration-300 bg-white dark:bg-[#0b0e14] ${open ? "border-indigo-300 dark:border-indigo-500/40 shadow-lg shadow-indigo-500/5" : "border-slate-200 dark:border-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700"}`}>
        {/* Level 1 */}
        <button onClick={onToggle} aria-expanded={open} className="w-full flex items-center gap-3 px-3.5 py-3 text-left rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50">
          <span className={`w-6 text-center text-xs font-black tabular-nums ${rank <= 3 ? "text-slate-900 dark:text-slate-100" : "text-slate-400 dark:text-slate-600"}`}>{rank}</span>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{m.sector}</p>
            <div className="flex items-center gap-2 mt-1">
              <StageChip stage={m.stage} />
              {m.confidenceLevel !== "High" ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400" title="Small sample — the signal may be noisy">
                  <IcWarn className="w-3 h-3" /> {m.stockCount} stocks
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 hidden sm:inline">{m.stockCount} stocks</span>
              )}
            </div>
          </div>

          <div className="hidden sm:block w-24">
            <Bar pct={m.compositeScore} color={tone.hex} h="h-1.5" delay={index * 20} />
          </div>
          <div className="w-9 text-right">
            <p className={`text-lg font-black tabular-nums leading-none ${tone.text}`}>{m.compositeScore}</p>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">score</p>
          </div>
          <div className="w-14 text-right">
            <p className={`text-xs font-bold tabular-nums ${retColor(m.avgReturn1m)}`}>{fmt(m.avgReturn1m, 1)}</p>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">1 month</p>
          </div>
          <IcChevron className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-indigo-500" : ""}`} />
        </button>

        {/* Level 2 */}
        <Collapse open={open}>
          <div className="px-4 pb-4 pt-1 space-y-5 border-t border-slate-100 dark:border-slate-800/70">
            <div className={`mt-3 rounded-xl border p-3.5 ${vt.soft}`}>
              <p className={`text-sm font-bold ${vt.text}`}>{v.title}</p>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mt-1">{v.text}</p>
            </div>

            <WhyScore m={m} />

            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Average return</p>
              <div className="max-w-sm"><ReturnsChart items={[{ l: "1D", v: m.avgReturn1d }, { l: "1W", v: m.avgReturn1w }, { l: "1M", v: m.avgReturn1m }, { l: "3M", v: m.avgReturn3m }]} /></div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Top movers · 1 month</p>
              <ul className="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/70 overflow-hidden">
                {movers.map((s) => {
                  const { display, slug } = parseSymbol(s.stckname);
                  return (
                    <li key={s.id}>
                      <button onClick={() => router.push(`/stocks/${slug}`)} className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <span className="flex-1 text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{display}</span>
                        <span className="text-[11px] font-mono text-slate-400">₹{s.close.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                        <span className={`w-16 text-right text-xs font-mono font-bold ${retColor(s.pcnt_1m ?? 0)}`}>{fmt(s.pcnt_1m ?? 0, 1)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <button onClick={() => setMore((x) => !x)} aria-expanded={more} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                <IcChevron className={`w-3.5 h-3.5 transition-transform duration-300 ${more ? "rotate-180" : ""}`} />
                {more ? "Hide" : "Show"} trend details
              </button>
              <Collapse open={more}><div className="pt-3"><MoreMetrics m={m} /></div></Collapse>
            </div>

            <button onClick={onAllStocks} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity group">
              See all {m.stockCount} stocks <IcRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </Collapse>
      </div>
    </div>
  );
}

// ─── Pulse (top summary) ──────────────────────────────────────────────────────

type FilterMode = "all" | "strong" | "neutral" | "weak";

function Pulse({ sectors, filter, onFilter }: { sectors: SectorMetrics[]; filter: FilterMode; onFilter: (f: FilterMode) => void }) {
  const total = Math.max(1, sectors.length);
  const strong = sectors.filter((s) => s.compositeScore >= 70).length;
  const weak = sectors.filter((s) => s.compositeScore < 45).length;
  const neutral = sectors.length - strong - weak;
  const stage2 = sectors.filter((s) => s.stage === 2).length;
  const on = useMounted();

  const headline = strong >= weak * 1.5 && strong > 0 ? "Leadership is broad" : weak > strong * 1.5 ? "Weakness dominates" : "A selective market";
  const sub = `${strong} of ${sectors.length} sectors score 70 or more, and ${stage2} are in a Stage 2 uptrend.`;

  const segs: { f: FilterMode; n: number; t: Tone }[] = [
    { f: "strong", n: strong, t: "strong" }, { f: "neutral", n: neutral, t: "neutral" }, { f: "weak", n: weak, t: "weak" },
  ];

  return (
    <section className="ss-in rounded-2xl border border-slate-200 dark:border-slate-800/70 bg-white dark:bg-[#0b0e14] p-4 sm:p-5">
      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Market pulse</p>
      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 mt-1">{headline}</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">{sub}</p>

      <div className="flex h-3 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 mt-4 gap-0.5">
        {segs.map((s, i) => (
          <button key={s.f} onClick={() => onFilter(filter === s.f ? "all" : s.f)} aria-label={`Show ${TONE[s.t].label} sectors`}
            className={`h-full ${TONE[s.t].bar} transition-[width,opacity] duration-700 ease-out hover:opacity-80 ${filter !== "all" && filter !== s.f ? "opacity-30" : ""}`}
            style={{ width: on ? `${(s.n / total) * 100}%` : "0%", transitionDelay: `${i * 120}ms` }} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3">
        {segs.map((s) => (
          <button key={s.f} onClick={() => onFilter(filter === s.f ? "all" : s.f)} className={`text-left rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${filter === s.f ? "bg-slate-100 dark:bg-slate-800/70" : ""}`}>
            <p className={`text-2xl font-black tabular-nums leading-none ${TONE[s.t].text}`}><CountUp value={s.n} /></p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">{TONE[s.t].label} <span className="font-normal text-slate-400">{s.t === "strong" ? "70+" : s.t === "neutral" ? "45–69" : "<45"}</span></p>
          </button>
        ))}
      </div>
    </section>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3" aria-label="Loading sector data">
      <div className="h-44 rounded-2xl bg-slate-200/60 dark:bg-slate-800/40 ss-shimmer" />
      {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 rounded-2xl bg-slate-200/60 dark:bg-slate-800/40 ss-shimmer" style={{ animationDelay: `${i * 100}ms` }} />)}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SortMode = "score" | "return1m" | "return3m" | "breadth";
const SORTS: { id: SortMode; label: string }[] = [
  { id: "score", label: "Strongest" },
  { id: "return1m", label: "1M return" },
  { id: "return3m", label: "3M return" },
  { id: "breadth", label: "Breadth" },
];
const PAGE = 12;

export default function SectorStrengthPage() {
  const [stocks, setStocks] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sort, setSort] = useState<SortMode>("score");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [openSector, setOpenSector] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<string | null>(null);
  const [showHow, setShowHow] = useState(false);
  const [visible, setVisible] = useState(PAGE);
  const [updated, setUpdated] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchStocks()
      .then((d) => { setStocks(d); setUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  const sectors = useMemo(() => computeSectors(stocks), [stocks]);
  const rankOf = useMemo(() => new Map(sectors.map((s, i) => [s.sector, i + 1])), [sectors]);

  const list = useMemo(() => {
    let s = [...sectors];
    if (filter === "strong") s = s.filter((x) => x.compositeScore >= 70);
    else if (filter === "neutral") s = s.filter((x) => x.compositeScore >= 45 && x.compositeScore < 70);
    else if (filter === "weak") s = s.filter((x) => x.compositeScore < 45);
    if (query.trim()) s = s.filter((x) => x.sector.toLowerCase().includes(query.toLowerCase()));
    s.sort((a, b) =>
      sort === "return1m" ? b.avgReturn1m - a.avgReturn1m
      : sort === "return3m" ? b.avgReturn3m - a.avgReturn3m
      : sort === "breadth" ? b.breadthPct - a.breadthPct
      : b.compositeScore - a.compositeScore);
    return s;
  }, [sectors, filter, sort, query]);

  useEffect(() => { setVisible(PAGE); setOpenSector(null); }, [filter, sort, query]);

  const drawerSector = drawer ? sectors.find((s) => s.sector === drawer) ?? null : null;
  const filterLabel = filter === "all" ? null : TONE[filter].label;

  return (
    <div className="ss-root min-h-screen bg-slate-50 dark:bg-[#06080c] text-slate-800 dark:text-slate-200" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{CSS}</style>
      {showHow && <HowItWorks onClose={() => setShowHow(false)} />}
      {drawerSector && <StocksDrawer m={drawerSector} isMobile={isMobile} onClose={() => setDrawer(null)} />}

      <div className="max-w-3xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <header className="pt-6 pb-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Sector Strength</h1>
            <p className="text-xs text-slate-500 mt-1">Which parts of the market are leading — and why.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setShowHow(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <IcHelp className="w-3.5 h-3.5" /> How it works
            </button>
            {updated && (
              <button onClick={load} disabled={loading} title="Refresh" aria-label="Refresh data" className="relative w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                <IcRefresh className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span className="absolute -top-0.5 -right-0.5 flex w-2.5 h-2.5"><span className="ss-ping absolute inset-0 rounded-full bg-emerald-500" /><span className="relative w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-50 dark:border-[#06080c]" /></span>
              </button>
            )}
          </div>
        </header>

        {loading && stocks.length === 0 && <Skeleton />}

        {error && (
          <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 p-6 text-center ss-pop">
            <IcWarn className="w-7 h-7 mx-auto text-rose-500 mb-2" />
            <p className="text-rose-700 dark:text-rose-400 font-semibold text-sm">Couldn&apos;t load sector data</p>
            <p className="text-xs text-rose-600/80 mt-1">{error}. Check your Supabase environment variables.</p>
            <button onClick={load} className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700">Try again</button>
          </div>
        )}

        {!error && stocks.length > 0 && (
          <div className="space-y-4 pb-16">
            <Pulse sectors={sectors} filter={filter} onFilter={setFilter} />

            {/* Controls */}
            <div className="sticky top-14 z-20 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2.5 bg-slate-50/90 dark:bg-[#06080c]/90 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                    {filterLabel ? `${filterLabel} sectors` : "All sectors"} <span className="font-normal text-slate-400">· {list.length}</span>
                  </p>
                </div>

                {filter !== "all" && (
                  <button onClick={() => setFilter("all")} className="ss-pop flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700">
                    {TONE[filter].label} <IcClose className="w-3 h-3" />
                  </button>
                )}

                <div className={`relative flex items-center transition-all duration-300 ${searchOpen || query ? "w-40 sm:w-52" : "w-8"}`}>
                  <button onClick={() => setSearchOpen(true)} aria-label="Search sectors" className="absolute left-0 w-8 h-8 flex items-center justify-center text-slate-500 z-10"><IcSearch className="w-4 h-4" /></button>
                  <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} onBlur={() => { if (!query) setSearchOpen(false); }} placeholder="Search" aria-label="Search sectors"
                    className={`w-full h-8 pl-8 pr-2 text-xs rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-400 transition-opacity ${searchOpen || query ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
                </div>

                <label className="flex items-center">
                  <span className="sr-only">Rank by</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)} className="h-8 px-2.5 text-xs font-medium rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-400">
                    {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </label>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 -mt-2">
              {list.slice(0, visible).map((m, i) => (
                <SectorItem
                  key={m.sector} m={m} index={i} rank={rankOf.get(m.sector) ?? i + 1}
                  open={openSector === m.sector}
                  onToggle={() => setOpenSector((p) => (p === m.sector ? null : m.sector))}
                  onAllStocks={() => setDrawer(m.sector)}
                />
              ))}

              {list.length === 0 && (
                <div className="ss-pop text-center py-14 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No sectors match</p>
                  <button onClick={() => { setFilter("all"); setQuery(""); }} className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Clear filters</button>
                </div>
              )}

              {visible < list.length && (
                <button onClick={() => setVisible((v) => v + PAGE)} className="w-full py-3 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                  Show {Math.min(PAGE, list.length - visible)} more · {list.length - visible} left
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center pt-2">
              {stocks.length} stocks · updated {updated} · rank is by overall score
            </p>
          </div>
        )}
      </div>
    </div>
  );
}