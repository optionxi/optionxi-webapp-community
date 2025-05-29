export interface Screener {
  id: string;
  name: string;
  timeframe: string;
  signal_count: number;
  last_update: string;
  description: string;
  criteria: string[];
  category: 'bullish' | 'bearish';
}