'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NewsDigest {
  id: string;
  headline: string;
  summary: string;
  region: string;
  category: string;
  sectors: string[];
  stocks: string[];
  sentiment: string;
  impact: string;
  image_url?: string;
  created_at: string;
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

function categoryIcon(c: string): string {
  const icons: Record<string, string> = {
    markets: '📈', economy: '🏛', commodities: '🛢', forex: '💱', stocks: '🕯',
  };
  return icons[c] ?? '📰';
}

function sentimentStyle(s: string) {
  if (s === 'bullish') return { dot: 'bg-emerald-500', text: 'text-emerald-500', label: '↑ Bullish' };
  if (s === 'bearish') return { dot: 'bg-red-500', text: 'text-red-500', label: '↓ Bearish' };
  return { dot: 'bg-slate-400', text: 'text-slate-400', label: '→ Neutral' };
}

function impactRing(i: string) {
  if (i === 'high') return 'border-orange-500/60 shadow-orange-500/10';
  if (i === 'medium') return 'border-yellow-500/40 shadow-yellow-500/10';
  return 'border-border/50';
}

function SkeletonCard() {
  return (
    <div className="flex-none w-72 rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
      <div className="h-36 w-full bg-muted/60 animate-pulse" />
      <div className="p-4 space-y-2.5">
        <div className="flex gap-2">
          <div className="h-4 w-16 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-12 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="h-3.5 w-full rounded bg-muted animate-pulse" />
        <div className="h-3.5 w-4/5 rounded bg-muted animate-pulse" />
        <div className="h-3.5 w-3/5 rounded bg-muted animate-pulse" />
        <div className="h-3 w-20 rounded bg-muted/70 animate-pulse mt-1" />
      </div>
    </div>
  );
}

function NewsCard({ digest: d, onClick }: { digest: NewsDigest; onClick: () => void }) {
  const sent = sentimentStyle(d.sentiment);
  const isHigh = d.impact === 'high';

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`
        group flex-none w-72 rounded-2xl border bg-card overflow-hidden cursor-pointer
        transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl shadow-sm
        ${isHigh ? impactRing('high') + ' border shadow-lg' : 'border-border/50'}
      `}
      style={{ minWidth: '288px' }}
    >
      {/* High-impact accent bar */}
      {isHigh && (
        <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-orange-400 to-transparent" />
      )}

      {/* Image */}
      <div className="relative h-36 w-full bg-muted overflow-hidden flex-shrink-0">
        {d.image_url ? (
          <img
            src={d.image_url}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-4xl opacity-30">{categoryIcon(d.category)}</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category pill over image */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold tracking-wide uppercase">
            <span>{categoryIcon(d.category)}</span>
            {d.category}
          </span>
        </div>

        {/* Region pill */}
        <div className="absolute top-2.5 right-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium">
            {d.region === 'india' ? '🇮🇳' : '🌐'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-3 flex flex-col gap-2">
        {/* Sentiment + Impact */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${sent.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sent.dot} animate-pulse`} />
            {sent.label}
          </span>
          {isHigh && (
            <span className="ml-auto px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-500 text-[9px] font-bold tracking-wider uppercase">
              HIGH
            </span>
          )}
        </div>

        {/* Headline */}
        <h3 className="text-[13.5px] font-bold leading-snug tracking-tight text-foreground line-clamp-2 group-hover:text-blue-500 transition-colors duration-200">
          {d.headline}
        </h3>

        {/* Summary */}
        <p className="text-[11.5px] text-muted-foreground leading-relaxed line-clamp-2">
          {d.summary}
        </p>

        {/* Stocks */}
        {(d.stocks?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {d.stocks.slice(0, 3).map(s => (
              <span
                key={s}
                className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-mono font-medium"
              >
                {s.toUpperCase()}
              </span>
            ))}
            {d.stocks.length > 3 && (
              <span className="text-[9px] text-muted-foreground self-center">+{d.stocks.length - 3}</span>
            )}
          </div>
        )}

        {/* Time */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70 mt-0.5 pt-2 border-t border-border/40">
          <span>⏱</span>
          <span>{timeAgo(d.created_at)}</span>
        </div>
      </div>
    </article>
  );
}

export default function MarketNewsBanner() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [digests, setDigests] = useState<NewsDigest[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('news_digests')
          .select('id, headline, summary, region, category, sectors, stocks, sentiment, impact, image_url, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
        setDigests((data ?? []) as NewsDigest[]);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [digests]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Live pulse dot */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
            </span>
            <h2 className="text-base font-bold tracking-tight text-foreground">Market News</h2>
          </div>
          {!loading && digests.length > 0 && (
            <span className="text-[10px] text-muted-foreground/60 font-medium hidden sm:inline">
              Latest {digests.length} updates
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Scroll arrows — desktop only */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="h-7 w-7 rounded-lg border border-border/60 bg-background flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ‹
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="h-7 w-7 rounded-lg border border-border/60 bg-background flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ›
            </button>
          </div>

          {/* View All */}
          <Link
            href="/market-news"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-500 text-xs font-semibold transition-all duration-200 hover:scale-105"
          >
            View All
            <span className="text-[11px]">→</span>
          </Link>
        </div>
      </div>

      {/* Scrollable Feed */}
      <div className="relative">
        {/* Left fade */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
        )}
        {/* Right fade */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : digests.map(d => (
                <NewsCard
                  key={d.id}
                  digest={d}
                  onClick={() => router.push(`/market-news/${d.id}`)}
                />
              ))
          }

          {/* "View All" end card */}
          {!loading && digests.length > 0 && (
            <Link
              href="/market-news"
              className="flex-none w-48 rounded-2xl border border-dashed border-border/60 bg-muted/20 hover:bg-muted/40 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] group"
              style={{ minWidth: '192px' }}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-blue-500 text-lg">→</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">View All News</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Full market coverage</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}