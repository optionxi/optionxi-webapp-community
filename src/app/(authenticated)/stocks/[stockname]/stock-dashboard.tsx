'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchHistoricalData } from '@/lib/supabaseDB/supabase_historical';
import { StockDataPoint } from '@/datamodels/stock_historical';
import { LoadingSkeletonChart } from './stock-chart-loading';
import { StockSummary } from './stock-summary';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { StockAreaChart } from '@/components/chart/chart-area-chart';

type Timeframe = '1m' | '3m' | '6m' | '1y' | '3y' | '5y';

export default function StockDashboard({ stockName }: { stockName: string }) {
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1y');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const { data: historicalData, error: historicalError } = await fetchHistoricalData(
          `${stockName}.NS`,
          selectedTimeframe
        );
        if (historicalError) throw historicalError;
        if (!cancelled) setStockData(historicalData || []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadData();
    return () => { cancelled = true; };
  }, [stockName, selectedTimeframe]);

  const chartData = useMemo(() => {
    const sma = (window: number) =>
      stockData.map((_, idx) => {
        if (idx < window - 1) return null;
        const slice = stockData.slice(idx - window + 1, idx + 1);
        return slice.reduce((sum, item) => sum + item.price, 0) / window;
      });

    const sma20 = sma(20);
    const sma50 = sma(50);

    return stockData.map((item, idx) => ({
      Date: item.date,
      Price: item.price,
      SMA20: sma20[idx],
      SMA50: sma50[idx],
    }));
  }, [stockData]);

  const valueFormatter = (n: number) => `₹${Intl.NumberFormat("en-IN").format(n)}`;

  const TimeframeSelector = () => (
    <div className="flex space-x-2 flex-wrap md:flex-nowrap">
      {[
        { label: '3M', value: '3m' },
        { label: '6M', value: '6m' },
        { label: '1Y', value: '1y' },
        { label: '3Y', value: '3y' },
        { label: '5Y', value: '5y' },
      ].map((option) => (
        <Button
          key={option.value}
          variant={selectedTimeframe === option.value ? "default" : "outline"}
          size="sm"
          className="px-4 py-2 rounded-full transition-all"
          onClick={() => setSelectedTimeframe(option.value as Timeframe)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 bg-background">
      <StockSummary stockName={stockName} />

      <Card className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">Price History</h2>
            <TimeframeSelector />
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {isLoading ? (
            <LoadingSkeletonChart />
          ) : error ? (
            <div className="text-lg text-red-500">Error: {error}</div>
          ) : (
            <StockAreaChart
              data={chartData}
              index="Date"
              height={isDesktop ? 384 : 288}
              valueFormatter={valueFormatter}
              series={[
                { key: "Price", label: "Price", color: "#6366f1", kind: "area" },
                { key: "SMA20", label: "SMA 20", color: "#f59e0b", kind: "line", dashed: true },
                { key: "SMA50", label: "SMA 50", color: "#10b981", kind: "line", dashed: true },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}