'use client';

import React, { useState, useEffect } from 'react';
import { Info, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';


interface TopStock {
  symbol: string;
  stockName: string;
  signalCount: number;
  lastPrice: number;
  percentChange: number;
  open: number;
  high: number;
  low: number;
  close: number;
  sector?: string;
}

type Category = 'bullish' | 'bearish';

async function fetchTopStocks(category: Category, limit: number = 10): Promise<TopStock[]> {
  try {
    const { data, error } = await supabase
      .from('screener_results')
      .select(`
        id, screener_id, scan_date, close, high, low, open, pcnt, sec, stckname, vol,
        screener_names!inner(category)
      `)
      .eq('screener_names.category', category)
      .order('scan_date', { ascending: false });

    if (error) throw error;

    const stockSignalMap = new Map<string, TopStock>();

    for (const item of data || []) {
      const symbol = item.stckname as string;
      if (!symbol) continue;

      if (!stockSignalMap.has(symbol)) {
        stockSignalMap.set(symbol, {
          symbol,
          stockName: symbol,
          signalCount: 1,
          lastPrice: item.close ?? 0,
          percentChange: item.pcnt ?? 0,
          open: item.open ?? 0,
          high: item.high ?? 0,
          low: item.low ?? 0,
          close: item.close ?? 0,
          sector: item.sec,
        });
      } else {
        const existing = stockSignalMap.get(symbol)!;
        stockSignalMap.set(symbol, {
          ...existing,
          signalCount: existing.signalCount + 1,
          lastPrice: item.close ?? existing.lastPrice,
          percentChange: item.pcnt ?? existing.percentChange,
        });
      }
    }

    return Array.from(stockSignalMap.values())
      .sort((a, b) => b.signalCount - a.signalCount)
      .slice(0, limit);
  } catch (err) {
    console.error('Error fetching top stocks:', err);
    return [];
  }
}

function StockCard({ stock }: { stock: TopStock }) {
  const stockSymbol = stock.stockName.includes(':')
    ? stock.stockName.split(':')[1].split('-')[0]
    : stock.stockName;
  const isPositive = stock.percentChange >= 0;

  return (
    <div className="group relative p-4 rounded-xl transition-all duration-200
      bg-white dark:bg-gray-800 
      border border-gray-200 dark:border-gray-700
      hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600
      hover:scale-[1.02]"
    >
      {/* Signal Count Badge */}
      <div className="absolute -top-2 -right-2 z-10
        min-w-6 h-6 px-1.5 rounded-full
        flex items-center justify-center
        bg-indigo-500 text-white text-xs font-bold
        shadow-md border-2 border-white dark:border-gray-800
        group-hover:scale-110 transition-transform"
      >
        {stock.signalCount}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
          <Image
            src={`/assets/stockimages/${stockSymbol}.png`}
            alt={stockSymbol}
            fill
            unoptimized
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/logo_xi.png';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {stockSymbol}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {stock.sector || 'NSE'}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-semibold text-gray-900 dark:text-white">
            ₹{stock.lastPrice.toFixed(2)}
          </p>
          <div className="flex items-center justify-end gap-1">
            <svg
              className={`w-4 h-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d={isPositive
                  ? 'M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z'
                  : 'M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z'
                }
                clipRule="evenodd"
              />
            </svg>
            <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{stock.percentChange.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="animate-pulse p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-300 dark:bg-gray-700" />
            <div className="flex-1">
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
              <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
            <div className="text-right">
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
              <div className="h-3 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TopStocksTabs({ limit = 10 }: { limit?: number }) {
  const [activeTab, setActiveTab] = useState<Category>('bullish');
  const [stocks, setStocks] = useState<TopStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTopStocks(activeTab, limit);
      setStocks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message:'Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [activeTab, limit]);

  const tabs: { key: Category; label: string; icon: React.ReactNode }[] = [
    { key: 'bullish', label: 'Bullish', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'bearish', label: 'Bearish', icon: <TrendingDown className="w-4 h-4" /> },
  ];

  return (
    <section className="w-full max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Top Signals
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Stocks with highest screener signals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={loadData} 
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" 
            aria-label="Refresh"
          >
            <RefreshCw className={cn("w-4 h-4 text-gray-500", loading && "animate-spin")} />
          </button>
          <button 
            onClick={() => setIsInfoOpen(true)} 
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" 
            aria-label="Info"
          >
            <Info className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative
              ${activeTab === tab.key
                ? tab.key === 'bullish' 
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.key && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                tab.key === 'bullish' ? 'bg-green-600 dark:bg-green-400' : 'bg-red-600 dark:bg-red-400'
              }`} />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : stocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No {activeTab} stocks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((stock) => (
            <Link 
              key={stock.stockName} 
              href={`/stocks/${stock.stockName.includes(':') ? stock.stockName.split(':')[1].split('-')[0] : stock.stockName}`}
            >
              <StockCard stock={stock} />
            </Link>
          ))}
        </div>
      )}

      {stocks.length > 0 && !loading && (
        <div className="mt-6 pt-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          Last updated: {new Date().toLocaleString()}
        </div>
      )}

      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>About Signal Count</DialogTitle></DialogHeader>
          <div className="py-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <p>The signal count represents the number of technical screeners that have identified this stock with a {activeTab} trend.</p>
            <p>A higher signal count indicates stronger consensus across multiple technical indicators.</p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}