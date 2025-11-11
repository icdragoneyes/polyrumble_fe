import type { Pool } from '../types';
import { lamportsToSol } from './solana';

/**
 * Betting utility functions
 */

/**
 * Map trader choice to trader name
 * @param traderChoice - 0 for Trader A, 1 for Trader B
 * @returns 'A' or 'B'
 */
export function getTraderSide(traderChoice: number): 'A' | 'B' {
  return traderChoice === 0 ? 'A' : 'B';
}

/**
 * Map trader side to trader choice number
 * @param side - 'A' or 'B'
 * @returns 0 for A, 1 for B
 */
export function getTraderChoice(side: 'A' | 'B'): number {
  return side === 'A' ? 0 : 1;
}

/**
 * Format odds for display
 * @param odds - Odds value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted odds string (e.g., "1.67x")
 */
export function formatOdds(odds: number, decimals: number = 2): string {
  return `${odds.toFixed(decimals)}x`;
}

/**
 * Calculate current odds for a trader
 * @param totalPoolSize - Total pool size in lamports
 * @param traderPoolSize - Trader's pool size in lamports
 * @returns Current odds
 */
export function calculateOdds(
  totalPoolSize: bigint | string | number,
  traderPoolSize: bigint | string | number
): number {
  const total = typeof totalPoolSize === 'bigint'
    ? Number(totalPoolSize)
    : typeof totalPoolSize === 'string'
    ? Number(totalPoolSize)
    : totalPoolSize;

  const traderTotal = typeof traderPoolSize === 'bigint'
    ? Number(traderPoolSize)
    : typeof traderPoolSize === 'string'
    ? Number(traderPoolSize)
    : traderPoolSize;

  if (traderTotal === 0) return 1;
  return total / traderTotal;
}

/**
 * Calculate pool ratio (percentage of total pool)
 * @param traderPoolSize - Trader's pool size
 * @param totalPoolSize - Total pool size
 * @returns Ratio as percentage (0-100)
 */
export function calculatePoolRatio(
  traderPoolSize: bigint | string | number,
  totalPoolSize: bigint | string | number
): number {
  const total = typeof totalPoolSize === 'bigint'
    ? Number(totalPoolSize)
    : typeof totalPoolSize === 'string'
    ? Number(totalPoolSize)
    : totalPoolSize;

  const traderTotal = typeof traderPoolSize === 'bigint'
    ? Number(traderPoolSize)
    : typeof traderPoolSize === 'string'
    ? Number(traderPoolSize)
    : traderPoolSize;

  if (total === 0) return 0;
  return (traderTotal / total) * 100;
}

/**
 * Calculate potential payout after placing a bet
 * @param betAmount - Bet amount in SOL
 * @param totalPoolSize - Total pool size in lamports
 * @param traderPoolSize - Trader's pool size in lamports
 * @returns Potential payout in SOL
 */
export function calculatePotentialPayout(
  betAmount: number,
  totalPoolSize: bigint | string | number,
  traderPoolSize: bigint | string | number
): number {
  // Simplified calculation - in reality, odds change as you bet
  // For accurate calculation, use the /api/v1/bets/simulate endpoint
  const betLamports = Math.floor(betAmount * 1_000_000_000);

  const total = typeof totalPoolSize === 'bigint'
    ? Number(totalPoolSize)
    : typeof totalPoolSize === 'string'
    ? Number(totalPoolSize)
    : totalPoolSize;

  const traderTotal = typeof traderPoolSize === 'bigint'
    ? Number(traderPoolSize)
    : typeof traderPoolSize === 'string'
    ? Number(traderPoolSize)
    : traderPoolSize;

  const newTotal = total + betLamports;
  const newTraderTotal = traderTotal + betLamports;
  const newOdds = newTotal / newTraderTotal;

  return betAmount * newOdds;
}

/**
 * Get pool status display info
 * @param status - Pool status
 * @returns Display info with color and label
 */
export function getPoolStatusInfo(status: string): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (status) {
    case 'active':
      return {
        label: 'Active',
        color: 'text-green-800',
        bgColor: 'bg-green-100',
      };
    case 'locked':
      return {
        label: 'Locked',
        color: 'text-yellow-800',
        bgColor: 'bg-yellow-100',
      };
    case 'settled':
      return {
        label: 'Settled',
        color: 'text-blue-800',
        bgColor: 'bg-blue-100',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        color: 'text-red-800',
        bgColor: 'bg-red-100',
      };
    default:
      return {
        label: status,
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
      };
  }
}

/**
 * Check if betting is allowed for a pool
 * @param pool - Pool object
 * @returns true if betting is allowed
 */
export function isBettingAllowed(pool: Pool): boolean {
  if (pool.status !== 'active') return false;

  // Check if betting window is open
  if (pool.bettingClosesAt) {
    const closesAt = typeof pool.bettingClosesAt === 'number'
      ? pool.bettingClosesAt * 1000 // Convert Unix timestamp to milliseconds
      : new Date(pool.bettingClosesAt).getTime();

    if (Date.now() >= closesAt) return false;
  }

  return true;
}

/**
 * Calculate time remaining until betting closes
 * @param bettingClosesAt - Unix timestamp or Date
 * @returns Seconds remaining (0 if expired)
 */
export function getTimeUntilBettingCloses(
  bettingClosesAt: number | Date | undefined
): number {
  if (!bettingClosesAt) return 0;

  const closesAt = typeof bettingClosesAt === 'number'
    ? bettingClosesAt * 1000 // Convert Unix timestamp to milliseconds
    : new Date(bettingClosesAt).getTime();

  const remaining = Math.max(0, closesAt - Date.now());
  return Math.floor(remaining / 1000); // Return seconds
}

/**
 * Format time remaining as human-readable string
 * @param seconds - Seconds remaining
 * @returns Formatted string (e.g., "2h 30m", "45m", "30s")
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Closed';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${secs}s`;
  }
}

/**
 * Get pool size in SOL
 * @param pool - Pool object
 * @param side - 'A', 'B', or 'total'
 * @returns Pool size in SOL
 */
export function getPoolSize(pool: Pool, side: 'A' | 'B' | 'total'): number {
  const totalLamports = typeof pool.totalPoolSize === 'string'
    ? BigInt(pool.totalPoolSize)
    : BigInt(pool.totalPoolSize || 0);

  if (side === 'total') {
    return lamportsToSol(totalLamports);
  }

  const ratio = side === 'A' ? pool.poolARatio : pool.poolBRatio;
  const sideLamports = Number(totalLamports) * ratio;
  return lamportsToSol(sideLamports);
}
