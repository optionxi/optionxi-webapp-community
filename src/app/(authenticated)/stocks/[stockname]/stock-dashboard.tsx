'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchHistoricalData } from '@/lib/supabaseDB/supabase_historical';
import { StockDataPoint } from '@/datamodels/stock_historical';
import { AreaChart, type AreaChartEventProps } from '@/components/chart/chart-tremor';
import { LoadingSkeletonChart } from './stock-chart-loading';
import { StockSummary } from './stock-summary';
import { Button } from '@/components/ui/button';

// Define available timeframes
type Timeframe = '1m'|'3m'|'6m' | '1y' | '3y' | '5y';

// Define the type for formatted data
type FormattedDataPoint = {
  Date: string;
  Price: number;
  Volume: number;
  SMA20: number | null;
  SMA50: number | null;
  [key: string]: string | number | null; // Index signature
};

export default function StockDashboard({ stockName }: { stockName: string }) {
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1y');
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const { data: historicalData, error: historicalError } = await fetchHistoricalData(
          `${stockName}.NS`,
          selectedTimeframe
        );
        if (historicalError) throw historicalError;
        setStockData(historicalData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [stockName, selectedTimeframe]);

  // Function to calculate SMA
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

  // Format data for the chart
  const formattedData: FormattedDataPoint[] = stockData.map((item, idx) => ({
    Date: item.date,
    Price: item.price,
    Volume: item.volume,
    SMA20: sma20[idx],
    SMA50: sma50[idx],
  }));

  // Filter data based on hidden categories
  const filteredData = formattedData.map((item) => {
    const newItem = { ...item };
    hiddenCategories.forEach((category) => {
      newItem[category] = null; // No more TypeScript error
    });
    return newItem;
  });

  // Value formatter for the chart
  const valueFormatter = (number: number) => `₹${Intl.NumberFormat("en-IN").format(number).toString()}`;

  // Handle legend item clicks
  const handleValueChange = (event: AreaChartEventProps) => {
    if (event?.eventType === "category") {
      const category = event.categoryClicked;
      setHiddenCategories((prev) => {
        const newHiddenCategories = new Set(prev);
        if (newHiddenCategories.has(category)) {
          newHiddenCategories.delete(category);
        } else {
          newHiddenCategories.add(category);
        }
        return newHiddenCategories;
      });
    }
  };

  // Time period selector component
  const TimeframeSelector = () => (
    <div className="flex space-x-2 flex-wrap md:flex-nowrap">
      {[
        // { label: '1M', value: '1m' },
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
      {/* Stock Summary Section */}
      <StockSummary stockName={stockName} />

      {/* Chart Section for Desktop */}
      <Card className="hidden md:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Price History</h2>
            <TimeframeSelector />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <LoadingSkeletonChart />
          ) : error ? (
            <div className="text-lg text-red-500">Error: {error}</div>
          ) : (
            <AreaChart
              className="h-96"
              data={filteredData}
              index="Date"
              categories={["Price", "SMA20", "SMA50"]}
              valueFormatter={valueFormatter}
              showLegend={true}
              showGridLines={true}
              showXAxis={true}
              showYAxis={true}
              connectNulls={true}
              enableLegendSlider={true}
              xAxisLabel="Date"
              yAxisLabel="Price"
              onValueChange={handleValueChange}
              // colors={["blue", "green", "orange"]}
            />
          )}
        </CardContent>
      </Card>

      {/* Chart Section for Mobile */}
      <div className="block md:hidden">
        <Card className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Price History</h2>
              <TimeframeSelector />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {isLoading ? (
              <LoadingSkeletonChart />
            ) : error ? (
              <div className="text-lg text-red-500">Error: {error}</div>
            ) : (
              <AreaChart
                className="h-72"
                data={filteredData}
                index="Date"
                categories={["Price", "SMA20", "SMA50"]}
                valueFormatter={valueFormatter}
                showLegend={true}
                showGridLines={true}
                showXAxis={true}
                showYAxis={true}
                connectNulls={true}
                enableLegendSlider={true}
                xAxisLabel="Date"
                yAxisLabel="Price"
                onValueChange={handleValueChange}
                // colors={["blue", "green", "orange"]}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}