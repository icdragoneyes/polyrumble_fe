import { useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useWalletStore } from '../stores/walletStore';

/**
 * Custom hook to manage wallet balance
 * Provides balance fetching and validation utilities
 */
export function useWalletBalance() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const connected = useWalletStore(state => state.connected);
  const balance = useWalletStore(state => state.balance);
  const setBalance = useWalletStore(state => state.setBalance);

  console.log('[useWalletBalance] Store values:', { connected, balance, publicKey: publicKey?.toBase58() });
  console.log('[useWalletBalance] Will return:', { connected });

  // Fetch balance on demand
  const { data: freshBalance, isLoading, refetch } = useQuery({
    queryKey: ['walletBalance', publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey || !connected) {
        return 0;
      }
      try {
        const balanceLamports = await connection.getBalance(publicKey);
        const balanceSOL = balanceLamports / 1_000_000_000;
        setBalance(balanceSOL);
        return balanceSOL;
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
        throw error;
      }
    },
    enabled: !!publicKey && connected,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  /**
   * Check if wallet has sufficient balance for a transaction
   * @param amountSOL - Amount in SOL to check
   * @returns true if wallet has sufficient balance
   */
  const hasSufficientBalance = useCallback(
    (amountSOL: number): boolean => {
      if (!connected || balance === 0) return false;
      // Add buffer for transaction fees (~0.000005 SOL)
      const TRANSACTION_FEE_BUFFER = 0.00001;
      return balance >= amountSOL + TRANSACTION_FEE_BUFFER;
    },
    [connected, balance]
  );

  /**
   * Get available balance minus transaction fee buffer
   * @returns Available balance in SOL
   */
  const getAvailableBalance = useCallback((): number => {
    if (!connected || balance === 0) return 0;
    const TRANSACTION_FEE_BUFFER = 0.00001;
    return Math.max(0, balance - TRANSACTION_FEE_BUFFER);
  }, [connected, balance]);

  /**
   * Format balance to display string
   * @param decimals - Number of decimal places (default: 4)
   * @returns Formatted balance string
   */
  const formatBalance = useCallback(
    (decimals: number = 4): string => {
      return balance.toFixed(decimals);
    },
    [balance]
  );

  return {
    balance: freshBalance ?? balance,
    isLoading,
    refetchBalance: refetch,
    hasSufficientBalance,
    getAvailableBalance,
    formatBalance,
    connected,
  };
}
