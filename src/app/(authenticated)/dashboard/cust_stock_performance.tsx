"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

/* ------------------------------------------------------------------ */
/* Types & constants                                                   */
/* ------------------------------------------------------------------ */

interface SectorRow {
  sec: string;
  stock_count: number | string | null;
  advancing_count: number | string | null;
  avg_pcnt: number | string | null;
  updated_at: string;
}

interface Sector {
  name: string;
  count: number;
  advancing: number;
  avg: number;
}

const REFRESH_MS = 60_000;
const MIN_STOCKS = 3; // tiny sectors swing too wildly to be useful
const UP_RGB = "16,160,100";
const DOWN_RGB = "214,69,58";
const UP = `rgb(${UP_RGB})`;
const DOWN = `rgb(${DOWN_RGB})`;
const EASE = "cubic-bezier(0.2,0.8,0.2,1)";

const TONES = {
  strong: {
    title: "Strongest sectors",
    icon: "▲",
    box: "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    bar: "border-l-4 border-l-emerald-500",
    head: "text-emerald-800 dark:text-emerald-300",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
    divide: "divide-emerald-200/70 dark:divide-emerald-900/40",
    hover: "hover:bg-emerald-100/70 data-[active=true]:bg-emerald-100/70 dark:hover:bg-emerald-900/30 dark:data-[active=true]:bg-emerald-900/30",
  },
  weak: {
    title: "Weakest sectors",
    icon: "▼",
    box: "border-rose-200 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/20",
    bar: "border-l-4 border-l-rose-500",
    head: "text-rose-800 dark:text-rose-300",
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
    divide: "divide-rose-200/70 dark:divide-rose-900/40",
    hover: "hover:bg-rose-100/70 data-[active=true]:bg-rose-100/70 dark:hover:bg-rose-900/30 dark:data-[active=true]:bg-rose-900/30",
  },
} as const;
type Tone = keyof typeof TONES;

// scan animation geometry
const CHIP_H = 44;
const STEP = 52;
const LABEL_H = 24;
const SWEEP_MS = 1400;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

function signed(n: number, digits = 2): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(digits)}%`;
}

function formatUpdated(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

/* Counts from the previous value to the new one, so refreshes glide too. */
function CountUp({ value, delay, reduce }: { value: number; delay: number; reduce: boolean }) {
  const [display, setDisplay] = useState(reduce ? value : 0);
  const from = useRef(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      from.current = value;
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start0 = from.current;
    const timer = setTimeout(() => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / 900, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = start0 + (value - start0) * eased;
        from.current = v;
        setDisplay(v);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, delay, reduce]);

  return <>{signed(display)}</>;
}

/* ------------------------------------------------------------------ */
/* Explainer: scan every sector, measure, filter, keep the movers       */
/* ------------------------------------------------------------------ */

const CAPTIONS = (total: number) => [
  `Start with every sector. There are ${total} today.`,
  "Measure each sector's average move.",
  "Drop the middle of the pack.",
  "Keep the strongest and weakest. They're listed on the right.",
];

type Role = "strong" | "weak" | "mid";

function ScanDemo({
  strong,
  weak,
  middle,
  total,
  paused,
  reduce,
  highlight,
}: {
  strong: Sector[];
  weak: Sector[];
  middle: Sector[];
  total: number;
  paused: boolean;
  reduce: boolean;
  highlight: string | null;
}) {
  // -1 hidden, 0 all sectors appear, 1 measured, 2 middle fades, 3 movers grouped
  const [phase, setPhase] = useState<number>(reduce || paused ? 3 : -1);

  useEffect(() => {
    if (reduce) setPhase(3);
  }, [reduce]);

  useEffect(() => {
    if (reduce || paused) return;
    const wait = phase === -1 ? 300 : phase === 0 ? 1300 : phase === 1 ? SWEEP_MS + 900 : phase === 2 ? 1500 : 4200;
    const t = setTimeout(() => setPhase(phase === 3 ? -1 : phase + 1), wait);
    return () => clearTimeout(t);
  }, [phase, paused, reduce]);

  const chips = useMemo(() => {
    const all: { s: Sector; role: Role; slot: number }[] = [
      ...strong.map((s, k) => ({ s, role: "strong" as Role, slot: k })),
      ...weak.map((s, k) => ({ s, role: "weak" as Role, slot: k })),
      ...middle.map((s, k) => ({ s, role: "mid" as Role, slot: k })),
    ];
    return all
      .sort((a, b) => hash(a.s.name) - hash(b.s.name))
      .map((c, i) => ({ ...c, col: i % 3, row: Math.floor(i / 3), i }));
  }, [strong, weak, middle]);

  const rows = Math.max(Math.ceil(chips.length / 3), 3);
  const H = LABEL_H + rows * STEP;
  const sweepRange = H - LABEL_H;

  const captions = CAPTIONS(total);
  const captionIndex = Math.max(phase, 0);

  return (
    <div className="flex flex-1 flex-col justify-center">
      <p className="sr-only">
        Of {total} sectors, the strongest are {strong.map((s) => s.name).join(", ")}. The weakest are{" "}
        {weak.map((s) => s.name).join(", ")}.
      </p>

      <div aria-hidden className="relative w-full" style={{ height: H }}>
        {/* Column labels, shown once movers are grouped */}
        {(
          [
            ["Strongest", "0%"],
            ["Weakest", "50%"],
          ] as const
        ).map(([label, left]) => (
          <span
            key={label}
            className={`absolute top-0 text-xs font-semibold ${
              label === "Strongest"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-rose-700 dark:text-rose-400"
            }`}
            style={{
              left,
              opacity: phase === 3 ? 1 : 0,
              transition: reduce ? "none" : "opacity 400ms ease 500ms",
            }}
          >
            {label}
          </span>
        ))}

        {/* Scan line */}
        <span
          className="pointer-events-none absolute inset-x-0 z-10 h-[2px] rounded-full bg-amber-500"
          style={{
            top: LABEL_H - 4,
            opacity: phase === 1 ? 1 : 0,
            transform: `translateY(${phase === 1 ? sweepRange : 0}px)`,
            boxShadow: "0 0 14px 2px rgba(245,158,11,0.45)",
            transition: reduce
              ? "none"
              : phase === 1
              ? `transform ${SWEEP_MS}ms linear, opacity 200ms ease`
              : "opacity 250ms ease",
          }}
        />

        {chips.map((c) => {
          const isMid = c.role === "mid";
          const grouped = phase === 3 && !isMid;
          const up = c.s.avg >= 0;
          const rgb = up ? UP_RGB : DOWN_RGB;

          const left = grouped ? (c.role === "strong" ? "0%" : "50%") : `${c.col * 33.333}%`;
          const top = LABEL_H + (grouped ? c.slot : c.row) * STEP;
          const width = grouped ? "calc(50% - 6px)" : "calc(33.333% - 6px)";

          const opacity = phase === -1 ? 0 : isMid ? (phase === 2 ? 0.15 : phase === 3 ? 0 : 1) : 1;
          const scale = phase === -1 ? 0.85 : isMid && phase >= 2 ? 0.92 : 1;
          const measured = phase >= 1;

          // reveal in step with the scan line
          const dColor = phase === 1 ? ((c.row * STEP + CHIP_H / 2) / sweepRange) * SWEEP_MS : 0;
          const dEnter = phase === 0 ? c.i * 45 : 0;
          const dMove = phase === 3 ? c.slot * 90 : 0;

          const transition = reduce
            ? "none"
            : phase === -1
            ? "opacity 300ms ease"
            : `left 700ms ${EASE} ${dMove}ms, top 700ms ${EASE} ${dMove}ms, width 700ms ${EASE} ${dMove}ms, opacity 450ms ease ${dEnter}ms, transform 450ms ${EASE} ${dEnter}ms, background-color 450ms ease ${dColor}ms, border-color 450ms ease ${dColor}ms`;

          const focused = highlight === c.s.name && grouped;

          return (
            <div
              key={c.s.name}
              className={`absolute overflow-hidden rounded-lg border px-2.5 py-1.5 ${
                focused ? "ring-2 ring-zinc-900 dark:ring-zinc-100" : ""
              } border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900`}
              style={{
                left,
                top,
                width,
                height: CHIP_H,
                opacity,
                transform: `scale(${scale})`,
                backgroundColor: measured ? `rgba(${rgb},0.1)` : undefined,
                borderColor: measured ? `rgba(${rgb},0.4)` : undefined,
                transition,
              }}
            >
              <span className="block truncate text-xs font-medium text-zinc-900 dark:text-zinc-50">{c.s.name}</span>
              <span
                className="block text-sm font-semibold tabular-nums"
                style={{
                  color: up ? UP : DOWN,
                  opacity: measured ? 1 : 0,
                  transition: reduce ? "none" : `opacity 350ms ease ${dColor}ms`,
                }}
              >
                {signed(c.s.avg)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Caption + progress */}
      <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
        <div className="grid">
          {captions.map((c, i) => (
            <p
              key={i}
              className="col-start-1 row-start-1 text-sm leading-snug text-zinc-700 transition-opacity duration-300 motion-reduce:transition-none dark:text-zinc-300"
              style={{ opacity: captionIndex === i ? 1 : 0 }}
            >
              {c}
            </p>
          ))}
        </div>
        <div aria-hidden className="mt-2.5 flex gap-1.5">
          {captions.map((_, i) => (
            <span
              key={i}
              className="h-1 flex-1 rounded-full transition-colors duration-300 motion-reduce:transition-none"
              style={{
                background: i <= captionIndex ? "rgb(245,158,11)" : undefined,
              }}
            >
              {i > captionIndex && <span className="block h-full w-full rounded-full bg-zinc-200 dark:bg-zinc-800" />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function StockPerformanceVisualBanner() {
  const router = useRouter();
  const reduce = usePrefersReducedMotion();

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  const [preview, setPreview] = useState<string | null>(null); // row under pointer or keyboard
  const [paused, setPaused] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("sector_summary")
        .select("sec, stock_count, advancing_count, avg_pcnt, updated_at")
        .limit(100);

      if (error) throw error;

      const rows = (data ?? []) as unknown as SectorRow[];
      setSectors(
        rows.map((r) => ({
          name: r.sec,
          count: num(r.stock_count) ?? 0,
          advancing: num(r.advancing_count) ?? 0,
          avg: num(r.avg_pcnt) ?? 0,
        }))
      );
      setUpdatedAt(
        rows.reduce<string | null>((latest, r) => (!latest || r.updated_at > latest ? r.updated_at : latest), null)
      );
      setFailed(false);
    } catch (e) {
      console.error("Sector banner fetch error:", e);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  /* Three strongest and three weakest sectors. */
  const groups = useMemo(() => {
    const filtered = sectors.filter((s) => s.count >= MIN_STOCKS);
    const pool = filtered.length >= 2 ? filtered : sectors;
    const desc = [...pool].sort((a, b) => b.avg - a.avg);
    const k = Math.min(3, Math.ceil(desc.length / 2));
    return {
      pool,
      strongest: desc.slice(0, k),
      weakest: desc.slice(k).slice(-3).reverse(),
    };
  }, [sectors]);

  const shown = useMemo(() => [...groups.strongest, ...groups.weakest], [groups]);
  const tileCount = shown.length;

  /* A spread of the sectors in between, so the "filter" step has something to drop. */
  const middle = useMemo(() => {
    const names = new Set(shown.map((s) => s.name));
    const rest = groups.pool.filter((s) => !names.has(s.name)).sort((a, b) => b.avg - a.avg);
    const want = Math.min(3, rest.length);
    return Array.from({ length: want }, (_, i) => rest[Math.floor((i * rest.length) / want)]);
  }, [groups.pool, shown]);

  /* One shared bar scale, so bar lengths compare across rows. */
  const scale = useMemo(() => {
    const max = shown.reduce((m, s) => Math.max(m, Math.abs(s.avg)), 0);
    return Math.max(1, Math.ceil(max));
  }, [shown]);

  /* Let the first paint happen with empty bars, then grow them. */
  useEffect(() => {
    if (ready || tileCount === 0) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [tileCount, ready]);

  /* Plain-language summary. */
  const summary = useMemo(() => {
    if (!sectors.length) return null;
    const total = sectors.length;
    const green = sectors.filter((s) => s.avg > 0).length;
    const best = groups.strongest[0];
    const worst = groups.weakest[0];

    const headline =
      green === total
        ? "Every sector is in the green."
        : green === 0
        ? "Every sector is in the red."
        : `${green} of ${total} sectors are in the green.`;

    const first = best
      ? best.avg >= 0
        ? `${best.name} leads at ${signed(best.avg)}.`
        : `${best.name} is holding up best at ${signed(best.avg)}.`
      : "";
    const second = worst
      ? worst.avg < 0
        ? ` ${worst.name} is weakest at ${signed(worst.avg)}.`
        : ` ${worst.name} is rising the slowest at ${signed(worst.avg)}.`
      : "";

    return { headline, detail: first + second };
  }, [sectors, groups]);

  const goToSector = (name: string) => router.push(`/stock-performance?sector=${encodeURIComponent(name)}`);

  const empty = !loading && !failed && sectors.length === 0;
  const broken = !loading && failed && sectors.length === 0;

  /* One ranked row -------------------------------------------------- */
  const renderRow = (s: Sector, order: number, tone: Tone) => {
    const up = s.avg >= 0;
    const color = up ? UP : DOWN;
    const delay = reduce ? 0 : order * 70;
    const barPct = Math.max(Math.min(Math.abs(s.avg) / scale, 1) * 50, 1.5);
    const active = preview === s.name;

    return (
      <li key={s.name}>
        <button
          onClick={() => goToSector(s.name)}
          onMouseEnter={() => setPreview(s.name)}
          onMouseLeave={() => setPreview(null)}
          onFocus={() => setPreview(s.name)}
          onBlur={() => setPreview(null)}
          title={s.name}
          aria-label={`${s.name}, ${signed(s.avg)}, ${s.advancing} of ${s.count} stocks up. Open sector.`}
          data-active={active}
          className={`group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 rounded-lg px-3 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_4.75rem] ${TONES[tone].hover}`}
        >
          <span className="min-w-0 sm:order-1">
            <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">{s.name}</span>
            <span className="block text-xs text-zinc-600 dark:text-zinc-400">
              {s.advancing} of {s.count} stocks up
            </span>
          </span>

          <span
            className={`text-right text-base font-semibold tabular-nums sm:order-3 ${
              up ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
            }`}
          >
            <CountUp value={s.avg} delay={delay} reduce={reduce} />
          </span>

          {/* Diverging bar: gains grow right of the centre line, losses grow left */}
          <span
            aria-hidden
            className="relative col-span-2 block h-2 w-full overflow-hidden rounded-full bg-white/80 dark:bg-zinc-900/80 sm:order-2 sm:col-span-1"
          >
            <span className="absolute left-1/2 top-0 z-10 h-full w-px bg-zinc-400 dark:bg-zinc-500" />
            <span
              className="absolute top-0 h-full rounded-full motion-reduce:transition-none"
              style={{
                [up ? "left" : "right"]: "50%",
                width: ready ? `${barPct}%` : "0%",
                background: color,
                transition: `width 700ms ${EASE} ${delay}ms`,
              }}
            />
          </span>
        </button>
      </li>
    );
  };

  const renderGroup = (list: Sector[], tone: Tone, offset: number) => {
    const t = TONES[tone];
    const groupAvg = list.reduce((a, s) => a + s.avg, 0) / list.length;
    return (
      <div className={`overflow-hidden rounded-xl border ${t.box} ${t.bar}`}>
        <div className="flex items-center justify-between gap-3 px-4 pb-1 pt-3">
          <h3 className={`flex items-center gap-2 text-sm font-semibold ${t.head}`}>
            <span aria-hidden className="text-[10px]">{t.icon}</span>
            {t.title}
          </h3>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${t.badge}`}>
            avg {signed(groupAvg)}
          </span>
        </div>
        <ul className={`divide-y px-1 pb-1 ${t.divide}`}>
          {list.map((s, i) => renderRow(s, offset + i, tone))}
        </ul>
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="space-y-2" aria-hidden>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-[62px] animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
      ))}
    </div>
  );

  /* Render ---------------------------------------------------------- */
  return (
    <section className="w-full" aria-labelledby="sector-banner-title">
      <div className="mx-auto max-w-8xl overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12 lg:p-10">
          {/* Left: headline, animated explainer, action */}
          <div className="flex flex-col">
            {loading ? (
              <div className="space-y-3" aria-hidden>
                <div className="h-3 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
                <div className="h-9 w-4/5 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
                <div className="h-4 w-full max-w-sm animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
              </div>
            ) : (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                  Sector pulse
                </p>
                <h2
                  id="sector-banner-title"
                  className="mt-1.5 max-w-md text-xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl"
                >
                  {summary?.headline ?? "See which sectors are moving."}
                </h2>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {summary?.detail || "Sector moves will show up here once the latest data is in."}
                </p>
              </>
            )}

            {/* Explainer panel */}
            {loading ? (
              <div className="mt-4 min-h-[300px] animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" aria-hidden />
            ) : (
              tileCount > 0 && (
                <div className="mt-4 flex flex-1 flex-col rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        How the movers are picked
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                        Point at a sector on the right to find it here.
                      </p>
                    </div>
                    {!reduce && (
                      <button
                        onClick={() => setPaused((p) => !p)}
                        aria-pressed={paused}
                        className="shrink-0 rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-semibold text-zinc-800 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:focus-visible:outline-zinc-100"
                      >
                        {paused ? "Play" : "Pause"}
                      </button>
                    )}
                  </div>

                  <ScanDemo
                    strong={groups.strongest}
                    weak={groups.weakest}
                    middle={middle}
                    total={sectors.length}
                    paused={paused}
                    reduce={reduce}
                    highlight={preview}
                  />
                </div>
              )
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/stock-performance"
                className="inline-flex items-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:focus-visible:outline-zinc-100"
              >
                View all sectors
              </Link>
              {updatedAt && (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Updated {formatUpdated(updatedAt)}</span>
              )}
            </div>
          </div>

          {/* Right: strongest and weakest sectors */}
          <div>
            {broken ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
                <p className="max-w-xs text-sm text-zinc-700 dark:text-zinc-300">
                  Sector data isn&rsquo;t loading. Check your connection and try again.
                </p>
                <button
                  onClick={() => {
                    setLoading(true);
                    load();
                  }}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:focus-visible:outline-zinc-100"
                >
                  Try again
                </button>
              </div>
            ) : empty ? (
              <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
                <p className="max-w-xs text-sm text-zinc-700 dark:text-zinc-300">
                  No sector data yet. It appears here after the first market update.
                </p>
              </div>
            ) : loading ? (
              renderSkeleton()
            ) : (
              <div className="space-y-4">
                {renderGroup(groups.strongest, "strong", 0)}
                {groups.weakest.length > 0 &&
                  renderGroup(groups.weakest, "weak", groups.strongest.length)}

                <p className="px-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Bars share one scale, up to &plusmn;{scale}%. Sectors with fewer than {MIN_STOCKS} stocks are left out.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}