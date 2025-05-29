import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, TrendingUp, ChevronUp, ChevronDown, ChartArea } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchStockSummary } from "@/lib/supabaseDB/supabase_historical";
import StockSummarySkeleton from "./stock-summary-skelton";

interface StockSummaryProps {
  stockName: string;
}

export function StockSummary({ stockName }: StockSummaryProps) {
  const [summaryData, setSummaryData] = useState<{
    currentPrice: number;
    previousClose: number;
    priceChange: number;
    weeklyChange: number;
    monthlyChange: number;
    yearlyChange: number;
    lowPrice52W: number;
    highPrice52W: number;
    pricePosition: number;
    lastUpdated: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummaryData() {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: summaryError } = await fetchStockSummary(`${stockName}.NS`);
        if (summaryError) throw summaryError;
        setSummaryData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    loadSummaryData();
  }, [stockName]);

  // If still loading or error occurred, return early
  if (isLoading) {
    return <StockSummarySkeleton />;
  }

  if (error || !summaryData) {
    return <div>Error loading summary data: {error}</div>;
  }

  // Utility functions
  const getChangeColor = (value: number): string =>
    value >= 0 ? "text-emerald-500" : "text-rose-500";

  const getChangeIcon = (value: number) =>
    value >= 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;

  const {
    currentPrice,
    previousClose,
    priceChange,
    weeklyChange,
    monthlyChange,
    yearlyChange,
    lowPrice52W,
    highPrice52W,
    pricePosition,
    lastUpdated
  } = summaryData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Current Price Card */}
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Current Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">₹{currentPrice.toFixed(2)}</span>
            <div className={`flex items-center ${getChangeColor(priceChange)}`}>
              {getChangeIcon(priceChange)}
              <span className="text-sm font-medium">{priceChange}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Previous Close</span>
              <span className="text-sm font-medium">₹{previousClose.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last updated on {lastUpdated}</p>
          </div>
        </CardContent>
      </Card>

      {/* 52-Week Range */}
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ChartArea className="h-4 w-4 text-blue-500" />
            52 Week Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">₹{currentPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">LTP</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                  pricePosition > 50 ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${pricePosition}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">52W Low</span>
                <span className="font-medium">₹{lowPrice52W.toFixed(2)}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-muted-foreground">52W High</span>
                <span className="font-medium">₹{highPrice52W.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Card */}
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PieChart className="h-4 w-4 text-blue-500" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Weekly</span>
              <div className={`flex items-center gap-1 ${getChangeColor(weeklyChange)}`}>
                {getChangeIcon(weeklyChange)}
                <span className="text-lg font-bold">{weeklyChange}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly</span>
              <div className={`flex items-center gap-1 ${getChangeColor(monthlyChange)}`}>
                {getChangeIcon(monthlyChange)}
                <span className="text-lg font-bold">{monthlyChange}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Yearly</span>
              <div className={`flex items-center gap-1 ${getChangeColor(yearlyChange)}`}>
                {getChangeIcon(yearlyChange)}
                <span className="text-lg font-bold">{yearlyChange}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StockSummary;