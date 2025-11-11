import axios from "axios";
import type {
  PNLDataPoint,
  PortfolioValueResponse,
  Position,
  Trade,
  TraderProfile,
  Timeframe,
  ProfileSearchResponse,
  ProfileSearchResult,
} from "../types";

const PNL_API_BASE = "https://user-pnl-api.polymarket.com";
const DATA_API_BASE = "https://data-api.polymarket.com";

// Use proxy to bypass CORS (works in both dev and production)
// Uses /api/gamma path to avoid conflict with backend API at /api
const GAMMA_API_BASE = "/api/gamma";

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await axios.get(url);
    cache.set(url, { data: response.data, timestamp: Date.now() });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Fetch PNL time-series data for a trader
 */
export async function fetchTraderPNL(
  walletAddress: string,
  timeframeDays: Timeframe,
): Promise<PNLDataPoint[]> {
  const intervalMap: Record<Timeframe, string> = {
    7: "1w",
    30: "1m",
    90: "all",
  };

  const fidelityMap: Record<Timeframe, string> = {
    7: "1h",
    30: "1h",
    90: "1d",
  };

  const interval = intervalMap[timeframeDays];
  const fidelity = fidelityMap[timeframeDays];

  const url = `${PNL_API_BASE}/user-pnl?user_address=${walletAddress}&interval=${interval}&fidelity=${fidelity}`;

  const data = await fetchWithCache<PNLDataPoint[]>(url);

  // If 90 days, filter to last 90 days
  if (timeframeDays === 90) {
    const cutoffTimestamp = Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60;
    return data.filter((point) => point.t >= cutoffTimestamp);
  }

  return data;
}

/**
 * Fetch current portfolio value
 */
export async function fetchPortfolioValue(
  walletAddress: string,
): Promise<number> {
  const url = `${DATA_API_BASE}/value?user=${walletAddress}`;
  const data = await fetchWithCache<PortfolioValueResponse[]>(url);

  if (data.length === 0) {
    return 0;
  }

  return data[0].value;
}

/**
 * Fetch trader positions
 */
export async function fetchTraderPositions(
  walletAddress: string,
): Promise<Position[]> {
  const url = `${DATA_API_BASE}/positions?user=${walletAddress}&limit=500&sortBy=PERCENTPNL&sortDirection=DESC`;
  return fetchWithCache<Position[]>(url);
}

/**
 * Fetch trader trades
 */
export async function fetchTraderTrades(
  walletAddress: string,
): Promise<Trade[]> {
  // Note: API may have a max limit, try to fetch as many as possible
  const url = `${DATA_API_BASE}/trades?user=${walletAddress}&limit=10000`;
  const trades = await fetchWithCache<Trade[]>(url);

  console.debug(
    `Fetched ${trades.length} trades for ${walletAddress.slice(0, 6)}...`,
  );

  return trades;
}

/**
 * Fetch trader profile information
 */
export async function fetchTraderProfile(
  walletAddress: string,
): Promise<TraderProfile> {
  const url = `${DATA_API_BASE}/activity?user=${walletAddress}&limit=1`;

  try {
    const data = await fetchWithCache<any[]>(url);

    if (data.length === 0) {
      return {
        name: "Unknown Trader",
        pseudonym: "Unknown",
        profileImage: null,
        profileImageOptimized: null,
      };
    }

    return {
      name: data[0].name || data[0].pseudonym || "Unknown Trader",
      pseudonym: data[0].pseudonym,
      profileImage: data[0].profileImage,
      profileImageOptimized: data[0].profileImageOptimized,
      bio: data[0].bio || undefined,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return {
      name: "Unknown Trader",
      pseudonym: "Unknown",
      profileImage: null,
      profileImageOptimized: null,
      bio: undefined,
    };
  }
}

/**
 * Calculate win rate from closed positions
 */
export async function calculateWinRate(walletAddress: string): Promise<number> {
  try {
    const allPositions = await fetchTraderPositions(walletAddress);
    // Closed positions are those that are redeemable OR have size = 0
    const closedPositions = allPositions.filter(
      (p) => p.redeemable === true || p.size === 0,
    );

    if (closedPositions.length === 0) {
      return 0;
    }

    const winningPositions = closedPositions.filter((p) => p.cashPnl > 0);
    const winRate = (winningPositions.length / closedPositions.length) * 100;

    console.debug(
      `Win rate calculation: ${winningPositions.length} wins / ${closedPositions.length} closed = ${winRate.toFixed(2)}%`,
    );

    return winRate;
  } catch (error) {
    console.error("Error calculating win rate:", error);
    return 0;
  }
}

/**
 * Search for trader profiles by name
 */
export async function searchProfiles(
  query: string,
  limit: number = 5,
): Promise<ProfileSearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const url = `${GAMMA_API_BASE}/public-search?q=${encodeURIComponent(query)}&search_profiles=true`;

  try {
    const response = await axios.get<ProfileSearchResponse>(url);

    // Return top N results
    return (response.data.profiles || []).slice(0, limit);
  } catch (error) {
    console.error("Error searching profiles:", error);
    return [];
  }
}

/**
 * Clear the API cache
 */
export function clearCache(): void {
  cache.clear();
}
