'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const RECENT_KEY = 'ox_recent_searches';
const MAX_RECENT = 6;

type StockHit = {
  symbol: string;
  name?: string;
  full_stock_name?: string;
  ltp?: number;
  percent_change?: number;
  type?: string;
};

function sym(stock: StockHit): string {
  return (stock.symbol ?? '')
    .replace('NSE:', '')
    .replace(/-EQ|-BE|-BZ/g, '')
    .trim();
}

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveRecent(name: string) {
  const list = [name, ...getRecent().filter((x) => x !== name)].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

async function meiliSearch(
  query: string,
  opts?: { hitsPerPage?: number; sort?: string[] }
): Promise<StockHit[]> {
  const body: Record<string, unknown> = {
    q: query,
    filter: 'type = "stock"',
    hitsPerPage: opts?.hitsPerPage ?? 5,
  };
  if (opts?.sort) body.sort = opts.sort;

  const res = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`MeiliSearch ${res.status}`);
  const data = await res.json();
  return data.hits ?? [];
}

function sortByRelevance(hits: StockHit[], query: string): StockHit[] {
  const q = query.toLowerCase().trim();
  if (!q) return hits;
  return [...hits].sort((a, b) => {
    const as = sym(a).toLowerCase();
    const bs = sym(b).toLowerCase();
    const an = (a.name ?? a.full_stock_name ?? '').toLowerCase();
    const bn = (b.name ?? b.full_stock_name ?? '').toLowerCase();
    const aExact = as === q || an === q;
    const bExact = bs === q || bn === q;
    if (aExact && !bExact) return -1;
    if (bExact && !aExact) return 1;
    const aStarts = as.startsWith(q) || an.startsWith(q);
    const bStarts = bs.startsWith(q) || bn.startsWith(q);
    if (aStarts && !bStarts) return -1;
    if (bStarts && !aStarts) return 1;
    return 0;
  });
}

export const SearchBarCustom: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockHit[]>([]);
  const [defaultStocks, setDefaultStocks] = useState<StockHit[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const defaultLoadedRef = useRef(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Preload default stocks on mount so they're ready instantly on focus
  useEffect(() => {
    loadDefaultStocks();
  }, []);

  async function loadDefaultStocks() {
    if (defaultLoadedRef.current) return;
    defaultLoadedRef.current = true;
    try {
      let hits = await meiliSearch('', { hitsPerPage: 5, sort: ['volume:desc'] });
      if (!hits.length) hits = await meiliSearch('', { hitsPerPage: 5 });
      setDefaultStocks(hits);
    } catch {
      // silent fail — user can still type to search
    }
  }

  const handleFocus = () => {
    setRecent(getRecent());
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!val.trim()) {
      setResults([]);
      setRecent(getRecent());
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const hits = await meiliSearch(val.trim(), { hitsPerPage: 5 });
        setResults(sortByRelevance(hits, val.trim()));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);
  };

  const handleSelect = (stock: StockHit) => {
    const name = sym(stock);
    saveRecent(name);
    setQuery(name);
    setOpen(false);
    router.push(`/stocks/${name.toUpperCase()}`);
  };

  const handleRecentClick = (name: string) => {
    setQuery(name);
    setLoading(true);
    setOpen(true);
    meiliSearch(name, { hitsPerPage: 5 })
      .then((hits) => setResults(sortByRelevance(hits, name)))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  };

  const isSearching = query.trim().length > 0;
  const displayList = isSearching ? results : defaultStocks;
  const showRecent = !isSearching && recent.length > 0;
  const showPopularLabel = !isSearching && defaultStocks.length > 0;

  return (
    <div className="relative max-w-2xl mx-auto" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search your stocks.."
          className="w-full p-2 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl
            text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
            outline-none border border-gray-200 dark:border-gray-700
            focus:border-blue-500 transition-colors"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          autoComplete="off"
          spellCheck={false}
        />
        <Search
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      {open && (
        <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-xl
          border border-gray-200 dark:border-gray-700 shadow-xl max-h-[300px] overflow-y-auto z-30">

          {/* Recent */}
          {showRecent && (
            <>
              <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                Recent
              </div>
              {recent.map((name) => (
                <div
                  key={name}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer flex items-center gap-2"
                  onClick={() => handleRecentClick(name)}
                >
                  <Search size={13} className="text-gray-400 shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{name}</span>
                </div>
              ))}
              {defaultStocks.length > 0 && (
                <div className="mx-4 my-1 border-t border-gray-100 dark:border-gray-700" />
              )}
            </>
          )}

          {/* Popular label */}
          {showPopularLabel && (
            <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Popular
            </div>
          )}

          {/* Shimmer — only shown during live search, not on initial open */}
          {loading &&
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="px-4 py-3 flex justify-between items-center animate-pulse">
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-2 w-16 bg-gray-100 dark:bg-gray-600 rounded" />
                </div>
                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}

          {/* Results / default stocks */}
          {!loading &&
            displayList.map((stock) => {
              const name = sym(stock);
              const fullName = stock.name ?? stock.full_stock_name ?? '';
              const pct = stock.percent_change;
              const ltp = stock.ltp;
              const pos = (pct ?? 0) >= 0;

              return (
                <div
                  key={stock.symbol}
                  className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer flex justify-between items-center"
                  onClick={() => handleSelect(stock)}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-gray-900 dark:text-white text-sm font-medium truncate">
                      {fullName || name}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 text-xs">{name}</span>
                  </div>
                  <div className="flex flex-col items-end shrink-0 ml-4 gap-0.5">
                    {ltp != null && (
                      <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                        ₹{ltp.toFixed(2)}
                      </span>
                    )}
                    {pct != null ? (
                      <span className={`text-xs font-medium ${pos ? 'text-green-500' : 'text-red-500'}`}>
                        {pos ? '+' : ''}{pct.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Stock</span>
                    )}
                  </div>
                </div>
              );
            })}

          {/* No results */}
          {!loading && isSearching && results.length === 0 && (
            <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center text-sm">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};