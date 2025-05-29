export interface BollingerBreakoutModel {
    id: number;
    created_at: string;
    description: string;
    time: string;
    sentiment: 'bullish' | 'bearish';
    whichmode: string | null;
  }
  
  export interface BollingerResponse {
    data: BollingerBreakoutModel[];
    count: number;
    page: number;
    pageSize: number;
  }