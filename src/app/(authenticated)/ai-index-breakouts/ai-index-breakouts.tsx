"use client";

import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase/client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, startOfDay, endOfDay, addDays, subDays } from "date-fns";


// ── Types ─────────────────────────────────────────────────────────────────────

interface IndexEntry {
  id: number;
  symbol: string;
  snapshot_time: string;
  sentiment: string | null;
  close: number | null;
  high: number | null;
  low: number | null;
  description: string;
  created_at: string | null;
}

interface OhlcvEntry {
  id: number;
  symbol: string;
  ts: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface GroupedIndex {
  symbol: string;
  mappedSymbol: string;
  sentiment: string;
  firstSeenIso: string;
  startPrice: number | null;
  latestPrice: number | null;
  priceChange: number | null;
  picks: IndexEntry[];
  ohlcvData: OhlcvEntry[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTodayIST(): Date {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + istOffset);
}

function formatDateForHeader(d: Date): string {
  return format(d, "dd MMM yyyy");
}

function formatTimeOnly(isoString: string): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function mapSymbol(symbol: string) {
  if (symbol === "NIFTY50") return "NIFTY";
  if (symbol === "NIFTYBANK") return "BANKNIFTY";
  return symbol;
}

/** Returns true if the pick's description indicates a high/up breakout */
function isUpBreakout(pick: IndexEntry): boolean {
  return pick.description?.toLowerCase().includes("high");
}

/** Per-pick color: green for up breakout, red for low breakout */
function pickColor(pick: IndexEntry): string {
  return isUpBreakout(pick) ? "#10b981" : "#ef4444";
}

/**
 * Derive the card-level theme color from the MAJORITY breakout type.
 * If more picks are "high" breakouts → green; else → red.
 */
function dominantColor(picks: IndexEntry[]): string {
  const upCount = picks.filter(isUpBreakout).length;
  return upCount >= picks.length / 2 ? "#10b981" : "#ef4444";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AIPickedIndex() {
  const [selectedDate, setSelectedDate] = useState<Date>(getTodayIST());
  const [groups, setGroups] = useState<GroupedIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const start = startOfDay(selectedDate).toISOString();
        const end = endOfDay(selectedDate).toISOString();

        // 1. Fetch AI Picks
        const { data: picksData, error: picksError } = await supabase
          .from("ai_picked_index")
          .select("*")
          .gte("snapshot_time", start)
          .lte("snapshot_time", end)
          .order("snapshot_time", { ascending: true });

        if (picksError) throw picksError;

        // 2. Fetch 5-min OHLCV data
        const { data: ohlcvData, error: ohlcvError } = await supabase
          .from("nifty_ohlcv")
          .select("*")
          .gte("ts", start)
          .lte("ts", end)
          .order("ts", { ascending: true });

        if (ohlcvError) throw ohlcvError;

        // 3. Group by Symbol
        const groupedMap = new Map<string, GroupedIndex>();

        (picksData as IndexEntry[] || []).forEach((pick) => {
          const mappedSym = mapSymbol(pick.symbol);

          if (!groupedMap.has(mappedSym)) {
            groupedMap.set(mappedSym, {
              symbol: pick.symbol,
              mappedSymbol: mappedSym,
              sentiment: pick.sentiment || "Neutral",
              firstSeenIso: pick.snapshot_time,
              startPrice: pick.close,
              latestPrice: null,
              priceChange: null,
              picks: [],
              ohlcvData: [],
            });
          }
          groupedMap.get(mappedSym)!.picks.push(pick);
        });

        // 4. Attach OHLCV data and calculate latest stats
        const ohlcvArray = (ohlcvData as OhlcvEntry[]) || [];

        groupedMap.forEach((group, symKey) => {
          const symbolOhlcv = ohlcvArray.filter((o) => o.symbol === symKey);
          group.ohlcvData = symbolOhlcv;

          if (symbolOhlcv.length > 0) {
            const latestEntry = symbolOhlcv[symbolOhlcv.length - 1];
            group.latestPrice = latestEntry.close;

            if (group.startPrice) {
              group.priceChange = group.latestPrice - group.startPrice;
            }
          }
        });

        setGroups(Array.from(groupedMap.values()));
      } catch (err: unknown) {
        console.error("Error fetching index data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch index data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedDate]);

  const handlePrevDay = () => setSelectedDate((d) => subDays(d, 1));
  const handleNextDay = () => setSelectedDate((d) => addDays(d, 1));
  const isToday =
    formatDateForHeader(selectedDate) === formatDateForHeader(getTodayIST());

  return (
    <section className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-8 font-sans">

      {/* ── Header & Date Controls ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono">
            Nifty and BankNifty Breakouts
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-xl leading-relaxed">
            Consolidated daily view. Track every AI pick plotted on the 5-minute intraday chart for NIFTY and BANKNIFTY.
          </p>
          {/* ── Legend ── */}
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
              High Breakout
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-rose-600 dark:text-rose-400">
              <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
              Low Breakout
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 shrink-0">
          <button
            onClick={handlePrevDay}
            className="p-2.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="flex flex-col items-center min-w-[120px]">
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Date</span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
              {formatDateForHeader(selectedDate)}
            </span>
          </div>
          <button
            onClick={handleNextDay}
            disabled={isToday}
            className={`p-2.5 rounded-lg transition-colors ${
              isToday
                ? "opacity-30 cursor-not-allowed text-zinc-400 dark:text-zinc-600"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <p className="text-xs text-zinc-500 font-mono">Compiling intraday index data...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-sm text-rose-400 flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {groups.map((group) => {
            const themeColor = dominantColor(group.picks);
            const isPositive = group.priceChange !== null && group.priceChange >= 0;

            const chartData = group.ohlcvData.map((d) => ({
              time: formatTimeOnly(d.ts),
              close: d.close,
            }));

            // Count per type for the badge summary
            const upCount = group.picks.filter(isUpBreakout).length;
            const downCount = group.picks.length - upCount;

            return (
              <div
                key={group.mappedSymbol}
                className="flex flex-col bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm dark:shadow-none"
              >
                {/* ── Card Header ── */}
                <div className="p-5 pb-4 flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800/50">
                  <div>
                    <h4 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                      {group.mappedSymbol}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {upCount > 0 && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                          ↑ {upCount} High Breakout{upCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {downCount > 0 && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                          ↓ {downCount} Low Breakout{downCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider font-bold rounded-lg font-mono ${
                      group.sentiment.toLowerCase() === "bullish"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                        : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                    }`}
                  >
                    {group.sentiment}
                  </span>
                </div>

                {/* ── Stats Grid ── */}
                <div className="px-5 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-50 dark:bg-zinc-950/30">
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase">1st Broke Time</p>
                    <p className="text-sm font-mono font-medium text-zinc-900 dark:text-zinc-200">
                      {formatTimeOnly(group.firstSeenIso)}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase">Start Price</p>
                    <p className="text-sm font-mono font-medium text-zinc-900 dark:text-zinc-200">
                      {group.startPrice ? group.startPrice.toFixed(2) : "—"}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase">Latest</p>
                    <p className="text-sm font-mono font-medium text-zinc-900 dark:text-zinc-200">
                      {group.latestPrice ? group.latestPrice.toFixed(2) : "—"}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase">Net Change</p>
                    <p
                      className={`text-sm font-mono font-bold ${
                        isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {group.priceChange !== null
                        ? `${isPositive ? "+" : ""}${group.priceChange.toFixed(2)} pts`
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* ── Chart Area ── */}
                <div className="h-64 w-full relative bg-zinc-50 dark:bg-zinc-950/50 p-2">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`grad-${group.mappedSymbol}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={themeColor} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={themeColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e4e4e7"
                          className="dark:stroke-[#27272a]"
                        />
                        <XAxis dataKey="time" hide />
                        <YAxis domain={["auto", "auto"]} hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            borderColor: "#e4e4e7",
                            borderRadius: "8px",
                            fontFamily: "monospace",
                            fontSize: "12px",
                            color: "#18181b",
                          }}
                          itemStyle={{ color: themeColor }}
                          labelStyle={{ color: "#71717a", marginBottom: "4px" }}
                        />

                        {/* ── Per-pick Reference Lines: green = high, red = low ── */}
                        {group.picks.map((pick, idx) => {
                          const lineColor = pickColor(pick);
                          const isUp = isUpBreakout(pick);
                          const label = idx === 0
                            ? (isUp ? "1ST HIGH" : "1ST LOW")
                            : (isUp ? "HIGH BRK" : "LOW BRK");

                          return (
                            <ReferenceLine
                              key={pick.id}
                              x={formatTimeOnly(pick.snapshot_time)}
                              stroke={lineColor}
                              strokeDasharray="3 3"
                              strokeWidth={1.5}
                              label={(props: { viewBox?: { x?: number; y?: number } }) => {
                                const { viewBox } = props;
                                const x = viewBox?.x ?? 0;
                                const y = viewBox?.y ?? 0;
                                return (
                                  <text
                                    x={x}
                                    y={y + 10}
                                    transform={`rotate(-90, ${x}, ${y})`}
                                    fill={lineColor}
                                    fontSize={10}
                                    fontFamily="monospace"
                                    textAnchor="end"
                                  >
                                    {label}
                                  </text>
                                );
                              }}
                            />
                          );
                        })}

                        <Area
                          type="monotone"
                          dataKey="close"
                          stroke={themeColor}
                          strokeWidth={2}
                          fillOpacity={1}
                          fill={`url(#grad-${group.mappedSymbol})`}
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-zinc-400 dark:text-zinc-600 font-mono">
                        No OHLCV data available
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 px-6 py-20 flex flex-col items-center justify-center mt-6">
          <p className="text-sm text-zinc-400 dark:text-zinc-500 font-mono">
            No index breakout recorded for {formatDateForHeader(selectedDate)}.
          </p>
          <button
            onClick={() => setSelectedDate(getTodayIST())}
            className="mt-4 px-4 py-2 text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            Return to Today
          </button>
        </div>
      )}

      {/* ── Disclaimer ── */}
      <div className="mt-12 p-4 border-t border-zinc-200 dark:border-zinc-800/50">
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono text-center leading-relaxed max-w-3xl mx-auto">
          <strong>Disclaimer:</strong> The AI breakout indices and related data presented on this platform are for informational and educational purposes only. They do not constitute financial, investment, or trading advice. AI predictions are probabilistic and can be incorrect due to market volatility. Always conduct your own research.
        </p>
      </div>

    </section>
  );
}