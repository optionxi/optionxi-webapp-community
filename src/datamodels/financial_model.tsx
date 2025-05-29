export interface StockFinancial {
  id: number;
  stockname: string;
  total_assets?: number | null;
  total_assets_growth?: number | null;
  total_debt?: number | null;
  debt_growth?: number | null;
  debt_to_assets?: number | null;
  working_capital?: number | null;
  working_capital_growth?: number | null;
  stockholders_equity?: number | null;
  equity_growth?: number | null;
  current_ratio?: number | null;
  observations: string;
  year?: string | null;
}
