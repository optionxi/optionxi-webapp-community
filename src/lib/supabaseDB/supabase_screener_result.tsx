import { createClient } from '@supabase/supabase-js';
import { DataStockModel } from '@/datamodels/stock_model';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface FetchScreenerResultsParams {
  screenerId: string;
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'asc' | 'desc'; // Add sorting parameter
}

export const fetchScreenerResults = async ({
  screenerId,
  page = 1,
  pageSize = 10,
  search = '',
  sortBy = 'desc', // Default to descending order (highest to lowest)
}: FetchScreenerResultsParams) => {
  try {
    let query = supabase
      .from('screener_results')
      .select('*', { count: 'exact' })
      .eq('screener_id', screenerId);

    // Apply search filter if search term is provided
    if (search.trim().toUpperCase()) {
      query = query.ilike('stckname', `%${search}%`);
    }

    // Apply sorting by percentage
    if (sortBy === 'desc') {
      query = query.order('pcnt', { ascending: false });
    } else {
      query = query.order('pcnt', { ascending: true });
    }

    // Apply pagination
    const { data, error, count } = await query.range(
      (page - 1) * pageSize,
      page * pageSize - 1
    );

    if (error) throw error;

    // Transform the data to match DataStockModel
    const transformedData: DataStockModel[] = data.map((item) => ({
      stckname: item.stckname || item.stock_symbol,
      close: item.close ?? 0,
      pclose: item.close / (1 + (item.pcnt || 0) / 100), // Calculate previous close based on pcnt
      high: item.high ?? 0,
      low: item.low ?? 0,
      open: item.open ?? 0,
      pcnt: item.pcnt ?? 0,
      sec: item.sec ?? '',
      vol: item.vol ?? 0,
    }));

    return {
      results: transformedData,
      total: count || 0,
    };
  } catch (error) {
    console.error('Error fetching screener results:', error);
    throw error;
  }
};