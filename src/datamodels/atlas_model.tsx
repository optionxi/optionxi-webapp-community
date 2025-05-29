export interface IndicatorList {
    [key: string]: number;
  }
  
export interface AtlasOutput {
    id: string;
    created_at: string;
    "Negative Indicators": number;
    "Negative Indicators List": string;
    "Neutral Indicators": number;
    "Neutral Indicators List": string;
    "Postive Indicators": number;
    "Postive Indicators List": string;
    "Total Crossovers": number;
    "Total Crossovers List": string;
    advancing: number;
    breakoutvalue: number;
    crossovers: number;
    date: string;
    declining: number;
    entry: boolean;
    longterm: "Bull" | "Bear" | "Neutral";
    lowbreakout: string;
    probability: number;
    shortterm: "Bull" | "Bear" | "Neutral";
    time: string;
    timeinmill: number;
    type: "Bull" | "Bear" | "Neutral";
    upbreakout: string;
  }