import NoStockData from "@/components/custom/cust_error_page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockDataPoint } from "@/datamodels/stock_historical";
import { PieChart, TrendingUp, ChevronUp, ChevronDown, ChartArea } from "lucide-react";

interface StockSummaryProps {
  stockData: StockDataPoint[];
}

export function StockSummarySideBar({ stockData }: StockSummaryProps) {
  // Ensure stockData has at least two entries for calculations
  if (stockData.length < 2) {
    return <NoStockData/>
  }
  
  // Latest price and previous close
  const latestPrice = stockData[stockData.length - 1]?.price ?? 0;
  const previousClose = stockData[stockData.length - 2]?.price ?? 0;
  const latestDate = new Date(stockData[stockData.length - 1]?.date);
  
  // Format date
  const formattedDate = latestDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  
  // Price change percentage
  const priceChange = ((latestPrice - previousClose) / previousClose * 100).toFixed(2);
  
  // Helper function to check if date is a weekend
  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };
  
  // Helper function to get the previous business day
  // const getPreviousBusinessDay = (date: Date): Date => {
  //   const prevDay = new Date(date);
  //   prevDay.setDate(prevDay.getDate() - 1);
  //   while (isWeekend(prevDay)) {
  //     prevDay.setDate(prevDay.getDate() - 1);
  //   }
  //   return prevDay;
  // };
  
  // Helper function to get business days ago
  const getBusinessDaysAgo = (date: Date, businessDays: number): Date => {
    const result = new Date(date);
    let daysCount = 0;
    
    while (daysCount < businessDays) {
      result.setDate(result.getDate() - 1);
      if (!isWeekend(result)) {
        daysCount++;
      }
    }
    
    return result;
  };
  
  // Generic function to get start price or fallback
  const getStartPrice = (data: StockDataPoint[], fallback: number): number => 
    data.length > 0 ? data[0].price : fallback;
  
  // Weekly change (5 business days)
  const fiveBusinessDaysAgo = getBusinessDaysAgo(latestDate, 5);
  const weekData = stockData.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= fiveBusinessDaysAgo && !isWeekend(recordDate);
  });
  const weekStartPrice = getStartPrice(weekData, latestPrice);
  const weeklyChange = ((latestPrice - weekStartPrice) / weekStartPrice * 100).toFixed(2);
  
  // Monthly change (approximately 21 business days)
  const twentyOneBusinessDaysAgo = getBusinessDaysAgo(latestDate, 21);
  const monthData = stockData.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= twentyOneBusinessDaysAgo && !isWeekend(recordDate);
  });
  const monthStartPrice = getStartPrice(monthData, latestPrice);
  const monthlyChange = ((latestPrice - monthStartPrice) / monthStartPrice * 100).toFixed(2);
  
  // Yearly change (approximately 252 business days)
  const yearAgoDate = getBusinessDaysAgo(latestDate, 252);
  const yearData = stockData.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= yearAgoDate && !isWeekend(recordDate);
  });
  const yearStartPrice = getStartPrice(yearData, latestPrice);
  const yearlyChange = ((latestPrice - yearStartPrice) / yearStartPrice * 100).toFixed(2);
  
  // Calculate 52-week high and low (using business days)
  const lowPrice = yearData.length > 0 ? Math.min(...yearData.map(record => record.lowprice)) : latestPrice;
  const highPrice = yearData.length > 0 ? Math.max(...yearData.map(record => record.highprice)) : latestPrice;
  
  // 52-week range position
  const pricePosition = ((latestPrice - lowPrice) / (highPrice - lowPrice) * 100).toFixed(0);

  // Utility functions
  const getChangeColor = (value: number): string =>
    value >= 0 ? "text-emerald-500" : "text-rose-500";

  const getChangeIcon = (value: number) =>
    value >= 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
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
            <span className="text-3xl font-bold tracking-tight">₹{latestPrice.toFixed(2)}</span>
            <div className={`flex items-center ${getChangeColor(Number(priceChange))}`}>
              {getChangeIcon(Number(priceChange))}
              <span className="text-sm font-medium">{priceChange}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Previous Close</span>
              <span className="text-sm font-medium">₹{previousClose.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last updated on {formattedDate}</p>
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
              <span className="text-3xl font-bold tracking-tight">₹{latestPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">LTP</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                  Number(pricePosition) > 50 ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${pricePosition}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">52W Low</span>
                <span className="font-medium">₹{lowPrice.toFixed(2)}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-muted-foreground">52W High</span>
                <span className="font-medium">₹{highPrice.toFixed(2)}</span>
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
              <div className={`flex items-center gap-1 ${getChangeColor(Number(weeklyChange))}`}>
                {getChangeIcon(Number(weeklyChange))}
                <span className="text-lg font-bold">{weeklyChange}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly</span>
              <div className={`flex items-center gap-1 ${getChangeColor(Number(monthlyChange))}`}>
                {getChangeIcon(Number(monthlyChange))}
                <span className="text-lg font-bold">{monthlyChange}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Yearly</span>
              <div className={`flex items-center gap-1 ${getChangeColor(Number(yearlyChange))}`}>
                {getChangeIcon(Number(yearlyChange))}
                <span className="text-lg font-bold">{yearlyChange}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      
    </div>
  );
}

export default StockSummarySideBar;
