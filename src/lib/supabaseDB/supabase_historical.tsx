import { RawStockData as StockDataHistorical, StockDataPoint } from '@/datamodels/stock_historical';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type TimeframeOption ='1m'|'3m'|'6m' | '1y' | '3y' | '5y';

export async function fetchHistoricalData(
  stockSymbol: string,
  timeframe: TimeframeOption = '1y'
): Promise<{
  data: StockDataPoint[] | null;
  error: Error | null;
}> {
  try {
    // Calculate the start timestamp based on the selected timeframe
    const now = new Date();
    let startDate: Date;
    
    switch (timeframe) {
      case '1m':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3m':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6m':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case '3y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 3));
        break;
      case '5y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 5));
        break;
      default:
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }
    
    const startTimestamp = startDate.getTime();

    // Query Supabase with the appropriate time range
    const { data, error } = await supabase
      .from('stock_data')
      .select('*')
      .eq('Stock Symbol', stockSymbol)
      .gte('Timestamp', startTimestamp)
      .order('Timestamp', { ascending: true });

    if (error) {
      console.error("Error fetching data:", error);
      throw error;
    }

    // Transform the data
    const transformedData = (data as StockDataHistorical[]).map(record => {
      const date = new Date(record.Timestamp);
      
      // Format date based on timeframe for better readability
      let dateFormat: Intl.DateTimeFormatOptions;
      if (timeframe === '6m' || timeframe === '1y' || timeframe === '3y' || timeframe === '5y') {
        dateFormat = {
          day: "2-digit",
          month: "short",
          year: "numeric"
        };
      } else {
        // For longer timeframes, show less detail
        dateFormat = {
          month: "short",
          year: "numeric"
        };
      }
      
      const formattedDate = date.toLocaleDateString("en-GB", dateFormat);
      
      return {
        date: formattedDate,
        price: record.Close,
        highprice: record.High,
        lowprice: record.Low,
        openprice: record.Open,
        volume: record.Volume
      };
    });

    // Sample the data for longer timeframes to prevent chart overcrowding
    let sampledData = transformedData;
    if (timeframe === '3y' && transformedData.length > 365) {
      // For 3-year data, sample every 3 days
      sampledData = transformedData.filter((_, index) => index % 3 === 0);
    } else if (timeframe === '5y' && transformedData.length > 600) {
      // For 5-year data, sample every 5 days
      sampledData = transformedData.filter((_, index) => index % 5 === 0);
    }

    return { data: sampledData, error: null };
  } catch (err) {
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Unknown error occurred') 
    };
  }
}

// Add this to your supabaseDB/supabase_historical.ts file

export async function fetchStockSummary(
  stockSymbol: string
): Promise<{
  data: {
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
  } | null;
  error: Error | null;
}> {
  try {
    // Get latest price data
    const { data: latestData, error: latestError } = await supabase
      .from('stock_data')
      .select('*')
      .eq('Stock Symbol', stockSymbol)
      .order('Timestamp', { ascending: false })
      .limit(2);

    if (latestError) throw latestError;
    if (!latestData || latestData.length < 2) {
      return { 
        data: null, 
        error: new Error('Insufficient recent data') 
      };
    }

    const latestPrice = latestData[0].Close;
    const previousClose = latestData[1].Close;
    const priceChange = ((latestPrice - previousClose) / previousClose) * 100;
    const latestDate = new Date(latestData[0].Timestamp);
    
    // Format date
    const formattedDate = latestDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Get weekly data (5 business days ago)
    const weeklyDate = new Date(latestDate);
    weeklyDate.setDate(weeklyDate.getDate() - 7); // Go back 7 calendar days to capture 5 business days
    
    const { data: weeklyData, error: weeklyError } = await supabase
      .from('stock_data')
      .select('Close')
      .eq('Stock Symbol', stockSymbol)
      .gte('Timestamp', weeklyDate.getTime())
      .order('Timestamp', { ascending: true })
      .limit(1);
    
    if (weeklyError) throw weeklyError;
    
    // Get monthly data (approximately 21 business days ago)
    const monthlyDate = new Date(latestDate);
    monthlyDate.setMonth(monthlyDate.getMonth() - 1);
    
    const { data: monthlyData, error: monthlyError } = await supabase
      .from('stock_data')
      .select('Close')
      .eq('Stock Symbol', stockSymbol)
      .gte('Timestamp', monthlyDate.getTime())
      .order('Timestamp', { ascending: true })
      .limit(1);
    
    if (monthlyError) throw monthlyError;
    
    // Get yearly data (approximately 252 business days ago)
    const yearlyDate = new Date(latestDate);
    yearlyDate.setFullYear(yearlyDate.getFullYear() - 1);
    
    const { data: yearlyData, error: yearlyError } = await supabase
      .from('stock_data')
      .select('Close')
      .eq('Stock Symbol', stockSymbol)
      .gte('Timestamp', yearlyDate.getTime())
      .order('Timestamp', { ascending: true })
      .limit(1);
    
    if (yearlyError) throw yearlyError;
    
    // Get 52-week high and low
    const yearAgoDate = new Date(latestDate);
    yearAgoDate.setFullYear(yearAgoDate.getFullYear() - 1);
    
    const { data: yearRangeData, error: yearRangeError } = await supabase
      .from('stock_data')
      .select('High, Low')
      .eq('Stock Symbol', stockSymbol)
      .gte('Timestamp', yearAgoDate.getTime());
    
    if (yearRangeError) throw yearRangeError;
    
    // Calculate 52-week high and low
    const highPrices = yearRangeData.map(record => record.High);
    const lowPrices = yearRangeData.map(record => record.Low);
    
    const lowPrice52W = lowPrices.length > 0 ? Math.min(...lowPrices) : latestPrice;
    const highPrice52W = highPrices.length > 0 ? Math.max(...highPrices) : latestPrice;
    
    // Calculate 52-week range position
    const range = highPrice52W - lowPrice52W;
    const pricePosition = range > 0 ? ((latestPrice - lowPrice52W) / range * 100) : 50;
    
    // Calculate changes
    const weekStartPrice = weeklyData && weeklyData.length > 0 ? weeklyData[0].Close : latestPrice;
    const monthStartPrice = monthlyData && monthlyData.length > 0 ? monthlyData[0].Close : latestPrice;
    const yearStartPrice = yearlyData && yearlyData.length > 0 ? yearlyData[0].Close : latestPrice;
    
    const weeklyChange = ((latestPrice - weekStartPrice) / weekStartPrice * 100);
    const monthlyChange = ((latestPrice - monthStartPrice) / monthStartPrice * 100);
    const yearlyChange = ((latestPrice - yearStartPrice) / yearStartPrice * 100);
    
    return {
      data: {
        currentPrice: latestPrice,
        previousClose: previousClose,
        priceChange: Number(priceChange.toFixed(2)),
        weeklyChange: Number(weeklyChange.toFixed(2)),
        monthlyChange: Number(monthlyChange.toFixed(2)),
        yearlyChange: Number(yearlyChange.toFixed(2)),
        lowPrice52W,
        highPrice52W,
        pricePosition: Number(pricePosition.toFixed(0)),
        lastUpdated: formattedDate
      },
      error: null
    };
  } catch (err) {
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Unknown error occurred') 
    };
  }
}