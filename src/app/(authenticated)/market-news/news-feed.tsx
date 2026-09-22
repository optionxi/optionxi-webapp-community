// app/market-news/news-feed-client.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import React from 'react';


interface NewsDigest {
  id: string;
  headline: string;
  summary: string;
  details: string;
  master_summary?: string;
  region: string;
  category: string;
  sectors: string[];
  stocks: string[];
  sentiment: string;
  impact: string;
  priority: number;
  image_url?: string;
  source_titles?: string[];
  source_urls?: string[];
  approved_at?: string;
  created_at: string;
}

const PAGE_SIZE = 12;

async function fetchDigests({ region, category, page = 1 }: {
  region?: string; category?: string; page?: number;
}): Promise<{ data: NewsDigest[]; total: number }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  
  let query = supabase.from('news_digests').select('*', { count: 'exact' });
  if (region) query = query.eq('region', region);
  if (category) query = query.eq('category', category);
  
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);
  
  if (error) throw new Error(error.message);
  return { data: (data ?? []) as NewsDigest[], total: count ?? 0 };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function sentimentColor(s: string) {
  if (s === 'bullish') return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/40' };
  if (s === 'bearish') return { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/40' };
  return { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted-foreground/40' };
}

function impactBadgeClass(i: string) {
  if (i === 'high') return 'bg-orange-500/20 text-orange-500';
  if (i === 'medium') return 'bg-yellow-400/20 text-yellow-500';
  return 'bg-slate-400/20 text-slate-400';
}

function categoryIcon(c: string): string {
  const icons: Record<string, string> = {
    markets: '📈', economy: '🏛', commodities: '🛢', forex: '💱', stocks: '🕯',
  };
  return icons[c] ?? '📰';
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="h-44 w-full bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-md bg-muted animate-pulse" />
          <div className="h-5 w-14 rounded-md bg-muted animate-pulse" />
          <div className="ml-auto h-5 w-12 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
          <div className="h-5 w-12 rounded-md bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function MetaBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-semibold tracking-wide font-sans uppercase whitespace-nowrap">
      <span>{icon}</span>{label}
    </span>
  );
}

function ImpactChip({ impact }: { impact: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase whitespace-nowrap ${impactBadgeClass(impact)}`}>
      {impact}
    </span>
  );
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const c = sentimentColor(sentiment);
  const arrow = sentiment === 'bullish' ? '↑' : sentiment === 'bearish' ? '↓' : '→';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9.5px] font-semibold tracking-wide whitespace-nowrap ${c.bg} ${c.text} ${c.border}`}>
      {arrow} {sentiment.toUpperCase()}
    </span>
  );
}

function StockChip({ symbol, onClick }: { symbol: string; onClick?: (e?: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10.5px] font-mono font-medium hover:bg-blue-500/20 transition-colors"
    >
      {symbol.toUpperCase()}
    </button>
  );
}

function TagChip({ label }: { label: string }) {
  return (
    <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10.5px] font-medium">
      {label}
    </span>
  );
}

function RegionBadge({ region }: { region: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[9.5px] font-medium whitespace-nowrap">
      {region === 'india' ? '🇮🇳 India' : '🌐 Global'}
    </span>
  );
}

function DigestCard({ digest: d, onClick }: { digest: NewsDigest; onClick: () => void }) {
  const isHigh = d.impact === 'high';

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`group flex flex-col rounded-xl border bg-card overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        isHigh ? 'border-orange-500/40 shadow-orange-500/5' : 'border-border'
      }`}
    >
      {isHigh && (
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-orange-500/40" />
      )}

      {d.image_url && (
        <div className="w-full h-44 overflow-hidden flex-shrink-0 bg-muted">
          <img src={d.image_url} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      )}

      <div className="flex-1 p-4 pb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <MetaBadge icon={categoryIcon(d.category)} label={d.category} />
          <RegionBadge region={d.region} />
          <div className="flex-1" />
          <ImpactChip impact={d.impact} />
        </div>

        <h2 className="mt-2.5 mb-1.5 text-base font-bold leading-snug tracking-tight text-foreground line-clamp-2">
          {d.headline}
        </h2>

        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 mb-2.5">
          {d.summary}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap">
          <SentimentBadge sentiment={d.sentiment} />
          {d.sectors?.slice(0, 2).map(s => <TagChip key={s} label={s} />)}
        </div>

        {(d.stocks?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {d.stocks.slice(0, 3).map(s => (
              <StockChip
                key={s}
                symbol={s}
                onClick={(e) => {
                  e?.stopPropagation();
                  window.open(`/stocks/NSE:${s.toUpperCase()}-EQ`, '_blank');
                }}
              />
            ))}
            {d.stocks.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{d.stocks.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 px-4 py-2.5 mt-auto text-[10.5px] text-muted-foreground border-t border-border/50">
        <span className="text-[11px]">⏱</span>
        <span>{timeAgo(d.created_at)}</span>
      </div>
    </article>
  );
}

function StateScreen({ icon, iconColor, title, subtitle, actionLabel, onAction }: {
  icon: string; iconColor: string; title: string;
  subtitle: string; actionLabel: string; onAction: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: `${iconColor}18` }}>
        <span className="text-3xl">{icon}</span>
      </div>
      <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-7 max-w-xs">{subtitle}</p>
      <button
        type="button"
        onClick={onAction}
        className="px-6 py-2.5 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
}

// Mobile Dropdown Filter Component
// Mobile Dropdown Filter Component
function MobileFilterDropdown({ 
  selected, 
  onChange, 
  label 
}: { 
  selected?: string; 
  onChange: (v?: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(label);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: [string | undefined, string][] = label === 'Region' 
    ? [[undefined, 'All Regions'], ['india', '🇮🇳 India'], ['international', '🌐 Global']]
    : [[undefined, 'All Categories'], ['markets', 'Markets'], ['economy', 'Economy'],
       ['commodities', 'Commodities'], ['forex', 'Forex'], ['stocks', 'Stocks']];

  React.useEffect(() => {
    const found = options.find(([val]) => val === selected);
    setSelectedLabel(found?.[1] || label);
  }, [selected, options, label]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-9 px-3.5 flex items-center gap-2 rounded-lg border text-sm font-medium transition-colors bg-background hover:bg-accent whitespace-nowrap"
      >
        <span>{selectedLabel}</span>
        <span className="text-muted-foreground text-xs">▼</span>
      </button>

      {open && (
        <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-[320px] rounded-xl border border-border bg-popover shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <h3 className="text-sm font-semibold text-foreground">Select {label}</h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-accent rounded-full transition-colors"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {options.map(([val, labelText]) => (
              <button
                key={labelText}
                type="button"
                onClick={() => { onChange(val); setOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm text-left hover:bg-accent transition-colors ${
                  selected === val ? 'text-blue-500 font-semibold bg-blue-500/5' : 'text-foreground'
                }`}
              >
                <span className="text-base">
                  {selected === val && '✓'}
                  {!selected === (val === undefined) && '○'}
                </span>
                <span>{labelText}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
// Desktop Category Filter
function CategoryFilter({ selected, onChange }: { selected?: string; onChange: (v?: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const CATS: [string | undefined, string][] = [
    [undefined, 'All'], ['markets', 'Markets'], ['economy', 'Economy'],
    ['commodities', 'Commodities'], ['forex', 'Forex'], ['stocks', 'Stocks'],
  ];

  const selectedLabel = CATS.find(([val]) => val === selected)?.[1] || 'Filter';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-9 px-3.5 flex items-center gap-2 rounded-lg border text-sm font-medium transition-colors bg-background hover:bg-accent"
      >
        <span className="text-muted-foreground">⚙</span>
        <span>{selectedLabel}</span>
        <span className="text-muted-foreground text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[170px] rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
          {CATS.map(([val, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => { onChange(val); setOpen(false); }}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-left hover:bg-accent transition-colors ${
                selected === val ? 'text-blue-500 font-semibold bg-blue-500/5' : 'text-foreground'
              }`}
            >
              {categoryIcon(val ?? '')} {label}
              {selected === val && <span className="ml-auto text-xs text-blue-500">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 py-8 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
      >
        Previous
      </button>
      
      {getPageNumbers().map((page, idx) => (
        page === '...' ? (
          <span key={`dots-${idx}`} className="px-3 py-2 text-muted-foreground">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'border border-border hover:bg-accent'
            }`}
          >
            {page}
          </button>
        )
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
      >
        Next
      </button>
    </div>
  );
}

export default function NewsFeedClient() {
  const router = useRouter();
  const [region, setRegion] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [digests, setDigests] = useState<NewsDigest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, total } = await fetchDigests({ region, category, page: currentPage });
      setDigests(data);
      setTotalItems(total);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [region, category, currentPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tabIndex: number) => {
    setRegion(tabIndex === 1 ? 'india' : tabIndex === 2 ? 'international' : undefined);
    setCurrentPage(1);
  };

  const handleCardClick = (digest: NewsDigest) => {
    router.push(`/market-news/${digest.id}`);
  };

  const TABS = ['All', '🇮🇳 India', '🌐 Global'];
  const activeTab = region === 'india' ? 1 : region === 'international' ? 2 : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Region Tabs - Hidden on mobile, shown on desktop */}
        <div className="hidden sm:flex gap-0.5 p-1 bg-muted/50 rounded-xl border border-border/50">
          {TABS.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTabChange(i)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === i
                  ? 'bg-background text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Mobile: Dropdown Filters */}
        <div className="flex sm:hidden gap-2">
          <MobileFilterDropdown 
            selected={region} 
            onChange={(val) => { setRegion(val); setCurrentPage(1); }} 
            label="Region"
          />
          <MobileFilterDropdown 
            selected={category} 
            onChange={(val) => { setCategory(val); setCurrentPage(1); }} 
            label="Category"
          />
          <button
            type="button"
            onClick={() => loadData()}
            title="Refresh"
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent transition-colors"
          >
            ↻
          </button>
        </div>

        {/* Desktop: Filters */}
        <div className="hidden sm:flex items-center gap-2">
          <CategoryFilter selected={category} onChange={(val) => { setCategory(val); setCurrentPage(1); }} />
          <button
            type="button"
            onClick={() => loadData()}
            title="Refresh"
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent transition-colors"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Stats bar */}
      {!loading && !error && digests.length > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/50 pb-3">
          <div className="flex items-center gap-4">
            <span>📰 {totalItems} articles</span>
            <span>🕐 Page {currentPage} of {totalPages}</span>
          </div>
          <span>Updated just now</span>
        </div>
      )}

      {/* Feed - Full width, no internal scroll */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <StateScreen icon="📡" iconColor="#EF4444" title="Connection Error" subtitle={error} actionLabel="Retry" onAction={loadData} />
        ) : digests.length === 0 ? (
          <StateScreen icon="📰" iconColor="#6B7280" title="No News Yet" subtitle="Check back soon for the latest market updates." actionLabel="Refresh" onAction={loadData} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {digests.map(d => (
                <DigestCard key={d.id} digest={d} onClick={() => handleCardClick(d)} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}