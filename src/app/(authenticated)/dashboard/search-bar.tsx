'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Clock, CornerDownLeft, Search, SearchX, TriangleAlert, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

/* ------------------------------ config ------------------------------ */

const RECENT_KEY = 'ox_recent_searches';
const MAX_RECENT = 5;
const STRIP_SIZE = 8;
const LIST_SIZE = 6;
const DEBOUNCE_MS = 180;
const EXAMPLES = ['RELIANCE', 'Tata Motors', 'HDFCBANK', 'Infosys', 'ITC'];

const ANIM_CSS = `
@keyframes ox-roll { from { opacity: 0; transform: translateY(70%); } to { opacity: 1; transform: none; } }
@keyframes ox-scan { from { transform: translateX(-100%); } to { transform: translateX(300%); } }
.ox-roll { animation: ox-roll .38s cubic-bezier(.2,.8,.2,1) both; }
.ox-scan { animation: ox-scan 1.05s cubic-bezier(.4,0,.2,1) infinite; }
@media (prefers-reduced-motion: reduce) { .ox-roll, .ox-scan { animation: none; } }
`;

type StockHit = {
  symbol: string;
  name?: string;
  full_stock_name?: string;
  ltp?: number;
  percent_change?: number;
  type?: string;
};

type Item = { kind: 'recent'; name: string } | { kind: 'stock'; stock: StockHit };

/* ------------------------------ helpers ------------------------------ */

const sym = (s: StockHit) =>
  (s.symbol ?? '').replace('NSE:', '').replace(/-(EQ|BE|BZ|SM)$/, '').trim();

const fullNameOf = (s: StockHit) => s.name ?? s.full_stock_name ?? '';

function getRecent(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function setRecentStorage(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}

function saveRecent(name: string) {
  setRecentStorage([name, ...getRecent().filter((x) => x !== name)].slice(0, MAX_RECENT));
}

async function meiliSearch(
  query: string,
  opts?: { hitsPerPage?: number; sort?: string[]; signal?: AbortSignal }
): Promise<StockHit[]> {
  const body: Record<string, unknown> = {
    q: query,
    filter: 'type = "stock"',
    hitsPerPage: opts?.hitsPerPage ?? LIST_SIZE,
  };
  if (opts?.sort) body.sort = opts.sort;

  const res = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: opts?.signal,
  });
  if (!res.ok) throw new Error(`Search ${res.status}`);
  const data = await res.json();
  return data.hits ?? [];
}

function sortByRelevance(hits: StockHit[], query: string): StockHit[] {
  const q = query.toLowerCase().trim();
  if (!q) return hits;
  const rank = (s: StockHit) => {
    const a = sym(s).toLowerCase();
    const n = fullNameOf(s).toLowerCase();
    if (a === q || n === q) return 0;
    if (a.startsWith(q)) return 1;
    if (n.startsWith(q)) return 2;
    return 3;
  };
  return [...hits].sort((a, b) => rank(a) - rank(b));
}

const isUp = (pct?: number) => (pct ?? 0) >= 0;
const fmtPct = (pct: number) => `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
const fmtPrice = (n: number) =>
  `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const changeText = (pct?: number) =>
  isUp(pct) ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';

const changePill = (pct?: number) =>
  isUp(pct)
    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
    : 'bg-rose-500/10 text-rose-700 dark:text-rose-400';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30 dark:focus-visible:ring-white/40';

/** Matched text goes full-strength; the rest of the string stays quiet. */
function Match({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent font-semibold text-zinc-950 dark:text-white">
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  );
}

/* ------------------------------ component ------------------------------ */

export const SearchBarCustom: React.FC<{ showMovers?: boolean }> = ({ showMovers = true }) => {
  const router = useRouter();
  const listId = useId();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockHit[]>([]);
  const [popular, setPopular] = useState<StockHit[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [popularLoading, setPopularLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const [hint, setHint] = useState(0);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isSearching = query.trim().length > 0;

  const items: Item[] = isSearching
    ? results.map((stock) => ({ kind: 'stock', stock }))
    : [
        ...recent.map((name): Item => ({ kind: 'recent', name })),
        ...popular.slice(0, LIST_SIZE).map((stock): Item => ({ kind: 'stock', stock })),
      ];

  const showSkeleton = isSearching
    ? loading && results.length === 0
    : popularLoading && items.length === 0;
  const showEmpty = isSearching && !loading && !error && results.length === 0;

  /* ------------------------------ effects ------------------------------ */

  useEffect(() => setMounted(true), []);

  // Rotate example searches in the idle placeholder
  useEffect(() => {
    if (expanded || query) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setHint((h) => (h + 1) % EXAMPLES.length), 2600);
    return () => clearInterval(t);
  }, [expanded, query]);

  useEffect(() => {
    setRecent(getRecent());
    (async () => {
      try {
        let hits = await meiliSearch('', { hitsPerPage: STRIP_SIZE, sort: ['volume:desc'] });
        if (!hits.length) hits = await meiliSearch('', { hitsPerPage: STRIP_SIZE });
        setPopular(hits);
      } catch {
        /* silent: typing still works */
      } finally {
        setPopularLoading(false);
      }
    })();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  // Close on outside press
  useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (containerRef.current?.contains(t) || dropdownRef.current?.contains(t)) return;
      setExpanded(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, []);

  // "/" focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (
        e.key === '/' &&
        !e.metaKey &&
        !e.ctrlKey &&
        tag !== 'INPUT' &&
        tag !== 'TEXTAREA' &&
        !el?.isContentEditable
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Keep active row visible
  useEffect(() => {
    if (activeIndex < 0) return;
    scrollRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Anchor dropdown to the field
  const measure = useCallback(() => {
    const el = fieldRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ top: r.bottom, left: r.left, width: r.width });
  }, []);

  useEffect(() => {
    if (!expanded) return;
    measure();
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [expanded, measure]);

  /* ------------------------------ actions ------------------------------ */

  const runSearch = useCallback((value: string, delay = 0) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    const q = value.trim();
    setError(false);
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const hits = await meiliSearch(q, { hitsPerPage: LIST_SIZE, signal: controller.signal });
        setResults(sortByRelevance(hits, q));
        setLoading(false);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setResults([]);
        setError(true);
        setLoading(false);
      }
    }, delay);
  }, []);

  const open = () => {
    setRecent(getRecent());
    setExpanded(true);
  };

  const close = () => {
    setExpanded(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const go = (name: string) => {
    const s = name.trim();
    if (!s) return;
    saveRecent(s);
    setRecent(getRecent());
    close();
    router.push(`/stocks/${encodeURIComponent(s.toUpperCase())}`);
  };

  const choose = (item: Item) => go(item.kind === 'recent' ? item.name : sym(item.stock));

  const clearQuery = () => {
    abortRef.current?.abort();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setQuery('');
    setResults([]);
    setLoading(false);
    setError(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const removeRecent = (name: string) => {
    const next = getRecent().filter((x) => x !== name);
    setRecentStorage(next);
    setRecent(next);
    setActiveIndex(-1);
  };

  const clearRecent = () => {
    setRecentStorage([]);
    setRecent([]);
    setActiveIndex(-1);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);
    setExpanded(true);
    runSearch(val, DEBOUNCE_MS);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    const count = items.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!expanded) return open();
        if (count) setActiveIndex((i) => (i + 1) % count);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (count) setActiveIndex((i) => (i <= 0 ? count - 1 : i - 1));
        break;
      case 'Enter': {
        if (loading) return;
        const target = activeIndex >= 0 ? items[activeIndex] : isSearching ? items[0] : undefined;
        if (target) choose(target);
        break;
      }
      case 'Escape':
        if (query) clearQuery();
        else close();
        break;
    }
  };

  /* ------------------------------ pieces ------------------------------ */

  const Sk = ({ className }: { className: string }) => (
    <div className={`rounded bg-zinc-200/70 dark:bg-zinc-800 ${className}`} />
  );

  const skeleton = (
    <div aria-hidden className="animate-pulse motion-reduce:animate-none px-2 py-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <Sk className="h-9 w-9 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Sk className="h-3 w-24" />
            <Sk className="h-2.5 w-40" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Sk className="h-3 w-16" />
            <Sk className="h-2.5 w-12" />
          </div>
        </div>
      ))}
    </div>
  );

  const rows = items.map((item, i) => {
    const active = i === activeIndex;
    const prev = items[i - 1];
    const heading =
      !prev || prev.kind !== item.kind
        ? item.kind === 'recent'
          ? 'Recent'
          : isSearching
            ? 'Stocks'
            : 'Popular'
        : null;

    const base = `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors
      before:absolute before:bottom-2.5 before:left-0 before:top-2.5 before:w-0.5 before:rounded-full
      before:bg-blue-500 before:transition-opacity before:duration-150 ${
        active ? 'bg-zinc-100 before:opacity-100 dark:bg-white/[0.07]' : 'before:opacity-0'
      }`;

    return (
      <React.Fragment key={item.kind === 'recent' ? `r-${item.name}` : `s-${item.stock.symbol}`}>
        {heading && (
          <div className="flex items-center justify-between px-5 pb-1 pt-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>{heading}</span>
            {item.kind === 'recent' && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={clearRecent}
                className={`rounded px-1 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white ${focusRing}`}
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {item.kind === 'recent' ? (
          <div
            id={`${listId}-opt-${i}`}
            data-index={i}
            role="option"
            aria-selected={active}
            onClick={() => choose(item)}
            onMouseMove={() => active || setActiveIndex(i)}
            className={base}
          >
            <div
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500"
            >
              <Clock size={16} />
            </div>
            <span className="flex-1 truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {item.name}
            </span>
            <button
              type="button"
              tabIndex={-1}
              aria-label={`Remove ${item.name} from recent searches`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                removeRecent(item.name);
              }}
              className={`rounded-md p-1.5 text-zinc-400 transition-opacity hover:text-zinc-800 dark:hover:text-white
                [@media(hover:hover)]:opacity-0 group-hover:opacity-100 ${active ? '[@media(hover:hover)]:opacity-100' : ''} ${focusRing}`}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          (() => {
            const s = item.stock;
            const name = sym(s);
            const full = fullNameOf(s);
            return (
              <div
                id={`${listId}-opt-${i}`}
                data-index={i}
                role="option"
                aria-selected={active}
                onClick={() => choose(item)}
                onMouseMove={() => active || setActiveIndex(i)}
                className={base}
              >
                <div
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-600 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
                >
                  {name.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <span className="text-zinc-900 dark:text-zinc-100">
                      <Match text={name} query={query} />
                    </span>
                  </span>
                  {full && (
                    <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      <Match text={full} query={query} />
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-0.5 tabular-nums">
                  {s.ltp != null && (
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {fmtPrice(s.ltp)}
                    </span>
                  )}
                  {s.percent_change != null && (
                    <span
                      className={`rounded px-1.5 py-px text-xs font-medium ${changePill(s.percent_change)}`}
                    >
                      {fmtPct(s.percent_change)}
                    </span>
                  )}
                </div>
              </div>
            );
          })()
        )}
      </React.Fragment>
    );
  });

  const panel = (
    <>
      <div
        ref={scrollRef}
        id={listId}
        role="listbox"
        aria-label="Stock suggestions"
        className={`overflow-y-auto overscroll-contain px-2 pb-2 transition-opacity ${
          isSearching && loading && results.length > 0 ? 'opacity-60' : 'opacity-100'
        }`}
        style={{ maxHeight: rect ? `min(26rem, calc(100dvh - ${rect.top}px - 5.5rem))` : '26rem' }}
      >
        {showSkeleton ? skeleton : rows}

        {showEmpty && (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <SearchX size={22} className="mb-3 text-zinc-400" aria-hidden />
            <div className="text-sm font-medium text-zinc-900 dark:text-white">
              No stocks match “{query.trim()}”
            </div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Check the spelling, or search by ticker (RELIANCE) or company name.
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <TriangleAlert size={22} className="mb-3 text-amber-500" aria-hidden />
            <div className="text-sm font-medium text-zinc-900 dark:text-white">
              Search is unavailable right now
            </div>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runSearch(query, 0)}
              className={`mt-3 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50
                dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-white/5 ${focusRing}`}
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* keyboard hints: desktop only */}
      <div className="hidden items-center gap-4 border-t border-zinc-100 px-5 py-2.5 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:flex">
        <span className="inline-flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          Navigate
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Kbd>
            <CornerDownLeft size={11} aria-hidden />
          </Kbd>
          Open
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Kbd>Esc</Kbd>
          Close
        </span>
      </div>
    </>
  );

  const overlay = !query && (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-nowrap text-base text-zinc-400 md:text-sm dark:text-zinc-500"
    >
      {expanded ? (
        'Search by name or ticker'
      ) : (
        <>
          <span>Search&nbsp;</span>
          <span key={hint} className="ox-roll font-medium text-zinc-500 dark:text-zinc-400">
            {EXAMPLES[hint]}
          </span>
        </>
      )}
    </div>
  );

  const movers = showMovers && (
    <div
      className={`mt-3 flex items-center gap-2 overflow-x-auto px-0.5 text-sm transition-opacity duration-200
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent)]
        ${expanded ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      {popularLoading &&
        Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-7 w-24 shrink-0 animate-pulse rounded-full bg-zinc-100 motion-reduce:animate-none dark:bg-zinc-800"
          />
        ))}
      {popular.map((s) => (
        <button
          key={s.symbol}
          type="button"
          onClick={() => go(sym(s))}
          className={`inline-flex shrink-0 items-baseline gap-1.5 rounded-full border border-zinc-200 px-3 py-1
            transition-colors hover:border-zinc-300 hover:bg-zinc-50
            dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-white/5 ${focusRing}`}
        >
          <span className="font-medium text-zinc-800 dark:text-zinc-200">{sym(s)}</span>
          {s.percent_change != null && (
            <span className={`text-xs tabular-nums ${changeText(s.percent_change)}`}>
              {fmtPct(s.percent_change)}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  /* ------------------------------ render ------------------------------ */

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-2xl">
      <style>{ANIM_CSS}</style>
      {mounted &&
        createPortal(
          <div
            aria-hidden
            onClick={close}
            className={`fixed inset-0 z-40 bg-zinc-950/25 transition-opacity duration-200 motion-reduce:transition-none dark:bg-black/50 ${
              expanded ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          />,
          document.body
        )}

      <div className="relative z-50">
        <div
          ref={fieldRef}
          className={`relative flex h-11 items-center gap-2.5 overflow-hidden rounded-xl border bg-white px-3.5
            transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none dark:bg-zinc-900 ${
              expanded
                ? 'border-zinc-300 shadow-md ring-4 ring-blue-500/15 dark:border-zinc-600 dark:ring-blue-400/20'
                : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
            }`}
        >
          {/* icon: turns blue on focus, swaps to a spinner while searching */}
          <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center" aria-hidden>
            <Search
              size={17}
              className={`absolute transition-all duration-200 motion-reduce:transition-none ${
                loading && isSearching ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
              } ${expanded ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}`}
            />
            <span
              className={`absolute h-4 w-4 animate-spin rounded-full border-2 border-blue-500/25 border-t-blue-500
                transition-opacity duration-200 motion-reduce:animate-none ${
                  loading && isSearching ? 'opacity-100' : 'opacity-0'
                }`}
            />
          </span>
          <div className="relative min-w-0 flex-1">
            {overlay}
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={expanded}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
            aria-label="Search stocks"
            enterKeyHint="search"
            className="relative w-full appearance-none border-0 bg-transparent p-0 text-base text-zinc-900 shadow-none outline-none ring-0
              placeholder:text-zinc-400 focus:border-0 focus:shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none
              md:text-sm dark:text-white dark:placeholder:text-zinc-500"
            value={query}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onFocus={open}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
          />
          </div>

          {query ? (
            <button
              type="button"
              onClick={clearQuery}
              aria-label="Clear search"
              className={`shrink-0 rounded-md p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 ${focusRing}`}
            >
              <X size={16} />
            </button>
          ) : expanded ? (
            <button
              type="button"
              onClick={close}
              className={`shrink-0 rounded-md px-1.5 py-0.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white md:hidden ${focusRing}`}
            >
              Cancel
            </button>
          ) : null}

          {!query && (
            <span className={expanded ? 'hidden' : 'hidden md:block'}>
              <Kbd>/</Kbd>
            </span>
          )}

          {/* focus line draws out from the centre; a highlight sweeps along it while searching */}
          <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden">
            <span
              className={`absolute inset-0 origin-center bg-blue-500 transition-transform duration-300 ease-out
                motion-reduce:transition-none dark:bg-blue-400 ${expanded ? 'scale-x-100' : 'scale-x-0'}`}
            />
            {loading && isSearching && (
              <span className="ox-scan absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/90 to-transparent" />
            )}
          </span>
        </div>
      </div>

      {mounted &&
        rect &&
        createPortal(
          <div
            ref={dropdownRef}
            aria-hidden={!expanded}
            style={{ position: 'fixed', top: rect.top + 6, left: rect.left, width: rect.width }}
            className={`z-50 origin-top overflow-hidden rounded-2xl border border-zinc-200 bg-white
              shadow-xl shadow-zinc-900/10 transition-[opacity,transform,visibility] duration-150 ease-out
              motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/50 ${
                expanded ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
              }`}
          >
            {panel}
          </div>,
          document.body
        )}

      {movers}
    </div>
  );
};

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-zinc-200 bg-zinc-50 px-1
        font-sans text-[11px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
    >
      {children}
    </kbd>
  );
}