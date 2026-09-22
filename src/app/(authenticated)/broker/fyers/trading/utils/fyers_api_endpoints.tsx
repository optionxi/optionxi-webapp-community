import { auth } from "@/utils/firebaseConfig";
import {
  FyersApiResponse,
  FyersProfileModel,
  FyersFundsResponse,
  FyersHoldingsResponse,
  FyersPositionsResponse,
  FyersOrderModel,
  FyersFundLimit,
  FyersHoldingModel,
  FyersOverallSummary,
  FyersPositionModel,
  FyersOverallPositionsSummary,
  transformProfileResponse,
  FyersProfileApiResponse,
} from "./fyers_datamodel";

class FyersApiService {
  private baseUrl: string;
  private timeout: number = 30000;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_FYERS_URL || "";
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    try {
      const token = await this.getFirebaseToken();
      return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };
    } catch (error) {
      console.error("Error getting auth headers:", error);
      return {
        "Content-Type": "application/json",
      };
    }
  }

  private async getFirebaseToken(): Promise<string | null> {
    try {
      return (await auth.currentUser?.getIdToken()) || null;
    } catch (error) {
      console.error("Error getting Firebase token:", error);
      return null;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<FyersApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.getAuthHeaders();

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(await this.getErrorMessage(response));
      }

      const data: FyersApiResponse<T> = await response.json();

      if (data.status !== "ok") {
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(
            "Request timeout. Please check your internet connection."
          );
        }
        throw error;
      }
      throw new Error("Network error. Please check your connection.");
    }
  }

  private async getErrorMessage(response: Response): Promise<string> {
    const status = response.status;

    try {
      const errorData = await response.json();
      if (errorData.error) return errorData.error;
    } catch {
      // Ignore JSON parsing errors
    }

    switch (status) {
      case 401:
        return "Authentication failed. Please login again.";
      case 403:
        return "Access denied. Your Fyers credentials may be invalid.";
      case 404:
        return "Fyers credentials not found. Please configure your account.";
      case 500:
        return "Server error. Please try again later.";
      case 502:
        return "Fyers API error. Please try again.";
      case 504:
        return "Request timeout. Please try again.";
      default:
        return `API Error (${status}): Please try again.`;
    }
  }

  // ---------------------- Endpoints ----------------------

  // Profile
  async fetchProfile(): Promise<FyersProfileModel> {
    const response = await this.makeRequest<FyersProfileApiResponse>("/profile");
    
    if (response.data) {
      return transformProfileResponse(response.data);
    }
    throw new Error("Invalid profile data received");
  }

  // Holdings
  async fetchHoldings(): Promise<FyersHoldingsResponse> {
    const response = await this.makeRequest<{
      holdings: FyersHoldingModel[];
      overall: FyersOverallSummary;
    }>("/portfolio/holdings");

    if (response.data) {
      return {
        status: response.status,
        code: response.code,
        message: response.message,
        holdings: response.data.holdings || [],
        overall: response.data.overall,
      };
    }

    throw new Error("Failed to fetch holdings data");
  }

  // Positions
  async fetchPositions(): Promise<FyersPositionsResponse> {
    const response = await this.makeRequest<{
      positions: FyersPositionModel[];
      overall: FyersOverallPositionsSummary;
    }>("/portfolio/positions");

    if (response.data) {
      return {
        status: response.status,
        code: response.code,
        message: response.message,
        netPositions: response.data.positions || [],
        overall: response.data.overall,
      };
    }

    throw new Error("Failed to fetch positions data");
  }

  // Orders
  async fetchOrders(): Promise<FyersOrderModel[]> {
    const response = await this.makeRequest<FyersOrderModel[]>("/orders");

    if (response.data) {
      return response.data;
    }

    throw new Error("Failed to fetch orders data");
  }

  // Funds
  async fetchFunds(): Promise<FyersFundsResponse> {
    const response = await this.makeRequest<{ fund_limit: FyersFundLimit[] }>(
      "/funds"
    );

    if (response.data) {
      return {
        status: response.status,
        code: response.code,
        message: response.message,
        fundLimit: response.data.fund_limit,
      };
    }

    throw new Error("Failed to fetch funds data");
  }
}

// Export singleton instance
export const fyersApi = new FyersApiService();

// Export repository class for dependency injection if needed
export class FyersRepository {
  constructor(private apiService: FyersApiService = fyersApi) {}

  async getProfile(): Promise<FyersProfileModel> {
    return this.apiService.fetchProfile();
  }

  async getHoldings(): Promise<FyersHoldingsResponse> {
    return this.apiService.fetchHoldings();
  }

  async getPositions(): Promise<FyersPositionsResponse> {
    return this.apiService.fetchPositions();
  }

  async getOrders(): Promise<FyersOrderModel[]> {
    return this.apiService.fetchOrders();
  }

  async getFunds(): Promise<FyersFundsResponse> {
    return this.apiService.fetchFunds();
  }
}

export default fyersApi;
