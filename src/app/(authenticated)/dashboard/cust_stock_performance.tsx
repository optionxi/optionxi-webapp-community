"use client";

import { JSX, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface SectorTile {
  name: string;
  count: number;
  avg1d: number;
  avg1w: number;
}

const ICON_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

function sectorIcon(name: string): JSX.Element {
  const s = name.toLowerCase();
  if (s.includes("tech") || s.includes("it")) {
    return (
      <svg {...ICON_PROPS} className="h-5 w-5">
        <rect x="7" y="7" width="10" height="10" rx="1.5" />
        <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
      </svg>
    );
  }
  if (s.includes("bank") || s.includes("financ")) {
    return (
      <svg {...ICON_PROPS} className="h-5 w-5">
        <path d="M4 21h16M5 21V10M9 21V10M15 21V10M19 21V10M3 10l9-6 9 6" />
      </svg>
    );
  }
  if (s.includes("energy") || s.includes("oil") || s.includes("gas") || s.includes("power")) {
    return (
      <svg {...ICON_PROPS} className="h-5 w-5">
        <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" strokeLinejoin="round" />
      </svg>
    );
  }
  if (s.includes("health") || s.includes("pharma")) {
    return (
      <svg {...ICON_PROPS} className="h-5 w-5">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    );
  }
  if (s.includes("consum") || s.includes("fmcg") || s.includes("retail") || s.includes("auto")) {
    return (
      <svg {...ICON_PROPS} className="h-5 w-5">
        <path d="M6 8h12l-1 12H7L6 8z" />
        <path d="M9 8V6a3 3 0 016 0v2" />
      </svg>
    );
  }
  if (s.includes("real") || s.includes("realty") || s.includes("construction") || s.includes("infra")) {
    return (
      <svg {...ICON_PROPS} className="h-5 w-5">
        <path d="M4 11L12 4l8 7" />
        <path d="M6 10v10h12V10" />
        <path d="M10 20v-6h4v6" />
      </svg>
    );
  }
  return (
    <svg {...ICON_PROPS} className="h-5 w-5">
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
    </svg>
  );
}

function Sparkline({ seed, up }: { seed: number; up: boolean }) {
  const points = [4, 9, 6, 13, 8, 15, 11].map((v, i) => {
    const y = 14 - ((v + seed * 3) % 12);
    return `${i * 6},${y}`;
  });
  const color = up ? "#0F9D58" : "#C0392B";
  return (
    <svg viewBox="0 0 36 16" className="h-3.5 w-10 shrink-0" style={{ color }}>
      <polyline points={points.join(" ")} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function StockPerformanceVisualBanner() {
  const router = useRouter();
  const [sectors, setSectors] = useState<SectorTile[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        const { data, error } = await supabase
          .from("stock_performance")
          .select("sec, pcnt_1d, pcnt_1w")
          .not("sec", "is", null);

        if (error) throw error;
        if (!data) return;

        const map: Record<string, { s1d: number; s1w: number; cnt: number }> = {};
        for (const r of data as { sec: string | null; pcnt_1d: number | null; pcnt_1w: number | null }[]) {
          if (!r.sec) continue;
          if (!map[r.sec]) map[r.sec] = { s1d: 0, s1w: 0, cnt: 0 };
          map[r.sec].s1d += r.pcnt_1d ?? 0;
          map[r.sec].s1w += r.pcnt_1w ?? 0;
          map[r.sec].cnt += 1;
        }

        const top6: SectorTile[] = Object.entries(map)
          .map(([name, v]) => ({
            name,
            count: v.cnt,
            avg1d: v.cnt ? v.s1d / v.cnt : 0,
            avg1w: v.cnt ? v.s1w / v.cnt : 0,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);

        setSectors(top6);
      } catch (e) {
        console.error("Sector banner fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const goToSector = (name: string) => {
    router.push(`/stock-performance?sector=${encodeURIComponent(name)}`);
  };

  const gainers = sectors.filter((s) => s.avg1d >= 0).length;

  return (
    <section className="w-full">
      <style>{`
        @keyframes spb-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .spb-tape-track {
          animation: spb-scroll 36s linear infinite;
        }
        .spb-tape:hover .spb-tape-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .spb-tape-track { animation: none; }
        }
      `}</style>

      <div className="mx-auto max-w-8xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {/* Ticker tape hero */}
        <div className="spb-tape relative overflow-hidden border-b border-zinc-200 bg-zinc-50 py-2.5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="spb-tape-track flex w-max gap-10 whitespace-nowrap px-4">
            {(sectors.length ? [...sectors, ...sectors] : []).map((s, i) => {
              const up = s.avg1d >= 0;
              return (
                <button
                  key={i}
                  onClick={() => goToSector(s.name)}
                  className="group flex items-center gap-2.5 rounded-md px-1 py-0.5 font-mono text-xs tracking-wide text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                  <Sparkline seed={i} up={up} />
                  <span className="transition-colors">{s.name}</span>
                  <span className="font-semibold tabular-nums" style={{ color: up ? "#0F9D58" : "#C0392B" }}>
                    {up ? "+" : ""}
                    {s.avg1d.toFixed(2)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          {/* Left: copy */}
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Live market pulse
            </span>

            <h2 className="mt-4 text-3xl font-semibold leading-[1.15] text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Watching the market shouldn&rsquo;t feel like homework.
            </h2>

            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              Today&rsquo;s six most-tracked sectors, updating live. Tap any
              tile to jump straight to it on the full board.
            </p>

            {!loading && sectors.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 font-medium text-emerald-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-emerald-400">
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 8l3-3 2 2 3-4" />
                  </svg>
                  {gainers} gaining
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 font-medium text-rose-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-rose-400">
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4l3 3 2-2 3 4" />
                  </svg>
                  {sectors.length - gainers} lagging
                </span>
              </div>
            )}

            <div className="mt-7">
              <Link
                href="/stock-performance"
                className="group inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Explore the board
                <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right: sector tiles */}
          <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[118px] animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
                    />
                  ))
                : sectors.map((s) => {
                    const up = s.avg1d >= 0;
                    return (
                      <button
                        key={s.name}
                        onClick={() => goToSector(s.name)}
                        className="group flex flex-col items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-left transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {sectorIcon(s.name)}
                        </span>

                        <div className="w-full">
                          <div className="flex items-center justify-between gap-1">
                            <span className="line-clamp-1 text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
                              {s.name}
                            </span>
                            <svg
                              viewBox="0 0 12 12"
                              className="h-3 w-3 shrink-0 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-400"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2 6h8M7 3l3 3-3 3" />
                            </svg>
                          </div>

                          <div className="mt-1.5 flex items-center justify-between gap-1">
                            <span
                              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums"
                              style={{
                                color: up ? "#0F9D58" : "#C0392B",
                                background: up ? "rgba(15,157,88,0.08)" : "rgba(192,57,43,0.08)",
                              }}
                            >
                              <svg viewBox="0 0 8 8" className="h-2 w-2" fill="currentColor">
                                <path d={up ? "M4 1l3 5H1z" : "M4 7L1 2h6z"} />
                              </svg>
                              {up ? "+" : ""}
                              {s.avg1d.toFixed(2)}%
                            </span>
                            <span className="text-[10px] font-medium tabular-nums text-zinc-400 dark:text-zinc-500">
                              1W {s.avg1w >= 0 ? "+" : ""}
                              {s.avg1w.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}