/**
 * Core type definitions for the application
 */

// Solana types
export interface PublicKeyString {
  toString(): string;
}

// Pool types
export type PoolStatus = 'active' | 'locked' | 'settled' | 'cancelled';

export interface Pool {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  status: PoolStatus;
  lockTime?: Date;
  expiryTime?: Date;
  totalYesAmount?: number;
  totalNoAmount?: number;
  yesOdds?: number;
  noOdds?: number;
  createdAt: Date;
  updatedAt?: Date;
  // Arena/Rumble-specific fields (from API_REFERENCE.md)
  poolNumber?: number;
  rumbleId?: string;
  poolPubkey?: string;
  traderAAddress?: string;
  traderBAddress?: string;
  timeframeDays?: number;
  poolATotal?: string;
  poolBTotal?: string;
  totalPoolSize?: string | bigint;
  poolARatio: number; // Ratio of Pool A (0-1)
  poolBRatio: number; // Ratio of Pool B (0-1)
  currentOddsA: number; // Current odds for Trader A
  currentOddsB: number; // Current odds for Trader B
  minBetAmount?: string; // Min bet in lamports
  maxBetAmount?: string; // Max bet in lamports
  bettingOpensAt?: string | number;
  bettingClosesAt?: string | number;
  gracePeriodEndsAt?: string;
}

// Bet types
export type BetSide = 'yes' | 'no';
export type BetStatus = 'pending' | 'confirmed' | 'settled' | 'cancelled';

export interface Bet {
  id: string;
  poolId: string;
  userId: string;
  walletAddress: string;
  side: BetSide;
  amount: number;
  odds: number;
  potentialPayout: number;
  status: BetStatus;
  transactionSignature?: string;
  settledAmount?: number;
  createdAt: Date;
  settledAt?: Date;
}

// User types
export interface User {
  id: string;
  walletAddress: string;
  username?: string;
  totalBets: number;
  totalWinnings: number;
  winRate: number;
  createdAt: Date;
}

// WebSocket event types
export type PoolEvent =
  | { type: 'pool:created'; data: Pool }
  | { type: 'pool:updated'; data: Pool }
  | { type: 'pool:odds_changed'; data: { poolId: string; yesOdds: number; noOdds: number } }
  | { type: 'pool:locked'; data: { poolId: string } }
  | { type: 'pool:settled'; data: { poolId: string; winingSide: BetSide } };

export type BetEvent =
  | { type: 'bet:placed'; data: Bet }
  | { type: 'bet:confirmed'; data: { betId: string; transactionSignature: string } }
  | { type: 'bet:settled'; data: { betId: string; settledAmount: number } };

export type WebSocketEvent = PoolEvent | BetEvent;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    lastPage: number;
  };
}

// Form types
export interface PlaceBetForm {
  poolId: string;
  side: BetSide;
  amount: number;
}

// Admin types
export interface AdminStats {
  totalPools: number;
  activePools: number;
  totalBets: number;
  totalVolume: number;
  totalUsers: number;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'operator';
  createdAt: Date;
}

// ============================================
// Trader Comparison Types (from kin/phase-0)
// ============================================

// Polymarket API Response Types
export interface PNLDataPoint {
  t: number; // Unix timestamp (seconds)
  p: number; // PNL value
}

export interface PortfolioValueResponse {
  user: string;
  value: number;
}

export interface Position {
  title: string;
  outcome: string;
  size: number;
  avgPrice: number;
  curPrice: number;
  cashPnl: number;
  percentPnl: number;
  currentValue: number;
  icon?: string;
  redeemable: boolean;
}

export interface Trade {
  timestamp: number;
  side: "BUY" | "SELL";
  size: number;
  price: number;
  conditionId: string;
}

export interface TraderProfile {
  name: string;
  pseudonym: string;
  profileImage: string | null;
  profileImageOptimized: string | null;
  bio?: string;
}

// Chart Data Types
export interface ChartDataPoint {
  timestamp: number;
  trader1Percent: number;
  trader2Percent: number;
  trader1Value: number;
  trader2Value: number;
  trader1RealizedPnl: number;
  trader1UnrealizedPnl: number;
  trader2RealizedPnl: number;
  trader2UnrealizedPnl: number;
}

// Trader Data Types
export interface TraderMetrics {
  portfolioValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  activePositions: number;
  avgPositionSize: number;
}

export interface TraderData {
  profile: TraderProfile;
  metrics: TraderMetrics;
  positions: Position[];
  pnlTimeSeries: PNLDataPoint[];
}

// App State Types (for comparison page)
export interface AppState {
  wallet1: string;
  wallet2: string;
  wallet1Valid: boolean;
  wallet2Valid: boolean;
  wallet1Error: string | null;
  wallet2Error: string | null;

  isComparing: boolean;
  comparisonError: string | null;
  selectedTimeframe: 7 | 30 | 90;

  trader1: TraderData | null;
  trader2: TraderData | null;

  loading: boolean;
  autoRefreshCountdown: number;
  lastRefreshTime: Date | null;
}

// Error Types (for validation)
export const ErrorType = {
  INVALID_WALLET: "Invalid wallet address format",
  NO_TRADING_HISTORY: "No trading history found",
  INSUFFICIENT_HISTORY: "Insufficient trading history for selected timeframe",
  API_ERROR: "Failed to fetch data from Polymarket API",
  NETWORK_ERROR: "Network error. Please check your connection",
  UNKNOWN_ERROR: "An unexpected error occurred",
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

export interface ValidationError {
  type: ErrorType;
  message: string;
  trader?: 1 | 2;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  firstTradeDate?: Date;
  commonStartTimestamp?: number;
}

// Timeframe type
export type Timeframe = 7 | 30 | 90;

// Profile Search Types
export interface ProfileSearchResult {
  name: string;
  pseudonym: string;
  proxyWallet: string;
  profileImage: string | null;
  profileImageOptimized: string | null;
  bio: string;
  displayUsernamePublic: boolean;
}

export interface ProfileSearchResponse {
  profiles: ProfileSearchResult[];
  pagination: {
    hasMore: boolean;
    totalResults: number;
  };
}

export interface TraderSelection {
  walletAddress: string;
  name?: string;
  pseudonym?: string;
  bio?: string;
  profileImage?: string | null;
  source: "wallet" | "search";
}

export type InputMode = "wallet" | "name";

// Rumble/Arena Types
export interface RumbleData {
  id: string;
  creatorWallet: string;
  traderAAddress: string;
  traderAName: string;
  traderAImage?: string;
  traderBAddress: string;
  traderBName: string;
  traderBImage?: string;
  timeframe: number;
  status: string;
  createdAt: string;
}
