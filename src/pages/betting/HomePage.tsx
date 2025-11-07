/**
 * Home page for betting interface
 * Shows active pools and allows users to place bets
 */

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { PoolCard } from '../../components/betting/PoolCard';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function HomePage() {
  const [notification, setNotification] = useState<string | null>(null);
  const { isConnected, onPoolUpdated, onPoolCreated, onPoolStatusChanged, onPoolCancelled } = useWebSocket();

  // Fetch active pools
  const { data, isLoading, error } = useQuery({
    queryKey: ['pools', 'active'],
    queryFn: async () => {
      const response = await api.pools.active();
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Setup WebSocket event listeners
  useEffect(() => {
    const cleanupPoolUpdated = onPoolUpdated((event) => {
      setNotification(`Pool #${event.data.poolNumber} updated! New total: ${(Number(event.data.totalPoolSize) / 1_000_000_000).toFixed(2)} SOL`);
      setTimeout(() => setNotification(null), 5000);
    });

    const cleanupPoolCreated = onPoolCreated((event) => {
      setNotification(`New Pool #${event.data.poolNumber} created!`);
      setTimeout(() => setNotification(null), 5000);
    });

    const cleanupPoolStatusChanged = onPoolStatusChanged((event) => {
      if (event.data.metadata?.alert) {
        setNotification(`Pool #${event.data.poolNumber}: ${event.data.metadata.alert}`);
        setTimeout(() => setNotification(null), 5000);
      }
    });

    const cleanupPoolCancelled = onPoolCancelled((event) => {
      setNotification(`Pool #${event.data.poolNumber} has been cancelled`);
      setTimeout(() => setNotification(null), 5000);
    });

    return () => {
      cleanupPoolUpdated();
      cleanupPoolCreated();
      cleanupPoolStatusChanged();
      cleanupPoolCancelled();
    };
  }, [onPoolUpdated, onPoolCreated, onPoolStatusChanged, onPoolCancelled]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Active Betting Pools
        </h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading pools...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Active Betting Pools
        </h1>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 font-medium">
            Failed to load betting pools
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const pools = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Realtime Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">{notification}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Active Betting Pools
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a pool and bet on which trader will perform better
            </p>
          </div>
          {/* WebSocket Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {pools.length === 0 ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-blue-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Active Pools
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There are no active betting pools at the moment. Check back later!
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {pools.length} {pools.length === 1 ? 'pool' : 'pools'} available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.map((pool) => (
              <PoolCard
                key={pool.id}
                pool={pool}
                onClick={(pool) => {
                  console.log('Pool clicked:', pool);
                  // TODO: Navigate to pool details page
                  // Navigate to `/pool/${pool.id}` when detail page is implemented
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
