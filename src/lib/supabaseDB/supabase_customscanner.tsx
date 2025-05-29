import { ColumnComparisonFilter } from '@/datamodels/filter_model';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const fetchStockData = async (
  searchTerm: string, 
  columnFilters: ColumnComparisonFilter[],
  page: number, 
  pageSize: number
) => {
  try {
    let query = 'SELECT * FROM generated_values';
    const conditions = [];

    // Apply search filter
    if (searchTerm) {
      conditions.push(`stckname ILIKE '%${searchTerm}%'`);
    }

    // Apply column comparison filters
    if (columnFilters.length > 0) {
      const validFilters = columnFilters.filter(
        filter => filter.indicator_l && filter.operator && filter.indicator_r
      );

      if (validFilters.length > 0) {
        const filterConditions = validFilters.map(filter => 
          `${filter.indicator_l} ${getSqlOperator(filter.operator)} ${filter.indicator_r}`
        );
        conditions.push(`(${filterConditions.join(' AND ')})`);
      }
    }

    // Add WHERE clause if conditions exist
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Add ORDER BY and pagination
    query += ` ORDER BY pcnt DESC LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;

    // Execute the query
    const { data, error } = await supabase.rpc('execute_query', { query_text: query });

    if (error) throw error;

    return { data: data || [] };
  } catch (error) {
    console.error("Error in querying: "+error);
    return { data: [] };
  }
};

export const fetchTotalStockCount = async (
  searchTerm: string, 
  columnFilters: ColumnComparisonFilter[]
) => {
  try {
    let query = 'SELECT COUNT(*) FROM generated_values';
    const conditions = [];

    // Apply search filter
    if (searchTerm) {
      conditions.push(`stckname ILIKE '%${searchTerm}%'`);
    }

    // Apply column comparison filters
    if (columnFilters.length > 0) {
      const validFilters = columnFilters.filter(
        filter => filter.indicator_l && filter.operator && filter.indicator_r
      );

      if (validFilters.length > 0) {
        const filterConditions = validFilters.map(filter => 
          `${filter.indicator_l} ${getSqlOperator(filter.operator)} ${filter.indicator_r}`
        );
        conditions.push(`(${filterConditions.join(' AND ')})`);
      }
    }

    // Add WHERE clause if conditions exist
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Execute the query
    const { data, error } = await supabase.rpc('execute_count_query', { query_text: query });

    if (error) throw error;

    const count = data ? parseInt(data) : 0;
    return { count };
  } catch (error) {
    console.error("Error in total count: "+error);
    return { count: 0 };
  }
};

// Convert operator strings to SQL operators
function getSqlOperator(operator: string): string {
  switch (operator) {
    case 'gt': return '>';
    case 'lt': return '<';
    case 'eq': return '=';
    case 'gte': return '>=';
    case 'lte': return '<=';
    case 'neq': return '!=';
    default: return '=';
  }
}

// Preset filter collections for common technical analysis patterns
export const getTechnicalPatternFilters = {
  // goldenCross: (): ColumnComparisonFilter[] => [
  //   { indicator_l: 'ema20', operator: 'gt', indicator_r: 'sma50' }
  // ],
  breakout: (): ColumnComparisonFilter[] => [
    { indicator_l: 'high', operator: 'gte', indicator_r: 'prev_day_high' },
    { indicator_l: 'high', operator: 'gte', indicator_r: 'week_max_52_high' }
  ],
  bullishMomentum: (): ColumnComparisonFilter[] => [
    { indicator_l: 'close', operator: 'gt', indicator_r: 'ema20' },
    { indicator_l: 'ema20', operator: 'gt', indicator_r: 'ema50' },
    { indicator_l: 'ema50', operator: 'gt', indicator_r: 'ema200' },
    { indicator_l: 'vol', operator: 'gt', indicator_r: 'curr_day_sma5_volume' }
  ],
  volumeSpike: (): ColumnComparisonFilter[] => [
    { indicator_l: 'vol', operator: 'gt', indicator_r: 'prev_day_vol' },
    { indicator_l: 'vol', operator: 'gt', indicator_r: 'prev_day2_vol' },
    { indicator_l: 'vol', operator: 'gt', indicator_r: 'prev_day3_vol' }
  ],
  aboveEMA: (): ColumnComparisonFilter[] => [
    { indicator_l: 'close', operator: 'gt', indicator_r: 'ema20' }
  ],
  deathCross: (): ColumnComparisonFilter[] => [
    { indicator_l: 'ema20', operator: 'lt', indicator_r: 'sma50' }
  ]
};