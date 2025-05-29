import React from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SparkAreaChart } from "./chart-spark"
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react"
import { formatVolume } from "@/lib/supabaseDB/helper_formatdata"

interface StockData {
  month: string
  Performance: number
}

interface SparkAreaStocksProps {
  stockName: string
  symbol: string
  currentPrice: number
  percentageChange: number
  dayRange: { low: number; high: number }
  weekRange: { low: number; high: number }
  volume: number
  smavolume4: number
  data?: StockData[]
  className?: string
}

type ChartColor = "blue" | "emerald" | "violet" | "amber" | "gray" | "cyan" | "pink" | "lime" | "fuchsia"

const DEFAULT_CHART_DATA: StockData[] = [
  { month: "Jan 21", Performance: 4000 },
  { month: "Feb 21", Performance: 3000 },
  { month: "Mar 21", Performance: 2000 },
  { month: "Apr 21", Performance: 2780 },
  { month: "May 21", Performance: 1890 },
  { month: "Jun 21", Performance: 2390 },
  { month: "Jul 21", Performance: 3490 },
  { month: "Aug 21", Performance: 4200 },
  { month: "Sep 21", Performance: 3100 },
  { month: "Oct 21", Performance: 2800 },
]

const RangeIndicator2 = ({ low, high, current }: { low: number; high: number; current: number }) => {
  const range = high - low
  const currentPosition = ((current - low) / range) * 100
  const isCloserToHigh = currentPosition >= 50
  const intensity = Math.abs(currentPosition - 50) * 2
  
  return (
    <div className="flex flex-col gap-1 w-40">
      <div className="relative h-2">
        <div className="absolute w-full h-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
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
  )
}

const RangeIndicator = ({ low, high, current }: { low: number; high: number; current: number }) => {
  const range = high - low
  const currentPosition = ((current - low) / range) * 100
  const isCloserToHigh = currentPosition >= 50

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="relative h-2">
        <div className="absolute w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className={`absolute h-full rounded-full transition-all duration-300 ${
              isCloserToHigh ? 'bg-gradient-to-r from-gray-300 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-gray-300'
            }`}
            style={{ width: `${currentPosition}%` }}
          />
          <div 
            className={`absolute w-2 h-4 -top-1 rounded-full transition-all duration-300 ${
              isCloserToHigh ? 'bg-emerald-600' : 'bg-red-600'
            }`}
            style={{ left: `calc(${currentPosition}% - 4px)` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-red-500 font-medium">₹{low.toFixed(2)}</span>
        <span className={`font-medium ${
          isCloserToHigh ? 'text-emerald-500' : 'text-red-500'
        }`}>
          ₹{current.toFixed(2)}
        </span>
        <span className="text-emerald-500 font-medium">₹{high.toFixed(2)}</span>
      </div>
    </div>
  )
}

export default function SparkAreaStocks({
  stockName="",
  symbol="",
  currentPrice=23,
  percentageChange=23,
  dayRange={low:20, high:50},
  weekRange={low:20, high:50},
  volume=2323,
  smavolume4=2323,
  data = DEFAULT_CHART_DATA,
  className = "",
}: SparkAreaStocksProps) {
  const isPositiveChange = percentageChange >= 0
  const chartColor: ChartColor = isPositiveChange ? "emerald" : "pink"
  const volumeRatio = volume > smavolume4 
    ? (volume / smavolume4)
    : (smavolume4 / volume)

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="font-semibold text-lg hidden sm:block">{symbol}</h3>
              <p className="text-sm text-muted-foreground">{stockName}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`text-lg font-bold ${
                  isPositiveChange ? "text-emerald-500" : "text-red-500"
                }`}
              >
                ₹{currentPrice.toFixed(2)}
              </span>
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium text-white ${
                  isPositiveChange ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                {isPositiveChange ? 
                  <TrendingUp className="h-3 w-3" /> : 
                  <TrendingDown className="h-3 w-3" />
                }
                {isPositiveChange ? "+" : ""}{percentageChange.toFixed(2)}%
              </span>
            </div>
            <RangeIndicator2 
              low={dayRange.low} 
              high={dayRange.high} 
              current={currentPrice}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="pt-4">
          <SparkAreaChart
            data={data}
            categories={["Performance"]}
            index="month"
            colors={[chartColor]}
            className="h-24 w-full"
          />
        </div>
        <div className="w-full">
          <br/>
          <div className="flex justify-between w-full text-sm text-muted-foreground">
            <p>52 Week Low</p>
            <p>52 Week High</p>
          </div>
          <RangeIndicator 
            low={weekRange.low} 
            high={weekRange.high} 
            current={currentPrice}
          />
        </div>
        <br/>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Volume</span>
            <span className="text-lg font-semibold">{formatVolume(volume)}</span>
          </div>
          
          <Separator orientation="vertical" className="h-8" />
          
          <div className="flex items-center space-x-2">
            {volume > smavolume4 ? (
              <div className="flex items-center px-2 py-1 rounded-full bg-green-100 dark:bg-green-900">
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {volumeRatio.toFixed(2)}x
                </span>
              </div>
            ) : (
              <div className="flex items-center px-2 py-1 rounded-full bg-red-100 dark:bg-red-900">
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  {volumeRatio.toFixed(2)}x
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}