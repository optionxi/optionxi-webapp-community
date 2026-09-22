// app/market-news/[slug]/page.tsx
import { supabase } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';


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

async function getNewsDigest(id: string): Promise<NewsDigest | null> {
  const { data, error } = await supabase
    .from('news_digests')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as NewsDigest;
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

function MetaBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 text-[11px] font-semibold tracking-wide font-sans uppercase">
      <span>{icon}</span>{label}
    </span>
  );
}

function RegionBadge({ region }: { region: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-[11px] font-medium">
      {region === 'india' ? '🇮🇳 India' : '🌐 Global'}
    </span>
  );
}

function ImpactChip({ impact }: { impact: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${impactBadgeClass(impact)}`}>
      {impact}
    </span>
  );
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const c = sentimentColor(sentiment);
  const arrow = sentiment === 'bullish' ? '↑' : sentiment === 'bearish' ? '↓' : '→';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide ${c.bg} ${c.text} ${c.border}`}>
      {arrow} {sentiment.toUpperCase()}
    </span>
  );
}

function StockChip({ symbol }: { symbol: string }) {
  return (
    <a
      href={`/stocks/${symbol.toUpperCase()}`}
      target="_blank"
      rel="noopener noreferrer"
      className="px-2.5 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[11px] font-mono font-medium hover:bg-blue-500/20 transition-colors"
    >
      {symbol.toUpperCase()}
    </a>
  );
}

function TagChip({ label }: { label: string }) {
  return (
    <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-[11px] font-medium">
      {label}
    </span>
  );
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from('news_digests')
    .select('id')
    .limit(50);
  
  return (data || []).map((item) => ({
    slug: item.id,
  }));
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const digest = await getNewsDigest(slug);
  
  if (!digest) {
    notFound();
  }

  const d = digest;

  return (
    <ContentLayout title={d.headline}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/market-news">Market News</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate max-w-[200px]">{d.headline}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Desktop-optimized detail view */}
      <article className="max-w-4xl mx-auto">

        <br/>

        {/* Hero Section */}
        <div className="space-y-6">
          {d.image_url && (
            <div className="relative h-[320px] lg:h-[420px] rounded-xl overflow-hidden bg-muted">
              <img 
                src={d.image_url} 
                alt={d.headline} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          )}

          {/* Badge row */}
          <div className="flex flex-wrap gap-2">
            <MetaBadge icon={categoryIcon(d.category)} label={d.category} />
            <RegionBadge region={d.region} />
            <ImpactChip impact={d.impact} />
            <SentimentBadge sentiment={d.sentiment} />
          </div>

          {/* Headline */}
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-foreground">
            {d.headline}
          </h1>

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-b border-border pb-4">
            <span>📅</span>
            <time dateTime={d.created_at}>{new Date(d.created_at).toLocaleString()}</time>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span>⏱ {timeAgo(d.created_at)}</span>
          </div>

          {/* Summary */}
          <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
              {d.summary}
            </p>
          </div>

          {/* Details */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-lg font-semibold tracking-tight mb-3">Analysis</h2>
            <p className="text-sm text-muted-foreground leading-loose whitespace-pre-wrap">
              {d.details}
            </p>
          </div>

          {d.master_summary && (
            <div className="bg-blue-500/5 rounded-xl p-5 border border-blue-500/20">
              <h2 className="text-sm font-semibold tracking-wider text-blue-500 uppercase mb-2">Executive Summary</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {d.master_summary}
              </p>
            </div>
          )}

          {/* Sectors */}
          {(d.sectors?.length ?? 0) > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Affected Sectors</h2>
              <div className="flex flex-wrap gap-2">
                {d.sectors?.map(s => <TagChip key={s} label={s} />)}
              </div>
            </div>
          )}

          {/* Related Stocks */}
          {(d.stocks?.length ?? 0) > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Related Stocks</h2>
              <div className="flex flex-wrap gap-2">
                {d.stocks?.map(s => <StockChip key={s} symbol={s} />)}
              </div>
            </div>
          )}

          {/* Sources */}
          {(d.source_urls?.length ?? 0) > 0 && (
            <div className="space-y-3 pt-4 border-t border-border">
              <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Sources</h2>
              <div className="space-y-2">
                {d.source_urls?.slice(0, 5).map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-muted/30 border border-border hover:bg-accent transition-colors no-underline"
                  >
                    <span className="text-blue-500 text-sm flex-shrink-0">↗</span>
                    <span className="text-blue-500 text-xs font-mono truncate">
                      {d.source_titles?.[i] ?? new URL(url).hostname}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </ContentLayout>
  );
}