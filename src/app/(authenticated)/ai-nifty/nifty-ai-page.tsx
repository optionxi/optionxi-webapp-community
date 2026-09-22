"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Brain,
  ShieldCheck,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  CandlestickChart,
  Layers,
  ChevronRight,
  Info,
  Loader2,
  Link as LinkIcon,
  BarChart,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CandlePoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface NiftySummary {
  cached: boolean;
  ttl_seconds?: number;
  market_open: boolean;
  data: {
    last_updated: string;
    nifty_ltp: number;
    nifty_day_change_pct: number;
    market_sentiment: string;
    sentiment_emoji: string;
    one_liner: string;
    short_term_trend: string;
    intraday_bias: string;
    confidence: string;
    timeframe: string;
    probability_score: number;
    key_levels: { support: number[]; resistance: number[] };
    trade_idea: Record<string, unknown>;
    key_observations: string[];
    risk_factors: string[];
    atlas_interpretation: string;
    bollinger_interpretation: string;
    chartink_interpretation: string;
    nifty5min_interpretation: string;
    vix_interpretation: string;
    advancing_declining_ratio: string;
  };
  signal_verdict: Record<string, unknown>;
  bollinger_analysis: Record<string, unknown>;
  atlas_analysis: Record<string, unknown>;
  chartink_analysis: Record<string, unknown>;
  nifty_5min_summary: Record<string, unknown>;
  vix_analysis: Record<string, unknown>;
  vix_summary: Record<string, unknown>;
  live_nifty_indices: Array<Record<string, unknown>>;
  live_fno: Array<Record<string, unknown>>;
  nifty_5min_candles: CandlePoint[];
  vix_5min_candles: CandlePoint[];
}

// ─── Loading steps ─────────────────────────────────────────────────────────────

const STEPS = [
  { icon: "link", label: "Connecting", sub: "Market data & version check" },
  { icon: "candle", label: "Nifty 5-min data", sub: "Yahoo Finance live candles" },
  { icon: "shield", label: "VIX Analysis", sub: "India VIX volatility index" },
  { icon: "hub", label: "ATLAS Indicators", sub: "Advancing · Declining · Probability" },
  { icon: "bubble", label: "Bollinger Bands", sub: "Signal freshness check" },
  { icon: "bar", label: "Chartink Signals", sub: "Probability scores" },
  { icon: "chart", label: "Live Indices", sub: "Nifty · BankNifty · VIX · IT · Midcap" },
  { icon: "brain", label: "AI Analysis", sub: "LLaMA 4 Scout generating insights" },
];

// ─── Helper fns ───────────────────────────────────────────────────────────────

function confidenceBg(c: string) {
  const map: Record<string, string> = {
    strong: "bg-emerald-500",
    moderate: "bg-amber-500",
    weak: "bg-orange-500",
    avoid: "bg-red-500",
  };
  return map[c.toLowerCase()] ?? "bg-muted";
}

function sentimentColor(s: string) {
  if (s === "Bullish" || s === "Uptrend") return "text-emerald-500";
  if (s === "Bearish" || s === "Downtrend") return "text-red-500";
  return "text-amber-500";
}

function freshnessColor(l: string) {
  if (l === "fresh") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/25";
  if (l === "aging") return "text-amber-500 bg-amber-500/10 border-amber-500/25";
  return "text-red-500 bg-red-500/10 border-red-500/25";
}

// ─── Sparkline SVG ────────────────────────────────────────────────────────────

function Sparkline({
  candles,
  color,
  height = 72,
}: {
  candles: CandlePoint[];
  color: string;
  height?: number;
}) {
  if (!candles.length) return null;
  const values = candles.map((c) => c.close);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 300;
  const h = height;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h * 0.85 - h * 0.075;
      return `${x},${y}`;
    })
    .join(" ");
  const fill = `${pts} ${w},${h} 0,${h}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height }}
    >
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#sg-${color})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// ─── Mini candlestick chart ───────────────────────────────────────────────────

function CandleChart({ candles, height = 160 }: { candles: CandlePoint[]; height?: number }) {
  if (!candles.length)
    return (
      <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
        No intraday data
      </div>
    );

  const sliced = candles.slice(-60);
  const highs = sliced.map((c) => c.high);
  const lows = sliced.map((c) => c.low);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const range = max - min || 1;
  const W = 400;
  const H = height;
  const pad = 4;
  const bw = Math.max(2, (W - pad * 2) / sliced.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      {sliced.map((c, i) => {
        const x = pad + i * ((W - pad * 2) / sliced.length);
        const isUp = c.close >= c.open;
        const col = isUp ? "#10b981" : "#ef4444";
        const yo = H - ((Math.max(c.open, c.close) - min) / range) * H * 0.9 - H * 0.05;
        const yc = H - ((Math.min(c.open, c.close) - min) / range) * H * 0.9 - H * 0.05;
        const yh = H - ((c.high - min) / range) * H * 0.9 - H * 0.05;
        const yl = H - ((c.low - min) / range) * H * 0.9 - H * 0.05;
        const cx = x + bw / 2;
        return (
          <g key={i}>
            <line x1={cx} y1={yh} x2={cx} y2={yl} stroke={col} strokeWidth="0.8" />
            <rect x={x} y={yo} width={bw} height={Math.max(1, yc - yo)} fill={col} rx="0.5" />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Step icon ────────────────────────────────────────────────────────────────

function StepIcon({ icon, size = 16 }: { icon: string; size?: number }) {
  const map: Record<string, React.ReactNode> = {
    link: <LinkIcon size={size} />,
    candle: <CandlestickChart size={size} />,
    shield: <ShieldCheck size={size} />,
    hub: <Activity size={size} />,
    bubble: <Zap size={size} />,
    bar: <BarChart size={size} />,
    chart: <TrendingUp size={size} />,
    brain: <Brain size={size} />,
  };
  return <span>{map[icon] ?? <Activity size={size} />}</span>;
}

// ─── Loader ───────────────────────────────────────────────────────────────────

function LoadingView({ stepIndex }: { stepIndex: number }) {
  const step = STEPS[Math.min(stepIndex, STEPS.length - 1)];
  const pct = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  return (
    <div className="flex flex-col items-center px-4 md:px-6 py-8 md:py-12 max-w-lg md:max-w-xl mx-auto w-full">
      {/* Spinner */}
      <div className="relative flex items-center justify-center mb-8" style={{ width: 96, height: 96 }}>
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-spin" style={{ borderTopColor: "#3b82f6", animationDuration: "2s" }} />
        <div className="absolute rounded-full border border-violet-500/20 animate-spin" style={{ width: 68, height: 68, borderTopColor: "#8b5cf6", animationDuration: "3.2s", animationDirection: "reverse" }} />
        <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-blue-500">
          <StepIcon icon={step.icon} size={20} />
        </div>
      </div>

      {/* Label */}
      <p className="text-xs font-semibold tracking-widest text-blue-500 mb-2 uppercase">Nifty 50 AI</p>
      <h2 className="text-lg md:text-xl font-bold text-foreground text-center mb-1">{step.label}</h2>
      <p className="text-sm md:text-base text-muted-foreground text-center mb-6">{step.sub}</p>

      {/* Progress */}
      <div className="w-full mb-1">
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between w-full mb-6">
        <span className="text-xs font-mono text-muted-foreground">{stepIndex + 1} of {STEPS.length}</span>
        <span className="text-xs font-mono text-blue-500 font-semibold">{pct}%</span>
      </div>

      {/* Steps list */}
      <div className="w-full rounded-xl border border-border bg-card overflow-hidden">
        {STEPS.map((s, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          const color = done ? "text-emerald-500" : active ? "text-blue-500" : "text-muted-foreground/40";
          return (
            <div key={i}>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${done ? "bg-emerald-500/10" : active ? "bg-blue-500/10" : "bg-muted/40"} ${color}`}>
                  <StepIcon icon={s.icon} size={14} />
                </div>
                <span className={`flex-1 text-sm ${active ? "font-semibold" : "font-normal"} ${color}`}>{s.label}</span>
                {done ? (
                  <CheckCircle size={14} className="text-emerald-500" />
                ) : active ? (
                  <Loader2 size={14} className="text-blue-500 animate-spin" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-border" />
                )}
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

function ErrorView({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
        <AlertTriangle size={24} className="text-red-500" />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">Could not load market data</h3>
      <p className="text-sm md:text-base text-muted-foreground mb-4">Check your connection and try again.</p>
      <div className="w-full max-w-sm bg-muted/60 rounded-lg border border-border p-4 text-left mb-6">
        <p className="font-mono text-xs md:text-sm text-muted-foreground leading-relaxed break-all">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs md:text-sm font-semibold border ${className}`}>
      {label}
    </span>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

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
      <span className={`${color}`} style={{ display: "flex" }}>{icon}</span>
      <span className={`text-xs font-bold tracking-wider uppercase ${color}`}>
        {label}
      </span>
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

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
      className={`rounded-2xl bg-card border overflow-hidden ${className}`}
      style={accent ? { borderColor: accent } : undefined}
    >
      {children}
    </div>
  );
}

// ─── Signal Verdict Card ──────────────────────────────────────────────────────

function SignalVerdictCard({ verdict }: { verdict: Record<string, unknown> }) {
  const confidence = (verdict.entry_confidence as string) ?? "Avoid";
  const bias = (verdict.overall_bias as string) ?? "Neutral";
  const text = (verdict.verdict as string) ?? "";
  const sources = (verdict.sources_actionable as number) ?? 0;
  const vixFear = verdict.vix_fear_active as boolean;
  const atlasOk = verdict.atlas_actionable as boolean;
  const bollOk = verdict.bollinger_actionable as boolean;
  const chartOk = verdict.chartink_actionable as boolean;
  const bgc = confidenceBg(confidence);

  return (
    <Card className="p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`px-2.5 py-1 rounded-lg text-xs md:text-sm font-bold tracking-wide text-white ${bgc}`}>
          {confidence.toUpperCase()}
        </span>
        <span className={`px-2.5 py-1 rounded-lg text-xs md:text-sm font-semibold border ${sentimentColor(bias)} bg-current/5`}>
          {bias}
        </span>
        {vixFear && (
          <span className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-red-500 bg-red-500/10">
            <AlertTriangle size={12} />
            VIX ↑
          </span>
        )}
      </div>

      <p className="text-sm md:text-base text-foreground/90 leading-relaxed mb-4">{text}</p>

      <div className="flex items-center gap-2 flex-wrap">
        {[
          { label: "ATLAS", active: atlasOk },
          { label: "Bollinger", active: bollOk },
          { label: "Chartink", active: chartOk },
        ].map((src) => (
          <span
            key={src.label}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
              src.active
                ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/25"
                : "text-muted-foreground bg-muted border-border"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${src.active ? "bg-emerald-500" : "bg-border"}`} />
            {src.label}
          </span>
        ))}
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          {sources}/3 active
        </span>
      </div>
    </Card>
  );
}

// ─── Nifty Price Card ─────────────────────────────────────────────────────────

function NiftyPriceCard({ summary }: { summary: NiftySummary }) {
  const d = summary.data;
  const isUp = d.nifty_day_change_pct >= 0;
  const cc = isUp ? "text-emerald-500" : "text-red-500";
  const bg = isUp ? "bg-emerald-500/10" : "bg-red-500/10";
  const sc = sentimentColor(d.market_sentiment);

  return (
    <Card className="p-5 md:p-6">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs tracking-wider text-muted-foreground mb-1.5">NIFTY 50</p>
          <p className="font-mono text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
            ₹{d.nifty_ltp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs md:text-sm font-semibold ${bg} ${cc}`}>
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isUp ? "+" : ""}{d.nifty_day_change_pct.toFixed(2)}% today
          </span>
        </div>
        <div className={`flex flex-col items-center px-4 py-3 rounded-xl border ${bg.replace("/10", "/20")} border-current/20`}>
          <span className="text-2xl md:text-3xl mb-1">{d.sentiment_emoji}</span>
          <span className={`text-xs md:text-sm font-bold ${sc}`}>{d.market_sentiment}</span>
        </div>
      </div>

      <div className="border-t border-border my-5" />

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "A:D", value: d.advancing_declining_ratio },
          {
            label: "Probability",
            value: `${d.probability_score.toFixed(1)}%`,
            color:
              d.probability_score > 60
                ? "text-emerald-500"
                : d.probability_score < 40
                ? "text-red-500"
                : "text-amber-500",
          },
          {
            label: "Trend",
            value: d.short_term_trend,
            color: sentimentColor(d.short_term_trend),
          },
          {
            label: "Confidence",
            value: d.confidence,
            color:
              d.confidence === "Strong"
                ? "text-emerald-500"
                : d.confidence === "Moderate"
                ? "text-amber-500"
                : "text-red-500",
          },
        ].map((cell, i) => (
          <div key={i} className={`flex flex-col ${i > 0 ? "border-l border-border pl-3" : ""}`}>
            <span className="text-xs text-muted-foreground/80 tracking-wide">{cell.label}</span>
            <span className={`font-mono text-sm md:text-base font-bold mt-1 truncate ${cell.color ?? "text-foreground"}`}>
              {cell.value}
            </span>
          </div>
        ))}
      </div>

      {d.one_liner && (
        <>
          <div className="border-t border-border mt-5 mb-3" />
          <div className="flex gap-2.5">
            <Brain size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{d.one_liner}</p>
          </div>
        </>
      )}
    </Card>
  );
}

// ─── Chart card ───────────────────────────────────────────────────────────────

function ChartCard({ summary }: { summary: NiftySummary }) {
  const isUp = summary.data.nifty_day_change_pct >= 0;
  const s5 = summary.nifty_5min_summary as Record<string, string>;
  const cc = isUp ? "text-emerald-500" : "text-red-500";
  const shortTermTrend = s5.short_term_trend as string | undefined;

  return (
    <Card>
      <div className="px-5 py-4 flex items-center justify-between border-b border-border">
        <div>
          <p className="text-sm md:text-base font-semibold text-foreground">Intraday · 5-min</p>
          <p className="text-xs text-muted-foreground">Yahoo Finance · ^NSEI</p>
        </div>
        {s5?.day_high && s5?.day_low && (
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-xs text-muted-foreground">H</p>
              <p className="font-mono text-sm font-semibold text-emerald-500">
                ₹{Number(s5.day_high).toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">L</p>
              <p className="font-mono text-sm font-semibold text-red-500">
                ₹{Number(s5.day_low).toFixed(0)}
              </p>
            </div>
          </div>
        )}
      </div>

      {s5?.ltp && (
        <div className="px-5 py-3 bg-muted/40 border-b border-border flex items-center gap-4 flex-wrap">
          <span className="font-mono text-xs md:text-sm text-muted-foreground">
            O: ₹{Number(s5.open ?? 0).toFixed(2)}
          </span>
          <span className={`font-mono text-xs md:text-sm font-bold ${cc}`}>
            LTP: ₹{Number(s5.ltp).toFixed(2)}
          </span>
          <span className={`font-mono text-xs md:text-sm ${cc}`}>
            Chg: {Number(s5.day_change ?? 0) >= 0 ? "+" : ""}
            {Number(s5.day_change ?? 0).toFixed(2)}
          </span>
          {shortTermTrend && (
            <Chip
              label={shortTermTrend}
              className={
                shortTermTrend.toLowerCase().includes("up")
                  ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/25"
                  : shortTermTrend.toLowerCase().includes("down")
                  ? "text-red-500 bg-red-500/10 border-red-500/25"
                  : "text-amber-500 bg-amber-500/10 border-amber-500/25"
              }
            />
          )}
        </div>
      )}

      <div className="px-2 pt-3 pb-2">
        <CandleChart candles={summary.nifty_5min_candles} height={200} />
      </div>

      {summary.data.nifty5min_interpretation && (
        <div className="px-5 pb-5 flex gap-2.5">
          <Brain size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary.data.nifty5min_interpretation}
          </p>
        </div>
      )}
    </Card>
  );
}

// ─── VIX Card ─────────────────────────────────────────────────────────────────

function VixCard({ summary }: { summary: NiftySummary }) {
  const vix = summary.vix_analysis as Record<string, unknown>;
  const ltp = Number(vix.ltp ?? 0);
  const trend = (vix.trend as string) ?? "Unknown";
  const level = (vix.level as string) ?? "Unknown";
  const fear = vix.fear_flag as boolean;
  const interp = (vix.interpretation as string) ?? "";
  const chgPct = Number(vix.day_change_pct ?? 0);
  const isUp = chgPct >= 0;
  const unavailable = !vix || !ltp || trend === "Unknown";

  if (unavailable)
    return (
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border flex items-center justify-center">
            <ShieldCheck size={18} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest text-muted-foreground">INDIA VIX</p>
            <p className="text-sm md:text-base text-muted-foreground">No VIX data available</p>
          </div>
        </div>
      </Card>
    );

  const levelColor =
    level === "Extreme" || level === "High"
      ? "text-red-500 bg-red-500/10 border-red-500/25"
      : level === "Moderate"
      ? "text-amber-500 bg-amber-500/10 border-amber-500/25"
      : "text-emerald-500 bg-emerald-500/10 border-emerald-500/25";

  return (
    <Card className="p-5 md:p-6" accent={fear ? "rgba(239,68,68,0.28)" : undefined}>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <p className="font-mono text-xs tracking-widest text-muted-foreground mb-1">INDIA VIX</p>
          <p className="font-mono text-3xl md:text-4xl font-bold text-foreground">{ltp.toFixed(2)}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            {isUp ? (
              <TrendingUp size={14} className="text-red-500" />
            ) : (
              <TrendingDown size={14} className="text-emerald-500" />
            )}
            <span className={`text-sm md:text-base font-semibold ${isUp ? "text-red-500" : "text-emerald-500"}`}>
              {isUp ? "+" : ""}{chgPct.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Chip label={level} className={levelColor} />
          <Chip
            label={trend}
            className={
              trend === "Uptrend"
                ? "text-red-500 bg-red-500/10 border-red-500/25"
                : trend === "Downtrend"
                ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/25"
                : "text-amber-500 bg-amber-500/10 border-amber-500/25"
            }
          />
        </div>
      </div>

      {summary.vix_5min_candles.length > 0 && (
        <div className="mt-4 -mx-2">
          <Sparkline
            candles={summary.vix_5min_candles}
            color={fear ? "#ef4444" : "#10b981"}
            height={80}
          />
        </div>
      )}

      {interp && (
        <div className="border-t border-border mt-4 pt-4 flex gap-2.5">
          {fear ? (
            <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
          ) : (
            <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
          )}
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{interp}</p>
        </div>
      )}
    </Card>
  );
}

// ─── Atlas Card ───────────────────────────────────────────────────────────────

function AtlasCard({ summary }: { summary: NiftySummary }) {
  const atlas = summary.atlas_analysis as Record<string, unknown>;
  const freshness = (atlas.freshness as Record<string, unknown>) ?? {};
  const pos = Number(atlas.positive_indicators ?? 0);
  const neg = Number(atlas.negative_indicators ?? 0);
  const adv = Number(atlas.advancing ?? 0);
  const dec = Number(atlas.declining ?? 0);
  const prob = Number(atlas.probability ?? 0);
  const trend = (atlas.trend as string) ?? "Neutral";
  const actionable = atlas.actionable as boolean;
  const advice = (atlas.action_advice as string) ?? "";
  const freshnessLabel = (freshness.label as string) ?? "unknown";
  const ageMin = freshness.age_minutes as number;
  const entry = atlas.entry_signal === true;
  const upbreak = atlas.upbreakout === true;
  const probStrong = atlas.probability_strong as boolean;

  return (
    <Card className={`p-5 md:p-6 ${actionable ? "border-violet-500/30" : ""}`}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${freshnessColor(freshnessLabel)}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {freshnessLabel.charAt(0).toUpperCase() + freshnessLabel.slice(1)}
          {ageMin != null ? ` · ${Math.round(ageMin)}m ago` : ""}
        </span>
        <span
          className={`ml-auto px-2.5 py-1 rounded-md text-xs font-bold font-mono border ${
            probStrong
              ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/25"
              : "text-muted-foreground bg-muted border-border"
          }`}
        >
          {prob.toFixed(1)}%{probStrong ? " ✓" : ""}
        </span>
        <Chip label={trend} className={`${sentimentColor(trend)} bg-current/5 border-current/20`} />
      </div>

      <div className="flex justify-between mb-2">
        <span className="text-xs font-semibold text-emerald-500">▲ {adv} Advancing</span>
        <span className="text-xs font-semibold text-red-500">▼ {dec} Declining</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden bg-red-500/15 mb-5">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: `${adv + dec > 0 ? (adv / (adv + dec)) * 100 : 50}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-2.5 mb-5">
        <span className="px-3 py-1.5 rounded-lg text-sm md:text-base font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 font-mono">
          {pos} <span className="text-xs font-normal opacity-70">+ve</span>
        </span>
        <span className="px-3 py-1.5 rounded-lg text-sm md:text-base font-bold text-red-600 bg-red-500/10 border border-red-500/20 font-mono">
          {neg} <span className="text-xs font-normal opacity-70">-ve</span>
        </span>
        {entry && (
          <Chip label="⚡ Entry" className="text-blue-600 bg-blue-500/10 border-blue-500/25" />
        )}
        {upbreak && (
          <Chip label="🔼 Breakout" className="text-emerald-600 bg-emerald-500/10 border-emerald-500/25" />
        )}
      </div>

      {advice && (
        <div className="bg-muted/60 rounded-lg border border-border px-4 py-3 text-sm text-foreground mb-4 leading-relaxed">
          {advice}
        </div>
      )}

      {summary.data.atlas_interpretation && (
        <div className="border-t border-border pt-4 flex gap-2.5">
          <Brain size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary.data.atlas_interpretation}
          </p>
        </div>
      )}
    </Card>
  );
}

// ─── Bollinger Card ───────────────────────────────────────────────────────────

function BollingerCard({ summary }: { summary: NiftySummary }) {
  const boll = summary.bollinger_analysis as Record<string, unknown>;
  const actionable = boll.actionable as boolean;
  const advice = (boll.action_advice as string) ?? "";
  const bias = (boll.bias as string) ?? "Neutral";
  const bkFresh = Number(boll.breakout_fresh_count ?? 0);
  const cfFresh = Number(boll.checkfirst_fresh_count ?? 0);
  const bkSigs = ((boll.breakout_signals as unknown[]) ?? []).slice(0, 3) as Record<string, unknown>[];
  const cfSigs = ((boll.checkfirst_signals as unknown[]) ?? []).slice(0, 3) as Record<string, unknown>[];

  return (
    <Card className={`p-5 md:p-6 ${actionable ? "border-teal-500/30" : ""}`}>
      <div className="flex flex-wrap gap-2 mb-5">
        <Chip label={bias} className={`${sentimentColor(bias)} bg-current/5 border-current/20`} />
        {bkFresh > 0 && (
          <Chip
            label={`💥 ${bkFresh} fresh breakout`}
            className="text-teal-600 bg-teal-500/10 border-teal-500/25"
          />
        )}
        {cfFresh > 0 && (
          <Chip
            label={`🔍 ${cfFresh} fresh check`}
            className="text-violet-600 bg-violet-500/10 border-violet-500/25"
          />
        )}
      </div>

      {advice && (
        <div className="bg-muted/60 rounded-lg border border-border px-4 py-3 text-sm text-foreground mb-4 leading-relaxed">
          {advice}
        </div>
      )}

      {(bkSigs.length > 0 || cfSigs.length > 0) && (
        <div className="border-t border-border pt-4 space-y-4">
          {bkSigs.length > 0 && (
            <div>
              <p className="text-xs font-bold tracking-wide text-teal-600 mb-2">BREAKOUT</p>
              {bkSigs.map((s, i) => (
                <SignalRow key={i} signal={s} color="teal" />
              ))}
            </div>
          )}
          {cfSigs.length > 0 && (
            <div>
              <p className="text-xs font-bold tracking-wide text-violet-600 mb-2">
                CHECK FIRST
              </p>
              {cfSigs.map((s, i) => (
                <SignalRow key={i} signal={s} color="violet" />
              ))}
            </div>
          )}
        </div>
      )}

      {summary.data.bollinger_interpretation && (
        <div className="border-t border-border pt-4 flex gap-2.5 mt-4">
          <Brain size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary.data.bollinger_interpretation}
          </p>
        </div>
      )}
    </Card>
  );
}

function SignalRow({ signal, color }: { signal: Record<string, unknown>; color: string }) {
  const fresh = signal._freshness as Record<string, unknown> | undefined;
  const fl = (fresh?.label as string) ?? "";
  const dotColor = color === "teal" ? "bg-teal-500" : "bg-violet-500";
  const flColor =
    fl === "fresh" ? "bg-emerald-500" : fl === "aging" ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-2 mb-2">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span className="flex-1 text-sm text-foreground">{String(signal.description ?? "")}</span>
      {fl && <span className={`w-2 h-2 rounded-full shrink-0 ${flColor}`} />}
      <span className="font-mono text-xs text-muted-foreground">
        {String(signal.time ?? "")}
      </span>
    </div>
  );
}

// ─── Chartink Card ────────────────────────────────────────────────────────────

function ChartinkCard({ summary }: { summary: NiftySummary }) {
  const ci = summary.chartink_analysis as Record<string, unknown>;
  const avg = Number(ci.avg_probability ?? 0);
  const fresh = Number(ci.fresh_count ?? 0);
  const actionable = ci.actionable as boolean;
  const advice = (ci.action_advice as string) ?? "";
  const bc = Number(ci.bullish_count ?? 0);
  const berc = Number(ci.bearish_count ?? 0);
  const latest = ((ci.latest as unknown[]) ?? []).slice(0, 5) as Record<string, unknown>[];
  const probColor =
    avg > 60 ? "text-emerald-500" : avg < 40 ? "text-red-500" : "text-amber-500";

  return (
    <Card className={`p-5 md:p-6 ${actionable ? "border-orange-500/30" : ""}`}>
      <div className="flex items-center gap-4 mb-5">
        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-lg text-sm md:text-base font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 font-mono">
            {bc} <span className="text-xs opacity-70">↑</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg text-sm md:text-base font-bold text-red-600 bg-red-500/10 border border-red-500/20 font-mono">
            {berc} <span className="text-xs opacity-70">↓</span>
          </span>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-muted-foreground">Avg Prob</p>
          <p className={`font-mono text-2xl md:text-3xl font-bold ${probColor}`}>{avg.toFixed(1)}%</p>
        </div>
      </div>

      {fresh > 0 && (
        <Chip
          label={`⚡ ${fresh} fresh signal${fresh > 1 ? "s" : ""} (<5min)`}
          className="text-orange-600 bg-orange-500/10 border-orange-500/25 mb-4"
        />
      )}

      {advice && (
        <div className="bg-muted/60 rounded-lg border border-border px-4 py-3 text-sm text-foreground mb-4 leading-relaxed">
          {advice}
        </div>
      )}

      {latest.length > 0 && (
        <div className="border-t border-border pt-4">
          <p className="text-xs font-bold tracking-wide text-orange-600 mb-3">
            LATEST SIGNALS
          </p>
          {latest.map((s, i) => {
            const sent = ((s.sentiment as string) ?? "").toLowerCase();
            const dotColor =
              sent === "bullish"
                ? "bg-emerald-500"
                : sent === "bearish"
                ? "bg-red-500"
                : "bg-amber-500";
            const textColor =
              sent === "bullish"
                ? "text-emerald-600"
                : sent === "bearish"
                ? "text-red-600"
                : "text-amber-600";
            const fr = s._freshness as Record<string, unknown> | undefined;
            const fl = (fr?.label as string) ?? "";
            const flColor =
              fl === "fresh" ? "bg-emerald-500" : fl === "aging" ? "bg-amber-500" : "bg-red-500";
            return (
              <div key={i} className="flex items-center gap-2 mb-2.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                <span className="flex-1 text-sm text-foreground">
                  {String(s.description ?? "")}
                </span>
                {fl && <span className={`w-2 h-2 rounded-full shrink-0 ${flColor}`} />}
                <span className={`font-mono text-sm font-bold ${textColor}`}>
                  {Number(s.probability ?? 0).toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      )}

      {summary.data.chartink_interpretation && (
        <div className="border-t border-border pt-4 flex gap-2.5 mt-4">
          <Brain size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary.data.chartink_interpretation}
          </p>
        </div>
      )}
    </Card>
  );
}

// ─── Trade Card ───────────────────────────────────────────────────────────────

function TradeCard({ idea }: { idea: Record<string, unknown> }) {
  const dir = (idea.direction as string) ?? "Wait";
  const entry = (idea.entry_zone as string) ?? "—";
  const sl = Number(idea.stop_loss ?? 0);
  const t1 = Number(idea.target_1 ?? 0);
  const t2 = Number(idea.target_2 ?? 0);
  const rat = (idea.rationale as string) ?? "";
  const isWait = dir === "Wait" || dir === "wait";
  const bgBadge =
    dir === "Long" ? "bg-emerald-500" : dir === "Short" ? "bg-red-500" : "bg-amber-500";

  if (isWait)
    return (
      <Card className="p-5 md:p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Clock size={20} className="text-amber-500" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">No trade setup right now</p>
            <p className="text-sm text-muted-foreground">Conditions not yet met for entry</p>
          </div>
        </div>
        {rat && (
          <div className="bg-muted/60 rounded-lg border border-border px-4 py-3 flex gap-2.5">
            <Brain size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">{rat}</p>
          </div>
        )}
      </Card>
    );

  return (
    <Card className={`${dir === "Long" ? "border-emerald-500/25" : "border-red-500/25"}`}>
      <div
        className={`px-5 py-3 flex items-center gap-3 ${
          dir === "Long" ? "bg-emerald-500/5" : "bg-red-500/5"
        } border-b border-border`}
      >
        <span className={`px-4 py-1.5 rounded-lg text-sm md:text-base font-bold text-white ${bgBadge}`}>
          {dir}
        </span>
        <span className="font-mono text-sm md:text-base text-muted-foreground">Entry: {entry}</span>
      </div>
      <div className="p-5 md:p-6">
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Stop Loss", value: `₹${sl.toFixed(0)}`, color: "red" },
            { label: "Target 1", value: `₹${t1.toFixed(0)}`, color: "emerald" },
            { label: "Target 2", value: `₹${t2.toFixed(0)}`, color: "emerald" },
          ].map((box) => (
            <div
              key={box.label}
              className={`p-3 md:p-4 rounded-xl ${
                box.color === "red"
                  ? "bg-red-500/7 border border-red-500/18"
                  : "bg-emerald-500/7 border border-emerald-500/18"
              }`}
            >
              <p
                className={`text-xs tracking-wide mb-1 ${
                  box.color === "red" ? "text-red-600/75" : "text-emerald-600/75"
                }`}
              >
                {box.label}
              </p>
              <p
                className={`font-mono text-base md:text-lg font-bold ${
                  box.color === "red" ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {box.value}
              </p>
            </div>
          ))}
        </div>
        {rat && (
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{rat}</p>
        )}
      </div>
    </Card>
  );
}

// ─── Key Levels ───────────────────────────────────────────────────────────────

function KeyLevelsCard({
  support,
  resistance,
}: {
  support: number[];
  resistance: number[];
}) {
  return (
    <Card>
      {[
        { label: "SUPPORT", levels: support, color: "emerald" },
        { label: "RESISTANCE", levels: resistance, color: "red" },
      ].map((row, i) => (
        <div key={row.label} className={i > 0 ? "border-t border-border" : ""}>
          <div className="p-5 flex items-start gap-4">
            <div className="flex items-center gap-1 mt-1 shrink-0 w-28">
              {row.color === "emerald" ? (
                <TrendingUp size={14} className="text-emerald-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}
              <span
                className={`text-xs font-bold tracking-widest ${
                  row.color === "emerald" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {row.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {row.levels.slice(0, 6).map((l) => (
                <span
                  key={l}
                  className={`px-3 py-1 rounded-md font-mono text-sm md:text-base font-bold ${
                    row.color === "emerald"
                      ? "text-emerald-600 bg-emerald-500/7 border border-emerald-500/20"
                      : "text-red-600 bg-red-500/7 border border-red-500/20"
                  }`}
                >
                  ₹{l.toFixed(0)}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}

// ─── Live Indices ─────────────────────────────────────────────────────────────

function LiveIndicesCard({ indices }: { indices: Array<Record<string, unknown>> }) {
  if (!indices.length)
    return (
      <div className="flex items-center gap-2 p-5 rounded-xl bg-muted/60 border border-border text-sm text-muted-foreground">
        <Activity size={16} /> No live index data
      </div>
    );

  return (
    <Card>
      {indices.map((row, i) => {
        const pct = Number(row.pcnt ?? 0);
        const isUp = pct >= 0;
        const sym = String(row.symbol ?? "").toUpperCase();
        const isVix = sym.includes("VIX");
        const dispUp = isVix ? !isUp : isUp;
        const cc = dispUp ? "text-emerald-500" : "text-red-500";
        const bg = dispUp ? "bg-emerald-500/10" : "bg-red-500/10";

        return (
          <div key={i}>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-semibold text-foreground truncate">{sym}</p>
                {isVix && (
                  <p className="text-xs text-muted-foreground">Fear Index</p>
                )}
              </div>
              <span className="font-mono text-sm md:text-base text-foreground">
                ₹{Number(row.ltp ?? 0).toFixed(2)}
              </span>
              <span
                className={`px-2.5 py-1 rounded-md font-mono text-xs font-semibold ${cc} ${bg}`}
              >
                {isUp ? "+" : ""}{pct.toFixed(2)}%
              </span>
            </div>
            {i < indices.length - 1 && <div className="border-t border-border mx-5" />}
          </div>
        );
      })}
    </Card>
  );
}

// ─── List card (observations / risks) ────────────────────────────────────────

function ListCard({
  items,
  iconColor,
  numbered = false,
  accentBorder,
}: {
  items: string[];
  iconColor: string;
  numbered?: boolean;
  accentBorder?: string;
}) {
  return (
    <Card className={accentBorder ?? ""}>
      <div className="p-5 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <div
              className={`w-6 h-6 rounded-md shrink-0 flex items-center justify-center ${iconColor
                .replace("text-", "bg-")
                .replace("500", "500/10")}`}
            >
              {numbered ? (
                <span className={`${iconColor} text-xs font-bold`}>{i + 1}</span>
              ) : (
                <AlertTriangle size={12} className={iconColor} />
              )}
            </div>
            <p className="text-sm md:text-base text-foreground leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Meta card ────────────────────────────────────────────────────────────────

function MetaCard({ summary, onRefresh }: { summary: NiftySummary; onRefresh: () => void }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-muted/50 border border-border">
      <Clock size={16} className="text-muted-foreground shrink-0" />
      <span className="font-mono text-xs md:text-sm text-muted-foreground flex-1">
        {summary.data.last_updated}
      </span>
      <button
        onClick={onRefresh}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        title="Refresh data"
      >
        <RefreshCw size={16} className="text-muted-foreground" />
      </button>
      <Chip
        label={summary.cached ? "⚡ Cached" : "🤖 Live AI"}
        className={
          summary.cached
            ? "text-amber-600 bg-amber-500/10 border-amber-500/25"
            : "text-blue-600 bg-blue-500/10 border-blue-500/25"
        }
      />
    </div>
  );
}

// ─── Raw API response shape (all fields optional — the API is not reliable) ──

interface RawKeyLevels {
  support?: number[];
  resistance?: number[];
}

interface RawSummaryData {
  last_updated?: string;
  nifty_ltp?: number;
  nifty_day_change_pct?: number;
  market_sentiment?: string;
  sentiment_emoji?: string;
  one_liner?: string;
  short_term_trend?: string;
  intraday_bias?: string;
  confidence?: string;
  timeframe?: string;
  probability_score?: number;
  key_levels?: RawKeyLevels;
  trade_idea?: Record<string, unknown>;
  key_observations?: string[];
  risk_factors?: string[];
  atlas_interpretation?: string;
  bollinger_interpretation?: string;
  chartink_interpretation?: string;
  nifty5min_interpretation?: string;
  vix_interpretation?: string;
  advancing_declining_ratio?: string;
}

interface RawNiftySummary {
  cached?: boolean;
  ttl_seconds?: number;
  market_open?: boolean;
  data?: RawSummaryData;
  signal_verdict?: Record<string, unknown>;
  bollinger_analysis?: Record<string, unknown>;
  atlas_analysis?: Record<string, unknown>;
  chartink_analysis?: Record<string, unknown>;
  nifty_5min_summary?: Record<string, unknown>;
  vix_analysis?: Record<string, unknown>;
  vix_summary?: Record<string, unknown>;
  live_nifty_indices?: Array<Record<string, unknown>>;
  live_fno?: Array<Record<string, unknown>>;
  nifty_5min_candles?: CandlePoint[];
  vix_5min_candles?: CandlePoint[];
}

// ─── Normalizer ───────────────────────────────────────────────────────────────

function normalizeSummary(raw: RawNiftySummary): NiftySummary {
  const d = raw.data ?? {};
  return {
    cached: raw.cached ?? false,
    ttl_seconds: raw.ttl_seconds,
    market_open: raw.market_open ?? false,
    data: {
      last_updated: d.last_updated ?? "—",
      nifty_ltp: Number(d.nifty_ltp ?? 0),
      nifty_day_change_pct: Number(d.nifty_day_change_pct ?? 0),
      market_sentiment: d.market_sentiment ?? "Neutral",
      sentiment_emoji: d.sentiment_emoji ?? "⚪",
      one_liner: d.one_liner ?? "",
      short_term_trend: d.short_term_trend ?? "Neutral",
      intraday_bias: d.intraday_bias ?? "Neutral",
      confidence: d.confidence ?? "Weak",
      timeframe: d.timeframe ?? "",
      probability_score: Number(d.probability_score ?? 0),
      key_levels: {
        support: d.key_levels?.support ?? [],
        resistance: d.key_levels?.resistance ?? [],
      },
      trade_idea: d.trade_idea ?? {},
      key_observations: d.key_observations ?? [],
      risk_factors: d.risk_factors ?? [],
      atlas_interpretation: d.atlas_interpretation ?? "",
      bollinger_interpretation: d.bollinger_interpretation ?? "",
      chartink_interpretation: d.chartink_interpretation ?? "",
      nifty5min_interpretation: d.nifty5min_interpretation ?? "",
      vix_interpretation: d.vix_interpretation ?? "",
      advancing_declining_ratio: d.advancing_declining_ratio ?? "—",
    },
    signal_verdict: raw.signal_verdict ?? {},
    bollinger_analysis: raw.bollinger_analysis ?? {},
    atlas_analysis: raw.atlas_analysis ?? {},
    chartink_analysis: raw.chartink_analysis ?? {},
    nifty_5min_summary: raw.nifty_5min_summary ?? {},
    vix_analysis: raw.vix_analysis ?? {},
    vix_summary: raw.vix_summary ?? {},
    live_nifty_indices: raw.live_nifty_indices ?? [],
    live_fno: raw.live_fno ?? [],
    nifty_5min_candles: raw.nifty_5min_candles ?? [],
    vix_5min_candles: raw.vix_5min_candles ?? [],
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NiftyAiSummaryPage() {
  const [data, setData] = useState<NiftySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setError(null);
    setStepIndex(0);

    for (let i = 1; i < STEPS.length - 1; i++) {
      await new Promise((r) => setTimeout(r, 420));
      setStepIndex(i);
    }
    try {
      const apiBase = process.env.NEXT_PUBLIC_AI_NIFTYSUMMARY_URL ?? "";
      const res = await fetch(`${apiBase}/nifty-summary`);
      setStepIndex(STEPS.length - 1);
      await new Promise((r) => setTimeout(r, 380));

      if (res.ok) {
        const json = await res.json();
        setData(normalizeSummary(json));
        setLoading(false);
      } else {
        const b = await res.json().catch(() => ({}));
        setError(
          (b as Record<string, unknown>).detail?.toString() ?? `Server error ${res.status}`
        );
        setLoading(false);
      }
    } catch (e) {
      if (!mountedRef.current) return;
      setError(String(e));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="px-4 md:px-6">
        {loading ? (
          <LoadingView stepIndex={stepIndex} />
        ) : error ? (
          <ErrorView error={error} onRetry={load} />
        ) : data ? (
          <div className="space-y-6 md:space-y-8 pt-6 md:pt-8">
            {/* Disclaimer */}
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/7 border border-amber-500/20">
              <Info size={16} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs md:text-sm text-amber-600 dark:text-amber-400 leading-snug">
                For educational purposes only. Not financial advice. Consult a SEBI-registered
                advisor.
              </p>
            </div>

            {/* Signal Verdict */}
            <section>
              <SectionLabel
                icon={<Zap size={16} />}
                label="Signal Verdict"
                color="text-blue-500"
              />
              <SignalVerdictCard verdict={data.signal_verdict} />
            </section>

            {/* Price */}
            <section>
              <SectionLabel
                icon={<TrendingUp size={16} />}
                label="Nifty 50"
                color="text-emerald-600"
              />
              <NiftyPriceCard summary={data} />
            </section>

            {/* Chart */}
            <section>
              <SectionLabel
                icon={<CandlestickChart size={16} />}
                label="Nifty 5-Min Chart"
                color="text-blue-500"
              />
              <ChartCard summary={data} />
              <a
                href="https://in.tradingview.com/chart/?symbol=NSE%3ANIFTY"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm md:text-base font-semibold"
              >
                <CandlestickChart size={18} />
                View on TradingView
                <ChevronRight size={16} className="opacity-60" />
              </a>
            </section>

            {/* VIX */}
            <section>
              <SectionLabel
                icon={<ShieldCheck size={16} />}
                label="India VIX"
                color="text-violet-500"
              />
              <VixCard summary={data} />
            </section>

            {/* ATLAS */}
            <section>
              <SectionLabel
                icon={<Activity size={16} />}
                label="ATLAS Indicators"
                color="text-violet-500"
              />
              <AtlasCard summary={data} />
            </section>

            {/* Bollinger */}
            <section>
              <SectionLabel
                icon={<Zap size={16} />}
                label="Bollinger Breakouts"
                color="text-teal-500"
              />
              <BollingerCard summary={data} />
            </section>

            {/* Chartink */}
            <section>
              <SectionLabel
                icon={<BarChart size={16} />}
                label="Chartink Probability"
                color="text-orange-500"
              />
              <ChartinkCard summary={data} />
            </section>

            {/* Trade Setup */}
            <section>
              <SectionLabel
                icon={<ChevronRight size={16} />}
                label="Trade Setup"
                color="text-emerald-600"
              />
              <TradeCard idea={data.data.trade_idea as Record<string, unknown>} />
            </section>

            {/* Key Levels */}
            <section>
              <SectionLabel icon={<Layers size={16} />} label="Key Levels" />
              <KeyLevelsCard
                support={data.data.key_levels?.support ?? []}
                resistance={data.data.key_levels?.resistance ?? []}
              />
            </section>

            {/* Live Watchlist */}
            <section>
              <SectionLabel icon={<Activity size={16} />} label="Live Watchlist" />
              <LiveIndicesCard indices={data.live_nifty_indices} />
            </section>

            {/* Observations */}
            <section>
              <SectionLabel
                icon={<Info size={16} />}
                label="Key Observations"
                color="text-amber-500"
              />
              <ListCard
                items={data.data.key_observations}
                iconColor="text-amber-500"
                numbered
              />
            </section>

            {/* Risks */}
            {(data.data.risk_factors ?? []).length > 0 && (
              <section>
                <SectionLabel
                  icon={<AlertTriangle size={16} />}
                  label="Risk Factors"
                  color="text-red-500"
                />
                <ListCard
                  items={data.data.risk_factors}
                  iconColor="text-red-500"
                  accentBorder="border-red-500/18"
                />
              </section>
            )}

            {/* Meta */}
            <MetaCard summary={data} onRefresh={load} />
          </div>
        ) : null}
      </div>
    </div>
  );
}