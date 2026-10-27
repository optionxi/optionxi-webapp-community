'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RefreshCw, TrendingUp, TrendingDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';

/* -------------------------------------------------------------------------- */
/*  Types & data                                                              */
/* -------------------------------------------------------------------------- */

type Category = 'bullish' | 'bearish';

interface TopStock {
  symbol: string;
  signalCount: number;
  price: number;
  percentChange: number;
  sector?: string;
}

interface ScreenerRow {
  id: number | string;
  screener_id: number | string;
  scan_date: string;
  close: number | null;
  pcnt: number | null;
  sec: string | null;
  stckname: string | null;
}

interface CategoryResult {
  stocks: TopStock[];
  scanDate: string | null;
}

const PAGE = 1000;
const MAX_PAGES = 10;

/** "NSE:TCS-EQ" -> "TCS" */
const toSymbol = (name: string) =>
  name.includes(':') ? name.split(':')[1].split('-')[0] : name;

/**
 * Loads the most recent scan DAY (not one exact timestamp) and counts each
 * screener once per stock.
 */
async function fetchCategory(category: Category): Promise<CategoryResult> {
  const latest = await supabase
    .from('screener_results')
    .select('scan_date, screener_names!inner(category)')
    .eq('screener_names.category', category)
    .order('scan_date', { ascending: false })
    .limit(1);

  if (latest.error) throw latest.error;
  const scanDate = latest.data?.[0]?.scan_date as string | undefined;
  if (!scanDate) return { stocks: [], scanDate: null };

  // Match the whole day, not a single exact timestamp
  const day = scanDate.slice(0, 10); // 'YYYY-MM-DD'
  const next = new Date(`${day}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const nextDay = next.toISOString().slice(0, 10);

  const rows: ScreenerRow[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const { data, error } = await supabase
      .from('screener_results')
      .select(
        'id, screener_id, scan_date, close, pcnt, sec, stckname, screener_names!inner(category)'
      )
      .eq('screener_names.category', category)
      .gte('scan_date', day)
      .lt('scan_date', nextDay)
      .order('scan_date', { ascending: false })
      .order('id', { ascending: true }) // stable pagination, no skipped/duplicated rows
      .range(page * PAGE, page * PAGE + PAGE - 1);

    if (error) throw error;
    rows.push(...((data ?? []) as unknown as ScreenerRow[]));
    if (!data || data.length < PAGE) break;
  }

  const map = new Map<string, TopStock & { ids: Set<string> }>();
  for (const row of rows) {
    if (!row.stckname) continue;
    const symbol = toSymbol(row.stckname);
    const entry =
      map.get(symbol) ??
      {
        symbol,
        signalCount: 0,
        price: row.close ?? 0,
        percentChange: row.pcnt ?? 0,
        sector: row.sec ?? undefined,
        ids: new Set<string>(),
      };
    entry.ids.add(String(row.screener_id));
    entry.signalCount = entry.ids.size;
    map.set(symbol, entry);
  }

  const stocks = Array.from(map.values()).map(({ ids: _ids, ...s }) => s);
  return { stocks, scanDate };
}

/* -------------------------------------------------------------------------- */
/*  Left side: animation — each stock is checked, earns signals, gets ranked  */
/* -------------------------------------------------------------------------- */

const CHECKS: Record<Category, { name: string; question: string }[]> = {
  bullish: [
    { name: 'Trend', question: 'Price above its recent average?' },
    { name: 'Momentum', question: 'Buyers getting stronger?' },
    { name: 'Volume', question: 'More shares trading than usual?' },
    { name: 'Breakout', question: 'Price cleared a recent high?' },
  ],
  bearish: [
    { name: 'Trend', question: 'Price below its recent average?' },
    { name: 'Momentum', question: 'Sellers getting stronger?' },
    { name: 'Volume', question: 'More shares trading than usual?' },
    { name: 'Breakdown', question: 'Price broke a recent low?' },
  ],
};

// Three demo stocks, checked one after another
const DEMO = [
  { name: 'Stock A', pass: [false, true, false, false] },
  { name: 'Stock B', pass: [true, true, true, true] },
  { name: 'Stock C', pass: [true, true, false, true] },
];
const scoreOf = (i: number) => DEMO[i].pass.filter(Boolean).length;
const HOT_AT = 3;
const PER = 6; // ticks per stock: 0 arrive, 1–4 checks, 5 added to list
const TOTAL = PER * DEMO.length + 4; // + hold on the final ranking
const TICK_MS = 750;
const PITCH = 52;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function SignalExplainer({ category }: { category: Category }) {
  const reduced = useReducedMotion();
  const bull = category === 'bullish';
  const checks = CHECKS[category];

  const [tick, setTick] = useState(0);
  useEffect(() => {
    setTick(0);
    if (reduced) return;
    const id = setInterval(() => setTick((t) => (t + 1) % TOTAL), TICK_MS);
    return () => clearInterval(id);
  }, [category, reduced]);

  const t = reduced ? PER * DEMO.length : tick;
  const done = t >= PER * DEMO.length;
  const si = done ? DEMO.length - 1 : Math.floor(t / PER); // current stock
  const p = done ? 4 : t % PER; // phase within the stock
  const resolved = Math.min(p, 4); // checks finished
  const stock = DEMO[si];
  const score = stock.pass.slice(0, resolved).filter(Boolean).length;

  const arrived = (i: number) => done || i < si || (i === si && p === 5);
  const rankOf = useMemo(() => {
    const list = DEMO.map((_, i) => i)
      .filter(arrived)
      .sort((a, b) => scoreOf(b) - scoreOf(a) || a - b);
    return (i: number) => list.indexOf(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, si, p]);

  const tone = bull
    ? {
        solid: 'bg-emerald-500',
        soft: 'bg-emerald-500/10',
        border: 'border-emerald-500/50',
        text: 'text-emerald-600 dark:text-emerald-400',
      }
    : {
        solid: 'bg-rose-500',
        soft: 'bg-rose-500/10',
        border: 'border-rose-500/50',
        text: 'text-rose-600 dark:text-rose-400',
      };

  const caption = done
    ? 'The more signals a stock earns, the higher it sits. That is how the list is ranked.'
    : p === 0
      ? `${stock.name} arrives. Four screeners will check it.`
      : p <= 4
        ? `${checks[p - 1].name}: ${
            stock.pass[p - 1] ? 'yes, +1 signal.' : 'no match, no signal.'
          }`
        : `${stock.name} earned ${scoreOf(si)} signal${scoreOf(si) === 1 ? '' : 's'} and takes its place in the list.`;

  return (
    <aside
      className="hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60 sm:p-6 lg:sticky lg:top-16 lg:block"
      aria-label="How signals work"
    >
      <style>{`
        @keyframes xi-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes xi-pop{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}
      `}</style>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        How a stock earns signals
      </h3>
      <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Screeners ask simple yes or no questions about each stock. Every
        &ldquo;yes&rdquo; is one signal. Stocks with the most signals are
        ranked first.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-hidden="true">
        {/* Checklist */}
        <div>
          <p className="mb-2 text-xs text-slate-500">Screener checks</p>
          <div
            key={si}
            className={cn(
              'rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950',
              done && 'opacity-50 transition-opacity duration-500'
            )}
            style={!reduced ? { animation: 'xi-in 350ms ease-out' } : undefined}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white">{stock.name}</span>
              <span className="flex items-baseline gap-1">
                <span
                  key={score}
                  className={cn('inline-block text-2xl font-semibold tabular-nums', score ? tone.text : 'text-slate-300 dark:text-slate-700')}
                  style={!reduced && score ? { animation: 'xi-pop 350ms ease-out' } : undefined}
                >
                  {score}
                </span>
                <span className="text-xs text-slate-500">signals</span>
              </span>
            </div>

            <ul className="mt-2 space-y-1">
              {checks.map((c, i) => {
                const state =
                  i < resolved ? (stock.pass[i] ? 'yes' : 'no') : i === p && !done ? 'checking' : 'pending';
                return (
                  <li
                    key={c.name}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-300',
                      state === 'yes' && tone.soft
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-5 w-5 flex-none items-center justify-center rounded-full border transition-colors duration-300',
                        state === 'yes' && cn(tone.solid, 'border-transparent text-white'),
                        state === 'no' && 'border-transparent bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                        state === 'checking' && 'animate-pulse border-slate-400 dark:border-slate-500',
                        state === 'pending' && 'border-dashed border-slate-300 dark:border-slate-700'
                      )}
                    >
                      {state === 'yes' && <Check className="h-3 w-3" strokeWidth={3} />}
                      {state === 'no' && <X className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-tight text-slate-800 dark:text-slate-200">
                        {c.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500">{c.question}</span>
                    </span>
                    <span
                      className={cn(
                        'w-7 flex-none text-right text-xs font-medium',
                        state === 'yes' ? tone.text : 'text-slate-400'
                      )}
                    >
                      {state === 'yes' ? 'Yes' : state === 'no' ? 'No' : ''}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Ranked list */}
        <div>
          <p className="mb-2 text-xs text-slate-500">Ranked list</p>
          <div className="relative" style={{ height: PITCH * DEMO.length - 8 }}>
            {DEMO.map((_, i) => (
              <div
                key={`slot-${i}`}
                className="absolute inset-x-0 h-11 rounded-lg border border-dashed border-slate-200 dark:border-slate-800"
                style={{ top: i * PITCH }}
              />
            ))}
            {DEMO.map((s, i) => {
              const on = arrived(i);
              const hot = scoreOf(i) >= HOT_AT;
              return (
                <div
                  key={s.name}
                  className={cn(
                    'absolute inset-x-0 flex h-11 items-center gap-3 rounded-lg border bg-white px-3 dark:bg-slate-950',
                    hot && on ? cn(tone.border, tone.soft) : 'border-slate-200 dark:border-slate-800'
                  )}
                  style={{
                    top: 0,
                    transform: `translateY(${(on ? rankOf(i) : DEMO.length - 1) * PITCH}px)`,
                    opacity: on ? 1 : 0,
                    transition: 'transform 500ms ease-in-out, opacity 300ms',
                  }}
                >
                  <span className="w-3 text-sm tabular-nums text-slate-400">
                    {on ? rankOf(i) + 1 : ''}
                  </span>
                  <span className="w-14 flex-none text-sm font-semibold text-slate-900 dark:text-white">
                    {s.name}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <span
                      className={cn('block h-full rounded-full', tone.solid)}
                      style={{
                        width: on ? `${(scoreOf(i) / 4) * 100}%` : '0%',
                        transition: 'width 600ms ease-out 150ms',
                      }}
                    />
                  </span>
                  <span className="w-4 text-right text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                    {scoreOf(i)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-5 min-h-[2.5rem] text-sm text-slate-700 dark:text-slate-300">
        {caption}
      </p>

      <p className="mt-4 border-t border-slate-200 pt-3 text-xs leading-relaxed text-slate-500 dark:border-slate-800">
        Demo with made-up stocks and example checks. Signals are a shortlist
        for your own research, not advice to buy or sell.
      </p>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*  Right side: ranked list                                                   */
/* -------------------------------------------------------------------------- */

function StockLogo({ symbol }: { symbol: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative h-10 w-10 flex-none overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
      <Image
        src={failed ? '/assets/images/logo_xi.png' : `/assets/stockimages/${symbol}.png`}
        alt=""
        fill
        unoptimized
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function StockRow({
  stock,
  rank,
  max,
  category,
}: {
  stock: TopStock;
  rank: number;
  max: number;
  category: Category;
}) {
  const up = stock.percentChange >= 0;
  const bar = category === 'bullish' ? 'bg-emerald-500' : 'bg-rose-500';

  return (
    <Link
      href={`/stocks/${stock.symbol}`}
      className="group flex items-center gap-3 px-4 py-3 outline-none transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:hover:bg-slate-900 dark:focus-visible:bg-slate-900 sm:gap-4 sm:px-5"
    >
      <span className="w-5 flex-none text-right text-sm tabular-nums text-slate-400">
        {rank}
      </span>
      <StockLogo symbol={stock.symbol} />

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-900 dark:text-white">
          {stock.symbol}
        </p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
          {stock.sector || 'NSE'}
        </p>
      </div>

      <div className="hidden w-20 flex-none xl:block" title={`${stock.signalCount} signals`}>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={cn('h-full rounded-full transition-[width] duration-700 ease-out', bar)}
            style={{ width: `${Math.max(8, (stock.signalCount / max) * 100)}%` }}
          />
        </div>
      </div>
      <span className="w-12 flex-none text-right text-sm tabular-nums text-slate-700 dark:text-slate-300">
        {stock.signalCount}
        <span className="ml-1 text-xs text-slate-400">sig</span>
      </span>

      <div className="w-24 flex-none text-right">
        <p className="font-semibold tabular-nums text-slate-900 dark:text-white">
          ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p
          className={cn(
            'text-xs font-medium tabular-nums',
            up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          )}
        >
          {up ? '+' : ''}
          {stock.percentChange.toFixed(2)}%
        </p>
      </div>
    </Link>
  );
}

function ListSkeleton() {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800" aria-busy="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-4 px-5 py-3">
          <div className="h-4 w-5 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function TopStocksTabs({ limit = 10 }: { limit?: number }) {
  const [category, setCategory] = useState<Category>('bullish');
  const [sector, setSector] = useState<string>('All');
  const [cache, setCache] = useState<Partial<Record<Category, CategoryResult & { at: Date }>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef(cache);
  cacheRef.current = cache;

  const load = useCallback(async (cat: Category, force = false) => {
    if (!force && cacheRef.current[cat]) {
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCategory(cat);
      setCache((c) => ({ ...c, [cat]: { ...result, at: new Date() } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load signals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(category);
  }, [category, load]);

  useEffect(() => setSector('All'), [category]);

  const current = cache[category];

  const sectors = useMemo(() => {
    const set = new Set<string>();
    current?.stocks.forEach((s) => s.sector && set.add(s.sector));
    return ['All', ...Array.from(set).sort()];
  }, [current]);

  const visible = useMemo(() => {
    const list = (current?.stocks ?? []).filter(
      (s) => sector === 'All' || s.sector === sector
    );
    list.sort(
      (a, b) =>
        b.signalCount - a.signalCount ||
        Math.abs(b.percentChange) - Math.abs(a.percentChange)
    );
    return list.slice(0, limit);
  }, [current, sector, limit]);

  const max = Math.max(1, ...visible.map((s) => s.signalCount));

  const scanLabel = current?.scanDate
    ? new Date(current.scanDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const tabs: { key: Category; label: string; icon: React.ReactNode; active: string }[] = [
    { key: 'bullish', label: 'Bullish', icon: <TrendingUp className="h-4 w-4" />, active: 'text-emerald-700 dark:text-emerald-400' },
    { key: 'bearish', label: 'Bearish', icon: <TrendingDown className="h-4 w-4" />, active: 'text-rose-700 dark:text-rose-400' },
  ];

  return (
    <section className="w-full max-w-7xl" aria-labelledby="top-signals-title">
      {/* <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="top-signals-title" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Top signals
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Stocks flagged by the most screeners in the latest scan
            {scanLabel ? ` (${scanLabel})` : ''}.
          </p>
        </div>
        <button
          onClick={() => load(category, true)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          Refresh
        </button>
      </div> */}

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <SignalExplainer category={category} />

        <div className="min-w-0">
          <div className="mb-3">
            <div role="tablist" aria-label="Signal direction" className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
              {tabs.map((t) => {
                const on = category === t.key;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setCategory(t.key)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                      on
                        ? cn('bg-white shadow-sm dark:bg-slate-800', t.active)
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    )}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {sectors.length > 2 && (
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by sector">
              {sectors.map((s) => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  aria-pressed={sector === s}
                  className={cn(
                    'flex-none rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                    sector === s
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            {loading && !current ? (
              <ListSkeleton />
            ) : error ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Couldn&apos;t load signals: {error}
                </p>
                <button
                  onClick={() => load(category, true)}
                  className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Try again
                </button>
              </div>
            ) : visible.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-slate-500">
                No {category} signals
                {sector !== 'All' ? ` in ${sector}` : ''} in the latest scan.
                {sector !== 'All' && (
                  <button onClick={() => setSector('All')} className="ml-1 text-indigo-600 underline underline-offset-2 dark:text-indigo-400">
                    Show all sectors
                  </button>
                )}
              </p>
            ) : (
              <div
                className={cn(
                  'divide-y divide-slate-100 transition-opacity dark:divide-slate-800',
                  loading && 'opacity-60'
                )}
              >
                {visible.map((s, i) => (
                  <StockRow key={s.symbol} stock={s} rank={i + 1} max={max} category={category} />
                ))}
              </div>
            )}
          </div>

          {current && !error && (
            <p className="mt-3 text-xs text-slate-500">
              Updated {current.at.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}