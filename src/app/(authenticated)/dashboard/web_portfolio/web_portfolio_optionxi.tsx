"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  X,
  Radio,
  TrendingUp,
  Flame,
  ArrowLeft,
  Bell,
  MessageCircle,
  ChevronRight,
  Clock,
} from "lucide-react";
import PriceChartSheet from "./price_chart_sheet";
import { supabase } from "@/lib/supabase/client";

interface ParsedSymbol {
  exchange: string;
  symbol: string;
  segment: string;
}

function parseSymbol(value: string): ParsedSymbol {
  const [exchange = "", rest = ""] = value.split(":");

  const [symbol = "", segment = ""] = rest.split("-");

  return {
    exchange,
    symbol,
    segment,
  };
}

/* ------------------------------------------------------------------ */
/* Types — mirror opxi_portfolio / opxi_daily_accuracy                 */
/* ------------------------------------------------------------------ */

type PickStatus = "pending" | "win" | "loss";

interface PortfolioRow {
  symbol: string;
  pick_date: string; // yyyy-mm-dd
  sentiment: "BULLISH" | "BEARISH";
  entry_time: string;
  entry_price: number;
  eval_time: string;
  eval_price: number;
  pnl_pcnt: number;
  status: PickStatus;
  is_final: boolean;
}

interface DailyAccuracy {
  pick_date: string;
  total_picks: number;
  wins: number;
  losses: number;
  accuracy_pct: number | null; // null when no win/loss yet (all pending)
  has_pending: boolean;
}

// A single cell in the calendar grid. `data` is null for weekends/holidays
// or any day outside the fetched accuracy window.
interface CalendarDay {
  date: string; // yyyy-mm-dd
  dayOfMonth: number;
  isWeekend: boolean;
  inRange: boolean; // true if this date actually has an accuracy row
  data: DailyAccuracy | null;
}

const MAX_LIVE_PICKS = 5;
const ACCURACY_DAYS = 14;
const PICKS_FETCH_LIMIT = 200; // enough to cover two weeks of picks for day filtering
const POLL_MS = 2 * 60 * 1000;

const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Slow "storytelling" reveal: each pick lands, then its % and status badge
// appear together, then the next pick lands, and so on.
const AUTOPLAY_REVEAL_COUNT = 4; // stocks shown per day before advancing
const AUTOPLAY_ITEM_INTERVAL_MS = 2000; // gap between each stock + its result
const AUTOPLAY_STATUS_DELAY_MS = 800; // delay after a stock appears before its % + status show
const AUTOPLAY_DAY_HOLD_MS = 6000; // pause once a day's stocks are all shown
const AUTOPLAY_EMPTY_DAY_SKIP_MS = 500; // skip quickly past days with no picks

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function dayLabel(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
  });
}

function fullDayLabel(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

function timeIST(t: string) {
  return new Date(t).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

function pickKey(p: PortfolioRow) {
  return `${p.symbol}-${p.pick_date}-${p.entry_time}`;
}

// yyyy-mm-dd from a local Date, without any UTC shifting.
function formatDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Turns the flat accuracy rows into full calendar weeks (Sun -> Sat),
// padding out to complete weeks so weekends/holidays always show up
// as their own gray cells alongside the scored trading days.
function buildCalendarWeeks(accuracy: DailyAccuracy[]): CalendarDay[][] {
  if (accuracy.length === 0) return [];

  const byDate = new Map(accuracy.map((d) => [d.pick_date, d]));
  const timestamps = accuracy.map((d) => new Date(`${d.pick_date}T00:00:00`).getTime());
  const minDate = new Date(Math.min(...timestamps));
  const maxDate = new Date(Math.max(...timestamps));

  const start = new Date(minDate);
  start.setDate(start.getDate() - start.getDay()); // rewind to Sunday
  const end = new Date(maxDate);
  end.setDate(end.getDate() + (6 - end.getDay())); // forward to Saturday

  const days: CalendarDay[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const key = formatDateKey(cursor);
    const dow = cursor.getDay();
    days.push({
      date: key,
      dayOfMonth: cursor.getDate(),
      isWeekend: dow === 0 || dow === 6,
      inRange: byDate.has(key),
      data: byDate.get(key) ?? null,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400 sm:px-4 sm:py-1.5 sm:text-xs">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function PortfolioSection() {
  const [picks, setPicks] = useState<PortfolioRow[]>([]);
  const [accuracy, setAccuracy] = useState<DailyAccuracy[]>([]);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [chartPick, setChartPick] = useState<PortfolioRow | null>(null);

  // Slow-reveal / auto-cycle state: picks appear one at a time, then the
  // demo hops to the next previous day and reveals its picks too.
  const [autoPlaying, setAutoPlaying] = useState(true);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  // Tracks which pick rows have had their result (% + status) revealed yet.
  const [statusReadyCount, setStatusReadyCount] = useState(0);

  // Subscribe dialog (Play Store / Web / support).
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);

  // Track which accuracy days the user has already "seen" rendered, so
  // only genuinely new day-cells get the entrance animation on later polls.
  const seenDaysRef = useRef<Set<string>>(new Set());
  const [freshDays, setFreshDays] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      const [{ data: pickRows, error: e1 }, { data: accRows, error: e2 }] =
        await Promise.all([
          supabase
            .from("web_portfolio")
            .select("*")
            .order("pick_date", { ascending: false })
            .order("entry_time", { ascending: false })
            .limit(PICKS_FETCH_LIMIT),
          supabase
            .from("web_daily_accuracy")
            .select("*")
            .order("pick_date", { ascending: false })
            .limit(ACCURACY_DAYS),
        ]);

      if (e1 || e2) throw e1 ?? e2;

      setPicks((pickRows as PortfolioRow[]) ?? []);
      // oldest -> newest so the calendar reads left to right, top to bottom
      setAccuracy(((accRows as DailyAccuracy[]) ?? []).slice().reverse());
      setErrored(false);
    } catch (err) {
      console.error("PortfolioSection load failed", err);
      setErrored(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  // Mark newly-arrived accuracy days so they get a "just landed" entrance
  // animation on the calendar grid.
  useEffect(() => {
    if (!accuracy.length) return;
    const newly = accuracy
      .map((d) => d.pick_date)
      .filter((k) => !seenDaysRef.current.has(k));
    if (newly.length) {
      newly.forEach((k) => seenDaysRef.current.add(k));
      setFreshDays(new Set(newly));
      const t = setTimeout(() => setFreshDays(new Set()), newly.length * 90 + 700);
      return () => clearTimeout(t);
    }
  }, [accuracy]);

  const scored = accuracy.filter((d) => d.accuracy_pct !== null);
  const avgAccuracy = scored.length
    ? Math.round(
        scored.reduce((s, d) => s + (d.accuracy_pct ?? 0), 0) / scored.length
      )
    : 0;
  const greenDays = scored.filter((d) => (d.accuracy_pct ?? 0) >= 60).length;
  const redDays = scored.length - greenDays;

  const calendarWeeks = useMemo(() => buildCalendarWeeks(accuracy), [accuracy]);

  const calendarRangeLabel = useMemo(() => {
    if (!accuracy.length) return "";
    const first = new Date(`${accuracy[0].pick_date}T00:00:00`);
    const last = new Date(`${accuracy[accuracy.length - 1].pick_date}T00:00:00`);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    const a = fmt(first);
    const b = fmt(last);
    return a === b ? a : `${a} – ${b}`;
  }, [accuracy]);

  const selectedDayMeta = useMemo(
    () => accuracy.find((d) => d.pick_date === selectedDate) ?? null,
    [accuracy, selectedDate]
  );

  const displayedPicks = useMemo(() => {
    if (selectedDate) {
      return picks.filter((p) => p.pick_date === selectedDate);
    }
    return picks.slice(0, MAX_LIVE_PICKS);
  }, [picks, selectedDate]);

  // The sequence the demo walks through: live picks first, then each
  // previous day that actually has picks, most recent first.
  const autoplaySequence = useMemo(() => {
    const pastDays = accuracy
      .filter((d) => d.total_picks > 0)
      .map((d) => d.pick_date)
      .reverse(); // most recent day first
    return [null as string | null, ...pastDays];
  }, [accuracy]);

  // Keep selectedDate in sync with the autoplay cycle while it's running.
  useEffect(() => {
    if (!autoPlaying || loading || autoplaySequence.length === 0) return;
    const date = autoplaySequence[cycleIndex % autoplaySequence.length];
    setSelectedDate(date);
  }, [autoPlaying, loading, cycleIndex, autoplaySequence]);

  // Reveal ticker: item → % + status → item → % + status ... then hold,
  // then move to the next day in the sequence (and loop back to live).
  useEffect(() => {
    if (!autoPlaying || loading || errored || autoplaySequence.length === 0) {
      return;
    }

    const cap = Math.min(AUTOPLAY_REVEAL_COUNT, displayedPicks.length);

    if (cap === 0) {
      const t = setTimeout(() => {
        setVisibleCount(0);
        setStatusReadyCount(0);
        setCycleIndex((i) => (i + 1) % autoplaySequence.length);
      }, AUTOPLAY_EMPTY_DAY_SKIP_MS);
      return () => clearTimeout(t);
    }

    // Phase 1: item is visible but its result hasn't shown yet.
    // Wait STATUS_DELAY, then reveal this item's % + status together.
    if (visibleCount > 0 && statusReadyCount < visibleCount) {
      const t = setTimeout(
        () => setStatusReadyCount((c) => c + 1),
        AUTOPLAY_STATUS_DELAY_MS
      );
      return () => clearTimeout(t);
    }

    // Phase 2: current item fully settled (item + result). If we still
    // have more items to show, wait the full interval before revealing
    // the next item.
    if (visibleCount < cap) {
      const t = setTimeout(
        () => setVisibleCount((c) => c + 1),
        AUTOPLAY_ITEM_INTERVAL_MS
      );
      return () => clearTimeout(t);
    }

    // Phase 3: all items revealed with their results. Hold, then advance.
    const t = setTimeout(() => {
      setVisibleCount(0);
      setStatusReadyCount(0);
      setCycleIndex((i) => (i + 1) % autoplaySequence.length);
    }, AUTOPLAY_DAY_HOLD_MS);
    return () => clearTimeout(t);
  }, [
    autoPlaying,
    loading,
    errored,
    visibleCount,
    statusReadyCount,
    displayedPicks,
    autoplaySequence,
  ]);

  // What actually gets rendered: capped to visibleCount while auto-playing,
  // shown in full once the user takes over manually.
  const revealedPicks = useMemo(() => {
    if (!autoPlaying) return displayedPicks;
    return displayedPicks.slice(0, visibleCount);
  }, [displayedPicks, visibleCount, autoPlaying]);

  const handleDayClick = (d: DailyAccuracy) => {
    if (d.total_picks === 0) return;
    setAutoPlaying(false);
    setVisibleCount(MAX_LIVE_PICKS);
    setStatusReadyCount(MAX_LIVE_PICKS);
    setSelectedDate((cur) => (cur === d.pick_date ? null : d.pick_date));
  };

  const goToLive = () => {
    setAutoPlaying(false);
    setVisibleCount(MAX_LIVE_PICKS);
    setStatusReadyCount(MAX_LIVE_PICKS);
    setSelectedDate(null);
  };

  const resumeAutoplay = () => {
    setCycleIndex(0);
    setVisibleCount(0);
    setStatusReadyCount(0);
    setAutoPlaying(true);
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <div className="pointer-events-none absolute left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full " />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        {/* <div className="mb-8 text-center">
          <Pill>Stocks AI Picked</Pill>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:mt-6 sm:text-4xl md:text-5xl">
            See trending stocks,{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              and why.
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-zinc-600 dark:text-zinc-400 sm:mt-4 sm:text-lg">
            Our AI scans the market using technical indicators and sends you a
            notification when something interesting shows up. No more hours of
            research — just open the app and learn. Built for education, not
            as financial advice.
          </p>
        </div> */}

        {/* <div className="text-center">
          <button
            onClick={() => setShowSubscribeDialog(true)}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-3 text-xs font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 sm:px-7 sm:py-3.5 sm:text-sm"
          >
            <Bell size={16} />
            Notify me when AI picks a stock
          </button>
        </div>
        <br/> */}

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* ------------------------- LEFT: 14-day accuracy calendar ------------------------- */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:rounded-3xl sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 sm:text-xs">
                  Last 14 days
                </p>
                <h3 className="mt-2 flex items-center gap-2 text-xl font-semibold sm:mt-3 sm:text-2xl">
                  Check our past portfolio
                  <TrendingUp className="h-5 w-5 text-emerald-500 sm:h-6 sm:w-6" />
                </h3>
              </div>
              {!loading && calendarRangeLabel && (
                <span className="mt-1 shrink-0 rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:px-3 sm:py-1 sm:text-[11px]">
                  {calendarRangeLabel}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm md:text-base">
             See which stocks the AI picked and how those picks performed each day.
            </p>

            <div className="mt-4 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800 sm:mt-6 sm:rounded-2xl sm:p-4">
              {/* Weekday header row */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {WEEKDAY_HEADERS.map((wd) => (
                  <div
                    key={wd}
                    className="pb-1 text-center text-[9px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 sm:text-[10px]"
                  >
                    {wd}
                  </div>
                ))}
              </div>

              {loading && (
                <div className="mt-1.5 grid grid-cols-7 gap-1 sm:gap-1.5">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/40 sm:rounded-lg"
                    />
                  ))}
                </div>
              )}

              {!loading &&
                calendarWeeks.map((week, wi) => (
                  <div key={wi} className="mt-1.5 grid grid-cols-7 gap-1 sm:gap-1.5">
                    {week.map((cell, ci) => {
                      const d = cell.data;
                      const pct = d?.accuracy_pct ?? null;
                      const win = pct !== null && pct >= 60;
                      const isHoliday = !d || d.total_picks === 0;
                      const clickable = !!d && d.total_picks > 0;
                      const isSelected = selectedDate === cell.date;
                      const isFresh = freshDays.has(cell.date);

                      return (
                        <button
                          key={cell.date}
                          type="button"
                          disabled={!clickable}
                          onClick={() => d && handleDayClick(d)}
                          style={isFresh ? { animationDelay: `${(wi * 7 + ci) * 60}ms` } : undefined}
                          title={
                            d
                              ? pct !== null
                                ? `${fullDayLabel(cell.date)} · ${pct}% moved up · ${d.wins} up / ${d.losses} down${
                                    d.has_pending ? " · still live" : ""
                                  }`
                                : clickable
                                ? `${fullDayLabel(cell.date)} · waiting on results${d.has_pending ? " · live" : ""}`
                                : `${fullDayLabel(cell.date)} · no picks`
                              : `${fullDayLabel(cell.date)} · weekend / holiday`
                          }
                          className={`relative flex aspect-square min-w-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-md text-[9px] font-semibold transition-transform sm:rounded-lg sm:text-[11px] ${
                            isHoliday
                              ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800/40 dark:text-zinc-600"
                              : pct === null
                              ? "bg-zinc-300 text-white dark:bg-zinc-700"
                              : win
                              ? "bg-emerald-500/90 text-white"
                              : "bg-red-500/85 text-white"
                          } ${
                            clickable
                              ? "cursor-pointer hover:scale-105"
                              : "cursor-default opacity-70"
                          } ${
                            isSelected
                              ? "ring-2 ring-offset-1 ring-zinc-900 dark:ring-white dark:ring-offset-zinc-900 sm:ring-offset-2"
                              : ""
                          } ${isFresh ? "opxi-enter-day" : ""}`}
                        >
                          <span className="text-[8px] font-normal opacity-70 sm:text-[10px]">
                            {cell.dayOfMonth}
                          </span>
                          <span>
                            {isHoliday ? "·" : pct !== null ? `${pct}%` : "—"}
                          </span>
                          {d?.has_pending && (
                            <Flame
                              size={8}
                              className="absolute -right-0.5 -top-0.5 rounded-full bg-amber-400 p-0.5 text-zinc-900 sm:h-3 sm:w-3"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 sm:mt-4 sm:gap-x-4 sm:gap-y-2 sm:text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded bg-emerald-500 sm:h-3 sm:w-3" /> 60%+ moved up
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded bg-red-500/85 sm:h-3 sm:w-3" /> More moved down
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded bg-zinc-100 dark:bg-zinc-800/40 sm:h-3 sm:w-3" /> Weekend / holiday
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={10} className="text-amber-500 sm:h-3 sm:w-3" /> Result pending
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center sm:mt-5 sm:gap-3">
              {[
                { label: "Avg accuracy", value: `${avgAccuracy}%` },
                { label: "Green days", value: String(greenDays) },
                { label: "Red days", value: String(redDays) },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-zinc-200 px-2 py-2 dark:border-zinc-800 sm:rounded-2xl sm:px-3 sm:py-3"
                >
                  <p className="text-base font-semibold tabular-nums sm:text-lg">{s.value}</p>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 sm:text-[11px]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-3 text-center text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-500 sm:mt-4 sm:text-[11px]">
              Past results don&apos;t guarantee future outcomes. OptionXi is an
              educational tool — not investment advice. Always do your own
              research before taking any trade.
            </p>
          </div>

          {/* ------------------------- RIGHT: live picks ------------------------- */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:rounded-3xl sm:p-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 sm:text-xs">
              {selectedDate ? "Stocks we picked that day" : "Live picks"}
            </p>
            <h3 className="mt-2 text-xl font-semibold sm:mt-3 sm:text-2xl">
              {selectedDate ? fullDayLabel(selectedDate) : "Pick. Learn. Repeat."}
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
              {selectedDate
                ? `${
                    selectedDayMeta?.total_picks ?? displayedPicks.length
                  } stock${
                    (selectedDayMeta?.total_picks ?? displayedPicks.length) === 1
                      ? ""
                      : "s"
                  } the AI flagged that day. We show you what happened next so you can learn from it — this is a record, not a recommendation.`
                : "Every trading day, our AI scans for stocks showing interesting technical setups. When it finds one, it picks it, records the price, and sends you a notification so you don't miss it."}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6">
              {selectedDate ? (
                <button
                  onClick={goToLive}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:px-4 sm:py-2 sm:text-sm"
                >
                  <ArrowLeft size={14} />
                  Back to today's picks
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800/60 sm:px-4 sm:py-2 sm:text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="font-medium">optionxi.com/live</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Live
                  </span>
                </div>
              )}

              {!autoPlaying && (
                <button
                  onClick={resumeAutoplay}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 hover:underline dark:text-emerald-400 sm:text-xs"
                >
                  ▶ Resume auto-play
                </button>
              )}
            </div>

            <ul
              className={`mt-4 min-h-[15rem] space-y-2 sm:mt-6 sm:min-h-[19rem] sm:space-y-3 ${
                selectedDate ? "max-h-80 overflow-y-auto pr-1 sm:max-h-96" : ""
              }`}
            >
              {loading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <li
                    key={i}
                    className="h-14 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800/40 sm:h-16 sm:rounded-2xl"
                  />
                ))}

              {!loading && errored && (
                <li className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
                  Couldn&apos;t load picks right now.
                </li>
              )}

              {!loading && !errored && displayedPicks.length === 0 && (
                <li className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
                  {selectedDate
                    ? "No AI picks were recorded for that day."
                    : "No AI picks yet — check back once the market opens."}
                </li>
              )}

              {!loading &&
                !errored &&
                revealedPicks.map((p, i) => {
                  const bullish = p.sentiment === "BULLISH";
                  const parsed = parseSymbol(p.symbol);

                  const logoUrl = `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${parsed.symbol}.png`;

                  // Result (both % and tick/wrong/live) appears together
                  // once auto-play reaches this row's status phase. When
                  // the user takes over manually, all rows are ready.
                  const showStatus = !autoPlaying || i < statusReadyCount;

                  // Only picks with a final result (win/loss) have candle
                  // data worth showing — a pending pick's outcome isn't
                  // in yet, so the row isn't clickable while it's live.
                  const isClickable = p.status !== "pending";

                  return (
                    <li
                      key={pickKey(p)}
                      onClick={() => isClickable && setChartPick(p)}
                      role={isClickable ? "button" : undefined}
                      tabIndex={isClickable ? 0 : undefined}
                      onKeyDown={(e) => {
                        if (isClickable && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          setChartPick(p);
                        }
                      }}
                      className={`opxi-enter-row flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/60 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-950/40 sm:gap-4 sm:rounded-2xl sm:px-4 sm:py-3 ${
                        isClickable
                          ? "cursor-pointer transition hover:border-zinc-300 hover:bg-zinc-100/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                          : ""
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 sm:h-10 sm:w-10">
                        <img
                          src={logoUrl}
                          alt={`${parsed.symbol} logo`}
                          className="h-full w-full object-contain p-1 sm:p-1.5"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement!.innerText =
                              parsed.symbol.slice(0, 2);
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold sm:text-sm">
                          {parsed.symbol}{" "}
                          <span className="font-normal text-zinc-500 dark:text-zinc-400">
                            flagged · {bullish ? "Long" : "Short"}
                          </span>
                        </p>

                        <p className="truncate text-[10px] text-zinc-500 dark:text-zinc-400 sm:text-xs">
                          {dayLabel(p.pick_date)} · {timeIST(p.entry_time)}
                        </p>
                      </div>

                      {/* % + status badge reveal together as one "result" unit */}
                      {showStatus ? (
                        <div className="opxi-enter-status flex shrink-0 items-center gap-2 sm:gap-3">
                          <span
                            className={`text-xs font-semibold tabular-nums sm:text-sm ${
                              p.pnl_pcnt >= 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-500 dark:text-red-400"
                            }`}
                          >
                            {p.pnl_pcnt >= 0 ? "+" : ""}
                            {p.pnl_pcnt.toFixed(2)}%
                          </span>

                          {p.status === "pending" ? (
                            <span
                              className="flex h-6 shrink-0 items-center gap-1 rounded-full bg-amber-500/15 px-2 text-[9px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 sm:h-7 sm:px-2.5 sm:text-[10px]"
                              title="Live — result not in yet"
                            >
                              <Clock size={11} className="animate-pulse" />
                              <span className="hidden sm:inline">Live</span>
                            </span>
                          ) : (
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full sm:h-7 sm:w-7 ${
                                p.status === "win"
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                  : "bg-red-500/15 text-red-500 dark:text-red-400"
                              }`}
                              title={
                                p.status === "win"
                                  ? "Moved up after pick"
                                  : "Moved down after pick"
                              }
                            >
                              {p.status === "win" ? (
                                <Check size={13} />
                              ) : (
                                <X size={13} />
                              )}
                            </span>
                          )}
                        </div>
                      ) : (
                        // Reserve the same footprint so the row doesn't
                        // reflow when the result lands.
                        <span
                          className="h-6 w-16 shrink-0 sm:h-7 sm:w-20"
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  );
                }
                )}
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 sm:mt-10 sm:text-xs">
          <strong className="font-semibold text-zinc-700 dark:text-zinc-300">
            Disclaimer:
          </strong>{" "}
          OptionXi is intended for educational and informational purposes only.
          All stock picks shown are generated by our technical screening tool
          and are shared to help users learn how indicators behave in real
          markets. Nothing here is a recommendation, tip, or solicitation to
          buy or sell any security. Markets carry risk, you are solely
          responsible for your own decisions. Please consult a SEBI-registered
          advisor before investing.
        </p>
      </div>
      <br/>
       <div className="text-center">
          <button
            onClick={() => setShowSubscribeDialog(true)}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-3 text-xs font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 sm:px-7 sm:py-3.5 sm:text-sm"
          >
            <Bell size={16} />
            Notify me when AI picks a stock
          </button>
        </div>
        <br/>

      {/* ------------------------- Subscribe dialog ------------------------- */}
      {showSubscribeDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={() => setShowSubscribeDialog(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:rounded-3xl sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold sm:text-lg">
                  Get a ping when the AI picks one
                </h4>
              </div>
              <button
                onClick={() => setShowSubscribeDialog(false)}
                className="rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
              OptionXi is available on the Play Store and on the web — pick
              whichever works for you. You&apos;ll get a notification every
              time the AI flags a new stock. For learning, not for tips.
            </p>

            {/* Store buttons — same style as the landing page */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-5 sm:gap-3">
              {/* Play Store badge (official Google Play image) */}
              <a
                href="https://play.google.com/store/apps/details?id=com.optionxi.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center transition-transform hover:scale-105"
              >
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="h-12 w-auto sm:h-14"
                />
              </a>

              {/* Web Terminal */}
              <a
                href="https://app.optionxi.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 font-semibold text-zinc-900 transition-colors hover:bg-emerald-500/5 dark:border-zinc-700 dark:text-zinc-50 sm:px-5 sm:py-3.5"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs sm:text-sm">Open Webapp</span>
                <ChevronRight size={14} className="shrink-0 sm:h-4 sm:w-4" />
              </a>
            </div>

            <a
              href="mailto:support@optionxi.com"
              className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-600 underline underline-offset-2 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white sm:mt-5 sm:text-sm"
            >
              <MessageCircle size={14} />
              Chat with support
            </a>
          </div>
        </div>
      )}

      {/* ------------------------- Per-pick candle chart bottom sheet ------------------------- */}
      <PriceChartSheet pick={chartPick} onClose={() => setChartPick(null)} />

      <style jsx>{`
        @keyframes opxiRowIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes opxiDayIn {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes opxiStatusIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .opxi-enter-row {
          opacity: 0;
          animation: opxiRowIn 0.45s ease forwards;
        }
        .opxi-enter-day {
          opacity: 0;
          animation: opxiDayIn 0.35s ease forwards;
        }
        .opxi-enter-status {
          animation: opxiStatusIn 0.3s ease forwards;
        }
      `}</style>
    </section>
  );
}