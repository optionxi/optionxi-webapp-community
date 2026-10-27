"use client";

/**
 * Sector Pulse — v5
 * -----------------------------------------------------------------------------
 * Changes from v4:
 *
 *  1. Individual stocks load automatically as soon as a sector panel opens —
 *     no more "View the N individual stocks" button. The fetch still happens
 *     client-side on demand (per-sector), it just fires on mount of the panel
 *     instead of on click.
 *
 *  2. Stocks are sorted by today's percent change (pcnt_1d, high → low).
 *
 *  3. Plain-English labels throughout. No Pro / Simple toggle.
 *
 * v5.1:
 *  - "Rising" filter sorts best → worst; "Falling" filter sorts most negative
 *    first, so clicking Falling surfaces the hardest-hit sectors at the top.
 *
 * Backed directly by the pre-aggregated `sector_summary` table.
 *
 * Needs: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * No extra npm packages required.
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types — 1:1 with sector_summary ─────────────────────────────────────

interface SectorSummary {
  id: number;
  sec: string;
  stock_count: number;
  advancing_count: number;
  declining_count: number;
  unchanged_count: number;
  advancing_pct: number | null;
  avg_pcnt: number | null;
  median_pcnt: number | null;
  avg_rsi14: number | null;
  median_rsi14: number | null;
  total_volume: number | null;
  avg_volume: number | null;
  volume_surge_ratio: number | null;
  z_pcnt: number | null;
  z_rsi: number | null;
  z_volume: number | null;
  trend_score: number | null;
  trend_rank: number | null;
  is_trending: boolean;
  updated_at: string;
}

interface StockRow {
  id: number;
  stckname: string;
  sym_key: string | null;
  close: number;
  pcnt_1d: number | null;
  pcnt_1w: number | null;
  pcnt_1m: number | null;
  rsi14: number | null;
  sec: string | null;
}

// ─── Supabase fetch ───────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const SECTOR_FIELDS = [
  "id", "sec", "stock_count", "advancing_count", "declining_count", "unchanged_count",
  "advancing_pct", "avg_pcnt", "median_pcnt", "avg_rsi14", "median_rsi14",
  "total_volume", "avg_volume", "volume_surge_ratio",
  "z_pcnt", "z_rsi", "z_volume",
  "trend_score", "trend_rank", "is_trending", "updated_at",
].join(",");

const STOCK_FIELDS = ["id", "stckname", "sym_key", "close", "pcnt_1d", "pcnt_1w", "pcnt_1m", "rsi14", "sec"].join(",");

function sb(path: string) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 300 },
  });
}

async function fetchSectorSummary(): Promise<SectorSummary[]> {
  const res = await sb(`sector_summary?select=${SECTOR_FIELDS}&order=trend_score.desc.nullslast`);
  if (!res.ok) throw new Error(`Couldn't reach the data source (${res.status})`);
  return res.json();
}

async function fetchSectorStocks(sec: string): Promise<StockRow[]> {
  // Sorted by today's percent change, high → low.
  const res = await sb(`stock_performance?select=${STOCK_FIELDS}&sec=eq.${encodeURIComponent(sec)}&order=pcnt_1d.desc.nullslast`);
  if (!res.ok) throw new Error(`Couldn't load stocks for ${sec} (${res.status})`);
  return res.json();
}

// ─── Small pure helpers ───────────────────────────────────────────────────

/** trend_score is a roughly-normal z-score (typically -3..3). Squash to 0–100. */
function momentumFromTrend(trendScore: number | null): number {
  if (trendScore == null) return 50;
  return (1 / (1 + Math.exp(-trendScore))) * 100;
}

function isSectorUp(s: SectorSummary): boolean {
  return (s.median_pcnt ?? s.avg_pcnt ?? 0) >= 0;
}

/** The number used everywhere to describe "how the sector moved today". */
function sectorMove(s: SectorSummary): number {
  return s.median_pcnt ?? s.avg_pcnt ?? 0;
}

function confidenceOf(count: number): "High" | "Medium" | "Low" {
  return count >= 10 ? "High" : count >= 5 ? "Medium" : "Low";
}

const fmtPct = (v: number | null, dp = 2) => (v == null ? "—" : (v >= 0 ? "+" : "") + v.toFixed(dp) + "%");
const retColor = (v: number | null) =>
  v == null ? "text-slate-400 dark:text-slate-500" : v > 0 ? "text-emerald-600 dark:text-emerald-400" : v < 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-400 dark:text-slate-500";
const scoreStroke = (s: number, isDark: boolean) =>
  s >= 65 ? (isDark ? "#34d399" : "#059669") : s >= 40 ? (isDark ? "#fbbf24" : "#d97706") : (isDark ? "#fb7185" : "#e11d48");

function parseSymbol(stckname: string): { display: string; slug: string } {
  const withoutExchange = stckname.replace(/^(NSE:|BSE:|MCX:)/, "");
  const slug = withoutExchange.replace(/-(EQ|BE|SM|N1|N2)$/, "");
  return { display: slug, slug };
}

const STOCK_BATCH = 8;

// ─── Prefers-color-scheme hook (only needed for canvas/SVG stroke colors,
//     which can't be styled with `dark:` classes) ─────────────────────────

function usePrefersDark(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return dark;
}

// ─── Small animated primitives ───────────────────────────────────────────

function AnimatedNumber({
  value, decimals = 0, prefix = "", suffix = "", duration = 700, delay = 0,
}: { value: number; decimals?: number; prefix?: string; suffix?: string; duration?: number; delay?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start = 0;
    const t = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min(1, (ts - start) / duration);
        setDisplay(value * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{prefix}{display.toFixed(decimals)}{suffix}</>;
}

function ScoreRing({ value, index = 0, size = 46 }: { value: number; index?: number; size?: number }) {
  const [filled, setFilled] = useState(false);
  const isDark = usePrefersDark();
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 100 + Math.min(index, 14) * 40);
    return () => clearTimeout(t);
  }, [index]);
  const stroke = 4.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - (filled ? value : 0) / 100);
  const color = scoreStroke(value, isDark);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="stroke-slate-200 dark:stroke-white/[0.06]" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" stroke={color} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1000ms cubic-bezier(0.16,1,0.3,1)" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[12px] font-extrabold tabular-nums" style={{ color }}>
          <AnimatedNumber value={value} delay={100 + Math.min(index, 14) * 40} />
        </span>
      </div>
    </div>
  );
}

function TermTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        className="w-3.5 h-3.5 ml-1 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-[9px] text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors"
        aria-label="What does this mean?">i</button>
      {open && (
        <span role="tooltip" className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 dark:border-white/10 shadow-xl px-2.5 py-2 text-[10.5px] leading-relaxed text-slate-100 dark:text-slate-300 animate-[fadeIn_120ms_ease-out]">
          {text}
        </span>
      )}
    </span>
  );
}

function LiveDot() {
  return (
    <span className="relative inline-flex w-1.5 h-1.5">
      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75 animate-ping" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 dark:bg-emerald-400" />
    </span>
  );
}

/** Three-segment advancing / unchanged / declining bar, animates its widths in once. */
function BreadthBar({ s, index = 0 }: { s: SectorSummary; index?: number }) {
  const [filled, setFilled] = useState(false);
  useEffect(() => { const t = setTimeout(() => setFilled(true), 150 + Math.min(index, 10) * 40); return () => clearTimeout(t); }, [index]);
  const total = Math.max(1, s.stock_count);
  const upW = (s.advancing_count / total) * 100;
  const flatW = (s.unchanged_count / total) * 100;
  const downW = (s.declining_count / total) * 100;
  return (
    <div>
      <div className="h-2 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-white/[0.06] flex">
        <div className="h-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-700 ease-out" style={{ width: `${filled ? upW : 0}%` }} />
        <div className="h-full bg-slate-400/60 dark:bg-slate-500/50 transition-all duration-700 ease-out" style={{ width: `${filled ? flatW : 0}%` }} />
        <div className="h-full bg-rose-500 dark:bg-rose-400 transition-all duration-700 ease-out" style={{ width: `${filled ? downW : 0}%` }} />
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[10px]">
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{s.advancing_count} up</span>
        <span className="text-slate-500 dark:text-slate-500">{s.unchanged_count} flat</span>
        <span className="text-rose-600 dark:text-rose-400 font-semibold">{s.declining_count} down</span>
      </div>
    </div>
  );
}

// ─── Info sheet — "how this works", plain words ──────────────────────────

function InfoSheet({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 10); return () => clearTimeout(t); }, []);
  const close = () => { setVisible(false); setTimeout(onClose, 200); };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = [
    { title: "Strength", desc: "One number that blends how many stocks are up, how far, and how unusual today's move is versus a normal day for this sector." },
    { title: "Trending Up / Down", desc: "A straight headcount — how many stocks in the sector actually rose or fell today." },
    { title: "Pace", desc: "Is the average stock running hot (overbought) or cool (oversold)? Above 70 = hot, below 40 = cool." },
    { title: "Trading activity", desc: "Is today busier than usual? A ratio above ~1.3× means noticeably more shares are changing hands than normal." },
    { title: "Unusual signal", desc: "How far today's numbers are from this sector's typical day. 0 = a normal day, 2+ = a genuinely unusual one." },
  ];

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-900/30 dark:bg-slate-950/70 backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={close}
      />
      <div
        className={`fixed inset-x-0 bottom-0 max-h-[85vh] sm:inset-x-auto sm:left-auto sm:right-0 sm:top-0 sm:bottom-0 sm:max-h-none sm:h-full sm:w-full sm:max-w-lg
          bg-white dark:bg-[#0d1017] border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/10
          rounded-t-3xl sm:rounded-t-none sm:rounded-l-3xl shadow-2xl overflow-hidden flex flex-col
          transition-transform duration-300 ease-out
          ${visible ? "translate-x-0 translate-y-0 sm:translate-x-0" : "translate-x-0 translate-y-full sm:translate-y-0 sm:translate-x-full"}`}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-white/15" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20 flex items-center justify-center text-sm">🩺</div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm">How to read this</h2>
              <p className="text-[10.5px] text-slate-500">No finance degree required.</p>
            </div>
          </div>
          <button onClick={close} className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-5 py-4 space-y-2.5 overflow-y-auto">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-1">
            Tap any sector to see its full breakdown. Here's what each part of that breakdown means:
          </p>
          {rows.map((x) => (
            <div key={x.title} className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{x.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{x.desc}</p>
            </div>
          ))}
          <p className="text-[10px] text-slate-400 dark:text-slate-600 pt-1 pb-1">Numbers refresh roughly every 5 minutes.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Sector panel — the only place with real detail ──────────────────────

function SectorSheet({ s, onClose }: { s: SectorSummary; onClose: () => void }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [stocks, setStocks] = useState<StockRow[] | null>(null);
  const [stocksLoading, setStocksLoading] = useState(false);
  const [stocksError, setStocksError] = useState<string | null>(null);
  const [shown, setShown] = useState(STOCK_BATCH);
  const [stockSearch, setStockSearch] = useState("");

  useEffect(() => { const t = setTimeout(() => setVisible(true), 10); return () => clearTimeout(t); }, []);
  const close = () => { setVisible(false); setTimeout(onClose, 200); };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load stocks as soon as the panel opens.
  useEffect(() => {
    let cancelled = false;
    setStocksLoading(true);
    setStocksError(null);
    fetchSectorStocks(s.sec)
      .then((data) => { if (!cancelled) setStocks(data); })
      .catch((e) => { if (!cancelled) setStocksError(e.message); })
      .finally(() => { if (!cancelled) setStocksLoading(false); });
    return () => { cancelled = true; };
  }, [s.sec]);

  const filteredStocks = useMemo(() => {
    if (!stocks) return [];
    if (!stockSearch.trim()) return stocks;
    const q = stockSearch.toLowerCase();
    return stocks.filter((r) => parseSymbol(r.stckname).display.toLowerCase().includes(q));
  }, [stocks, stockSearch]);

  const up = isSectorUp(s);
  const momentum = momentumFromTrend(s.trend_score);
  const confidence = confidenceOf(s.stock_count);
  const busy = (s.volume_surge_ratio ?? 0) >= 1.3;

  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={close}
      />
      <div
        className={`fixed inset-x-0 bottom-0 max-h-[88vh] sm:inset-x-auto sm:left-auto sm:right-0 sm:top-0 sm:bottom-0 sm:max-h-none sm:h-full sm:w-full sm:max-w-lg
          bg-white dark:bg-[#0d1017] border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/10
          rounded-t-3xl sm:rounded-t-none sm:rounded-l-3xl shadow-2xl flex flex-col
          transition-transform duration-300 ease-out
          ${visible ? "translate-x-0 translate-y-0 sm:translate-x-0" : "translate-x-0 translate-y-full sm:translate-y-0 sm:translate-x-full"}`}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-white/15" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-4 border-b border-slate-200 dark:border-white/10 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${
                  up ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/25 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/25"
                     : "bg-rose-500/10 text-rose-700 border-rose-500/25 dark:bg-rose-400/10 dark:text-rose-400 dark:border-rose-400/25"
                }`}>
                  {up ? "📈" : "📉"} {up ? "Rising" : "Falling"}
                </span>
                {s.is_trending && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold border bg-orange-500/10 text-orange-700 border-orange-500/25 dark:bg-orange-400/10 dark:text-orange-300 dark:border-orange-400/25">
                    🔥 Hot {s.trend_rank ? `#${s.trend_rank}` : ""}
                  </span>
                )}
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                  confidence === "High" ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20"
                  : confidence === "Medium" ? "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20"
                  : "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-400/10 dark:text-rose-400 dark:border-rose-400/20"
                }`}>
                  {confidence === "High" ? "●" : confidence === "Medium" ? "◑" : "○"} {confidence} confidence
                </span>
              </div>
              <h2 className="font-black text-slate-900 dark:text-slate-100 text-lg leading-tight truncate">{s.sec}</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">{s.stock_count} stocks tracked</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ScoreRing value={momentum} size={48} />
              <button onClick={close} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1.5 flex items-center">
            Strength<TermTip text="Blends breadth, price move and how unusual today's action is, squashed to 0–100." />
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Headline numbers */}
          <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-white/[0.06] border-b border-slate-200 dark:border-white/[0.06]">
            <div className="py-3 flex flex-col items-center gap-0.5">
              <span className={`text-sm font-bold tabular-nums ${retColor(s.avg_pcnt)}`}>{fmtPct(s.avg_pcnt)}</span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-600">Average move</span>
            </div>
            <div className="py-3 flex flex-col items-center gap-0.5">
              <span className={`text-sm font-bold tabular-nums ${retColor(s.median_pcnt)}`}>{fmtPct(s.median_pcnt)}</span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-600">Typical move</span>
            </div>
            <div className="py-3 flex flex-col items-center gap-0.5">
              <span className="text-sm font-bold tabular-nums text-slate-800 dark:text-slate-200">{s.advancing_pct != null ? s.advancing_pct.toFixed(0) + "%" : "—"}</span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-600">Trending up</span>
            </div>
          </div>

          {/* Breadth */}
          <div className="px-5 py-4 border-b border-slate-200 dark:border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-600 mb-2 flex items-center">
              How the sector splits<TermTip text="Every tracked stock in this sector, sorted into up / flat / down for today." />
            </p>
            <BreadthBar s={s} />
          </div>

          {/* Pace + volume */}
          <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-white/[0.06] border-b border-slate-200 dark:border-white/[0.06]">
            <div className="py-3 px-5">
              <p className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-1 flex items-center">Pace<TermTip text="How stretched the average stock is. Above 70 = running hot, below 40 = running cool." /></p>
              <span className={`text-sm font-bold tabular-nums ${
                (s.avg_rsi14 ?? 50) > 70 ? "text-rose-600 dark:text-rose-400" : (s.avg_rsi14 ?? 50) < 40 ? "text-sky-600 dark:text-sky-400" : "text-slate-800 dark:text-slate-200"
              }`}>
                {s.avg_rsi14 != null ? s.avg_rsi14.toFixed(1) : "—"}
                {s.avg_rsi14 != null && s.avg_rsi14 > 70 ? " hot" : s.avg_rsi14 != null && s.avg_rsi14 < 40 ? " cool" : ""}
              </span>
            </div>
            <div className="py-3 px-5">
              <p className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-1 flex items-center">Trading activity<TermTip text="Compares today's traded volume to this sector's normal volume. Busy = noticeably more shares changing hands than usual." /></p>
              <span className={`text-sm font-bold tabular-nums ${busy ? "text-amber-600 dark:text-amber-300" : "text-slate-800 dark:text-slate-200"}`}>
                {busy ? "Busy" : "Normal"}
              </span>
            </div>
          </div>

          {/* Stocks — always shown, loads on open */}
          <div className="px-5 py-4 pb-14">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-600 mb-2.5">
              Individual stocks · sorted by today's move
            </p>

            {stocksLoading && (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-11 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/[0.05] to-transparent" />
                  </div>
                ))}
              </div>
            )}

            {stocksError && (
              <div className="rounded-xl bg-rose-500/[0.06] dark:bg-rose-400/[0.06] border border-rose-500/20 dark:border-rose-400/20 p-4 text-center">
                <p className="text-rose-700 dark:text-rose-300 text-xs font-semibold">{stocksError}</p>
              </div>
            )}

            {stocks && (
              <div className="animate-[fadeSlideUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
                <div className="relative mb-2.5">
                  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input type="text" placeholder="Find a stock…" value={stockSearch} onChange={(e) => { setStockSearch(e.target.value); setShown(STOCK_BATCH); }}
                    className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 dark:focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 transition-colors" />
                </div>

                {filteredStocks.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-6">No stocks match that.</p>
                ) : (
                  <div className="space-y-1.5">
                    {filteredStocks.slice(0, shown).map((r, i) => {
                      const { display, slug } = parseSymbol(r.stckname);
                      return (
                        <div key={r.id} onClick={() => router.push(`/stocks/${slug}`)}
                          style={{ animationDelay: `${Math.min(i, 10) * 25}ms` }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] border border-slate-200 dark:border-white/[0.05] cursor-pointer transition-colors animate-[fadeSlideUp_300ms_cubic-bezier(0.16,1,0.3,1)_backwards]">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{display}</p>
                            <p className="text-[9px] text-slate-400 dark:text-slate-600">₹{r.close.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={`text-xs font-bold tabular-nums ${retColor(r.pcnt_1d)}`}>{fmtPct(r.pcnt_1d, 1)}</p>
                            <p className="text-[9px] text-slate-400 dark:text-slate-600">today</p>
                          </div>
                          <div className="text-right shrink-0 w-12">
                            <p className={`text-xs font-bold tabular-nums ${retColor(r.pcnt_1m)}`}>{fmtPct(r.pcnt_1m, 1)}</p>
                            <p className="text-[9px] text-slate-400 dark:text-slate-600">1 mo</p>
                          </div>
                          <div className={`text-[10px] font-mono w-9 text-right shrink-0 ${
                            r.rsi14 != null ? (r.rsi14 > 70 ? "text-rose-600 dark:text-rose-400" : r.rsi14 < 40 ? "text-sky-600 dark:text-sky-400" : "text-slate-400 dark:text-slate-500") : "text-slate-300 dark:text-slate-700"
                          }`}>
                            {r.rsi14 != null ? r.rsi14.toFixed(0) : "—"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {shown < filteredStocks.length && (
                  <button onClick={() => setShown((n) => n + STOCK_BATCH)}
                    className="w-full mt-2.5 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-white/20 transition-colors">
                    Show {Math.min(STOCK_BATCH, filteredStocks.length - shown)} more
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="px-5 pb-5 text-[10px] text-slate-400 dark:text-slate-600">
            Refreshed {new Date(s.updated_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Minimal sector row ───────────────────────────────────────────────────

function SectorRow({ s, rank, index, onClick }: { s: SectorSummary; rank: number; index: number; onClick: () => void }) {
  const up = isSectorUp(s);
  const move = sectorMove(s);

  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${Math.min(index, 20) * 30}ms` }}
      className="w-full text-left group rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white hover:bg-slate-50 dark:bg-white/[0.025] dark:hover:bg-white/[0.05] hover:border-slate-300 dark:hover:border-white/[0.12] px-3.5 py-3 flex items-center gap-3 transition-colors duration-150 animate-[fadeSlideUp_400ms_cubic-bezier(0.16,1,0.3,1)_backwards] shadow-sm dark:shadow-none"
    >
      <span className="w-5 shrink-0 text-center text-[11px] font-black tabular-nums text-slate-400 dark:text-slate-600">
        {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : rank}
      </span>

      <span className={`w-1.5 h-8 rounded-full shrink-0 ${up ? "bg-emerald-500 dark:bg-emerald-400" : "bg-rose-500 dark:bg-rose-400"}`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[13.5px] font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-cyan-700 dark:group-hover:text-cyan-200 transition-colors">{s.sec}</p>
          {s.is_trending && <span className="shrink-0 text-[11px]">🔥</span>}
        </div>
        <p className="text-[10.5px] text-slate-500 mt-0.5">
          {s.stock_count} stocks · {s.advancing_count} up, {s.declining_count} down
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className={`text-sm font-black tabular-nums ${retColor(move)}`}>{fmtPct(move)}</p>
        <p className="text-[9px] text-slate-400 dark:text-slate-600 uppercase tracking-widest">typical</p>
      </div>

      <svg className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-600 group-hover:translate-x-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

// ─── Compact mood strip ────────────────────────────────────────────────

function MoodStrip({ sectors }: { sectors: SectorSummary[] }) {
  const total = sectors.length || 1;
  const rising = sectors.filter(isSectorUp).length;
  const falling = total - rising;
  const hot = sectors.filter((s) => s.is_trending).length;
  const upPct = Math.round((rising / total) * 100);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.025] p-3.5 mb-4 shadow-sm dark:shadow-none animate-[fadeSlideUp_400ms_cubic-bezier(0.16,1,0.3,1)_backwards]">
      <div className="flex items-center justify-between text-[11px] mb-2">
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{rising} rising</span>
        <span className="text-slate-500">{upPct}% of sectors ↑</span>
        <span className="text-rose-600 dark:text-rose-400 font-semibold">{falling} falling</span>
      </div>
      <div className="h-1.5 rounded-full bg-rose-500/20 dark:bg-rose-400/25 overflow-hidden flex">
        <div className="h-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-700 ease-out" style={{ width: `${upPct}%` }} />
      </div>
      {hot > 0 && (
        <p className="text-[10.5px] text-orange-600 dark:text-orange-300 mt-2.5">🔥 {hot} sector{hot === 1 ? "" : "s"} trending unusually hard right now</p>
      )}
    </div>
  );
}

// ─── Filter bar ────────────────────────────────────────────────────────

type FilterMode = "all" | "rising" | "falling" | "hot";

function FilterBar({
  search, setSearch, filter, setFilter,
}: {
  search: string; setSearch: (v: string) => void;
  filter: FilterMode; setFilter: (v: FilterMode) => void;
}) {
  const FILTERS: { id: FilterMode; label: string }[] = [
    { id: "all", label: "Everything" },
    { id: "rising", label: "Rising" },
    { id: "falling", label: "Falling" },
    { id: "hot", label: "Hot" },
  ];
  return (
    <div className="flex gap-2 items-center overflow-x-auto pb-0.5">
      <div className="relative shrink-0 py-2">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Search sectors…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-7 pr-3 py-1.5 w-32 sm:w-40 text-xs rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 dark:focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 transition-colors" />
      </div>

      <div className="flex gap-1 shrink-0">
        {FILTERS.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
              filter === f.id ? "bg-cyan-500 dark:bg-cyan-400 text-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-white/20"
            }`}>
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Loading / error / empty ──────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-16 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] mb-4 overflow-hidden relative">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/70 dark:via-white/[0.04] to-transparent" />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-[62px] rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/70 dark:via-white/[0.04] to-transparent" style={{ animationDelay: `${i * 80}ms` }} />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl bg-rose-500/[0.06] dark:bg-rose-400/[0.06] border border-rose-500/20 dark:border-rose-400/20 p-8 text-center flex flex-col items-center gap-3">
      <span className="text-3xl">🩹</span>
      <p className="text-rose-700 dark:text-rose-300 font-semibold text-sm">Something interrupted the data feed</p>
      <p className="text-xs text-rose-600/70 dark:text-rose-400/70 max-w-xs">{message}</p>
      <button onClick={onRetry} className="mt-1 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 dark:bg-rose-400/15 dark:hover:bg-rose-400/25 border border-rose-500/30 dark:border-rose-400/30 text-rose-700 dark:text-rose-200 text-xs font-bold transition-colors">Try again</button>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────

export default function SectorPulsePage() {
  const [sectors, setSectors] = useState<SectorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SectorSummary | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchSectorSummary()
      .then((data) => {
        setSectors(data);
        setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = useMemo(() => {
    let s = [...sectors];
    if (filter === "rising") {
      // Best movers first.
      s = s.filter(isSectorUp).sort((a, b) => sectorMove(b) - sectorMove(a));
    } else if (filter === "falling") {
      // Most negative first — the hardest-hit sectors rise to the top.
      s = s.filter((x) => !isSectorUp(x)).sort((a, b) => sectorMove(a) - sectorMove(b));
    } else if (filter === "hot") {
      s = s.filter((x) => x.is_trending);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      s = s.filter((x) => x.sec.toLowerCase().includes(q));
    }
    return s;
  }, [sectors, filter, search]);

  return (
    <div className="min-h-screen font-sans">
      <style jsx global>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        ::selection { background: rgba(8, 145, 178, 0.2); }
        .dark ::selection { background: rgba(34, 211, 238, 0.25); }
      `}</style>

      {showInfo && <InfoSheet onClose={() => setShowInfo(false)} />}
      {selected && <SectorSheet s={selected} onClose={() => setSelected(null)} />}

      <div className="max-w-6xl mx-auto flex flex-col min-h-screen">
        {/* Header */}
        <div className=" px-4 pt-5 pb-3">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">Sector Pulse</h1>
              <p className="text-[11px] text-slate-500 mt-0.5">Tap a sector to see the full story.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {lastUpdated && (
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-full px-2.5 py-1.5 whitespace-nowrap">
                  <LiveDot /> {lastUpdated}
                </div>
              )}
              <button onClick={load}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-all"
                title="Refresh">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
              <button onClick={() => setShowInfo(true)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-all"
                title="How this works">
                <span className="text-[11px] font-bold">?</span>
              </button>
            </div>
          </div>
          <FilterBar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-4">
          {loading && <LoadingSkeleton />}
          {!loading && error && <ErrorState message={error} onRetry={load} />}

          {!loading && !error && (
            <>
              <MoodStrip sectors={sectors} />
              <p className="text-[10px] text-slate-400 dark:text-slate-600 mb-2 px-0.5">{filtered.length} of {sectors.length} sectors</p>

              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] py-14 text-center">
                  <p className="text-2xl mb-2">🔍</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No sectors match that</p>
                  <p className="text-xs text-slate-500 mt-1">Try a different search or filter.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((s, i) => (
                    <SectorRow key={s.sec} s={s} rank={i + 1} index={i} onClick={() => setSelected(s)} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}