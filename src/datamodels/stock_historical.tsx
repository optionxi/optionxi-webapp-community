export interface StockDataPoint {
    date: string;
    price: number;
    volume: number;
    highprice: number;
    lowprice: number;
    openprice:number;
  }
  
  export interface RawStockData {
    "Stock Symbol": string;
    "Timestamp": number;
    "Open": number;
    "High": number;
    "Low": number;
    "Close": number;
    "Volume": number;
    "Dividends": number;
    "Stock Splits": number;
  }