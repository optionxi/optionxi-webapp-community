import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FallbackImage } from "../custom/cust_fallback_image";

interface StockData {
  month: string;
  Performance: number;
}

interface SparkAreaStocksProps {
  stockName: string;
  symbol: string;
  currentPrice: number;
  percentageChange: number;
  dayRange: { low: number; high: number };
  weekRange: { low: number; high: number };
  volume: number;
  smavolume4: number;
  data?: StockData[];
  className?: string;
}


const RangeIndicator = ({ low, high, current }: { low: number; high: number; current: number }) => {
  const range = high - low;
  const currentPosition = ((current - low) / range) * 100;
  const isCloserToHigh = currentPosition >= 50;
  const intensity = Math.abs(currentPosition - 50) * 2;
  
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="relative h-2">
        <div className="absolute w-full h-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`absolute h-full rounded-full transition-all duration-300 ${
              isCloserToHigh ? 'bg-emerald-500' : 'bg-red-500'
            }`}
            style={{ width: `${currentPosition}%`, opacity: `${intensity}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-red-500 font-medium">₹{low.toFixed(2)}</span>
        <span className="text-emerald-500 font-medium">₹{high.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default function EnhancedStockCard({
  stockName = "",
  symbol = "",
  currentPrice = 23,
  percentageChange = 23,
  dayRange = { low: 20, high: 50 },
  volume = 2323,
  smavolume4 = 2323,
  className = "",
}: SparkAreaStocksProps) {
  const isPositiveChange = percentageChange >= 0;
  
  // Generate image URL from stock symbol
  const logoUrl = `/assets/stockimages/${stockName.split(':')[1].split('-')[0]}.png`;
  
  return (
    <Card className={cn(
      "w-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      `border-${isPositiveChange ? 'emerald' : 'red'}-200/30`,
      `${isPositiveChange ? 'bg-emerald' : 'bg-red'}-50/10 dark:${isPositiveChange ? 'bg-emerald' : 'bg-red'}-900/10`,
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <FallbackImage
                src={logoUrl}
                alt={`${symbol} logo`}
                width={40}
                height={40}
                className={cn(
                  "rounded-xl",
                  "border border-gray-200 dark:border-white/20",
                  "transition-transform duration-300",
                  "group-hover:scale-110",
                  "shadow-lg"
                )}
              />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">{symbol.split(':')[1].split('-')[0]}</h3>
              <p className="text-sm text-muted-foreground">{stockName}</p>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <span className={cn(
                "text-lg font-bold",
                `text-${isPositiveChange ? 'emerald' : 'red'}-600 dark:text-${isPositiveChange ? 'emerald' : 'red'}-400`
              )}>
                ₹{currentPrice.toFixed(2)}
              </span>
              <span className={cn(
                "flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium text-white",
                `bg-${isPositiveChange ? 'emerald' : 'red'}-500`
              )}>
                {isPositiveChange ? 
                  <TrendingUp className="h-3 w-3" /> : 
                  <TrendingDown className="h-3 w-3" />
                }
                {isPositiveChange ? "+" : ""}{percentageChange.toFixed(2)}%
              </span>
            </div>
            <div className="w-full sm:w-40">
              <RangeIndicator 
                low={dayRange.low} 
                high={dayRange.high} 
                current={currentPrice}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Day Range</span>
            <span className="text-sm font-medium">₹{dayRange.low.toFixed(2)} - ₹{dayRange.high.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Volume</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">
                {volume.toLocaleString()}
              </span>
              {volume > smavolume4 ? (
                <ArrowUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}