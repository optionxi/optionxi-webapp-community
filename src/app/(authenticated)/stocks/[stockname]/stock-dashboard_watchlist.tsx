'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchHistoricalData } from '@/lib/supabaseDB/supabase_historical';
import { StockDataPoint } from '@/datamodels/stock_historical';
import { AreaChart } from '@/components/chart/chart-tremor';
import { LoadingSkeletonChart } from './stock-chart-loading';
import { StockSummary } from './stock-summary';

export default function StockDashboardWatchlist({ stockName }: { stockName: string }) {
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null); // Clear any previous error state
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

  return (
    <div className="max-w-7xl space-y-6 bg-background">
      <StockSummary stockName={stockName}/>
      <Card className="hidden md:block">
        <CardHeader />
        <CardContent>
          {isLoading ? (
            <LoadingSkeletonChart />
          ) : error ? (
            <div className="text-lg text-red-500">Error: {error}</div>
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

      {/* For smaller devices, display chart outside of the card */}
      <div className="block md:hidden w-full">
        {isLoading ? (
          <LoadingSkeletonChart />
        ) : error ? (
          <div className="text-lg text-red-500">Error: {error}</div>
        ) : (
          <AreaChart
            className="w-full h-96"
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
      </div>
    </div>
  );
}
