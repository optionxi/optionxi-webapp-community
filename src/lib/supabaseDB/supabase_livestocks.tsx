import { DataStockModel } from '@/datamodels/stock_model';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchLiveStockData(): Promise<DataStockModel[]> {
  try {
    const { data, error } = await supabase
      .from('live_5000_stocks')
      .select('*')
      .order('symbol', { ascending: true });

    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }

    return (data ?? []).map((item): DataStockModel => ({
      close: item.ltp ?? 0,
      pclose: item.pclose ?? 0,
      high: item.h ?? 0,
      low: item.l ?? 0,
      open: item.o ?? 0,
      pcnt: item.pcnt ?? 0,
      sec: item.sec && item.sec !== "" ? item.sec : "N/A",
      stckname: item.symbol ?? "Unknown",
      vol: item.v ?? 0,
    }));
  } catch (err) {
    console.error("Error fetching live stock data:", err);
    return [];
  }
}
