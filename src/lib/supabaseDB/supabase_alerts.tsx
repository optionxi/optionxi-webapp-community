// lib/supabaseDB/supabase_alerts.ts
import { AlertModel } from '@/datamodels/alerts_model'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface GetAlertsParams {
  page?: number
  pageSize?: number
  sentiment?: 'bullish' | 'bearish'
  symbol?: string
  date?: Date
}

export async function getAlerts({
  page = 1,
  pageSize = 30,
  sentiment,
  symbol,
  date
}: GetAlertsParams) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('live_scanner')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (sentiment) {
    query = query.eq('sentiment', sentiment)
  }

  if (symbol) {
    query = query.eq('symbol', symbol)
  }

  if (date) {
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    
    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    query = query
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
  }

  const { data, error, count } = await query.range(from, to)

  if (error) {
    throw new Error(`Error fetching alerts: ${error.message}`)
  }

  return { 
    data: data as AlertModel[], 
    count: count || 0,
    page,
    pageSize
  }
}

// Remove getFilteredAlerts as it's now incorporated into getAlerts

export function subscribeToAlerts(callback: (payload: AlertModel) => void) {
  const subscription = supabase
    .channel('live_scanner_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'live_scanner'
      },
      (payload) => {
        callback(payload.new as AlertModel)
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}

export async function getFilteredAlerts(sentiment: 'bullish' | 'bearish', page = 1, pageSize = 30) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('live_scanner')
    .select('*', { count: 'exact' })
    .eq('sentiment', sentiment)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw new Error(`Error fetching ${sentiment} alerts: ${error.message}`)
  }

  return { 
    data: data as AlertModel[], 
    count: count || 0,
    page,
    pageSize
  }
}

export async function getAlertsBySymbol(symbol: string, page = 1, pageSize = 30) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('live_scanner')
    .select('*', { count: 'exact' })
    .eq('symbol', symbol)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw new Error(`Error fetching alerts for ${symbol}: ${error.message}`)
  }

  return { 
    data: data as AlertModel[], 
    count: count || 0,
    page,
    pageSize
  }
}
