// types/stock.ts
export interface AssetsCapital {
    id: number
    "Invested Capital": number
    "Working Capital": number
    year: number
    stockname: string
  }
  
  export interface DebtLiabilities {
    id: number
    "Net Debt": number
    "Total Debt": number
    "Total Liabilities Net Minority Interest": number
    "Total Non Current Liabilities Net Minority Interest": number
    "Non Current Pension And Other Postretirement Benefit Plans": number
    "Long Term Provisions": number
    "Current Liabilities": number
    "Current Debt And Capital Lease Obligation": number
    "Current Debt": number
    "Payables": number
    "Other Current Liabilities": number
    "Current Deferred Taxes Liabilities": number
    "Current Provisions": number
    year: number
    stockname: string
  }
  
  export interface ShareCapitalEquity {
    id: number
    "Ordinary Shares Number": number
    "Share Issued": number
    "Common Stock Equity": number
    "Common Stock": number
    "Capital Stock": number
    "Additional Paid In Capital": number
    "Retained Earnings": number
    "Other Equity Interest": number
    "Stockholders Equity": number
    "Total Equity Gross Minority Interest": number
    "Total Capitalization": number
    "Net Tangible Assets": number
    "Tangible Book Value": number
    year: number
    stockname: string
  }
  
  