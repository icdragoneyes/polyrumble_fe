import { fetchTraderTrades } from "../services/polymarketApi";
import type { ValidationResult, Timeframe } from "../types";

/**
 * Validate wallet address format
 * Must be 42 characters: 0x + 40 hex chars
 */
export function validateWallet(address: string): boolean {
  if (!address) return false;

  // Must start with 0x
  if (!address.startsWith("0x")) return false;

  // Must be exactly 42 characters
  if (address.length !== 42) return false;

  // Must only contain valid hex characters after 0x
  const hexPart = address.slice(2);
  return /^[0-9a-fA-F]{40}$/.test(hexPart);
}

/**
 * Validate that a trader has trading history
 * Note: We removed timeframe validation because the trades API returns limited results,
 * which can cause false negatives for active traders. The PNL API handles timeframe appropriately.
 */
export async function validateTradingHistory(
  walletAddress: string,
  _timeframeDays: Timeframe,
): Promise<ValidationResult> {
  try {
    const trades = await fetchTraderTrades(walletAddress);

    if (trades.length === 0) {
      return {
        valid: false,
        error: "No trading history found for this wallet",
      };
    }

    // Just confirm they have trading history, don't validate timeframe
    // The PNL API will return appropriate data for the selected timeframe
    return { valid: true };
  } catch (error) {
    console.error("Error validating trading history:", error);
    return {
      valid: false,
      error: "Failed to validate trading history",
    };
  }
}

/**
 * Validate both traders have trading history
 */
export async function validateBothTraders(
  wallet1: string,
  wallet2: string,
  timeframeDays: Timeframe,
): Promise<ValidationResult> {
  const validation1 = await validateTradingHistory(wallet1, timeframeDays);
  const validation2 = await validateTradingHistory(wallet2, timeframeDays);

  if (!validation1.valid) {
    return { valid: false, error: `Trader 1: ${validation1.error}` };
  }
  if (!validation2.valid) {
    return { valid: false, error: `Trader 2: ${validation2.error}` };
  }

  return { valid: true };
}

/**
 * Truncate wallet address for display
 */
export function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Detect if input is a wallet address or a name
 */
export function detectInputType(input: string): "wallet" | "name" {
  if (!input) return "name";

  // Check if it's a wallet address format (0x + 40 hex chars)
  if (input.startsWith("0x") && input.length === 42) {
    const hexPart = input.slice(2);
    if (/^[0-9a-fA-F]{40}$/.test(hexPart)) {
      return "wallet";
    }
  }

  return "name";
}
