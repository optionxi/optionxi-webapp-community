"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Add this interface near the top with your other interfaces
interface GeneratedValueRow {
  id: number;
  stckname: string;
  symbol?: string;
  name?: string;
  sec: string | null;
  pcnt: number;
  ltp?: number;
  open: number;
  close: number;
  high: number;
  low: number;
  vol: number;
  // Add other fields as needed
}

interface StockData {
  symbol: string;
  name: string;
  sec: string | null;
  pcnt: number;
  ltp: number;
}

interface TrendingSector {
  name: string;
  changePercent: number;
  stocks: StockData[];
}

interface MarketTrendsSectionProps {
  onViewAll?: () => void;
}

const ShimmerBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

const SkeletonLoader = () => (
  <div className="p-6">
    <div className="flex justify-center items-center gap-8 p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-emerald-500/10">
          <svg className="w-4 h-4 text-emerald-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <ShimmerBox className="h-7 w-12" />
      </div>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-red-500/10">
          <svg className="w-4 h-4 text-red-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        </div>
        <ShimmerBox className="h-7 w-12" />
      </div>
    </div>
    <div className="mb-4">
      <ShimmerBox className="h-4 w-32 mb-3" />
      <div className="flex flex-wrap gap-2">
        {[80, 100, 90].map((w, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <ShimmerBox className={`h-4 w-${w === 80 ? '20' : w === 100 ? '24' : '22'}`} />
            <ShimmerBox className="h-4 w-10" />
          </div>
        ))}
      </div>
    </div>
    <div>
      <ShimmerBox className="h-4 w-32 mb-3" />
      <div className="flex flex-wrap gap-2">
        {[85, 95, 75].map((w, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <ShimmerBox className={`h-4 w-${w === 85 ? '20' : w === 95 ? '24' : '18'}`} />
            <ShimmerBox className="h-4 w-10" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="m-2 p-8 rounded-2xl bg-white dark:bg-gray-900 border border-red-500/20">
    <div className="flex flex-col items-center text-center">
      <div className="p-4 rounded-full bg-red-500/10 mb-4">
        <svg className="w-10 h-10 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">
        Failed to load sector trends
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-5 max-w-xs">
        Unable to fetch market data. Please check your connection.
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Retry
      </button>
    </div>
  </div>
);

export default function MarketTrendsSection({ onViewAll }: MarketTrendsSectionProps) {
  const router = useRouter();
  const [advancingCount, setAdvancingCount] = useState(0);
  const [decliningCount, setDecliningCount] = useState(0);
  const [bullishSectors, setBullishSectors] = useState<TrendingSector[]>([]);
  const [bearishSectors, setBearishSectors] = useState<TrendingSector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('generated_values')
        .select('*')
        .not('sec', 'is', null);

      if (fetchError) throw fetchError;

      const sectorData: Record<string, StockData[]> = {};

      (data || []).forEach((item: GeneratedValueRow) => {
        const stock: StockData = {
          symbol: item.symbol || '',
          name: item.name || '',
          sec: item.sec,
          pcnt: item.pcnt || 0,
          ltp: item.ltp || 0,
        };
        const sector = stock.sec || 'Others';
        if (!sectorData[sector]) sectorData[sector] = [];
        sectorData[sector].push(stock);
      });

      let totalAdvancing = 0;
      let totalDeclining = 0;
      const allTrends: { sectorName: string; averageChange: number; totalStocks: number; stocks: StockData[] }[] = [];

      Object.entries(sectorData).forEach(([sector, stocks]) => {
        const advancing = stocks.filter(s => s.pcnt > 0).length;
        const declining = stocks.filter(s => s.pcnt < 0).length;
        const avgChange = stocks.reduce((sum, s) => sum + s.pcnt, 0) / stocks.length;

        totalAdvancing += advancing;
        totalDeclining += declining;

        allTrends.push({ sectorName: sector, averageChange: avgChange, totalStocks: stocks.length, stocks });
      });

      const bullish = allTrends.filter(t => t.averageChange > 0).sort((a, b) => b.averageChange - a.averageChange);
      const bearish = allTrends.filter(t => t.averageChange < 0).sort((a, b) => a.averageChange - b.averageChange);

      setAdvancingCount(totalAdvancing);
      setDecliningCount(totalDeclining);
      setBullishSectors(bullish.slice(0, 3).map(t => ({ name: t.sectorName, changePercent: t.averageChange, stocks: t.stocks })));
      setBearishSectors(bearish.slice(0, 3).map(t => ({ name: t.sectorName, changePercent: t.averageChange, stocks: t.stocks })));
      setIsLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message :  'An error occurred');
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSectorClick = (sector: TrendingSector) => {
    // Navigate to sector page - adjust route as needed
    router.push(`/sectors/${encodeURIComponent(sector.name)}`);
  };

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorState onRetry={fetchData} />;

  const total = advancingCount + decliningCount;
  const advancingPercent = total > 0 ? (advancingCount / total) * 100 : 50;

  return (
    <div className="p-6">
      {/* Advance/Decline Summary */}
      <button
        onClick={onViewAll}
        className="w-full flex justify-center items-center gap-8 p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors mb-2 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10">
            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {advancingCount}
          </span>
        </div>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-500/10 dark:bg-red-400/10">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <span className="text-xl font-bold text-red-600 dark:text-red-400 tracking-tight">
            {decliningCount}
          </span>
        </div>
      </button>

      {/* Progress Bar */}
      <div className="h-1 rounded-full overflow-hidden flex mb-6">
        <div className="bg-emerald-500 dark:bg-emerald-400 transition-all" style={{ width: `${advancingPercent}%` }} />
        <div className="bg-red-500 dark:bg-red-400 transition-all" style={{ width: `${100 - advancingPercent}%` }} />
      </div>

      {/* Bullish Sectors */}
      {bullishSectors.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Trending Bullish</h3>
          <div className="flex flex-wrap gap-2">
            {bullishSectors.map((sector) => (
              <button
                key={sector.name}
                onClick={() => handleSectorClick(sector)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 dark:border-emerald-400/20 hover:bg-emerald-500/20 dark:hover:bg-emerald-400/20 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{sector.name}</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  +{sector.changePercent.toFixed(1)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bearish Sectors */}
      {bearishSectors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Trending Bearish</h3>
          <div className="flex flex-wrap gap-2">
            {bearishSectors.map((sector) => (
              <button
                key={sector.name}
                onClick={() => handleSectorClick(sector)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 dark:bg-red-400/10 border border-red-500/20 dark:border-red-400/20 hover:bg-red-500/20 dark:hover:bg-red-400/20 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{sector.name}</span>
                <span className="text-xs font-bold text-red-600 dark:text-red-400">
                  {sector.changePercent.toFixed(1)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}