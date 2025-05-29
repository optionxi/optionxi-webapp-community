import { AssetsCapital, DebtLiabilities, ShareCapitalEquity } from '@/datamodels/financial_tables_model';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchStockDataFinancialTables(stockname: string) {
    stockname=stockname+".NS"
  try {
    const [assetsResult, debtResult, equityResult] = await Promise.all([
      supabase.from('bs_assetscapital').select('*').eq('stockname', stockname).order('year', { ascending: false }),
      supabase.from('bs_debtliabilities').select('*').eq('stockname', stockname).order('year', { ascending: false }),
      supabase.from('bs_sharecapitalequity').select('*').eq('stockname', stockname).order('year', { ascending: false })
    ]);

    if (assetsResult.error || debtResult.error || equityResult.error) {
      console.error('Error fetching financial tables:', assetsResult.error || debtResult.error || equityResult.error);
      return null;
    }

    return {
      assets: assetsResult.data as AssetsCapital[],
      debt: debtResult.data as DebtLiabilities[],
      equity: equityResult.data as ShareCapitalEquity[]
    };
  } catch (err) {
    console.error('Error fetching stock data financial tables:', err);
    return null;
  }
}