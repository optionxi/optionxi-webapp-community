// Base API Response Model
export interface FyersApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data?: T;
}

// Fyers Profile Model
export interface FyersProfileModel {
  name: string;
  image?: string;
  displayName: string;
  emailId: string;
  pan: string;
  fyId: string;
  pinChangeDate: string;
  mobileNumber: string;
  totp: boolean;
  pwdChangeDate: string;
  pwdToExpire: number;
  ddpiEnabled: boolean;
  mtfEnabled: boolean;
}

// Fund Models
export interface FyersFundLimit {
  id: number;
  title: string;
  equityAmount: number;
  commodityAmount: number;
}

export interface FyersFundsResponse {
  status: string;
  code: number;
  message: string;
  fundLimit: FyersFundLimit[];
}

// Holdings Models
export interface FyersHoldingModel {
  holdingType: string;
  quantity: number;
  costPrice: number;
  marketVal: number;
  remainingQuantity: number;
  pl: number;
  ltp: number;
  id: number;
  fyToken: number;
  exchange: number;
  symbol: string;
  segment: number;
  isin: string;
  qtyT1: number;
  remainingPledgeQuantity: number;
  collateralQuantity: number;
}

export interface FyersOverallSummary {
  countTotal: number;
  totalInvestment: number;
  totalCurrentValue: number;
  totalPl: number;
  pnlPerc: number;
}

export interface FyersHoldingsResponse {
  status: string;
  code: number;
  message: string;
  holdings: FyersHoldingModel[];
  overall: FyersOverallSummary;
}

// Positions Models
export interface FyersPositionModel {
  symbol: string;
  id: string;
  buyAvg: number;
  buyQty: number;
  buyVal: number;
  sellAvg: number;
  sellQty: number;
  sellVal: number;
  netAvg: number;
  netQty: number;
  side: number;
  qty: number;
  productType: string;
  realizedProfit: number;
  crossCurrency: string;
  rbiRefRate: number;
  fyToken: number;
  exchange: number;
  segment: number;
  dayBuyQty: number;
  daySellQty: number;
  cfBuyQty: number;
  cfSellQty: number;
  qtyMultiCom: number;
  pl: number;
  unrealizedProfit: number;
  ltp: number;
  slNo: number;
}

export interface FyersOverallPositionsSummary {
  totalCount: number;
  pnlRealized: number;
  pnlUnrealized: number;
  totalPnl: number;
  brokerage: number;
}

export interface FyersPositionsResponse {
  status: string;
  code: number;
  message: string;
  netPositions: FyersPositionModel[];
  overall: FyersOverallPositionsSummary;
}

// Orders Model
export interface FyersOrderModel {
  clientId: string;
  exchange: number;
  fyToken: string;
  id: string;
  instrument: number;
  offlineOrder: boolean;
  source: string;
  status: number;
  type: number;
  pan: string;
  limitPrice: number;
  productType: string;
  qty: number;
  disclosedQty: number;
  remainingQuantity: number;
  segment: number;
  symbol: string;
  description: string;
  exSym: string;
  orderDateTime: string;
  side: number;
  orderValidity: string;
  stopPrice: number;
  tradedPrice: number;
  filledQty: number;
  exchOrdId: string;
  message: string;
  ch: number;
  chp: number;
  lp: number;
  orderNumStatus: string;
  slNo: number;
  orderTag: string;
}

// Utility types for error handling
export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
}

// Helper functions for type safety
export const safeString = (value: unknown): string => {
  return typeof value === 'string' ? value : '';
};

export const safeNumber = (value: unknown): number => {
  if (typeof value === 'number' && !isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return !isNaN(parsed) ? parsed : 0;
  }
  return 0;
};

export const safeBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
};

export interface FyersProfileApiResponse {
  name: string;
  image?: string;
  display_name: string;
  email_id: string;
  PAN: string;
  fy_id: string;
  pin_change_date: string;
  mobile_number: string;
  totp: boolean | string;
  pwd_change_date: string;
  pwd_to_expire: number | string;
  ddpi_enabled: boolean | string;
  mtf_enabled: boolean | string;
}

// Profile transformation helpers
export const transformProfileResponse = (data: FyersProfileApiResponse): FyersProfileModel => ({
  name: safeString(data.name),
  image: data.image ? safeString(data.image) : undefined,
  displayName: safeString(data.display_name),
  emailId: safeString(data.email_id),
  pan: safeString(data.PAN),
  fyId: safeString(data.fy_id),
  pinChangeDate: safeString(data.pin_change_date),
  mobileNumber: safeString(data.mobile_number),
  totp: safeBoolean(data.totp),
  pwdChangeDate: safeString(data.pwd_change_date),
  pwdToExpire: safeNumber(data.pwd_to_expire),
  ddpiEnabled: safeBoolean(data.ddpi_enabled),
  mtfEnabled: safeBoolean(data.mtf_enabled),
});

export default FyersProfileModel;