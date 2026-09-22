"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from '@/lib/supabase/client';
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";


// ── Types ─────────────────────────────────────────────────────────────────────

interface StockEntry {
  id: number;
  symbol: string;
  snapshot_time: string;
  sentiment: string | null;
  close: number | null;
  pcnt: number | null;
  screener_count: number | null;
  sector: string | null;
  screener_names: string | null;
  breakout_desc: string | null;
  breakout_close: number | null;
  created_at: string | null;
}

interface GroupedStock {
  symbol: string;
  cleanSymbol: string;
  sector: string;
  sentiment: string;
  firstSeenIso: string;
  startPrice: number;
  latestPrice: number;
  latestDayPcnt: number;
  netGain: number;
  netGainPcnt: number;
  isSuccess: boolean;
  history: {
    time: string;
    iso: string;
    close: number;
    dayPcnt: number;
    pcntSinceFirst: number;
    diff: number;
  }[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractSymbol(raw: string): string {
  return raw.replace(/^(NSE|BSE):/, "").replace(/-EQ$/, "");
}

// Get current date in YYYY-MM-DD format based on IST Timezone
function getTodayIST(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

function toISTTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateForHeader(dateString: string) {
  if (dateString === getTodayIST()) return "Today";
  const d = new Date(`${dateString}T12:00:00+05:30`);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── UI Components ─────────────────────────────────────────────────────────────

function SentimentBadge({ sentiment }: { sentiment: string | null }) {
  if (!sentiment) return null;
  const s = sentiment.toUpperCase();
  if (s === "BULLISH")
    return (
      <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
        BULLISH
      </span>
    );
  if (s === "BEARISH")
    return (
      <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
        BEARISH
      </span>
    );
  return (
    <span className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
      {s}
    </span>
  );
}

interface TooltipData {
  time: string;
  close: number;
  dayPcnt: number;
  pcntSinceFirst: number;
}

const StockTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as TooltipData;

    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 text-xs shadow-2xl min-w-[180px]">
        <p className="font-bold text-zinc-600 dark:text-zinc-400 mb-3">{label}</p>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center gap-4">
            <span className="text-zinc-500">Close:</span>
            <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
              ₹{data.close.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-zinc-500">Day Change:</span>
            <span
              className={`font-mono font-medium ${
                data.dayPcnt >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {data.dayPcnt >= 0 ? "+" : ""}
              {data.dayPcnt.toFixed(2)}%
            </span>
          </div>

          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-2" />

          <div className="flex justify-between items-center gap-4">
            <span className="text-zinc-500">Since Picked:</span>
            <span
              className={`font-mono font-bold ${
                data.pcntSinceFirst >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {data.pcntSinceFirst >= 0 ? "+" : ""}
              {data.pcntSinceFirst.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// ── Skeletons ─────────────────────────────────────────────────────────────────

function TimelineSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse mt-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-zinc-100 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200 dark:border-zinc-800/60" />
        ))}
      </div>

      <div className="relative pl-6 sm:pl-8 border-l border-zinc-200 dark:border-zinc-800/50 space-y-10">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[31px] sm:-left-[39px] top-0 bg-white dark:bg-[#0a0a0a] py-1">
              <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700" />
            </div>
            <div className="h-6 w-24 bg-zinc-100 dark:bg-zinc-800/50 rounded mb-4" />
            <div className="h-48 bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AIPickedStocks() {
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState<string>(getTodayIST());
  const [dayEntries, setDayEntries] = useState<StockEntry[]>([]);
  const [dayLoading, setDayLoading] = useState(true);
  const [dayError, setDayError] = useState<string | null>(null);

  // ── Fetch entries for the selected day ────────────────────────────────────
  const fetchEntriesForDay = useCallback(async (dateString: string) => {
    setDayLoading(true);
    setDayError(null);
    try {
      // Create UTC bounds for the chosen IST day
      const start = new Date(`${dateString}T09:25:00+05:30`).toISOString();
      const end = new Date(`${dateString}T15:20:00+05:30`).toISOString();

      const { data, error } = await supabase
        .from("ai_picked_stocks")
        .select("*")
        .gte("snapshot_time", start)
        .lte("snapshot_time", end)
        .order("snapshot_time", { ascending: false });

      if (error) throw error;
      setDayEntries((data ?? []) as StockEntry[]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setDayError(err.message);
      } else {
        setDayError("Failed to fetch picks for this date.");
      }

      setDayEntries([]);
    } finally {
      setDayLoading(false);
    }
  }, []);

  // Trigger fetch when selectedDate changes
  useEffect(() => {
    fetchEntriesForDay(selectedDate);
  }, [selectedDate, fetchEntriesForDay]);

  // ── Derived data ───────────────────────────────────────────────────────────
  const groupedTimeline = useMemo(() => {
    if (!dayEntries.length) return [];
    
    const symbolMap = new Map<string, StockEntry[]>();
    dayEntries.forEach((e) => {
      if (!symbolMap.has(e.symbol)) symbolMap.set(e.symbol, []);
      symbolMap.get(e.symbol)!.push(e);
    });

    const uniqueStocks: GroupedStock[] = Array.from(symbolMap.values()).map(
      (entries) => {
        entries.sort(
          (a, b) =>
            new Date(a.snapshot_time).getTime() -
            new Date(b.snapshot_time).getTime()
        );

        const first = entries[0];
        const last = entries[entries.length - 1];

        const startPrice = first.close ?? 0;
        const latestPrice = last.close ?? 0;
        const netGain = latestPrice - startPrice;
        const netGainPcnt = startPrice ? (netGain / startPrice) * 100 : 0;
        
        // Define if prediction was a success based on sentiment vs actual move
        const sentiment = first.sentiment || "BULLISH";
        const isSuccess = sentiment.toUpperCase() === "BEARISH" ? netGain <= 0 : netGain > 0;

        const history = entries.map((e) => {
          const c = e.close ?? 0;
          const diff = c - startPrice;
          const pcntSinceFirst = startPrice ? (diff / startPrice) * 100 : 0;
          return {
            time: toISTTime(e.snapshot_time),
            iso: e.snapshot_time,
            close: c,
            dayPcnt: e.pcnt ?? 0,
            pcntSinceFirst,
            diff,
          };
        });

        return {
          symbol: first.symbol,
          cleanSymbol: extractSymbol(first.symbol),
          sector: first.sector || "General",
          sentiment,
          firstSeenIso: first.snapshot_time,
          startPrice,
          latestPrice,
          latestDayPcnt: last.pcnt ?? 0,
          netGain,
          netGainPcnt,
          isSuccess,
          history,
        };
      }
    );

    const timeGroupMap = new Map<string, GroupedStock[]>();
    uniqueStocks.forEach((stock) => {
      const timeKey = toISTTime(stock.firstSeenIso);
      if (!timeGroupMap.has(timeKey)) timeGroupMap.set(timeKey, []);
      timeGroupMap.get(timeKey)!.push(stock);
    });

    const sortedGroups = Array.from(timeGroupMap.entries()).sort((a, b) => {
      return (
        new Date(b[1][0].firstSeenIso).getTime() -
        new Date(a[1][0].firstSeenIso).getTime()
      );
    });

    return sortedGroups.map(([time, stocks]) => ({
      time,
      stocks: stocks.sort((sa, sb) => sb.latestDayPcnt - sa.latestDayPcnt),
    }));
  }, [dayEntries]);

  const analytics = useMemo(() => {
    if (!groupedTimeline.length) return null;
    let totalStocks = 0;
    let sumNetGainPcnt = 0;
    let successCount = 0;

    groupedTimeline.forEach(({ stocks }) => {
      stocks.forEach((s) => {
        totalStocks++;
        sumNetGainPcnt += s.netGainPcnt;
        if (s.isSuccess) successCount++;
      });
    });

    return {
      totalStocks,
      avgGrabbed: totalStocks > 0 ? sumNetGainPcnt / totalStocks : 0,
      accuracyRate: totalStocks > 0 ? (successCount / totalStocks) * 100 : 0,
    };
  }, [groupedTimeline]);

  const isMarketClosed = useMemo(() => {
    const todayKey = getTodayIST();
    if (selectedDate < todayKey) return true;

    if (selectedDate === todayKey) {
      const now = new Date();
      const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
      const hours = istTime.getUTCHours();
      const minutes = istTime.getUTCMinutes();
      return hours > 15 || (hours === 15 && minutes >= 30);
    }
    return false;
  }, [selectedDate]);

  // ── Navigation handlers ────────────────────────────────────────────────────
  const adjustDay = useCallback((days: number) => {
    const d = new Date(`${selectedDate}T12:00:00+05:30`);
    d.setDate(d.getDate() + days);
    
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    setSelectedDate(formatter.format(d));
  }, [selectedDate]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section className="w-full space-y-6">
      {/* ── Header & Date Navigator ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono">
            AI Timeline Picks for Stocks
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-1 font-mono">
            Tracking precise breakout momentum & probabilities
          </p>
        </div>

        {/* Date Navigation Controls */}
        <div className="flex items-center gap-1 sm:gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-xl w-full sm:w-auto">
          {/* Left Arrow (Older) */}
          <button
            onClick={() => adjustDay(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all active:scale-95 shrink-0"
            aria-label="Previous Day"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Native Date Display - Clickable & Mobile Friendly - NOW FULL WIDTH CLICKABLE */}
          <div className="relative flex-1 sm:flex-none flex items-center justify-center min-w-[140px] px-2 sm:px-4 h-10 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors group">
            <input
              type="date"
              value={selectedDate}
              max={getTodayIST()}
              onChange={(e) => {
                if(e.target.value) setSelectedDate(e.target.value)
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex items-center justify-center gap-2 w-full pointer-events-none">
              <span className="text-sm font-bold font-mono text-zinc-800 dark:text-zinc-100 whitespace-nowrap">
                {formatDateForHeader(selectedDate)}
              </span>
              <svg
                className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Right Arrow (Newer) */}
          <button
            onClick={() => adjustDay(1)}
            disabled={selectedDate >= getTodayIST()}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all active:scale-95 shrink-0"
            aria-label="Next Day"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Content Area ── */}
      {dayLoading && <TimelineSkeleton />}

      {dayError && !dayLoading && (
        <div className="rounded-2xl border border-rose-500/20 bg-zinc-50 dark:bg-[#111113] p-8 text-center mt-6">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-rose-500 text-xl font-bold">!</span>
          </div>
          <h3 className="text-zinc-800 dark:text-zinc-100 font-bold font-mono text-lg mb-2">
            Failed to load picks
          </h3>
          <p className="text-sm text-zinc-500 font-mono mb-6">{dayError}</p>
          <button
            onClick={() => fetchEntriesForDay(selectedDate)}
            className="px-6 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-mono font-medium rounded-lg border border-indigo-500/20 transition-all active:scale-95"
          >
            Retry Loading
          </button>
        </div>
      )}

      {!dayLoading && !dayError && (
        <>
          {/* ── Top Analytics ── */}
          {analytics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
              <div className="bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-1">
                  Total Picks
                </p>
                <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  {analytics.totalStocks}
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-1">
                  Avg Gain Grabbed
                </p>
                <p
                  className={`text-2xl font-bold font-mono ${
                    analytics.avgGrabbed >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {analytics.avgGrabbed >= 0 ? "+" : ""}
                  {analytics.avgGrabbed.toFixed(2)}%
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-1">
                  Accuracy Rate
                </p>
                <p className={`text-2xl font-bold font-mono ${
                    analytics.accuracyRate >= 50 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}>
                  {analytics.accuracyRate.toFixed(1)}%
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-4 flex flex-col justify-center">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-2">
                  Market Status
                </p>
                {isMarketClosed ? (
                  <span className="inline-flex w-fit items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700/50 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                    Resolved (Closed)
                  </span>
                ) : (
                  <span className="inline-flex w-fit items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Tracking
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── Timeline ── */}
          {groupedTimeline.length > 0 ? (
            <div className="relative pl-6 sm:pl-8 border-l border-zinc-200 dark:border-zinc-800 space-y-10 pb-8 mt-4">
              {groupedTimeline.map(({ time, stocks }, idx) => (
                <div key={time} className="relative">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-0 bg-white dark:bg-[#0a0a0a] py-1">
                    <div className="w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-900 border-2 border-indigo-500 flex items-center justify-center">
                      {idx === 0 && !isMarketClosed && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      )}
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-3">
                    <h3 className="text-sm font-bold font-mono text-zinc-800 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5">
                      {time}
                    </h3>
                    <span className="text-xs font-mono text-zinc-500">
                      {stocks.length} pick{stocks.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                <div className="grid grid-cols-1 gap-5">
                  {stocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-4 sm:p-5 flex flex-col xl:flex-row gap-5 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-all group"
                      onClick={() => router.push(`/stocks/${stock.cleanSymbol}`)}
                    >
                      {/* ================= LEFT (INFO) ================= */}
                      <div className="w-full xl:w-1/3 flex flex-col">
                        
                        {/* 🔹 HEADER */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-none">
                              {stock.cleanSymbol}
                            </h4>
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">
                              {stock.sector}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <SentimentBadge sentiment={stock.sentiment} />

                            {isMarketClosed && (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border ${
                                  stock.isSuccess
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                }`}
                              >
                                {stock.isSuccess ? "SUCCESS" : "FAILED"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 🔥 AFTER PICK KPI */}
                        {stock.history.length > 1 && (
                          <div className="mt-3">
                            <div
                              className={`inline-block px-3 py-1 rounded-md text-xs font-mono font-semibold tracking-wide ${
                                stock.netGainPcnt >= 0
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {stock.netGainPcnt >= 0 ? "▲" : "▼"}{" "}
                              {Math.abs(stock.netGainPcnt).toFixed(2)}% AFTER PICK
                            </div>
                          </div>
                        )}

                        {/* 💰 PRICE ROW */}
                        <div className="mt-4 grid grid-cols-2 gap-6">
                          {/* PICK PRICE */}
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mb-1">
                              Pick Price
                            </p>
                            <p className="text-sm font-mono text-zinc-700 dark:text-zinc-300">
                              ₹{stock.startPrice.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </div>

                          {/* CURRENT */}
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mb-1">
                              Current
                            </p>

                            <div className="flex items-center gap-2">
                              <p className="text-sm font-mono text-zinc-900 dark:text-zinc-100">
                                ₹{stock.latestPrice.toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                              </p>

                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap ${
                                  stock.latestDayPcnt >= 0
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {stock.latestDayPcnt >= 0 ? "▲" : "▼"}{" "}
                                {Math.abs(stock.latestDayPcnt).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ================= RIGHT (CHART) ================= */}
                      <div className="w-full xl:w-2/3 h-56 xl:h-40 bg-zinc-100 dark:bg-[#0a0a0c] border border-zinc-200 dark:border-zinc-800/40 rounded-xl p-3 relative">
                        {stock.history.length > 1 ? (
                          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <AreaChart data={stock.history}>
                              <defs>
                                <linearGradient
                                  id={`grad-${stock.cleanSymbol}`}
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor={stock.netGain >= 0 ? "#22c55e" : "#ef4444"}
                                    stopOpacity={0.25}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor={stock.netGain >= 0 ? "#22c55e" : "#ef4444"}
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>

                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#d4d4d8"
                                className="dark:stroke-[#1c1c1f]"
                                vertical={false}
                              />

                              <XAxis
                                dataKey="time"
                                tick={{ fontSize: 10, fill: "#71717a" }}
                                stroke="#d4d4d8"
                                className="dark:stroke-[#1c1c1f]"
                                tickMargin={5}
                                minTickGap={20}
                              />

                              <YAxis
                                domain={["auto", "auto"]}
                                tick={{ fontSize: 10, fill: "#71717a" }}
                                stroke="#d4d4d8"
                                className="dark:stroke-[#1c1c1f]"
                                tickFormatter={(v) => "₹" + v.toLocaleString("en-IN")}
                                width={60}
                                tickMargin={5}
                              />

                              <Tooltip content={<StockTooltip />} />

                              <Area
                                type="monotone"
                                dataKey="close"
                                stroke={stock.netGain >= 0 ? "#22c55e" : "#ef4444"}
                                strokeWidth={2}
                                fill={`url(#grad-${stock.cleanSymbol})`}
                                isAnimationActive={false}
                                activeDot={{
                                  r: 4,
                                  fill: stock.netGain >= 0 ? "#22c55e" : "#ef4444",
                                  stroke: "#fff",
                                  className: "dark:stroke-[#000]",
                                  strokeWidth: 2,
                                }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 bg-zinc-200/50 dark:bg-zinc-900/30 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-800">
                            {isMarketClosed ? (
                              <>
                                <div
                                  className={`w-2 h-2 rounded-full mb-2 ${
                                    stock.isSuccess ? "bg-emerald-500" : "bg-rose-500"
                                  }`}
                                />
                                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                                  {stock.isSuccess ? "Prediction Success" : "Prediction Failed"}
                                </p>
                                <p className="text-[9px] font-mono mt-1 text-zinc-500 text-center max-w-[200px]">
                                  Market closed before additional momentum points were charted.
                                </p>
                              </>
                            ) : (
                              <>
                                <div className="w-2 h-2 rounded-full bg-indigo-500 mb-2 animate-pulse" />
                                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                                  Tracking Started
                                </p>
                                <p className="text-[9px] font-mono mt-1 text-zinc-500">
                                  Awaiting more data points for chart
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 px-6 py-20 flex flex-col items-center justify-center mt-6">
              <p className="text-sm text-zinc-500 font-mono">
                No picks recorded for {formatDateForHeader(selectedDate)}.
              </p>
              <button
                onClick={() => setSelectedDate(getTodayIST())}
                className="mt-4 px-4 py-2 text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-300 dark:border-zinc-700"
              >
                Return to Today
              </button>
            </div>
          )}

          {/* ── Disclaimer ── */}
          <div className="mt-12 p-4 border-t border-zinc-200 dark:border-zinc-800/50">
            <p className="text-[10px] text-zinc-500 font-mono text-center leading-relaxed max-w-3xl mx-auto">
              <strong>Disclaimer:</strong> The AI-picked stocks and related data presented on this platform are for informational and educational purposes only. They do not constitute financial, investment, or trading advice. AI predictions are probabilistic and can be incorrect due to market volatility. Always conduct your own research or consult with a qualified financial advisor before making any investment decisions.
            </p>
          </div>
        </>
      )}
    </section>
  );
}