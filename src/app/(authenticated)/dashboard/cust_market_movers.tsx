'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';



interface Stock {
  stckname: string;
  symbol: string;
  fname: string;
  close: number;
  pcnt: number;
  vol: number;
}

type TabType = 'gainers' | 'losers' | 'volume';

export default function MarketMovers() {
  const [activeTab, setActiveTab] = useState<TabType>('gainers');
  const [gainers, setGainers] = useState<Stock[]>([]);
  const [losers, setLosers] = useState<Stock[]>([]);
  const [volume, setVolume] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [gainersRes, losersRes, volumeRes] = await Promise.all([
        supabase.from('top_gainers_all').select().order('pcnt', { ascending: false }).limit(10),
        supabase.from('top_losers_all').select().order('pcnt', { ascending: true }).limit(10),
        supabase.from('top_volume_all').select().order('vol', { ascending: false }).limit(10),
      ]);
      if (gainersRes.error) throw gainersRes.error;
      if (losersRes.error) throw losersRes.error;
      if (volumeRes.error) throw volumeRes.error;
      setGainers(gainersRes.data || []);
      setLosers(losersRes.data || []);
      setVolume(volumeRes.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message :'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatVolume = (vol: number) => {
    if (vol >= 10000000) return `${(vol / 10000000).toFixed(1)}Cr`;
    if (vol >= 100000) return `${(vol / 100000).toFixed(1)}L`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toString();
  };

  const cleanSymbol = (symbol: string) =>
    symbol.replace('NSE:', '').replace('-EQ', '').replace('-BZ', '');

  const getCurrentData = () => {
    switch (activeTab) {
      case 'gainers': return gainers;
      case 'losers': return losers;
      case 'volume': return volume;
    }
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'gainers', label: 'Top Gainers' },
    { key: 'losers', label: 'Top Losers' },
    { key: 'volume', label: 'Most Active' },
  ];

  return (
    <section className="w-full max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Market Movers
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track trending stocks
          </p>
        </div>
        <Link
          href="/top-gainers?category=ALL"
          className="px-4 py-2 text-sm font-semibold rounded-full
            bg-gray-100 dark:bg-gray-800 
            text-indigo-600 dark:text-indigo-400
            hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative
              ${activeTab === tab.key
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-300 dark:bg-gray-700" />
                <div className="flex-1">
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-3 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
                <div className="text-right">
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-3 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {getCurrentData().map((stock, idx) => {
            const symbol = cleanSymbol(stock.symbol || stock.stckname);
            const isPositive = stock.pcnt >= 0;
            const isVolumeTab = activeTab === 'volume';

            return (
              <Link
                key={idx}
                href={`/stocks/${symbol?.toUpperCase()}`}
                className="group p-4 rounded-xl transition-all duration-200
                  bg-white dark:bg-gray-800 
                  border border-gray-200 dark:border-gray-700
                  hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600
                  hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <Image
                      src={`/assets/stockimages/${symbol}.png`}
                      alt={symbol}
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
                      {symbol}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {stock.fname?.length > 25 ? `${stock.fname.slice(0, 25)}...` : stock.fname}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₹{stock.close?.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end">
                      {!isVolumeTab && (
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
                      )}
                      <span
                        className={`text-sm font-medium ${
                          isVolumeTab
                            ? 'text-gray-500 dark:text-gray-400'
                            : isPositive
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {isVolumeTab ? formatVolume(stock.vol) : `${Math.abs(stock.pcnt).toFixed(2)}%`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}