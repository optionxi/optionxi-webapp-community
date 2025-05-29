// datamodels/stock_financials.ts
import { StockFinancial } from '@/datamodels/financial_model';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export async function fetchStockFinancials(stockname: string): Promise<StockFinancial | null> {
  try {
    const { data, error } = await supabase
      .from('stock_financials')
      .select('*')
      .eq('stockname', stockname)
      .single();

    if (error) {
      console.error('Error fetching stock financials:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error fetching stock financials:', err);
    return null;
  }
}