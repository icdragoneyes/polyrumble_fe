import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration
 * Provides default options for data fetching and caching
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Data is considered fresh for 5 seconds
      staleTime: 5 * 1000,

      // Cache time: Unused data is garbage collected after 5 minutes
      gcTime: 5 * 60 * 1000,

      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus for real-time data
      refetchOnWindowFocus: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,

      // Refetch on reconnect to sync with server
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      retryDelay: 1000,
    },
  },
});

/**
 * Query keys for consistent cache management
 */
export const queryKeys = {
  // Pool queries
  pools: ['pools'] as const,
  pool: (id: string) => ['pools', id] as const,
  activePools: ['pools', 'active'] as const,

  // Bet queries
  bets: ['bets'] as const,
  bet: (id: string) => ['bets', id] as const,
  userBets: (walletAddress: string) => ['bets', 'user', walletAddress] as const,
  poolBets: (poolId: string) => ['bets', 'pool', poolId] as const,

  // User queries
  user: (walletAddress: string) => ['users', walletAddress] as const,
  userStats: (walletAddress: string) => ['users', walletAddress, 'stats'] as const,

  // Admin queries
  adminStats: ['admin', 'stats'] as const,
  adminPools: ['admin', 'pools'] as const,
  adminBets: ['admin', 'bets'] as const,
  adminUsers: ['admin', 'users'] as const,
};
