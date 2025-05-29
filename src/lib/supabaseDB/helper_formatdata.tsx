import { GeneratedDataModel } from "@/datamodels/generatedvalue_model";
import { TopGainerLoserData } from "../../datamodels/topgainerloser_model";

// Helper function to format stock data for SparkAreaStocks component
export function formatStockDataForChart(stockData: TopGainerLoserData) {
    return {
      stockName: stockData.fname || stockData.stckname,
      symbol: stockData.stckname,
      currentPrice: stockData.close ?? 0,
      percentageChange: stockData.pcnt ?? 0,
      dayRange: {
        low: stockData.low ?? 0,
        high: stockData.high ?? 0
      },
      weekRange: {
        low: stockData.min52 ?? 0,
        high: stockData.max52 ?? 0
      },
      volume: stockData.vol ?? 0,
      smavolume4: ((stockData.vol2 ?? 0) + (stockData.vol3 ?? 0) + (stockData.vol4 ?? 0) + (stockData.vol5 ?? 0)) / 4,
      performance: [
        stockData.pc ?? 0,
        stockData.pc2 ?? 0,
        stockData.pc3 ?? 0,
        stockData.pc4 ?? 0,
        stockData.pc5 ?? 0,
        stockData.pc6 ?? 0,
        stockData.pc7 ?? 0
      ].filter(value => value !== null && value !== undefined) // Remove null/undefined values
    };
  }

export function formatVolume(volume: number): string {
    if (volume >= 1_000_000_000) {
      return (volume / 1_000_000_000).toFixed(2) + 'B';
    } else if (volume >= 1_000_000) {
      return (volume / 1_000_000).toFixed(2) + 'M';
    } else if (volume >= 1_000) {
      return (volume / 1_000).toFixed(2) + 'K';
    }
    return (volume ?? 0).toString();
}

export function formatStockDataForChartGenerated(stockData: GeneratedDataModel) {
  return {
    stockName: stockData.stckname, // Assuming stockName is derived from stckname
    symbol: stockData.stckname,
    currentPrice: stockData.close ?? 0,
    percentageChange: stockData.pcnt ?? 0,
    dayRange: {
      low: stockData.low ?? 0,
      high: stockData.high ?? 0
    },
    weekRange: {
      low: stockData.week_min_52_low ?? 0,
      high: stockData.week_max_52_high ?? 0
    },
    volume: stockData.vol ?? 0,
    smavolume4: ((stockData.prev_day_vol ?? 0) + (stockData.prev_day2_vol ?? 0) + (stockData.prev_day3_vol ?? 0) + (stockData.prev_day4_vol ?? 0)) / 4,
    performance: [
      stockData.prev_day_close ?? 0,
      stockData.prev_day2_close ?? 0,
      stockData.prev_day3_close ?? 0,
      stockData.prev_day4_close ?? 0,
      stockData.prev_day5_close ?? 0,
      stockData.prev_day6_close ?? 0,
      stockData.prev_day7_close ?? 0
    ].filter(value => value !== null && value !== undefined) // Remove null/undefined values
  };
}

// // utils/formatNumber.ts
// export const formatNumber = (num: number): string => {
//   const isNegative = num < 0;
//   const absoluteNum = Math.abs(num);

//   let formattedNum: string;

//   if (absoluteNum >= 1_000_000_000) {
//     formattedNum = `${(absoluteNum / 1_000_000_000).toFixed(2)}B`; // Billions
//   } else if (absoluteNum >= 1_000_000) {
//     formattedNum = `${(absoluteNum / 1_000_000).toFixed(2)}M`; // Millions
//   } else if (absoluteNum >= 1_000) {
//     formattedNum = `${(absoluteNum / 1_000).toFixed(2)}K`; // Thousands
//   } else {
//     formattedNum = absoluteNum.toFixed(2); // Default
//   }

//   return isNegative ? `-${formattedNum}` : formattedNum;
// };
type CurrencyType = 'USD' | 'INR'

export function formatNumberRupees(
  num: number | null,
  currency: CurrencyType = 'INR'
): string {
  // Convert null to 0
  const value = num ?? 0

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    maximumFractionDigits: 1,
    // INR typically uses different grouping - lakhs and crores
    compactDisplay: currency === 'INR' ? 'short' : 'short'
  }).format(value)
}

// Usage examples:
// formatNumber(1234567, 'USD') -> "$1.2M"
// formatNumber(1234567, 'INR') -> "₹1.2M"
// formatNumber(null, 'USD') -> "$0"
// formatNumber(null, 'INR') -> "₹0"