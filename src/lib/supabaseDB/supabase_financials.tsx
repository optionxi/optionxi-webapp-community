// datamodels/stock_financials.ts
import { StockFinancial } from '@/datamodels/financial_model';
import { supabase } from '@/lib/supabase/client';

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