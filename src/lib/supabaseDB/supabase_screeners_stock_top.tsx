import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface TopStock {
  symbol: string;
  stockName: string;
  signalCount: number;
  lastPrice: number;
  percentChange: number;
  open: number;
  high: number;
  low: number;
  close: number;
  sector?: string;
}

export const fetchTopBullishBearishStocks = async (
  category: 'bullish' | 'bearish' = 'bullish',
  limit: number = 10
): Promise<TopStock[]> => {
  try {
    // First, get stocks that appear most frequently in screener results for the given category
    const { data, error } = await supabase
      .from('screener_results')
      .select(`
        id,
        screener_id,
        scan_date,
        close,
        high,
        low,
        open,
        pcnt,
        sec,
        stckname,
        vol,
        screener_names!inner(category)
      `)
      .eq('screener_names.category', category)
      .order('scan_date', { ascending: false });

    if (error) throw error;
    
    // Process the data to count occurrences and get latest data for each stock
    const stockSignalMap = new Map<string, TopStock>();
    
    data.forEach(item => {
      // The symbol appears to be missing in your schema, so we'll use stckname as a fallback
      // You may want to add a 'symbol' column to your database schema in the future
      const symbol = item.stckname; // Use stckname as the symbol identifier
      if (!symbol) return;
      
      if (!stockSignalMap.has(symbol)) {
        stockSignalMap.set(symbol, {
          symbol,
          stockName: item.stckname || symbol,
          signalCount: 1,
          lastPrice: item.close || 0,
          percentChange: item.pcnt || 0,
          open: item.open || 0,
          high: item.high || 0,
          low: item.low || 0,
          close: item.close || 0,
          sector: item.sec || undefined  // sec is the sector
        });
      } else {
        const stockData = stockSignalMap.get(symbol)!;
        stockData.signalCount += 1;
        
        // Update price data if this is a newer entry
        stockData.lastPrice = item.close || stockData.lastPrice;
        stockData.percentChange = item.pcnt || stockData.percentChange;
        stockData.open = item.open || stockData.open;
        stockData.high = item.high || stockData.high;
        stockData.low = item.low || stockData.low;
        stockData.close = item.close || stockData.close;
      }
    });
    
    // Convert map to array and sort by signal count
    const topStocks = Array.from(stockSignalMap.values())
      .sort((a, b) => b.signalCount - a.signalCount)
      .slice(0, limit);
      
    return topStocks;
    
  } catch (error) {
    console.error('Error fetching top stocks:', error);
    return [];
  }
};