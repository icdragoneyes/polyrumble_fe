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
  title: string;
  description: string;
  category: string;
  status: PoolStatus;
  lockTime: Date;
  expiryTime: Date;
  totalYesAmount: number;
  totalNoAmount: number;
  yesOdds: number;
  noOdds: number;
  createdAt: Date;
  updatedAt: Date;
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
