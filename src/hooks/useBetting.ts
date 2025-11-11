import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { api } from '../services/api';
import type { Bet } from '../types';

/**
 * Bet simulation response from backend
 */
export interface BetSimulation {
  amount: string;
  traderChoice: number;
  currentOdds: number;
  potentialPayout: string;
  platformFee: string;
  netPayout: string;
}

/**
 * Custom hook for betting functionality
 * Handles bet simulation, placement, and user bet history
 */
export function useBetting(poolId?: string) {
  const { publicKey, connected } = useWallet();
  const queryClient = useQueryClient();

  // Fetch user's bets
  const { data: userBets, isLoading: loadingBets } = useQuery({
    queryKey: ['userBets', publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey || !connected) return [];
      const response = await api.bets.list(publicKey.toBase58());
      return response.data.data || [];
    },
    enabled: !!publicKey && connected,
  });

  // Fetch pool-specific bets
  const { data: poolBets, isLoading: loadingPoolBets } = useQuery({
    queryKey: ['poolBets', poolId],
    queryFn: async () => {
      if (!poolId) return [];
      const response = await api.bets.poolBets(poolId);
      return response.data.data || [];
    },
    enabled: !!poolId,
  });

  // Simulate bet mutation
  const simulateBetMutation = useMutation({
    mutationFn: async ({
      poolId,
      amount,
      traderChoice,
    }: {
      poolId: string;
      amount: number; // Amount in SOL
      traderChoice: number;
    }) => {
      const amountLamports = Math.floor(amount * 1_000_000_000).toString();
      const response = await api.bets.simulate({
        poolId,
        amount: amountLamports,
        traderChoice,
      });
      return response.data.data as BetSimulation;
    },
  });

  // Place bet mutation
  const placeBetMutation = useMutation({
    mutationFn: async ({
      poolId,
      amount,
      traderChoice,
    }: {
      poolId: string;
      amount: number; // Amount in SOL
      traderChoice: number;
    }) => {
      if (!connected || !publicKey) {
        throw new Error('Wallet not connected');
      }

      const amountLamports = Math.floor(amount * 1_000_000_000).toString();
      const response = await api.bets.create({
        poolId,
        amount: amountLamports,
        traderChoice,
      });
      return response.data.data as Bet;
    },
    onSuccess: (bet) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['userBets'] });
      queryClient.invalidateQueries({ queryKey: ['poolBets', bet.poolId] });
      queryClient.invalidateQueries({ queryKey: ['pool', bet.poolId] });
      queryClient.invalidateQueries({ queryKey: ['pools'] });
    },
    onError: (error) => {
      console.error('Place bet failed:', error);
    },
  });

  /**
   * Simulate a bet to get potential payout
   */
  const simulateBet = async (
    poolId: string,
    amount: number,
    traderChoice: number
  ): Promise<BetSimulation | null> => {
    try {
      const result = await simulateBetMutation.mutateAsync({
        poolId,
        amount,
        traderChoice,
      });
      return result;
    } catch (error) {
      console.error('Simulate bet error:', error);
      return null;
    }
  };

  /**
   * Place a bet (requires wallet connection and transaction signing)
   */
  const placeBet = async (
    poolId: string,
    amount: number,
    traderChoice: number
  ): Promise<Bet | null> => {
    try {
      const result = await placeBetMutation.mutateAsync({
        poolId,
        amount,
        traderChoice,
      });
      return result;
    } catch (error) {
      console.error('Place bet error:', error);
      return null;
    }
  };

  /**
   * Get user's bets for a specific pool
   */
  const getUserPoolBets = (poolId: string): Bet[] => {
    if (!userBets) return [];
    return userBets.filter((bet: Bet) => bet.poolId === poolId);
  };

  /**
   * Calculate total amount bet by user on a specific pool
   */
  const getTotalBetAmount = (poolId: string): number => {
    const bets = getUserPoolBets(poolId);
    return bets.reduce((total: number, bet: Bet) => total + bet.amount, 0);
  };

  return {
    // Data
    userBets,
    poolBets,
    lastSimulation: simulateBetMutation.data || null,

    // Loading states
    loadingBets,
    loadingPoolBets,
    isSimulating: simulateBetMutation.isPending,
    isPlacingBet: placeBetMutation.isPending,

    // Actions
    simulateBet,
    placeBet,
    getUserPoolBets,
    getTotalBetAmount,

    // Errors
    simulationError: simulateBetMutation.error,
    placeBetError: placeBetMutation.error,
  };
}
