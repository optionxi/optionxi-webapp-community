export type AlertModel = {
  id: number
  date: string
  description: string
  created_at: string
  updated_at: string

  symbol: string | null
  sentiment: string | null

  close: number | null
  prev_close: number | null
  pcnt: number | null
  high: number | null
  low: number | null
  week_52_high: number | null
  week_52_low: number | null
  prev_day_low: number | null
  prev_day_high: number | null
  volume: number | null
  sma_5_volume: number | null
  open: number | null
}
