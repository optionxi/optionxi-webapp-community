'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  CalendarDays,
  Inbox,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Screener } from '@/datamodels/screeners_model';
import { fetchScreeners } from '@/lib/supabaseDB/supabase_screeners';
import { ScannerCard } from './custom-scanners-card';
import { ScannerCardSkeleton } from './custom-screener-card-skelton';

const BULLISH = '#3DDC84';
const BEARISH = '#FF5C7A';

const TimeframeIcon = ({ timeframe }: { timeframe: string }) => {
  const cls = "h-3.5 w-3.5";
  switch (timeframe) {
    case 'daily':
      return <Clock className={cls} />;
    case 'weekly':
      return <Calendar className={cls} />;
    case 'monthly':
      return <CalendarDays className={cls} />;
    default:
      return null;
  }
};

// Animates a number counting up to `target` — used for the header's live signal count.
const useOdometer = (target: number, duration = 500) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
};

// NSE/BSE cash market hours: Mon–Fri, 9:15–15:30 IST.
const useMarketStatus = () => {
  const [status, setStatus] = useState({ open: false, label: 'Market Closed' });
  useEffect(() => {
    const compute = () => {
      const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const day = ist.getDay();
      const minutes = ist.getHours() * 60 + ist.getMinutes();
      const open = day >= 1 && day <= 5 && minutes >= 555 && minutes <= 930;
      setStatus({ open, label: open ? 'Market Open' : 'Market Closed' });
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, []);
  return status;
};

const ScreenerSectionSkeleton = () => (
  <div className="space-y-8">
    {[0, 1].map((i) => (
      <div key={i}>
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
          <Skeleton className="h-3 w-16" />
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((j) => (
            <ScannerCardSkeleton key={j} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ type }: { type: 'bullish' | 'bearish' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl">
    <Inbox className="h-8 w-8 text-muted-foreground mb-3" />
    <p className="text-sm font-medium text-foreground">No {type} screeners right now</p>
    <p className="text-xs text-muted-foreground mt-1">Check back once new scans are published.</p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center border border-destructive/30 bg-destructive/5 rounded-xl">
    <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
    <p className="text-sm font-medium text-foreground">Couldn&apos;t load screeners</p>
    <p className="text-xs text-muted-foreground mt-1">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide px-3 py-1.5 rounded-full border border-border hover:bg-secondary transition-colors"
    >
      <RefreshCw className="h-3 w-3" /> Retry
    </button>
  </div>
);

const ScannerDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromURL = searchParams?.get("category") || "bullish";

  const [bullishScreeners, setBullishScreeners] = useState<Screener[]>([]);
  const [bearishScreeners, setBearishScreeners] = useState<Screener[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const marketStatus = useMarketStatus();

  useEffect(() => {
    const loadScreeners = async () => {
      try {
        setLoading(true);
        setError(null);
        const [bullishData, bearishData] = await Promise.all([
          fetchScreeners('bullish'),
          fetchScreeners('bearish'),
        ]);
        setBullishScreeners(bullishData);
        setBearishScreeners(bearishData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load screeners');
      } finally {
        setLoading(false);
      }
    };
    loadScreeners();
  }, []);

  const handleTabChange = (value: string) => {
    const current = new URLSearchParams(searchParams ? Array.from(searchParams.entries()) : []);
    current.set("category", value);
    router.push(`?${current.toString()}`);
  };

  const groupScreenersByTimeframe = (screeners: Screener[]) =>
    screeners.reduce((acc, screener) => {
      const { timeframe } = screener;
      if (!acc[timeframe]) acc[timeframe] = [];
      acc[timeframe].push(screener);
      return acc;
    }, {} as Record<string, Screener[]>);

  const bullishGrouped = useMemo(() => groupScreenersByTimeframe(bullishScreeners), [bullishScreeners]);
  const bearishGrouped = useMemo(() => groupScreenersByTimeframe(bearishScreeners), [bearishScreeners]);

  // Total stocks flagged across the active category — the header number is real, not decorative.
  const totalSignals = useMemo(() => {
    const list = categoryFromURL === 'bearish' ? bearishScreeners : bullishScreeners;
    return list.reduce((sum, s) => sum + (s.signal_count || 0), 0);
  }, [categoryFromURL, bullishScreeners, bearishScreeners]);
  const animatedTotal = useOdometer(totalSignals);
  const accent = categoryFromURL === 'bearish' ? BEARISH : BULLISH;

  const renderJumpNav = (
    grouped: Record<string, Screener[]>,
    type: 'bullish' | 'bearish'
  ) => {
    const order = ['daily', 'weekly', 'monthly'].filter(
      (tf) => grouped[tf]?.length
    );

    if (order.length < 2) return null;

    return (
      <div className="flex gap-2 flex-wrap mb-4">
        {order.map((tf) => (
          <a
            key={tf}
            href={`#${type}-${tf}`}
            className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            {tf} · {grouped[tf].length}
          </a>
        ))}
      </div>
    );
  };

  const renderTimeframeGroup = (
    screeners: Screener[] | undefined,
    timeframe: string,
    type: 'bullish' | 'bearish'
  ) => {
    if (!screeners?.length) return null;
    return (
      <section id={`${type}-${timeframe}`} className="scroll-mt-24 mb-8">
        <div className="flex items-center gap-2 mb-3 text-muted-foreground">
          <TimeframeIcon timeframe={timeframe} />
          <span className="text-xs font-mono uppercase tracking-widest">{timeframe}</span>
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-mono">
            {screeners.length} screener{screeners.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {screeners.map((screener) => (
            <ScannerCard key={screener.id} screener={screener} type={type} category={categoryFromURL} />
          ))}
        </div>
      </section>
    );
  };

  const renderCategoryContent = (grouped: Record<string, Screener[]>, type: 'bullish' | 'bearish', hasAny: boolean) => {
    if (loading) return <ScreenerSectionSkeleton />;
    if (error) return <ErrorState message={error} />;
    if (!hasAny) return <EmptyState type={type} />;
    return (
      <>
        {renderJumpNav(grouped, type)}
        {renderTimeframeGroup(grouped['daily'], 'daily', type)}
        {renderTimeframeGroup(grouped['weekly'], 'weekly', type)}
        {renderTimeframeGroup(grouped['monthly'], 'monthly', type)}
      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Screeners</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live scans across daily, weekly and monthly timeframes
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1.5 w-fit">
          <span className="relative flex h-2 w-2">
            {marketStatus.open && (
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: BULLISH }}
              />
            )}
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: marketStatus.open ? BULLISH : '#8A8F98' }}
            />
          </span>
          <span className="text-xs font-mono text-muted-foreground">{marketStatus.label}</span>
        </div>
      </div>

      <Tabs defaultValue={categoryFromURL} className="space-y-6" onValueChange={handleTabChange}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="inline-flex h-10 items-center rounded-full bg-secondary/50 p-1">
            <TabsTrigger
              value="bullish"
              className="rounded-full px-4 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <TrendingUp className="h-4 w-4" style={{ color: BULLISH }} />
              Bullish
            </TabsTrigger>
            <TabsTrigger
              value="bearish"
              className="rounded-full px-4 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <TrendingDown className="h-4 w-4" style={{ color: BEARISH }} />
              Bearish
            </TabsTrigger>
          </TabsList>

          {!loading && !error && (
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-semibold tabular-nums" style={{ color: accent }}>
                {animatedTotal}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                stocks flagged
              </span>
            </div>
          )}
        </div>

        <TabsContent value="bullish">
          {renderCategoryContent(bullishGrouped, 'bullish', bullishScreeners.length > 0)}
        </TabsContent>

        <TabsContent value="bearish">
          {renderCategoryContent(bearishGrouped, 'bearish', bearishScreeners.length > 0)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScannerDashboard;