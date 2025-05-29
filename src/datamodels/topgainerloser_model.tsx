
export interface TopGainerLoserData {
    stckname: string;
    close: number;
    open: number;
    high: number;
    low: number;
    vol: number;
    vol2: number;
    vol3: number;
    vol4: number;
    vol5: number;
    pcnt: number;
    sec: string;
    pc: number;
    pc2: number;
    pc3: number;
    pc4: number;
    pc5: number;
    pc6: number;
    pc7: number;
    fname: string;
    max52: number;
    min52: number;
  }
  

 export interface StockDataResponse {
    data: TopGainerLoserData[] | null;
    error: Error | null;
  }