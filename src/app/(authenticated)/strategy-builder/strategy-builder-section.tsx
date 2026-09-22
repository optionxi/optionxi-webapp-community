"use client";

import { supabase } from "@/lib/supabase/client";
/**
 * Strategy Builder — single-file page (v5).
 *
 * Drop this in as e.g. app/strategy-builder/page.tsx. It assumes a Supabase
 * browser client is already set up — adjust the import above to point at it.
 * Reads from two tables:
 *   - public.index_optionchain_historical  (option chain snapshots)
 *   - public.nifty_ohlcv                   (5-minute OHLCV candles, symbol
 *                                            is "NIFTY" or "BANKNIFTY")
 *
 * What's new vs v4:
 *  - Positions moved from a bottom sheet to a right-side cart drawer:
 *    a floating cart button (bottom-right) shows leg count + live P&L,
 *    tapping it slides in a right-anchored drawer with a backdrop.
 *  - Payoff chart now plots BOTH curves: the amber "Today (T+0)"
 *    mark-to-market curve (live IV, real days-to-expiry) and the blue
 *    "At expiry" intrinsic-only curve. The DTE slider only acts on the
 *    amber curve, as expiry payoff is by definition time-invariant.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────────────────
   Icons — tiny inline SVGs, no external dependency.
   ──────────────────────────────────────────────────────────────────────── */

function IconTriUp(props: { className?: string }) {
  return (
    <svg viewBox="0 0 10 8" fill="currentColor" className={props.className}>
      <path d="M5 0 10 8H0Z" />
    </svg>
  );
}

function IconTriDown(props: { className?: string }) {
  return (
    <svg viewBox="0 0 10 8" fill="currentColor" className={props.className}>
      <path d="M5 8 0 0h10Z" />
    </svg>
  );
}

function IconClose(props: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

function IconChevron(props: { dir: "left" | "right" | "up" | "down"; className?: string }) {
  const d: Record<string, string> = {
    left: "M9.5 3.5 5 8l4.5 4.5",
    right: "M6.5 3.5 11 8l-4.5 4.5",
    up: "M3.5 9.5 8 5l4.5 4.5",
    down: "M3.5 6.5 8 11l4.5-4.5",
  };
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d[props.dir]} />
    </svg>
  );
}

// function LogoMark({ className }: { className?: string }) {
//   return (
//     <svg viewBox="0 0 32 32" className={className} fill="none">
//       <rect width="32" height="32" rx="8" className="fill-amber-500 dark:fill-amber-400" />
//       <path
//         d="M8 21 12.5 14 17 18 24 8"
//         className="stroke-white dark:stroke-slate-950"
//         strokeWidth={2}
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         fill="none"
//       />
//       <circle cx="24" cy="8" r="1.6" className="fill-white dark:fill-slate-950" />
//     </svg>
//   );
// }

/* ────────────────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────────────────── */

type OptionType = "CE" | "PE";
type LegAction = "BUY" | "SELL";

/** Row shape matching public.index_optionchain_historical */
interface OptionChainRow {
  id: number;
  index_name: string;
  ts: string;
  expiry_date: string | null;
  atm_strike: number | null;
  strike_price: number | null;
  option_type: OptionType;
  ltp: number | null;
  close_price: number | null;
  bid_price: number | null;
  ask_price: number | null;
  oi: number | null;
  prev_oi: number | null;
  volume: number | null;
  iv: number | null;
}

interface ChainStrikeRow {
  strike: number;
  ce: OptionChainRow | null;
  pe: OptionChainRow | null;
}

interface ChainSnapshot {
  ts: string | null;
  atmStrike: number | null;
  rows: ChainStrikeRow[];
}

/** A single leg the user has added to the strategy. Local-only, in-memory. */
interface Leg {
  legId: string;
  strike: number;
  optionType: OptionType;
  action: LegAction;
  lots: number;
  entryPrice: number;
  entryIv: number | null;
  entryTs: string;
  entryExpiry: string | null;
  currentPrice: number | null;
  currentIv: number | null;
  currentTs: string | null;
  stale: boolean;
}

/** Row shape matching public.nifty_ohlcv */
interface Candle {
  ts: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number | null;
}

const INDEX_OPTIONS = ["NIFTY", "BANKNIFTY"] as const;

/** Lot sizes are fixed for now — not user-editable. */
const LOT_SIZE: Record<string, number> = {
  NIFTY: 65,
  BANKNIFTY: 30,
};

const RISK_FREE_RATE = 0.065; // flat assumption, used only for Greeks / repricing

/** Fixed chain window — no longer user-adjustable. */
const STRIKE_SPAN = 15;

/** Session bounds — index derivatives only trade within these hours. */
const MARKET_OPEN = { h: 9, m: 15 };
const MARKET_CLOSE = { h: 15, m: 30 };

function clampToMarketHours(d: Date): Date {
  const clamped = new Date(d);
  const openMin = MARKET_OPEN.h * 60 + MARKET_OPEN.m;
  const closeMin = MARKET_CLOSE.h * 60 + MARKET_CLOSE.m;
  const curMin = clamped.getHours() * 60 + clamped.getMinutes();
  if (curMin < openMin) clamped.setHours(MARKET_OPEN.h, MARKET_OPEN.m, 0, 0);
  else if (curMin > closeMin) clamped.setHours(MARKET_CLOSE.h, MARKET_CLOSE.m, 0, 0);
  else clamped.setSeconds(0, 0);
  return clamped;
}

/* ────────────────────────────────────────────────────────────────────────
   Supabase queries (all read-only)
   ──────────────────────────────────────────────────────────────────────── */

const CHAIN_TABLE = "index_optionchain_historical";
const CANDLE_TABLE = "nifty_ohlcv";

/**
 * Snapshots are whatever timestamps happen to exist in the historical table.
 * Given a target instant we find the closest actual snapshot: first look
 * at-or-before the target, then fall back to the closest one after it.
 */
async function findNearestSnapshotTs(indexName: string, targetIso: string): Promise<string | null> {
  const before = await supabase
    .from(CHAIN_TABLE)
    .select("ts")
    .eq("index_name", indexName)
    .lte("ts", targetIso)
    .order("ts", { ascending: false })
    .limit(1);
  if (before.error) throw before.error;
  if (before.data && before.data.length > 0) return before.data[0].ts as string;

  const after = await supabase
    .from(CHAIN_TABLE)
    .select("ts")
    .eq("index_name", indexName)
    .gt("ts", targetIso)
    .order("ts", { ascending: true })
    .limit(1);
  if (after.error) throw after.error;
  if (after.data && after.data.length > 0) return after.data[0].ts as string;

  return null;
}

/** List distinct expiry dates available for an index. */
async function fetchExpiries(indexName: string): Promise<{ expiries: string[]; latestDate: string | null }> {
  const { data, error } = await supabase.rpc("get_index_expiries", { p_index_name: indexName });
  if (error) throw error;
  const expiries = (data ?? []).map((r: { expiry_date: string }) => r.expiry_date);
  return { expiries, latestDate: null };
}

/** Fetch the full CE/PE chain for a given index+expiry at a specific snapshot ts. */
async function fetchChainAtTs(indexName: string, expiryDate: string, ts: string): Promise<ChainSnapshot> {
  const { data, error } = await supabase
    .from(CHAIN_TABLE)
    .select("*")
    .eq("index_name", indexName)
    .eq("expiry_date", expiryDate)
    .eq("ts", ts)
    .order("strike_price", { ascending: true });
  if (error) throw error;

  const rows = (data ?? []) as OptionChainRow[];
  const byStrike = new Map<number, ChainStrikeRow>();
  let atmStrike: number | null = null;

  for (const row of rows) {
    if (row.strike_price == null) continue;
    if (row.atm_strike != null) atmStrike = row.atm_strike;
    const strike = Number(row.strike_price);
    const existing = byStrike.get(strike) ?? { strike, ce: null, pe: null };
    if (row.option_type === "CE") existing.ce = row;
    if (row.option_type === "PE") existing.pe = row;
    byStrike.set(strike, existing);
  }

  const sorted = Array.from(byStrike.values()).sort((a, b) => a.strike - b.strike);
  return { ts: rows.length ? ts : null, atmStrike, rows: sorted };
}

/** Look up a single strike/option_type's row at (or before) a given ts, for repricing a leg. */
async function fetchLegPrice(
  indexName: string,
  expiryDate: string | null,
  strike: number,
  optionType: OptionType,
  ts: string
): Promise<{ price: number | null; iv: number | null; ts: string | null }> {
  let query = supabase
    .from(CHAIN_TABLE)
    .select("ltp, close_price, iv, ts")
    .eq("index_name", indexName)
    .eq("strike_price", strike)
    .eq("option_type", optionType)
    .lte("ts", ts)
    .order("ts", { ascending: false })
    .limit(1);
  if (expiryDate) query = query.eq("expiry_date", expiryDate);

  const { data, error } = await query;
  if (error) throw error;
  if (data && data.length > 0) {
    const row = data[0];
    const price = row.ltp ?? row.close_price ?? null;
    return {
      price: price != null ? Number(price) : null,
      iv: row.iv != null ? Number(row.iv) : null,
      ts: row.ts as string,
    };
  }
  return { price: null, iv: null, ts: null };
}

/** Fetch the session's 5-minute candles for an index on a given calendar date. */
async function fetchCandles(symbol: string, dateStr: string): Promise<Candle[]> {
  const dayStart = new Date(`${dateStr}T00:00:00`).toISOString();
  const dayEnd = new Date(`${dateStr}T23:59:59`).toISOString();
  const { data, error } = await supabase
    .from(CANDLE_TABLE)
    .select("ts, open, high, low, close, volume")
    .eq("symbol", symbol)
    .gte("ts", dayStart)
    .lte("ts", dayEnd)
    .order("ts", { ascending: true })
    .limit(300);
  if (error) throw error;
  return (data ?? [])
    .filter((r) => r.open != null && r.high != null && r.low != null && r.close != null)
    .map((r) => ({
      ts: r.ts as string,
      open: Number(r.open),
      high: Number(r.high),
      low: Number(r.low),
      close: Number(r.close),
      volume: r.volume != null ? Number(r.volume) : null,
    }));
}

/* ────────────────────────────────────────────────────────────────────────
   Black-Scholes helpers (used for Greeks + "what-if" repricing on the chart)
   ──────────────────────────────────────────────────────────────────────── */

function erf(x: number): number {
  // Abramowitz & Stegun 7.1.26
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

function normCdf(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

function normPdf(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

interface Greeks {
  delta: number;
  gamma: number;
  theta: number; // per day
  vega: number; // per 1 vol point (1%)
}

/** European option price. sigma is a decimal (0.15 = 15%), T in years. */
function bsPrice(spot: number, strike: number, T: number, sigma: number, r: number, type: OptionType): number {
  const intrinsic = type === "CE" ? Math.max(spot - strike, 0) : Math.max(strike - spot, 0);
  if (T <= 0 || sigma <= 0 || spot <= 0 || strike <= 0) return intrinsic;
  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(spot / strike) + (r + (sigma * sigma) / 2) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;
  if (type === "CE") {
    return spot * normCdf(d1) - strike * Math.exp(-r * T) * normCdf(d2);
  }
  return strike * Math.exp(-r * T) * normCdf(-d2) - spot * normCdf(-d1);
}

function bsGreeks(spot: number, strike: number, T: number, sigma: number, r: number, type: OptionType): Greeks {
  if (T <= 0 || sigma <= 0 || spot <= 0 || strike <= 0) {
    return { delta: 0, gamma: 0, theta: 0, vega: 0 };
  }
  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(spot / strike) + (r + (sigma * sigma) / 2) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;
  const pdf = normPdf(d1);
  const delta = type === "CE" ? normCdf(d1) : normCdf(d1) - 1;
  const gamma = pdf / (spot * sigma * sqrtT);
  const vega = (spot * pdf * sqrtT) / 100;
  const thetaYear =
    type === "CE"
      ? -((spot * pdf * sigma) / (2 * sqrtT)) - r * strike * Math.exp(-r * T) * normCdf(d2)
      : -((spot * pdf * sigma) / (2 * sqrtT)) + r * strike * Math.exp(-r * T) * normCdf(-d2);
  return { delta, gamma, theta: thetaYear / 365, vega };
}

/** Fractional days remaining to an expiry date, assuming a 15:30 close. */
function daysToExpiry(expiryDate: string, asOf: Date): number {
  const [y, m, d] = expiryDate.split("-").map(Number);
  const close = new Date(y, (m || 1) - 1, d || 1, 15, 30, 0, 0);
  const diffMs = close.getTime() - asOf.getTime();
  return Math.max(0, diffMs / (1000 * 60 * 60 * 24));
}

/** Estimate underlying spot from ATM put-call parity: spot ≈ strike + CE - PE. */
function estimateSpotFromChain(chain: ChainSnapshot): number | null {
  if (chain.atmStrike == null) return null;
  const atmRow = chain.rows.find((r) => r.strike === chain.atmStrike);
  const ce = atmRow?.ce?.ltp;
  const pe = atmRow?.pe?.ltp;
  if (ce != null && pe != null) return chain.atmStrike + Number(ce) - Number(pe);
  return chain.atmStrike;
}

/** Latest candle close at-or-before a given instant — the more reliable spot when available. */
function spotFromCandles(candles: Candle[], asOf: Date): number | null {
  if (candles.length === 0) return null;
  const asOfMs = asOf.getTime();
  let chosen: Candle | null = null;
  for (const c of candles) {
    if (new Date(c.ts).getTime() <= asOfMs) chosen = c;
    else break;
  }
  return (chosen ?? candles[0]).close;
}

/* ────────────────────────────────────────────────────────────────────────
   Strategy math: generic max-profit / max-loss + payoff sampling
   ──────────────────────────────────────────────────────────────────────── */

interface StrategyMetrics {
  maxProfit: number;
  maxProfitUnlimited: boolean;
  maxLoss: number;
  maxLossUnlimited: boolean;
  breakevens: number[];
}

/** Payoff (at expiry, T=0) of the whole book at a given spot. */
function payoffAtSpot(legs: Leg[], lotSize: number, spot: number): number {
  return legs.reduce((sum, leg) => {
    const qty = leg.lots * lotSize;
    const dir = leg.action === "BUY" ? 1 : -1;
    const value = bsPrice(spot, leg.strike, 0, 0, 0, leg.optionType);
    return sum + (value - leg.entryPrice) * qty * dir;
  }, 0);
}

function computeStrategyMetrics(legs: Leg[], lotSize: number): StrategyMetrics | null {
  if (legs.length === 0) return null;
  const strikes = legs.map((l) => l.strike);
  const lo = Math.max(0, Math.min(...strikes) - Math.min(...strikes) * 0.5);
  const hi = Math.max(...strikes) * 2.5;

  const N = 400;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= N; i++) {
    const x = lo + ((hi - lo) * i) / N;
    xs.push(x);
    ys.push(payoffAtSpot(legs, lotSize, x));
  }

  let maxProfit = -Infinity;
  let maxLoss = Infinity;
  for (const y of ys) {
    if (y > maxProfit) maxProfit = y;
    if (y < maxLoss) maxLoss = y;
  }

  const rightSlope = ys[N] - ys[N - 1];
  const epsilon = Math.max(1, lotSize * 0.001);
  const maxProfitUnlimited = rightSlope > epsilon;
  const maxLossUnlimited = rightSlope < -epsilon;

  const breakevens: number[] = [];
  for (let i = 1; i < ys.length; i++) {
    if ((ys[i - 1] < 0 && ys[i] >= 0) || (ys[i - 1] > 0 && ys[i] <= 0)) {
      const t = ys[i - 1] === ys[i] ? 0 : -ys[i - 1] / (ys[i] - ys[i - 1]);
      breakevens.push(xs[i - 1] + t * (xs[i] - xs[i - 1]));
    }
  }

  return { maxProfit, maxProfitUnlimited, maxLoss, maxLossUnlimited, breakevens };
}

/* ────────────────────────────────────────────────────────────────────────
   Small formatting helpers
   ──────────────────────────────────────────────────────────────────────── */

function fmt(n: number | null | undefined, digits = 2): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function fmtInt(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-IN");
}

function signed(n: number): string {
  const s = fmt(Math.abs(n));
  return n >= 0 ? `+${s}` : `-${s}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toTimeStr(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function combine(dateStr: string, timeStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

/** Estimate the strike step so STRIKE_SPAN means "N strikes on each side of ATM", not points. */
function stepGuess(rows: ChainStrikeRow[], atm: number): number {
  const sorted = [...rows].map((r) => r.strike).sort((a, b) => a - b);
  const idx = sorted.indexOf(atm);
  if (idx > 0) return sorted[idx] - sorted[idx - 1];
  if (sorted.length > 1) return sorted[1] - sorted[0];
  return 50;
}

function pnlClass(pnl: number | null): string {
  if (pnl == null) return "text-slate-400 dark:text-slate-500";
  if (pnl > 0) return "text-emerald-600 dark:text-emerald-400";
  if (pnl < 0) return "text-rose-600 dark:text-rose-400";
  return "text-slate-400 dark:text-slate-500";
}

/* ────────────────────────────────────────────────────────────────────────
   Skeletons (Tailwind's built-in animate-pulse — no custom CSS needed)
   ──────────────────────────────────────────────────────────────────────── */

function Block({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

function ChainSkeleton() {
  return (
    <div className="flex-1 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_auto_1fr] items-center gap-px border-b border-slate-100 px-3 py-2.5 dark:border-slate-800/60"
        >
          <div className="flex justify-end pr-2">
            <Block className="h-7 w-24" />
          </div>
          <div className="flex justify-center px-4">
            <Block className="h-4 w-12" />
          </div>
          <div className="flex justify-start pl-2">
            <Block className="h-7 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Block className="h-3 w-24" />
      <Block className="h-8 w-36" />
      {Array.from({ length: lines }).map((_, i) => (
        <Block key={i} className="h-3 w-full" />
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Block className="mb-2 h-3 w-32" />
      <Block className="h-[220px] w-full" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Chain table (CE | Strike | PE ladder) with joined Buy/Sell pill + Greeks
   ──────────────────────────────────────────────────────────────────────── */

function TradeCell({
  row,
  side,
  showGreeks,
  greeks,
  onTrade,
}: {
  row: OptionChainRow | null;
  side: "CE" | "PE";
  showGreeks: boolean;
  greeks: Greeks | null;
  onTrade: (action: LegAction) => void;
}) {
  const disabled = row?.ltp == null;
  const isCe = side === "CE";
  const priceColor = isCe ? "text-blue-600 dark:text-blue-400" : "text-teal-600 dark:text-teal-400";
  const align = isCe ? "items-end" : "items-start";
  const textAlign = isCe ? "text-right" : "text-left";

  return (
    <div className={`flex flex-col gap-1 px-2 py-1.5 ${align}`}>
      <div className={`font-mono text-[13px] font-semibold leading-tight tabular-nums ${priceColor} ${textAlign}`}>
        {fmt(row?.ltp)}
        {showGreeks && greeks && (
          <div className="mt-0.5 text-[10px] font-normal leading-tight text-slate-400 dark:text-slate-500">
            Δ{fmt(greeks.delta, 2)} · Θ{fmt(greeks.theta, 1)}
          </div>
        )}
      </div>
      <div className="flex overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-700">
        <button
          disabled={disabled}
          onClick={() => onTrade("BUY")}
          title={`Buy ${side} ${row?.strike_price ?? ""}`}
          className="flex items-center gap-1 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600 transition hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
        >
          <IconTriUp className="h-2 w-2.5" />
          B
        </button>
        <div className="w-px shrink-0 bg-slate-200 dark:bg-slate-700" />
        <button
          disabled={disabled}
          onClick={() => onTrade("SELL")}
          title={`Sell ${side} ${row?.strike_price ?? ""}`}
          className="flex items-center gap-1 bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600 transition hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500 dark:hover:text-white"
        >
          <IconTriDown className="h-2 w-2.5" />
          S
        </button>
      </div>
    </div>
  );
}

function ChainTable({
  rows,
  atmStrike,
  showGreeks,
  spot,
  yearsToExpiry,
  onTrade,
  loading,
  refreshing,
}: {
  rows: ChainStrikeRow[];
  atmStrike: number | null;
  showGreeks: boolean;
  spot: number | null;
  yearsToExpiry: number;
  onTrade: (strike: number, optionType: OptionType, action: LegAction) => void;
  loading: boolean;
  refreshing: boolean;
}) {
  const visible =
    atmStrike != null
      ? rows.filter((r) => Math.abs(r.strike - atmStrike) <= STRIKE_SPAN * stepGuess(rows, atmStrike))
      : rows;

  const greeksFor = (row: OptionChainRow | null, type: OptionType): Greeks | null => {
    if (!row || row.iv == null || spot == null) return null;
    return bsGreeks(spot, row.strike_price ?? 0, yearsToExpiry, row.iv / 100, RISK_FREE_RATE, type);
  };

  return (
    <div className="flex max-h-[75vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="h-0.5 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {refreshing && <div className="h-full w-2/5 animate-pulse bg-amber-500 dark:bg-amber-400" />}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-px border-b border-slate-200 bg-slate-200 text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-500">
        <div className="flex items-center justify-between bg-white px-3 py-2 dark:bg-slate-900">
          <span>OI</span>
          <span className="text-blue-600 dark:text-blue-400">Calls</span>
        </div>
        <div className="bg-white px-4 py-2 text-center font-semibold text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          Strike
        </div>
        <div className="flex items-center justify-between bg-white px-3 py-2 dark:bg-slate-900">
          <span className="text-teal-600 dark:text-teal-400">Puts</span>
          <span>OI</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && <ChainSkeleton />}
        {!loading && visible.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No chain data for this index / expiry / time yet.
          </div>
        )}
        {!loading &&
          visible.map((row) => {
            const isAtm = atmStrike != null && row.strike === atmStrike;
            return (
              <div
                key={row.strike}
                className={`grid grid-cols-[1fr_auto_1fr] items-center gap-px border-b border-slate-100 text-xs transition-colors dark:border-slate-800/60 ${
                  isAtm ? "bg-amber-50 dark:bg-amber-500/10" : ""
                }`}
              >
                <div className="flex items-center justify-between px-3 py-1.5">
                  <span className="font-mono tabular-nums text-slate-400 dark:text-slate-500">{fmtInt(row.ce?.oi)}</span>
                  <TradeCell
                    row={row.ce}
                    side="CE"
                    showGreeks={showGreeks}
                    greeks={greeksFor(row.ce, "CE")}
                    onTrade={(action) => onTrade(row.strike, "CE", action)}
                  />
                </div>

                <div
                  className={`px-4 py-1.5 text-center font-mono font-semibold tabular-nums ${
                    isAtm ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-slate-100"
                  }`}
                >
                  {row.strike}
                </div>

                <div className="flex items-center justify-between px-3 py-1.5">
                  <TradeCell
                    row={row.pe}
                    side="PE"
                    showGreeks={showGreeks}
                    greeks={greeksFor(row.pe, "PE")}
                    onTrade={(action) => onTrade(row.strike, "PE", action)}
                  />
                  <span className="font-mono tabular-nums text-slate-400 dark:text-slate-500">{fmtInt(row.pe?.oi)}</span>
                </div>
              </div>
            );
          })}
      </div>
      <div className="flex items-center gap-3 border-t border-slate-200 px-3 py-1.5 text-[10px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
        <span className="flex items-center gap-1">
          <IconTriUp className="h-2 w-2.5 text-emerald-500" /> Buy
        </span>
        <span className="flex items-center gap-1">
          <IconTriDown className="h-2 w-2.5 text-rose-500" /> Sell (write)
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Time controls — market hours only (09:15–15:30)
   ──────────────────────────────────────────────────────────────────────── */

function TimeControls({
  dateValue,
  timeValue,
  snapshotTs,
  loading,
  onDateChange,
  onTimeChange,
  onStep,
  onNextDay,
  onPrevDay,
}: {
  dateValue: string;
  timeValue: string;
  snapshotTs: string | null;
  loading: boolean;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  onStep: (minutes: number) => void;
  onNextDay: () => void;
  onPrevDay: () => void;
}) {
  const STEP_BUTTONS = [-15, -5, 5, 15];
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span>Date</span>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => onDateChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs tabular-nums text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span>Time</span>
          <input
            type="time"
            step={60}
            min="09:15"
            max="15:30"
            value={timeValue}
            onChange={(e) => onTimeChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs tabular-nums text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">Market hours only</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={onPrevDay}
          className="flex items-center gap-0.5 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-100"
          title="Carry back one day"
        >
          <IconChevron dir="left" className="h-3 w-3" /> Day
        </button>
        {STEP_BUTTONS.map((m) => (
          <button
            key={m}
            onClick={() => onStep(m)}
            className={`rounded-lg border border-slate-200 px-2.5 py-1 font-mono text-xs font-medium tabular-nums transition dark:border-slate-700 ${
              m < 0
                ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                : "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
            }`}
          >
            {m > 0 ? `+${m}m` : `${m}m`}
          </button>
        ))}
        <button
          onClick={onNextDay}
          className="flex items-center gap-0.5 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-100"
          title="Carry forward to next day, same time"
        >
          Day <IconChevron dir="right" className="h-3 w-3" />
        </button>
      </div>

      <div className="font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
        {loading
          ? "Fetching snapshot…"
          : snapshotTs
          ? `Snapshot ${new Date(snapshotTs).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : "No snapshot at this time"}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Candlestick chart — 5m OHLCV, buy/sell markers, click-to-jump time
   ──────────────────────────────────────────────────────────────────────── */

function CandleChart({
  symbol,
  candles,
  legs,
  asOf,
  onSelectTime,
  loading,
}: {
  symbol: string;
  candles: Candle[];
  legs: Leg[];
  asOf: Date;
  onSelectTime: (d: Date) => void;
  loading: boolean;
}) {
  const W = 900;
  const H = 260;
  const PAD = { top: 12, right: 12, bottom: 8, left: 48 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (loading) return <ChartSkeleton />;

  if (candles.length === 0) {
    return (
      <div className="flex h-[220px] flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-slate-300 bg-white/50 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <span className="text-xs text-slate-500 dark:text-slate-400">No 5-min candles for this session yet</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">Try a different date for {symbol}</span>
      </div>
    );
  }

  const n = candles.length;
  const slot = plotW / n;
  const bodyW = Math.max(2, slot * 0.6);
  const xFor = (i: number) => PAD.left + slot * (i + 0.5);

  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const yMax = Math.max(...highs);
  const yMin = Math.min(...lows);
  const yPad = (yMax - yMin) * 0.12 || 1;
  const scaleTop = yMax + yPad;
  const scaleBottom = yMin - yPad;
  const yScale = (y: number) => PAD.top + (1 - (y - scaleBottom) / (scaleTop - scaleBottom)) * plotH;

  const asOfMs = asOf.getTime();
  let nearestIdx = 0;
  let best = Infinity;
  candles.forEach((c, i) => {
    const d = Math.abs(new Date(c.ts).getTime() - asOfMs);
    if (d < best) {
      best = d;
      nearestIdx = i;
    }
  });

  const legMarkers = legs.map((leg) => {
    const t = new Date(leg.entryTs).getTime();
    let idx = 0;
    let b = Infinity;
    candles.forEach((c, i) => {
      const d = Math.abs(new Date(c.ts).getTime() - t);
      if (d < b) {
        b = d;
        idx = i;
      }
    });
    return { leg, idx };
  });

  const indexFromClientX = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const fracX = (clientX - rect.left) * (W / rect.width) - PAD.left;
    return Math.min(n - 1, Math.max(0, Math.floor(fracX / slot)));
  };

  const hovered = candles[hoverIdx ?? nearestIdx];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-slate-900 dark:text-slate-100">{symbol} · 5m</span>
        {hovered && (
          <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
            O {fmt(hovered.open)} H {fmt(hovered.high)} L {fmt(hovered.low)} C{" "}
            <span className={hovered.close >= hovered.open ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
              {fmt(hovered.close)}
            </span>
          </span>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full cursor-pointer select-none touch-none"
        onClick={(e) => {
          const idx = indexFromClientX(e.clientX);
          if (idx != null) onSelectTime(new Date(candles[idx].ts));
        }}
        onMouseMove={(e) => setHoverIdx(indexFromClientX(e.clientX))}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const y = PAD.top + f * plotH;
          const val = scaleTop - f * (scaleTop - scaleBottom);
          return (
            <g key={f}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y}
                y2={y}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth={1}
              />
              <text x={2} y={y + 3} className="fill-slate-400 font-mono text-[9px] tabular-nums dark:fill-slate-500">
                {fmt(val, 0)}
              </text>
            </g>
          );
        })}

        {candles.map((c, i) => {
          const up = c.close >= c.open;
          const x = xFor(i);
          const colorClass = up
            ? "stroke-emerald-500 fill-emerald-500 dark:stroke-emerald-400 dark:fill-emerald-400"
            : "stroke-rose-500 fill-rose-500 dark:stroke-rose-400 dark:fill-rose-400";
          const bodyTop = Math.min(yScale(c.open), yScale(c.close));
          const bodyH = Math.max(1, Math.abs(yScale(c.open) - yScale(c.close)));
          return (
            <g key={c.ts} className={colorClass}>
              <line x1={x} x2={x} y1={yScale(c.high)} y2={yScale(c.low)} strokeWidth={1} />
              <rect x={x - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} />
            </g>
          );
        })}

        {legMarkers.map(({ leg, idx }, i) => {
          const x = xFor(idx);
          const isBuy = leg.action === "BUY";
          const cy = isBuy ? yScale(candles[idx].low) + 9 : yScale(candles[idx].high) - 9;
          return (
            <g
              key={leg.legId + i}
              transform={`translate(${x}, ${cy})`}
              className={isBuy ? "fill-emerald-500 dark:fill-emerald-400" : "fill-rose-500 dark:fill-rose-400"}
            >
              {isBuy ? <path d="M-4 4 L4 4 L0 -4 Z" /> : <path d="M-4 -4 L4 -4 L0 4 Z" />}
            </g>
          );
        })}

        <line
          x1={xFor(nearestIdx)}
          x2={xFor(nearestIdx)}
          y1={PAD.top}
          y2={H - PAD.bottom}
          className="stroke-amber-500 dark:stroke-amber-400"
          strokeDasharray="4 3"
          strokeWidth={1.5}
        />
      </svg>

      <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
        <span>{new Date(candles[0].ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
        <span>{new Date(candles[n - 1].ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1">
          <IconTriUp className="h-2 w-2.5 text-emerald-500" /> Buy
        </span>
        <span className="flex items-center gap-1">
          <IconTriDown className="h-2 w-2.5 text-rose-500" /> Sell
        </span>
        <span>Click the chart to jump the snapshot to that time</span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   P&L summary — top of the right rail
   ──────────────────────────────────────────────────────────────────────── */

function PnLSummary({
  legs,
  lotSize,
  showGreeks,
  spot,
  asOf,
}: {
  legs: Leg[];
  lotSize: number;
  showGreeks: boolean;
  spot: number | null;
  asOf: Date;
}) {
  const priced = legs.map((leg) => {
    const qty = leg.lots * lotSize;
    const dir = leg.action === "BUY" ? 1 : -1;
    const pnl = leg.currentPrice != null ? (leg.currentPrice - leg.entryPrice) * qty * dir : null;
    const entryCash = leg.entryPrice * qty * (leg.action === "BUY" ? -1 : 1);
    let greeks: Greeks | null = null;
    if (spot != null && leg.entryExpiry) {
      const T = daysToExpiry(leg.entryExpiry, asOf) / 365;
      const sigma = (leg.currentIv ?? leg.entryIv ?? 0) / 100;
      if (sigma > 0) greeks = bsGreeks(spot, leg.strike, T, sigma, RISK_FREE_RATE, leg.optionType);
    }
    return { leg, qty, pnl, entryCash, greeks, dir };
  });

  const totalPnl = priced.reduce((sum, p) => sum + (p.pnl ?? 0), 0);
  const netCash = priced.reduce((sum, p) => sum + p.entryCash, 0);
  const allPriced = priced.length > 0 && priced.every((p) => p.pnl != null);

  const portfolioGreeks = priced.reduce(
    (acc, p) => {
      if (!p.greeks) return acc;
      const qty = p.qty * p.dir;
      return {
        delta: acc.delta + p.greeks.delta * qty,
        gamma: acc.gamma + p.greeks.gamma * qty,
        theta: acc.theta + p.greeks.theta * qty,
        vega: acc.vega + p.greeks.vega * qty,
      };
    },
    { delta: 0, gamma: 0, theta: 0, vega: 0 }
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total P&amp;L</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          {legs.length} leg{legs.length === 1 ? "" : "s"}
        </span>
      </div>
      <div
        className={`mt-1 font-mono text-3xl font-bold tabular-nums ${
          legs.length === 0 ? "text-slate-300 dark:text-slate-700" : pnlClass(allPriced ? totalPnl : null)
        }`}
      >
        {legs.length === 0 ? "—" : allPriced ? signed(totalPnl) : `${signed(totalPnl)}*`}
      </div>
      {legs.length > 0 && !allPriced && (
        <div className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">*some legs unpriced at this snapshot</div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800">
        <span className="text-slate-500 dark:text-slate-400">Net premium</span>
        <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">
          {legs.length === 0 ? "—" : `${netCash >= 0 ? "Credit " : "Debit "}${fmt(Math.abs(netCash))}`}
        </span>
      </div>

      {showGreeks && legs.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-1 border-t border-slate-100 pt-2.5 text-center dark:border-slate-800">
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">Delta</div>
            <div className="font-mono text-xs font-medium tabular-nums text-slate-900 dark:text-slate-100">
              {fmt(portfolioGreeks.delta, 2)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">Gamma</div>
            <div className="font-mono text-xs font-medium tabular-nums text-slate-900 dark:text-slate-100">
              {fmt(portfolioGreeks.gamma, 4)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">Theta</div>
            <div className="font-mono text-xs font-medium tabular-nums text-slate-900 dark:text-slate-100">
              {fmt(portfolioGreeks.theta, 2)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">Vega</div>
            <div className="font-mono text-xs font-medium tabular-nums text-slate-900 dark:text-slate-100">
              {fmt(portfolioGreeks.vega, 2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Payoff chart — draggable target spot + days-to-expiry slider
   ──────────────────────────────────────────────────────────────────────── */

function PayoffChart({
  legs,
  lotSize,
  spot,
  daysLeft,
}: {
  legs: Leg[];
  lotSize: number;
  spot: number | null;
  daysLeft: number;
}) {
  const W = 560;
  const H = 240;
  const PAD = { top: 14, right: 14, bottom: 8, left: 14 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [targetSpot, setTargetSpot] = useState<number | null>(spot);
  const [daysOffset, setDaysOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setTargetSpot((prev) => prev ?? spot);
  }, [spot]);

  const strikes = legs.map((l) => l.strike);
  const center = targetSpot ?? spot ?? strikes[0] ?? 100;
  const spread = strikes.length ? Math.max(...strikes) - Math.min(...strikes) : center * 0.1;
  const range = Math.max(spread * 1.6, center * 0.12, 100);
  const lo = Math.max(0, center - range);
  const hi = center + range;

  const T = Math.max(0, daysLeft - daysOffset) / 365;
  const sigmaFor = (leg: Leg) => (leg.currentIv ?? leg.entryIv ?? 15) / 100;

  const bookValueAt = (spotX: number) =>
    legs.reduce((sum, leg) => {
      const qty = leg.lots * lotSize;
      const dir = leg.action === "BUY" ? 1 : -1;
      const value = bsPrice(spotX, leg.strike, T, sigmaFor(leg), RISK_FREE_RATE, leg.optionType);
      return sum + (value - leg.entryPrice) * qty * dir;
    }, 0);

  const N = 120;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= N; i++) {
    const x = lo + ((hi - lo) * i) / N;
    pts.push({ x, y: bookValueAt(x) });
  }

  // True expiry payoff — intrinsic only, no vol/time
  const ptsExpiry: { x: number; y: number }[] = [];
  for (let i = 0; i <= N; i++) {
    const x = lo + ((hi - lo) * i) / N;
    ptsExpiry.push({ x, y: payoffAtSpot(legs, lotSize, x) });
  }

  const allYs = [...pts, ...ptsExpiry].map((p) => p.y);
  const yMin = Math.min(0, ...allYs);
  const yMax = Math.max(0, ...allYs);
  const yPad = (yMax - yMin) * 0.15 || 1;

  const xScale = (x: number) => PAD.left + ((x - lo) / (hi - lo)) * plotW;
  const yScale = (y: number) => PAD.top + (1 - (y - (yMin - yPad)) / (yMax + yPad - (yMin - yPad))) * plotH;

  const zeroY = yScale(0);
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.x).toFixed(1)} ${yScale(p.y).toFixed(1)}`).join(" ");
  const expiryLinePath = ptsExpiry
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.x).toFixed(1)} ${yScale(p.y).toFixed(1)}`)
    .join(" ");
  const areaPath =
    `M ${xScale(pts[0].x).toFixed(1)} ${zeroY.toFixed(1)} ` +
    pts.map((p) => `L ${xScale(p.x).toFixed(1)} ${yScale(p.y).toFixed(1)}`).join(" ") +
    ` L ${xScale(pts[pts.length - 1].x).toFixed(1)} ${zeroY.toFixed(1)} Z`;

  const targetPnl = targetSpot != null ? bookValueAt(targetSpot) : null;
  const targetX = targetSpot != null ? xScale(targetSpot) : null;
  const targetY = targetPnl != null ? yScale(targetPnl) : null;

  const spotFromClientX = useCallback(
    (clientX: number) => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      const frac = (clientX - rect.left) * (W / rect.width) - PAD.left;
      const clamped = Math.min(plotW, Math.max(0, frac));
      return lo + (clamped / plotW) * (hi - lo);
    },
    [lo, hi, plotW]
  );

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const x = spotFromClientX(e.clientX);
    if (x != null) setTargetSpot(Math.round(x * 20) / 20);
  };

  if (legs.length === 0) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-slate-300 bg-white/50 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <span className="text-xs text-slate-500 dark:text-slate-400">No legs yet</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">Use the buy / sell pills in the chain to build a payoff</span>
      </div>
    );
  }

  const metrics = computeStrategyMetrics(legs, lotSize);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Payoff — today vs expiry</span>
        {metrics && (
          <span className={`font-mono text-xs font-semibold tabular-nums ${pnlClass(targetPnl)}`}>
            {targetPnl != null ? signed(targetPnl) : "—"} at target
          </span>
        )}
      </div>

      <div className="mb-1.5 flex items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400" />
          Today (T+0)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full border border-dashed border-blue-500 dark:border-blue-400" />
          At expiry
        </span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none select-none"
        onPointerDown={(e) => {
          setDragging(true);
          (e.target as Element).setPointerCapture?.(e.pointerId);
          const x = spotFromClientX(e.clientX);
          if (x != null) setTargetSpot(Math.round(x * 20) / 20);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
      >
        <defs>
          <clipPath id="sbGainClip">
            <rect x={0} y={0} width={W} height={zeroY} />
          </clipPath>
          <clipPath id="sbLossClip">
            <rect x={0} y={zeroY} width={W} height={Math.max(0, H - zeroY)} />
          </clipPath>
        </defs>

        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={zeroY}
          y2={zeroY}
          className="stroke-slate-300 dark:stroke-slate-700"
          strokeWidth={1}
        />

        {spot != null && (
          <line
            x1={xScale(spot)}
            x2={xScale(spot)}
            y1={PAD.top}
            y2={H - PAD.bottom}
            className="stroke-slate-400 dark:stroke-slate-600"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
        )}

        <g clipPath="url(#sbGainClip)">
          <path d={areaPath} className="fill-emerald-500/15 dark:fill-emerald-400/20" />
        </g>
        <g clipPath="url(#sbLossClip)">
          <path d={areaPath} className="fill-rose-500/15 dark:fill-rose-400/20" />
        </g>

        {/* Expiry (blue) line — intrinsic only */}
        <path
          d={expiryLinePath}
          fill="none"
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth={1.5}
          strokeDasharray="5 3"
        />

        {/* Today (amber) line — mark-to-market with live IV and real DTE */}
        <path d={linePath} fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth={2} />

        {metrics?.breakevens.map((be, i) => (
          <circle key={i} cx={xScale(be)} cy={zeroY} r={3} className="fill-slate-900 dark:fill-slate-100" />
        ))}

        {targetX != null && targetY != null && (
          <g>
            <line
              x1={targetX}
              x2={targetX}
              y1={PAD.top}
              y2={H - PAD.bottom}
              className="stroke-amber-500 dark:stroke-amber-400"
              strokeDasharray="4 3"
              strokeWidth={1}
            />
            <circle
              cx={targetX}
              cy={targetY}
              r={5.5}
              className="fill-amber-500 stroke-white dark:fill-amber-400 dark:stroke-slate-900"
              strokeWidth={2}
            />
          </g>
        )}
      </svg>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <span>Target spot</span>
          <button
            onClick={() => setTargetSpot((s) => (s ?? spot ?? 0) - 5)}
            className="rounded-md border border-slate-200 px-1.5 text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-100"
          >
            −
          </button>
          <span className="w-16 text-center font-mono tabular-nums text-slate-900 dark:text-slate-100">{fmt(targetSpot, 2)}</span>
          <button
            onClick={() => setTargetSpot((s) => (s ?? spot ?? 0) + 5)}
            className="rounded-md border border-slate-200 px-1.5 text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-100"
          >
            +
          </button>
          <button onClick={() => setTargetSpot(spot)} className="ml-1 text-[10px] text-amber-600 hover:underline dark:text-amber-400">
            Reset
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="whitespace-nowrap font-mono tabular-nums">DTE {Math.max(0, daysLeft - daysOffset).toFixed(1)}</span>
        <input
          type="range"
          min={0}
          max={Math.max(0.1, Math.floor(daysLeft))}
          step={0.5}
          value={daysOffset}
          onChange={(e) => setDaysOffset(Number(e.target.value))}
          className="w-full accent-amber-500"
        />
      </div>

      {metrics && (
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-xs dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Max profit</span>
            <span className="font-mono font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {metrics.maxProfitUnlimited ? "Unlimited" : fmt(metrics.maxProfit)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Max loss</span>
            <span className="font-mono font-semibold tabular-nums text-rose-600 dark:text-rose-400">
              {metrics.maxLossUnlimited ? "Unlimited" : fmt(metrics.maxLoss)}
            </span>
          </div>
          {metrics.breakevens.length > 0 && (
            <div className="col-span-2 text-[10px] text-slate-400 dark:text-slate-500">
              Breakeven: {metrics.breakevens.map((b) => fmt(b, 0)).join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Positions cart — right-side drawer with floating trigger button
   ──────────────────────────────────────────────────────────────────────── */

function IconBriefcase(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className} stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="7" width="18" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12h18" strokeLinecap="round" />
    </svg>
  );
}

function IconTrash(props: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h10M6 4.5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M4.5 4.5l.6 8.4a1 1 0 0 0 1 .9h3.8a1 1 0 0 0 1-.9l.6-8.4" />
    </svg>
  );
}

function PositionsCartButton({ legCount, totalPnl, allPriced, onClick }:{
    legCount: number;
    totalPnl: number;
    allPriced: boolean;
    onClick: () => void;
  }) {
  const positive = allPriced && totalPnl > 0;
  const negative = allPriced && totalPnl < 0;
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-[70] mb-[60px] flex items-center gap-2.5 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl md:mb-0
        ${positive ? "border-emerald-300/60 bg-emerald-500/95 text-white dark:border-emerald-400/40" :
          negative ? "border-rose-300/60 bg-rose-500/95 text-white dark:border-rose-400/40" :
          "border-slate-200 bg-slate-900 text-white dark:border-slate-700 dark:bg-slate-100 dark:text-slate-900"}`}
    >
      <span className="relative">
        <IconBriefcase className="h-5 w-5" />
        {legCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-slate-950">
            {legCount}
          </span>
        )}
      </span>
      <div className="flex flex-col items-start leading-none">
        <span className="text-[9px] uppercase tracking-wide opacity-80">Positions</span>
        <span className="font-mono text-sm font-bold tabular-nums">
          {legCount === 0 ? "—" : allPriced ? signed(totalPnl) : `${signed(totalPnl)}*`}
        </span>
      </div>
    </button>
  );
}

function PositionsCart({
  open,
  onClose,
  legs,
  lotSize,
  spot,
  asOf,
  showGreeks,
  onRemove,
  onLotsChange,
  onClearAll,
}: {
  open: boolean;
  onClose: () => void;
  legs: Leg[];
  lotSize: number;
  spot: number | null;
  asOf: Date;
  showGreeks: boolean;
  onRemove: (legId: string) => void;
  onLotsChange: (legId: string, lots: number) => void;
  onClearAll: () => void;
}) {
  const priced = legs.map((leg) => {
    const qty = leg.lots * lotSize;
    const dir = leg.action === "BUY" ? 1 : -1;
    const pnl = leg.currentPrice != null ? (leg.currentPrice - leg.entryPrice) * qty * dir : null;
    let greeks: Greeks | null = null;
    if (spot != null && leg.entryExpiry) {
      const T = daysToExpiry(leg.entryExpiry, asOf) / 365;
      const sigma = (leg.currentIv ?? leg.entryIv ?? 0) / 100;
      if (sigma > 0) greeks = bsGreeks(spot, leg.strike, T, sigma, RISK_FREE_RATE, leg.optionType);
    }
    return { leg, qty, pnl, greeks };
  });

  return (
    <>
      {open && <div className="fixed inset-0 z-[75] bg-black/30" onClick={onClose} />}
      <div
        className={`fixed inset-y-0 right-0 z-[80] w-full max-w-[400px] transform border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Positions</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {legs.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {legs.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-[10px] text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded p-1 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-100"
                aria-label="Close positions"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-3">
            {legs.length === 0 ? (
              <div className="p-5 text-center text-xs text-slate-500 dark:text-slate-400">
                No legs yet. Tap a buy / sell pill in the chain to add one.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {priced.map(({ leg, qty, pnl, greeks }) => (
                  <li key={leg.legId} className="flex flex-col gap-1.5 px-2 py-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                            leg.action === "BUY"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                          }`}
                        >
                          {leg.action === "BUY" ? <IconTriUp className="h-2 w-2.5" /> : <IconTriDown className="h-2 w-2.5" />}
                          {leg.action}
                        </span>
                        <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">{leg.strike}</span>
                        <span
                          className={`text-[10px] font-semibold ${
                            leg.optionType === "CE" ? "text-blue-600 dark:text-blue-400" : "text-teal-600 dark:text-teal-400"
                          }`}
                        >
                          {leg.optionType}
                        </span>
                        {leg.stale && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500" title="No price found at current snapshot">
                            stale
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => onRemove(leg.legId)}
                        className="rounded p-0.5 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400"
                        aria-label="Remove leg"
                      >
                        <IconClose className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span>Lots</span>
                        <input
                          type="number"
                          min={1}
                          value={leg.lots}
                          onChange={(e) => onLotsChange(leg.legId, Math.max(1, Number(e.target.value) || 1))}
                          className="w-14 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-xs tabular-nums text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        />
                        <span className="text-[10px]">({qty})</span>
                      </div>
                      <div className="font-mono tabular-nums">
                        {fmt(leg.entryPrice)} → {leg.currentPrice != null ? fmt(leg.currentPrice) : "—"}
                      </div>
                      <div className={`font-mono font-semibold tabular-nums ${pnlClass(pnl)}`}>{pnl != null ? signed(pnl) : "—"}</div>
                    </div>
                    {showGreeks && greeks && (
                      <div className="flex gap-3 text-[10px] text-slate-400 dark:text-slate-500">
                        <span>Δ {fmt(greeks.delta, 3)}</span>
                        <span>Γ {fmt(greeks.gamma, 4)}</span>
                        <span>Θ {fmt(greeks.theta, 2)}</span>
                        <span>V {fmt(greeks.vega, 2)}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Header
   ──────────────────────────────────────────────────────────────────────── */

function Header({
  indexName,
  onIndexChange,
  expiries,
  expiryDate,
  onExpiryChange,
  loadingExpiries,
  lotSize,
  showGreeks,
  onToggleGreeks,
}: {
  indexName: string;
  onIndexChange: (v: string) => void;
  expiries: string[];
  expiryDate: string;
  onExpiryChange: (v: string) => void;
  loadingExpiries: boolean;
  lotSize: number;
  showGreeks: boolean;
  onToggleGreeks: () => void;
}) {
  return (
    <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      <div className="flex items-center gap-2.5">
        {/* <LogoMark className="h-8 w-8 shrink-0" /> */}
        <div>
          <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-slate-100">Strategy Builder</h1>
          <p className="text-[11px] leading-tight text-slate-400 dark:text-slate-500">
            Historical option-chain simulator · positions live in this tab only
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
          {INDEX_OPTIONS.map((idx) => (
            <button
              key={idx}
              onClick={() => onIndexChange(idx)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                indexName === idx
                  ? "bg-amber-500 text-white dark:bg-amber-400 dark:text-slate-950"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              {idx}
            </button>
          ))}
        </div>

        <select
          value={expiryDate}
          onChange={(e) => onExpiryChange(e.target.value)}
          disabled={loadingExpiries || expiries.length === 0}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs tabular-nums text-slate-900 outline-none focus:border-amber-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          {expiries.length === 0 && <option value="">No expiries</option>}
          {expiries.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>

        <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          Lot <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">{lotSize}</span>
        </span>

        <button
          onClick={onToggleGreeks}
          role="switch"
          aria-checked={showGreeks}
          className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
            showGreeks
              ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-400"
              : "border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
          }`}
        >
          <span
            className={`relative inline-flex h-4 w-7 items-center rounded-full transition ${
              showGreeks ? "bg-amber-500 dark:bg-amber-400" : "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            <span
              className="inline-block h-3 w-3 transform rounded-full bg-white transition"
              style={{ transform: showGreeks ? "translateX(14px)" : "translateX(2px)" }}
            />
          </span>
          Greeks
        </button>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────────── */

export default function StrategyBuilder() {
  const [indexName, setIndexName] = useState<string>(INDEX_OPTIONS[0]);
  const [expiries, setExpiries] = useState<string[]>([]);
  const [expiryDate, setExpiryDate] = useState<string>("");
  const lotSize = LOT_SIZE[indexName] ?? 1;
  const [showGreeks, setShowGreeks] = useState<boolean>(true);

  const [asOf, setAsOf] = useState<Date>(() => clampToMarketHours(new Date()));
  const [dateStr, setDateStr] = useState<string>(() => toDateStr(clampToMarketHours(new Date())));
  const [timeStr, setTimeStr] = useState<string>(() => toTimeStr(clampToMarketHours(new Date())));

  const [chain, setChain] = useState<ChainSnapshot>({ ts: null, atmStrike: null, rows: [] });
  const [legs, setLegs] = useState<Leg[]>([]);
  const [loadingChain, setLoadingChain] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [loadingExpiries, setLoadingExpiries] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [candles, setCandles] = useState<Candle[]>([]);
  const [loadingCandles, setLoadingCandles] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);

  // Load expiries whenever the index changes; clear legs since they belong
  // to a single index's chain only.
  useEffect(() => {
    let cancelled = false;
    setLoadingExpiries(true);
    setLegs([]);
    setHasLoadedOnce(false);
    // Replace lines ~913–925 in strategy-builder-section.tsx
    fetchExpiries(indexName)
      .then(({ expiries: list }) => {
        if (cancelled) return;
        setExpiries(list);
        setExpiryDate(() => {
          // Find the first expiry date on or after the active simulator date
          const validUpcoming = list.find((d) => d >= dateStr);
          // Fall back to the latest expiry in database if none are >= dateStr
          return validUpcoming ?? list[list.length - 1] ?? "";
        });
      })
  .catch((e) => setError(String(e.message ?? e)))
  .finally(() => !cancelled && setLoadingExpiries(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexName]);

  const loadChain = useCallback(async (targetDate: Date, index: string, expiry: string) => {
    if (!expiry) return;
    setLoadingChain(true);
    setError(null);
    try {
      const nearestTs = await findNearestSnapshotTs(index, targetDate.toISOString());
      if (!nearestTs) {
        setChain({ ts: null, atmStrike: null, rows: [] });
        return;
      }
      const snapshot = await fetchChainAtTs(index, expiry, nearestTs);
      setChain(snapshot);

      const repriceTs = snapshot.ts ?? nearestTs;
      setLegs((current) => {
        if (current.length === 0) return current;
        Promise.all(
          current.map(async (leg) => {
            try {
              const { price, iv, ts } = await fetchLegPrice(index, leg.entryExpiry, leg.strike, leg.optionType, repriceTs);
              return { ...leg, currentPrice: price, currentIv: iv, currentTs: ts, stale: price == null };
            } catch {
              return { ...leg, stale: true };
            }
          })
        ).then(setLegs);
        return current;
      });
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoadingChain(false);
      setHasLoadedOnce(true);
    }
  }, []);

  // Reload the chain whenever the index, expiry, or as-of instant changes.
  useEffect(() => {
    if (!expiryDate) return;
    loadChain(asOf, indexName, expiryDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asOf, indexName, expiryDate]);

  // Add this hook after loadChain definition (around line 950)
  useEffect(() => {
    if (expiries.length > 0 && expiryDate < dateStr) {
      const nextValid = expiries.find((d) => d >= dateStr);
      if (nextValid) {
        setExpiryDate(nextValid);
      }
    }
  }, [dateStr, expiries, expiryDate]);

  // Reload the day's candles whenever the index or calendar date changes.
  useEffect(() => {
    let cancelled = false;
    setLoadingCandles(true);
    fetchCandles(indexName, dateStr)
      .then((list) => !cancelled && setCandles(list))
      .catch(() => !cancelled && setCandles([]))
      .finally(() => !cancelled && setLoadingCandles(false));
    return () => {
      cancelled = true;
    };
  }, [indexName, dateStr]);

  function applyAsOf(next: Date) {
    const clamped = clampToMarketHours(next);
    setAsOf(clamped);
    setDateStr(toDateStr(clamped));
    setTimeStr(toTimeStr(clamped));
  }

  function handleDateChange(v: string) {
    applyAsOf(combine(v, timeStr));
  }

  function handleTimeChange(v: string) {
    applyAsOf(combine(dateStr, v));
  }

  function stepMinutes(minutes: number) {
    applyAsOf(new Date(asOf.getTime() + minutes * 60_000));
  }

  function stepDay(days: number) {
    applyAsOf(new Date(asOf.getTime() + days * 24 * 60 * 60_000));
  }

  function handleTrade(strike: number, optionType: OptionType, action: LegAction) {
    setLegs((current) => {
      const idx = current.findIndex((l) => l.strike === strike && l.optionType === optionType && l.action === action);
      if (idx >= 0) {
        const copy = [...current];
        copy[idx] = { ...copy[idx], lots: copy[idx].lots + 1 };
        return copy;
      }
      const row = chain.rows.find((r) => r.strike === strike);
      const sourceRow = optionType === "CE" ? row?.ce : row?.pe;
      const entryPrice = sourceRow?.ltp ?? sourceRow?.close_price ?? null;
      if (entryPrice == null) return current;
      const newLeg: Leg = {
        legId: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        strike,
        optionType,
        action,
        lots: 1,
        entryPrice: Number(entryPrice),
        entryIv: sourceRow?.iv != null ? Number(sourceRow.iv) : null,
        entryTs: chain.ts ?? asOf.toISOString(),
        entryExpiry: expiryDate || null,
        currentPrice: Number(entryPrice),
        currentIv: sourceRow?.iv != null ? Number(sourceRow.iv) : null,
        currentTs: chain.ts ?? null,
        stale: false,
      };
      return [...current, newLeg];
    });
  }

  function removeLeg(legId: string) {
    setLegs((current) => current.filter((l) => l.legId !== legId));
  }

  function updateLegLots(legId: string, lots: number) {
    setLegs((current) => current.map((l) => (l.legId === legId ? { ...l, lots } : l)));
  }

  const nowLabel = useMemo(
    () =>
      asOf.toLocaleString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [asOf]
  );

  const chainSpot = useMemo(() => estimateSpotFromChain(chain), [chain]);
  const estSpot = useMemo(() => spotFromCandles(candles, asOf) ?? chainSpot, [candles, asOf, chainSpot]);
  const remainingDays = expiryDate ? daysToExpiry(expiryDate, asOf) : 0;
  const yearsToExpiryVal = remainingDays / 365;
  const showChainSkeleton = loadingChain && !hasLoadedOnce;
  const showRailSkeleton = loadingExpiries && !hasLoadedOnce;

  const totalPnl = useMemo(() => {
    return legs.reduce((sum, leg) => {
      const qty = leg.lots * lotSize;
      const dir = leg.action === "BUY" ? 1 : -1;
      return sum + (leg.currentPrice != null ? (leg.currentPrice - leg.entryPrice) * qty * dir : 0);
    }, 0);
  }, [legs, lotSize]);
  const allPriced = legs.length > 0 && legs.every((l) => l.currentPrice != null);

  return (
    <main className="flex min-h-screen flex-col gap-3">
      <Header
        indexName={indexName}
        onIndexChange={setIndexName}
        expiries={expiries}
        expiryDate={expiryDate}
        onExpiryChange={setExpiryDate}
        loadingExpiries={loadingExpiries}
        lotSize={lotSize}
        showGreeks={showGreeks}
        onToggleGreeks={() => setShowGreeks((v) => !v)}
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <span className="font-semibold text-slate-900 dark:text-slate-100">{indexName}</span>
        <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
          Spot <span className="font-semibold text-slate-900 dark:text-slate-100">{estSpot != null ? fmt(estSpot, 2) : "—"}</span>
        </span>
        <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
          ATM <span className="font-semibold text-amber-600 dark:text-amber-400">{chain.atmStrike ?? "—"}</span>
        </span>
        <span className="font-mono tabular-nums text-slate-400 dark:text-slate-500">{remainingDays.toFixed(1)}d to expiry</span>
      </div>

      <TimeControls
        dateValue={dateStr}
        timeValue={timeStr}
        snapshotTs={chain.ts}
        loading={loadingChain}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
        onStep={stepMinutes}
        onNextDay={() => stepDay(1)}
        onPrevDay={() => stepDay(-1)}
      />

      <CandleChart
        symbol={indexName}
        candles={candles}
        legs={legs}
        asOf={asOf}
        onSelectTime={(d) => applyAsOf(d)}
        loading={loadingCandles}
      />

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-[1fr_380px] lg:items-start">
        <ChainTable
          rows={chain.rows}
          atmStrike={chain.atmStrike}
          showGreeks={showGreeks}
          spot={estSpot}
          yearsToExpiry={yearsToExpiryVal}
          onTrade={handleTrade}
          loading={showChainSkeleton}
          refreshing={loadingChain && hasLoadedOnce}
        />

        <div className="flex flex-col gap-3 lg:sticky lg:top-4">
          {showRailSkeleton ? (
            <>
              <CardSkeleton lines={2} />
              <CardSkeleton lines={4} />
            </>
          ) : (
            <>
              <PnLSummary legs={legs} lotSize={lotSize} showGreeks={showGreeks} spot={estSpot} asOf={asOf} />
              <PayoffChart legs={legs} lotSize={lotSize} spot={estSpot} daysLeft={remainingDays} />
            </>
          )}
        </div>
      </div>

      <footer className="text-[10px] text-slate-400 dark:text-slate-500">Viewing as of {nowLabel} (browser local time)</footer>

      <PositionsCartButton
        legCount={legs.length}
        totalPnl={totalPnl}
        allPriced={allPriced}
        onClick={() => setCartOpen(true)}
      />

      <PositionsCart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        legs={legs}
        lotSize={lotSize}
        spot={estSpot}
        asOf={asOf}
        showGreeks={showGreeks}
        onRemove={removeLeg}
        onLotsChange={updateLegLots}
        onClearAll={() => setLegs([])}
      />
    </main>
  );
}