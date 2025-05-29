'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchHistoricalData } from '@/lib/supabaseDB/supabase_historical';
import { StockDataPoint } from '@/datamodels/stock_historical';
import { AreaChart } from '@/components/chart/chart-tremor';
import { LoadingSkeletonChart } from './stock-chart-loading';
import { FallbackImage } from '@/components/custom/cust_fallback_image';
import { cn } from '@/lib/utils';
import StockSummarySideBar from './stock-summary-sidebar';
import StockSummarySideBarSkeleton from './stock-summary-sidebar-skelton';
import NoStockData from '@/components/custom/cust_error_page';
import Link from 'next/link';

export default function StockDashboardSideBar({ stockName }: { stockName: string }) {
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const { data: historicalData, error: historicalError } = await fetchHistoricalData(`${stockName}.NS`);
        if (historicalError) throw historicalError;
        setStockData(historicalData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [stockName]);

  function calculateSMA(data: StockDataPoint[], windowSize: number) {
    return data.map((_, idx) => {
      if (idx < windowSize - 1) return null;
      const windowSlice = data.slice(idx - windowSize + 1, idx + 1);
      const sma = windowSlice.reduce((sum, item) => sum + item.price, 0) / windowSize;
      return sma;
    });
  }

  const sma20 = calculateSMA(stockData, 20);
  const sma50 = calculateSMA(stockData, 50);

  const formattedData = stockData.map((item, idx) => ({
    Date: item.date,
    Price: item.price,
    Volume: item.volume,
    SMA20: sma20[idx],
    SMA50: sma50[idx],
  }));

  const valueFormatter = (number: number) => `₹${Intl.NumberFormat("en-IN").format(number).toString()}`;

  if (stockData.length < 2 && !isLoading) {
    return <NoStockData />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 bg-background">
      {/* Modern header section with glass effect */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col justify-between items-start sm:items-center gap-6">
          {/* Stock info section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20"></div>
              <div className="relative p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                <FallbackImage
                  src={`/assets/stockimages/${stockName}.png`}
                  alt={`${stockName} logo`}
                  width={72}
                  height={72}
                  className={cn(
                    "rounded-lg",
                    "transition-all duration-300",
                    "hover:scale-105"
                  )}
                />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                {stockName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Comprehensive overview and insights
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <a
              href={`https://in.tradingview.com/chart/?symbol=${stockName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <button className="w-full group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg text-white">
                <span className="text-sm font-medium">View Chart</span>
                <svg 
                  className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </a>
            
            <Link href={`/stocks/${stockName}`} className="w-full sm:w-auto">
              <button className="w-full group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg text-white">
                <span className="text-sm font-medium">View Full Overview</span>
                <svg 
                  className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stock Summary Section */}
      <div className="transition-all duration-300">
        {isLoading ? (
          <StockSummarySideBarSkeleton />
        ) : error ? (
          <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
            <p className="text-lg text-red-600 dark:text-red-400">Error: {error}</p>
          </div>
        ) : (
          <StockSummarySideBar stockData={stockData} />
        )}
      </div>

      {/* Chart Section for Desktop */}
      <Card className="hidden md:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Price History</h2>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <LoadingSkeletonChart />
          ) : error ? (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400">
              Error: {error}
            </div>
          ) : (
            <AreaChart
              className="h-96"
              data={formattedData}
              index="Date"
              categories={["Price"]}
              valueFormatter={valueFormatter}
              showLegend={false}
              showGridLines={true}
              showXAxis={true}
              showYAxis={true}
              connectNulls={true}
              enableLegendSlider={true}
              xAxisLabel="Year"
              yAxisLabel="Price"
            />
          )}
        </CardContent>
      </Card>

      {/* Chart Section for Mobile */}
      <div className="block md:hidden">
        <Card className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Price History</h2>
          </CardHeader>
          <CardContent className="p-4">
            {isLoading ? (
              <LoadingSkeletonChart />
            ) : error ? (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400">
                Error: {error}
              </div>
            ) : (
              <AreaChart
                className="h-72"
                data={formattedData}
                index="Date"
                categories={["Price"]}
                valueFormatter={valueFormatter}
                showLegend={false}
                showGridLines={true}
                showXAxis={true}
                showYAxis={true}
                connectNulls={true}
                enableLegendSlider={true}
                xAxisLabel="Year"
                yAxisLabel="Price"
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* View Full Overview Section with gradient background */}
      <div className="overflow-hidden relative rounded-xl group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 dark:from-indigo-500/10 dark:to-pink-500/10 transform group-hover:scale-105 transition-all duration-500"></div>
        <Link href={`/stocks/${stockName}`} className="block">
          <div className="p-6 rounded-xl backdrop-blur-sm relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Want to explore more?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Unlock detailed insights, forecasts, and comprehensive analysis</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:translate-x-1">
              <span>Full Overview</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L21 12M21 12L15 19M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}