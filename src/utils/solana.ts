import { PublicKey } from '@solana/web3.js';

/**
 * Solana utility functions
 */

/**
 * Convert SOL to lamports
 * @param sol - Amount in SOL
 * @returns Amount in lamports
 */
export function solToLamports(sol: number): bigint {
  return BigInt(Math.floor(sol * 1_000_000_000));
}

/**
 * Convert lamports to SOL
 * @param lamports - Amount in lamports
 * @returns Amount in SOL
 */
export function lamportsToSol(lamports: bigint | number | string): number {
  const lamportsNum = typeof lamports === 'bigint'
    ? Number(lamports)
    : typeof lamports === 'string'
    ? Number(lamports)
    : lamports;
  return lamportsNum / 1_000_000_000;
}

/**
 * Format SOL amount with specified decimals
 * @param amount - Amount in SOL or lamports
 * @param decimals - Number of decimal places (default: 4)
 * @param isLamports - Whether the amount is in lamports (default: false)
 * @returns Formatted string
 */
export function formatSOL(
  amount: number | bigint | string,
  decimals: number = 4,
  isLamports: boolean = false
): string {
  const solAmount = isLamports
    ? lamportsToSol(amount)
    : typeof amount === 'bigint'
    ? Number(amount)
    : typeof amount === 'string'
    ? parseFloat(amount)
    : amount;

  return solAmount.toFixed(decimals);
}

/**
 * Format SOL amount with SOL suffix
 * @param amount - Amount in SOL or lamports
 * @param decimals - Number of decimal places (default: 4)
 * @param isLamports - Whether the amount is in lamports (default: false)
 * @returns Formatted string with SOL suffix
 */
export function formatSOLWithSymbol(
  amount: number | bigint | string,
  decimals: number = 4,
  isLamports: boolean = false
): string {
  return `${formatSOL(amount, decimals, isLamports)} SOL`;
}

/**
 * Truncate wallet address for display
 * @param address - Wallet address
 * @param startChars - Number of characters to show at start (default: 4)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Truncated address (e.g., "Abc1...xyz9")
 */
export function truncateAddress(
  address: string,
  startChars: number = 4,
  endChars: number = 4
): string {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Validate Solana address
 * @param address - Address to validate
 * @returns true if valid Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format large numbers with commas
 * @param num - Number to format
 * @returns Formatted string (e.g., "1,234,567")
 */
export function formatNumber(num: number | bigint | string): string {
  const numValue = typeof num === 'bigint'
    ? Number(num)
    : typeof num === 'string'
    ? parseFloat(num)
    : num;

  return numValue.toLocaleString('en-US');
}

/**
 * Get Solana explorer URL for transaction
 * @param signature - Transaction signature
 * @param cluster - Solana cluster (default: 'mainnet-beta')
 * @returns Explorer URL
 */
export function getExplorerUrl(
  signature: string,
  cluster: 'mainnet-beta' | 'devnet' | 'testnet' = 'mainnet-beta'
): string {
  const baseUrl = 'https://explorer.solana.com/tx';
  const clusterParam = cluster !== 'mainnet-beta' ? `?cluster=${cluster}` : '';
  return `${baseUrl}/${signature}${clusterParam}`;
}

/**
 * Get Solana explorer URL for address
 * @param address - Wallet address
 * @param cluster - Solana cluster (default: 'mainnet-beta')
 * @returns Explorer URL
 */
export function getAddressExplorerUrl(
  address: string,
  cluster: 'mainnet-beta' | 'devnet' | 'testnet' = 'mainnet-beta'
): string {
  const baseUrl = 'https://explorer.solana.com/address';
  const clusterParam = cluster !== 'mainnet-beta' ? `?cluster=${cluster}` : '';
  return `${baseUrl}/${address}${clusterParam}`;
}

/**
 * Calculate transaction fee estimate
 * Standard Solana transaction fee is ~0.000005 SOL
 * @returns Estimated fee in SOL
 */
export function getEstimatedTransactionFee(): number {
  return 0.000005;
}

/**
 * Validate bet amount
 * @param amount - Amount in SOL
 * @param minAmount - Minimum allowed amount in SOL
 * @param maxAmount - Maximum allowed amount in SOL
 * @param balance - User's balance in SOL
 * @returns Validation result with error message if invalid
 */
export function validateBetAmount(
  amount: number,
  minAmount: number,
  maxAmount: number,
  balance: number
): { valid: boolean; error?: string } {
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }

  if (amount < minAmount) {
    return {
      valid: false,
      error: `Minimum bet amount is ${formatSOLWithSymbol(minAmount, 4)}`
    };
  }

  if (amount > maxAmount) {
    return {
      valid: false,
      error: `Maximum bet amount is ${formatSOLWithSymbol(maxAmount, 4)}`
    };
  }

  const totalCost = amount + getEstimatedTransactionFee();
  if (totalCost > balance) {
    return {
      valid: false,
      error: 'Insufficient balance (including transaction fee)'
    };
  }

  return { valid: true };
}
