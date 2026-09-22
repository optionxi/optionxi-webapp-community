"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  CandlestickChart,
  Layers,
  Info,
  Loader2,
  BarChart2,
  ShieldAlert,
  Target,
  Database,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap,
} from "lucide-react";
import { StockSearchEmptyState } from "./stock-empty-state";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScreenerSignal {
  name: string;
  timeframe: string;
  scan_date: string;
}

interface ScreenerAnalysis {
  bullish_signals: ScreenerSignal[];
  bearish_signals: ScreenerSignal[];
  bullish_count: number;
  bearish_count: number;
  screener_bias: string;
  strong_signal: boolean;
  signal_summary: string;
}

interface AlertSummary {
  triggered_alerts: unknown[];
  pending_alerts: unknown[];
  proximity_notes: string[];
  alert_summary: string;
}

interface PriceLevel {
  price: number;
  strength: string;
  note: string;
}

interface EntryOpportunity {
  type: string;
  entry_zone: string;
  rationale: string;
  risk_reward: string;
  stop_loss: number;
  target_1: number;
  target_2: number;
}

interface FetchCheck {
  source: string;
  found: boolean;
  count: number;
  detail: string;
}

interface StockAnalysis {
  symbol: string;
  company_name: string;
  market_sentiment: string;
  sentiment_emoji: string;
  one_liner: string;
  current_price: number;
  day_change_pct: number;
  support_levels: PriceLevel[];
  resistance_levels: PriceLevel[];
  entry_opportunities: EntryOpportunity[];
  key_observations: string[];
  risk_factors: string[];
  volume_analysis: string;
  indicator_summary: string;
  timeframe: string;
  confidence: string;
  last_updated: string;
  screener_analysis: ScreenerAnalysis;
  alert_analysis: AlertSummary;
  fetch_status: { checks: FetchCheck[]; found_count: number; total: number };
  cached: boolean;
  ttl_seconds?: number;
}

// ─── Loading steps ────────────────────────────────────────────────────────────

const STEPS = [
  { icon: "activity", label: "Establishing connection", sub: "Version check & market status" },
  { icon: "candle",   label: "Loading price history",   sub: "Last 30 daily candles" },
  { icon: "bar",      label: "Reading indicators",      sub: "RSI · EMA · SMA · Volume" },
  { icon: "alert",    label: "Checking alerts",         sub: "Active conditions & targets" },
  { icon: "layers",   label: "Pulling financials",      sub: "Balance sheet & P&L — 3 years" },
  { icon: "zap",      label: "Running screeners",       sub: "Bullish / bearish pattern scan" },
  { icon: "brain",    label: "Generating insights",     sub: "LLaMA 70B analysing everything" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function sentimentCls(s: string) {
  const l = s.toLowerCase();
  if (l.includes("bull") || l.includes("up")) return "text-emerald-500";
  if (l.includes("bear") || l.includes("down")) return "text-red-500";
  return "text-amber-500";
}

function confidenceCls(c: string) {
  const l = c.toLowerCase();
  if (l === "strong" || l === "high")
    return "text-emerald-600 bg-emerald-500/10 border-emerald-500/25";
  if (l === "moderate" || l === "medium")
    return "text-amber-600 bg-amber-500/10 border-amber-500/25";
  return "text-red-500 bg-red-500/10 border-red-500/25";
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Card({
  children,
  className = "",
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-card border border-border overflow-hidden ${className}`}
      style={accent ? { borderColor: accent } : undefined}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  icon,
  label,
  color = "text-muted-foreground",
}: {
  icon: React.ReactNode;
  label: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className={color} style={{ display: "flex" }}>{icon}</span>
      <span className={`text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase ${color}`}>
        {label}
      </span>
    </div>
  );
}

function Chip({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold border ${className}`}>
      {label}
    </span>
  );
}

function Divider() {
  return <div className="border-t border-border" />;
}

// ─── Step icon ────────────────────────────────────────────────────────────────

function StepIcon({ icon, size = 14 }: { icon: string; size?: number }) {
  const map: Record<string, React.ReactNode> = {
    activity: <Activity size={size} />,
    candle:   <CandlestickChart size={size} />,
    bar:      <BarChart2 size={size} />,
    alert:    <AlertTriangle size={size} />,
    layers:   <Layers size={size} />,
    zap:      <Zap size={size} />,
    brain:    <Brain size={size} />,
  };
  return <span>{map[icon] ?? <Activity size={size} />}</span>;
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ values, isUp }: { values: number[]; isUp: boolean }) {
  if (values.length < 2) return null;
  const W = 140, H = 48;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = H - ((v - min) / range) * H * 0.85 - H * 0.075;
      return `${x},${y}`;
    })
    .join(" ");
  const color = isUp ? "#10b981" : "#ef4444";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <defs>
        <linearGradient id="spk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${pts} ${W},${H} 0,${H}`} fill="url(#spk)" />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Loader ───────────────────────────────────────────────────────────────────

function LoadingView({ symbol, step }: { symbol: string; step: number }) {
  const current = STEPS[Math.min(step, STEPS.length - 1)];
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="flex flex-col items-center px-4 py-10 max-w-lg mx-auto w-full">
      {/* Dual-ring spinner */}
      <div className="relative flex items-center justify-center mb-8" style={{ width: 104, height: 104 }}>
        <div
          className="absolute inset-0 rounded-full border-2 border-border animate-spin"
          style={{ borderTopColor: "#06b6d4", animationDuration: "2.4s" }}
        />
        <div
          className="absolute rounded-full border border-border animate-spin"
          style={{ width: 74, height: 74, borderTopColor: "#8b5cf6", animationDuration: "3.6s", animationDirection: "reverse" }}
        />
        <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-cyan-500">
          <StepIcon icon={current.icon} size={22} />
        </div>
      </div>

      <p className="font-mono text-[11px] sm:text-xs tracking-[0.22em] text-cyan-500 uppercase mb-2">
        {symbol}
      </p>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-1.5">{current.label}</h2>
      <p className="text-sm sm:text-base text-muted-foreground text-center mb-7">{current.sub}</p>

      {/* Progress */}
      <div className="w-full mb-1.5">
        <div className="h-[2px] bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg,#06b6d4,#6366f1)" }}
          />
        </div>
      </div>
      <div className="flex justify-between w-full mb-7 text-[10px] sm:text-[11px] font-mono">
        <span className="text-muted-foreground">{step + 1} of {STEPS.length}</span>
        <span className="text-cyan-500 font-semibold">{pct}%</span>
      </div>

      {/* Step list */}
      <div className="w-full rounded-2xl border border-border bg-card overflow-hidden">
        {STEPS.map((s, i) => {
          const done   = i < step;
          const active = i === step;
          const color  = done ? "text-emerald-500" : active ? "text-cyan-500" : "text-muted-foreground/40";
          return (
            <div key={i}>
              <div className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${active ? "bg-muted/40" : ""}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${done ? "bg-emerald-500/10" : active ? "bg-cyan-500/10" : "bg-muted/50"} ${color}`}>
                  <StepIcon icon={s.icon} size={14} />
                </div>
                <span className={`flex-1 text-sm sm:text-[15px] ${active ? "font-semibold" : "font-normal"} ${color}`}>
                  {s.label}
                </span>
                {done   ? <CheckCircle size={14} className="text-emerald-500" />           : null}
                {active ? <Loader2 size={14} className="text-cyan-500 animate-spin" />     : null}
                {!done && !active ? <div className="w-1.5 h-1.5 rounded-full bg-border" /> : null}
              </div>
              {i < STEPS.length - 1 && <div className="border-t border-border mx-4" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Error view ───────────────────────────────────────────────────────────────

function ErrorView({ symbol, error, onRetry }: { symbol: string; error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
        <AlertTriangle size={26} className="text-red-500" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Analysis Failed</h3>
      <p className="text-sm sm:text-base text-muted-foreground mb-5">
        Could not fetch analysis for{" "}
        <span className="font-mono font-semibold text-foreground">{symbol}</span>.
      </p>
      <div className="w-full max-w-sm bg-muted/60 rounded-xl border border-border p-3 text-left mb-6">
        <p className="font-mono text-[11px] sm:text-xs text-muted-foreground leading-relaxed break-all">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold text-sm sm:text-base transition-colors"
      >
        <RefreshCw size={14} />
        Retry Analysis
      </button>
    </div>
  );
}

// ─── Hero card ────────────────────────────────────────────────────────────────

function HeroCard({
  data,
  sparkline,
  onRefresh,
  tvUrl,
}: {
  data: StockAnalysis;
  sparkline: number[];
  onRefresh: () => void;
  tvUrl: string;
}) {
  const isUp = data.day_change_pct >= 0;
  const cc   = isUp ? "text-emerald-500" : "text-red-500";
  const bg   = isUp ? "bg-emerald-500/10" : "bg-red-500/10";

  return (
    <Card className="p-4 sm:p-6">
      {/* Price row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] sm:text-xs tracking-[0.18em] text-muted-foreground mb-2">
            {data.symbol}
          </p>
          {/* Price — larger on desktop */}
          <p className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-3">
            ₹{fmt(data.current_price)}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold ${bg} ${cc}`}>
              {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isUp ? "+" : ""}{data.day_change_pct.toFixed(2)}% today
            </span>
            <Chip
              label={data.market_sentiment}
              className={`${sentimentCls(data.market_sentiment)} bg-current/5 border-current/20`}
            />
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="w-9 h-9 rounded-xl bg-muted/60 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw size={14} />
            </button>
            <span className="text-2xl sm:text-3xl">{data.sentiment_emoji}</span>
          </div>
          <Sparkline values={sparkline} isUp={isUp} />
        </div>
      </div>

      <Divider />

      {/* Stats row — bigger labels & values on desktop */}
      <div className="grid grid-cols-3 gap-1 py-3 sm:py-4">
        {[
          { label: "Confidence", value: data.confidence,  cls: confidenceCls(data.confidence) },
          { label: "Timeframe",  value: data.timeframe,   cls: "text-foreground" },
          { label: "Source",     value: data.cached ? "⚡ Cache" : "🤖 Live AI",
            cls: data.cached ? "text-amber-500" : "text-cyan-500" },
        ].map((c, i) => (
          <div key={i} className={`flex flex-col ${i > 0 ? "border-l border-border pl-3" : ""}`}>
            <span className="text-[9px] sm:text-[11px] text-muted-foreground/70 tracking-wide mb-1">{c.label}</span>
            <span className={`font-mono text-[11px] sm:text-sm font-bold truncate ${c.cls}`}>{c.value}</span>
          </div>
        ))}
      </div>

      {/* One-liner — more breathing room on desktop */}
      {data.one_liner && (
        <>
          <Divider />
          <div className="flex gap-2.5 pt-3 sm:pt-4">
            <Brain size={14} className="text-cyan-500 mt-0.5 shrink-0" />
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{data.one_liner}</p>
          </div>
        </>
      )}

      {/* TradingView CTA */}
      <a
        href={tvUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 sm:mt-5 flex items-center justify-center gap-2 h-11 sm:h-12 rounded-xl bg-foreground text-background text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity"
      >
        <CandlestickChart size={15} />
        View on TradingView
        <ExternalLink size={12} className="opacity-50" />
      </a>
    </Card>
  );
}

// ─── Screener card ────────────────────────────────────────────────────────────

function ScreenerCard({ sa }: { sa: ScreenerAnalysis }) {
  const total = sa.bullish_count + sa.bearish_count;
  if (total === 0)
    return (
      <Card className="p-4 sm:p-5 flex items-center gap-3 text-sm sm:text-base text-muted-foreground">
        <Activity size={15} /> No screener signals found
      </Card>
    );

  const biasIsUp   = sa.bullish_count > sa.bearish_count;
  const biasIsDown = sa.bearish_count > sa.bullish_count;
  const biasCls    = biasIsUp
    ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/25"
    : biasIsDown
    ? "text-red-500 bg-red-500/10 border-red-500/25"
    : "text-amber-500 bg-amber-500/10 border-amber-500/25";

  return (
    <Card>
      {/* Counts + bias */}
      <div className="p-4 sm:p-5 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp size={13} className="text-emerald-500" />
            <span className="font-mono text-sm sm:text-base font-bold text-emerald-600">{sa.bullish_count}</span>
            <span className="text-[10px] sm:text-[11px] text-emerald-600/70">Bull</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <TrendingDown size={13} className="text-red-500" />
            <span className="font-mono text-sm sm:text-base font-bold text-red-600">{sa.bearish_count}</span>
            <span className="text-[10px] sm:text-[11px] text-red-600/70">Bear</span>
          </div>
        </div>
        <div className={`ml-auto flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border text-sm sm:text-base font-semibold ${biasCls}`}>
          {sa.strong_signal && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
          {sa.screener_bias}
        </div>
      </div>

      {/* Ratio bar */}
      <div className="px-4 sm:px-5 pb-3">
        <div className="h-1.5 rounded-full overflow-hidden bg-red-500/15">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${total > 0 ? (sa.bullish_count / total) * 100 : 50}%` }}
          />
        </div>
      </div>

      {sa.signal_summary && (
        <>
          <Divider />
          <p className="px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {sa.signal_summary}
          </p>
        </>
      )}

      {(sa.bullish_signals.length > 0 || sa.bearish_signals.length > 0) && (
        <>
          <Divider />
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {sa.bullish_signals.length > 0 && (
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold tracking-wide text-emerald-600 mb-2.5">↑ BULLISH</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {sa.bullish_signals.map((s, i) => (
                    <span key={i} className="text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      {s.name}
                      {s.timeframe && <span className="opacity-50 ml-1 font-mono text-[10px] sm:text-[11px]">{s.timeframe}</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {sa.bearish_signals.length > 0 && (
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold tracking-wide text-red-500 mb-2.5">↓ BEARISH</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {sa.bearish_signals.map((s, i) => (
                    <span key={i} className="text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                      {s.name}
                      {s.timeframe && <span className="opacity-50 ml-1 font-mono text-[10px] sm:text-[11px]">{s.timeframe}</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

// ─── Alert card ───────────────────────────────────────────────────────────────

function AlertCard({ alert }: { alert: AlertSummary }) {
  return (
    <Card className="p-4 sm:p-5 space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold font-mono text-red-600 bg-red-500/10 border border-red-500/20">
          {alert.triggered_alerts.length} Triggered
        </span>
        <span className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold font-mono text-amber-600 bg-amber-500/10 border border-amber-500/20">
          {alert.pending_alerts.length} Pending
        </span>
      </div>
      {alert.proximity_notes.map((n, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm sm:text-base text-amber-600 dark:text-amber-400 leading-relaxed">{n}</p>
        </div>
      ))}
      {alert.alert_summary && (
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{alert.alert_summary}</p>
      )}
    </Card>
  );
}

// ─── Entry card ───────────────────────────────────────────────────────────────

function EntryCard({ entry }: { entry: EntryOpportunity }) {
  const isAggressive   = entry.type === "Aggressive";
  const isConservative = entry.type === "Conservative";
  const headerBg = isAggressive ? "bg-red-500/5" : isConservative ? "bg-emerald-500/5" : "bg-cyan-500/5";
  const typeCls  = isAggressive
    ? "text-red-600 bg-red-500/10 border-red-500/20"
    : isConservative
    ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
    : "text-cyan-600 bg-cyan-500/10 border-cyan-500/20";

  return (
    <Card>
      <div className={`px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between border-b border-border ${headerBg}`}>
        <Chip label={entry.type} className={typeCls} />
        <span className="font-mono text-xs sm:text-sm text-muted-foreground font-semibold">R:R {entry.risk_reward}</span>
      </div>
      <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base text-muted-foreground">Entry Zone</span>
          <span className="font-mono text-sm sm:text-base font-semibold text-foreground">{entry.entry_zone}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: "Stop Loss", val: `₹${fmt(entry.stop_loss)}`, c: "red"     },
            { label: "Target 1",  val: `₹${fmt(entry.target_1)}`,  c: "emerald" },
            { label: "Target 2",  val: `₹${fmt(entry.target_2)}`,  c: "emerald" },
          ].map((b) => (
            <div
              key={b.label}
              className={`p-2.5 sm:p-3 rounded-xl text-center ${b.c === "red" ? "bg-red-500/7 border border-red-500/18" : "bg-emerald-500/7 border border-emerald-500/18"}`}
            >
              <p className={`text-[9px] sm:text-[11px] tracking-wide mb-1 ${b.c === "red" ? "text-red-500/70" : "text-emerald-600/70"}`}>
                {b.label}
              </p>
              <p className={`font-mono text-xs sm:text-sm font-bold ${b.c === "red" ? "text-red-600" : "text-emerald-600"}`}>
                {b.val}
              </p>
            </div>
          ))}
        </div>
        {entry.rationale && (
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{entry.rationale}</p>
        )}
      </div>
    </Card>
  );
}


// ─── Support & Resistance ─────────────────────────────────────────────────────

function SRCard({ supports, resistances }: { supports: PriceLevel[]; resistances: PriceLevel[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {/* Support Column */}
      <Card>
        <div className="p-4 sm:p-5">
          <p className="text-[10px] sm:text-xs font-bold tracking-widest mb-3 sm:mb-4 text-emerald-600">
            ↑ SUPPORT
          </p>
          <div className="space-y-3 sm:space-y-4">
            {supports.map((l, i) => {
              const sl = l.strength.toLowerCase();
              const barCls = sl === "strong" ? "bg-emerald-500" : sl === "moderate" ? "bg-emerald-400/60" : "bg-emerald-500/20";
              return (
                <div key={i} className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-[3px] rounded-full self-stretch mt-0.5 ${barCls}`} style={{ minHeight: 40 }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 sm:gap-3">
                      <span className="font-mono text-base sm:text-lg font-bold text-foreground">₹{fmt(l.price)}</span>
                      <span className="text-[10px] sm:text-xs font-semibold text-emerald-500">
                        {l.strength}
                      </span>
                    </div>
                    {l.note && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">{l.note}</p>}
                  </div>
                </div>
              );
            })}
            {supports.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">No support levels identified</p>
            )}
          </div>
        </div>
      </Card>

      {/* Resistance Column */}
      <Card>
        <div className="p-4 sm:p-5">
          <p className="text-[10px] sm:text-xs font-bold tracking-widest mb-3 sm:mb-4 text-red-500">
            ↓ RESISTANCE
          </p>
          <div className="space-y-3 sm:space-y-4">
            {resistances.map((l, i) => {
              const sl = l.strength.toLowerCase();
              const barCls = sl === "strong" ? "bg-red-500" : sl === "moderate" ? "bg-red-400/60" : "bg-red-500/20";
              return (
                <div key={i} className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-[3px] rounded-full self-stretch mt-0.5 ${barCls}`} style={{ minHeight: 40 }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 sm:gap-3">
                      <span className="font-mono text-base sm:text-lg font-bold text-foreground">₹{fmt(l.price)}</span>
                      <span className="text-[10px] sm:text-xs font-semibold text-red-500">
                        {l.strength}
                      </span>
                    </div>
                    {l.note && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">{l.note}</p>}
                  </div>
                </div>
              );
            })}
            {resistances.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">No resistance levels identified</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Observations ─────────────────────────────────────────────────────────────

function ObservationsCard({ items }: { items: string[] }) {
  return (
    <Card>
      {items.map((obs, i) => (
        <div key={i}>
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="font-mono text-[10px] sm:text-xs font-bold text-cyan-500">{i + 1}</span>
            </div>
            <p className="text-sm sm:text-base text-foreground leading-relaxed">{obs}</p>
          </div>
          {i < items.length - 1 && <div className="border-t border-border mx-4 sm:mx-5" />}
        </div>
      ))}
    </Card>
  );
}

// ─── Indicators & Volume ──────────────────────────────────────────────────────

function IndicatorsCard({ indicators, volume }: { indicators: string; volume: string }) {
  return (
    <Card>
      <div className="p-4 sm:p-5">
        <p className="text-[10px] sm:text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2 sm:mb-3">Indicators</p>
        <p className="text-sm sm:text-base text-foreground leading-relaxed">{indicators}</p>
      </div>
      {volume && (
        <>
          <Divider />
          <div className="p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2 sm:mb-3">Volume</p>
            <p className="text-sm sm:text-base text-foreground leading-relaxed">{volume}</p>
          </div>
        </>
      )}
    </Card>
  );
}

// ─── Risk card ────────────────────────────────────────────────────────────────

function RiskCard({ risks }: { risks: string[] }) {
  return (
    <Card className="border-red-500/20">
      {risks.map((r, i) => (
        <div key={i}>
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[9px] sm:text-[11px] font-bold text-red-500">!</span>
            </div>
            <p className="text-sm sm:text-base text-foreground leading-relaxed">{r}</p>
          </div>
          {i < risks.length - 1 && <div className="border-t border-border mx-4 sm:mx-5" />}
        </div>
      ))}
    </Card>
  );
}

// ─── Data sources ─────────────────────────────────────────────────────────────

function DataSourcesCard({ checks, found, total }: { checks: FetchCheck[]; found: number; total: number }) {
  const [open, setOpen] = useState(false);
  const ratio    = total > 0 ? found / total : 0;
  const barColor = ratio === 1 ? "#10b981" : ratio > 0.5 ? "#f59e0b" : "#ef4444";

  return (
    <Card>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-muted/40 transition-colors"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ratio === 1 ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
          <Database size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-semibold text-foreground">{found} of {total} sources available</p>
          <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${ratio * 100}%`, background: barColor }} />
          </div>
        </div>
        {open
          ? <ChevronUp size={16} className="text-muted-foreground shrink-0" />
          : <ChevronDown size={16} className="text-muted-foreground shrink-0" />
        }
      </button>

      {open && (
        <>
          <Divider />
          <div className="p-4 sm:p-5 space-y-2.5">
            {checks.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                {c.found
                  ? <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                  : <AlertTriangle size={14} className="text-red-400 shrink-0" />
                }
                <span className="font-mono text-xs sm:text-sm text-foreground flex-1 truncate">{c.source}</span>
                {c.count > 0 && <span className="font-mono text-[11px] sm:text-xs text-muted-foreground">{c.count} rows</span>}
                {!c.found && <span className="font-mono text-[11px] sm:text-xs text-red-400">missing</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function AnalysisContent({
  data,
  symbol,
  onRefresh,
}: {
  data: StockAnalysis;
  symbol: string;
  onRefresh: () => void;
}) {
  const isUp = data.day_change_pct >= 0;

  const sparkline = Array.from({ length: 24 }, (_, i) => {
    const noise = (Math.random() - 0.5) * data.current_price * 0.012;
    return data.current_price + noise + (isUp ? i * 0.4 : -i * 0.4);
  });

  const tvSymbol = symbol.replace("NSE:", "").replace("-EQ", "").replace("-BE", "");
  const tvUrl    = `https://in.tradingview.com/chart/?symbol=NSE%3A${tvSymbol}`;
  const hasAlerts =
    data.alert_analysis.triggered_alerts.length > 0 ||
    data.alert_analysis.pending_alerts.length > 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Symbol bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link href={`/stocks/${data.symbol}`}>
          <span className="font-mono font-bold text-base sm:text-lg text-foreground cursor-pointer hover:underline">
            {data.symbol}
          </span>
        </Link>
        {data.company_name && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-sm sm:text-base text-muted-foreground truncate flex-1">{data.company_name}</span>
          </>
        )}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-amber-500/7 border border-amber-500/20">
        <Info size={14} className="text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 leading-snug">
          For educational purposes only. Not financial advice. Consult a SEBI-registered advisor.
        </p>
      </div>

      {/* Hero */}
      <section>
        <SectionLabel icon={<Activity size={14} />} label="Overview" color="text-cyan-500" />
        <HeroCard data={data} sparkline={sparkline} onRefresh={onRefresh} tvUrl={tvUrl} />
      </section>

      {/* Screener */}
      {(data.screener_analysis.bullish_count + data.screener_analysis.bearish_count) > 0 && (
        <section>
          <SectionLabel icon={<Zap size={14} />} label="Screener Signals" color="text-violet-500" />
          <ScreenerCard sa={data.screener_analysis} />
        </section>
      )}

      {/* Alerts */}
      {hasAlerts && (
        <section>
          <SectionLabel icon={<AlertTriangle size={14} />} label="Active Alerts" color="text-amber-500" />
          <AlertCard alert={data.alert_analysis} />
        </section>
      )}

      {/* Entry opportunities */}
      {data.entry_opportunities.length > 0 && (
        <section>
          <SectionLabel icon={<Target size={14} />} label="Entry Opportunities" color="text-emerald-600" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {data.entry_opportunities.map((e, i) => (
              <EntryCard key={i} entry={e} />
            ))}
          </div>
        </section>
      )}

      {/* Support & Resistance */}
      {(data.support_levels.length > 0 || data.resistance_levels.length > 0) && (
        <section>
          <SectionLabel icon={<Layers size={14} />} label="Support & Resistance" />
          <SRCard supports={data.support_levels} resistances={data.resistance_levels} />
        </section>
      )}

      {/* Key Observations */}
      {data.key_observations.length > 0 && (
        <section>
          <SectionLabel icon={<Info size={14} />} label="Key Observations" color="text-amber-500" />
          <ObservationsCard items={data.key_observations} />
        </section>
      )}

      {/* Indicators & Volume */}
      {(data.indicator_summary || data.volume_analysis) && (
        <section>
          <SectionLabel icon={<BarChart2 size={14} />} label="Indicators & Volume" color="text-blue-500" />
          <IndicatorsCard indicators={data.indicator_summary} volume={data.volume_analysis} />
        </section>
      )}

      {/* Risk Factors */}
      {data.risk_factors.length > 0 && (
        <section>
          <SectionLabel icon={<ShieldAlert size={14} />} label="Risk Factors" color="text-red-500" />
          <RiskCard risks={data.risk_factors} />
        </section>
      )}

      {/* Data Sources */}
      <section>
        <SectionLabel icon={<Database size={14} />} label="Data Sources" />
        <DataSourcesCard
          checks={data.fetch_status.checks}
          found={data.fetch_status.found_count}
          total={data.fetch_status.total}
        />
      </section>

      {/* Meta */}
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl bg-muted/50 border border-border">
        <Clock size={13} className="text-muted-foreground shrink-0" />
        <span className="font-mono text-[10px] sm:text-xs text-muted-foreground flex-1">{data.last_updated}</span>
        <Chip
          label={data.cached ? "⚡ Cached" : "🤖 Live AI"}
          className={data.cached
            ? "text-amber-600 bg-amber-500/10 border-amber-500/25"
            : "text-cyan-600 bg-cyan-500/10 border-cyan-500/25"
          }
        />
      </div>
    </div>
  );
}

// ─── Inner (reads search params) ─────────────────────────────────────────────

function StockAiSummaryInner() {
  const searchParams = useSearchParams();
  const symbol = searchParams?.get("symbol") ?? "";

  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [step, setStep]   = useState(0);
  const [data, setData]   = useState<StockAnalysis | null>(null);
  const [error, setError] = useState("");
  const stepRef           = useRef(0);

  const load = async () => {
    setState("loading");
    setStep(0);
    stepRef.current = 0;
    setData(null);
    setError("");

    const interval = setInterval(() => {
      stepRef.current += 1;
      if (stepRef.current < STEPS.length - 1) setStep(stepRef.current);
      else clearInterval(interval);
    }, 420);

    try {
      const apiBase = process.env.NEXT_PUBLIC_AI_SUMMARY_URL ?? "/api";
      const res     = await fetch(`${apiBase}/analysis/${encodeURIComponent(symbol)}`, {
        signal: AbortSignal.timeout(60_000),
      });

      clearInterval(interval);
      setStep(STEPS.length - 1);
      await new Promise((r) => setTimeout(r, 380));

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail ?? `Server error ${res.status}`);
      }

      const json = await res.json();
      const d    = json.data ?? json;

      const normalised: StockAnalysis = {
        symbol:              d.symbol              ?? symbol,
        company_name:        d.company_name        ?? "",
        market_sentiment:    d.market_sentiment    ?? "",
        sentiment_emoji:     d.sentiment_emoji     ?? "🟡",
        one_liner:           d.one_liner           ?? "",
        current_price:       Number(d.current_price  ?? 0),
        day_change_pct:      Number(d.day_change_pct  ?? 0),
        support_levels:      d.support_levels      ?? [],
        resistance_levels:   d.resistance_levels   ?? [],
        entry_opportunities: d.entry_opportunities ?? [],
        key_observations:    d.key_observations    ?? [],
        risk_factors:        d.risk_factors        ?? [],
        volume_analysis:     d.volume_analysis     ?? "",
        indicator_summary:   d.indicator_summary   ?? "",
        timeframe:           d.timeframe           ?? "",
        confidence:          d.confidence          ?? "",
        last_updated:        d.last_updated        ?? "",
        screener_analysis: json.screener_analysis ?? {
          bullish_signals: [], bearish_signals: [],
          bullish_count: 0, bearish_count: 0,
          screener_bias: "Neutral", strong_signal: false, signal_summary: "",
        },
        alert_analysis: json.alert_analysis ?? {
          triggered_alerts: [], pending_alerts: [],
          proximity_notes: [], alert_summary: "",
        },
        fetch_status: json.fetch_status ?? { checks: [], found_count: 0, total: 0 },
        cached:       json.cached       ?? false,
        ttl_seconds:  json.ttl_seconds,
      };

      setData(normalised);
      setState("success");
    } catch (e: unknown) {
      clearInterval(interval);
      setError(e instanceof Error ? e.message : String(e));
      setState("error");
    }
  };

  useEffect(() => {
    if (symbol) load();
    else setState("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  if (!symbol || state === "idle")
    return <StockSearchEmptyState />;

  if (state === "loading") return <LoadingView symbol={symbol} step={step} />;
  if (state === "error")   return <ErrorView symbol={symbol} error={error} onRetry={load} />;
  if (state === "success" && data)
    return <AnalysisContent data={data} symbol={symbol} onRefresh={load} />;

  return null;
}

export default function StockAiSummaryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 size={20} className="text-cyan-500 animate-spin" />
        </div>
      }
    >
      <StockAiSummaryInner />
    </Suspense>
  );
}