import { createClient } from '@supabase/supabase-js'
import { BollingerBreakoutModel, BollingerResponse } from '@/datamodels/bollinger_model'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getBollingerBreakouts(
  page = 1, 
  pageSize = 30,
  startDate?: string,
  endDate?: string,
  filterByEntry = false // Add filterByEntry parameter
): Promise<BollingerResponse> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('bollinger_breakouts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (startDate) {
    query = query.gte('created_at', startDate)
  }
  
  if (endDate) {
    query = query.lte('created_at', endDate)
  }

  if (filterByEntry) {
    query = query.eq('whichmode', 'checkfirst')
  }

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Error fetching bollinger breakouts: ${error.message}`)
  }

  return {
    data: data as BollingerBreakoutModel[],
    count: count || 0,
    page,
    pageSize
  }
}

export async function getFilteredBollingerBreakouts(
  sentiment: 'bullish' | 'bearish',
  page = 1,
  pageSize = 30,
  filterByEntry = false // Add filterByEntry parameter
): Promise<BollingerResponse> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('bollinger_breakouts')
    .select('*', { count: 'exact' })
    .eq('sentiment', sentiment)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (filterByEntry) {
    query = query.eq('whichmode', 'checkfirst')
  }

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Error fetching ${sentiment} bollinger breakouts: ${error.message}`)
  }

  return {
    data: data as BollingerBreakoutModel[],
    count: count || 0,
    page,
    pageSize
  }
}
export function subscribeToBollingerBreakouts(
  callback: (payload: BollingerBreakoutModel) => void
) {
  const subscription = supabase
    .channel('bollinger_breakouts_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bollinger_breakouts'
      },
      (payload) => {
        callback(payload.new as BollingerBreakoutModel)
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}