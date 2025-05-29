import { createClient } from '@supabase/supabase-js';
import { Screener } from '@/datamodels/screeners_model';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const fetchScreenersForStock = async (category: 'bullish' | 'bearish', stockSymbol: string) => {
  // Clean up the stock symbol for flexible matching
  const cleanedSymbol = stockSymbol.trim().toUpperCase();
  
  // Find screener IDs where the stock symbol appears in the results
  // This query will match:
  // - Exact matches (AHLUCONT) 
  // - With exchange prefix (NSE:AHLUCONT-EQ)
  // - With any suffix (AHLUCONT-BE, AHLUCONT-EQ)
  const { data: results, error: resultsError } = await supabase
    .from('screener_results')
    .select('screener_id')
    .or(`stckname.ilike.%:${cleanedSymbol}-%,stckname.ilike.%:${cleanedSymbol}%,stckname.eq.${cleanedSymbol}`)
    .order('scan_date', { ascending: false });

  if (resultsError) {
    throw resultsError;
  }

  if (!results || results.length === 0) {
    return []; // No results found for this stock
  }

  // Extract unique screener IDs
  const screenerIdsSet = new Set();
  results.forEach(item => screenerIdsSet.add(item.screener_id));
  const screenerIds = Array.from(screenerIdsSet);

  // Fetch the screener details based on those IDs
  const { data: screeners, error: screenersError } = await supabase
    .from('screener_names')
    .select('*')
    .eq('category', category)
    .in('id', screenerIds)
    .order('timeframe', { ascending: true })
    .order('created_at', { ascending: false });

  if (screenersError) {
    throw screenersError;
  }

  return screeners as Screener[];
};

// For debugging purposes, you can add this function to check actual stock names in the database
export const findAllMatchingStockFormats = async (stockSymbol: string) => {
  const cleanedSymbol = stockSymbol.trim().toUpperCase();
  
  const { data, error } = await supabase
    .from('screener_results')
    .select('stckname')
    .or(`stckname.ilike.%${cleanedSymbol}%`)
    .limit(20);
    
  if (error) {
    throw error;
  }
  
  return data?.map(item => item.stckname) || [];
};

