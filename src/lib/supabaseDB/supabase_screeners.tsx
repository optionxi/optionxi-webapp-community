import { createClient } from '@supabase/supabase-js';
import { Screener } from '@/datamodels/screeners_model';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const fetchScreeners = async (category: 'bullish' | 'bearish') => {
  const { data, error } = await supabase
    .from('screener_names')
    .select('*')
    .eq('category', category)
    .order('timeframe', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Screener[];
};

// Keep this for backward compatibility if needed elsewhere
export const fetchScreenersGrouped = async (category: 'bullish' | 'bearish') => {
  const screeners = await fetchScreeners(category);
  
  // Group screeners by timeframe
  const groupedScreeners = screeners.reduce((acc, screener) => {
    if (!acc[screener.timeframe]) {
      acc[screener.timeframe] = [];
    }
    acc[screener.timeframe].push(screener);
    return acc;
  }, {} as Record<string, Screener[]>);

  return groupedScreeners;
};