/**
 * Arenas page for betting interface
 * Shows active pools/arenas and allows users to navigate to detail pages
 */

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { api } from '../../services/api';
import { PoolCard } from '../../components/betting/PoolCard';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { env } from '../../config/env';
import { generateMockArenas } from '../../constants/mockData';

export default function ArenasPage() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'locked' | 'active' | 'settled'>('all');
  const { isConnected, onPoolUpdated, onPoolCreated, onPoolStatusChanged, onPoolCancelled } = useWebSocket();
  const { connected, balance } = useWalletBalance();

  // Generate mock arenas once (only regenerates on component mount)
  const mockArenas = useMemo(() => generateMockArenas(), []);

  // Fetch active pools (or use mock data)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pools', 'active'],
    queryFn: async () => {
      // If mock mode is enabled, return mock data
      if (env.mockMode) {
        return {
          success: true,
          data: mockArenas,
        };
      }

      // Otherwise fetch from API
      const response = await api.pools.active();
      return response.data;
    },
    refetchInterval: env.mockMode ? false : 30000, // Don't refetch in mock mode
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

  // Filter pools by status
  const filteredPools = statusFilter === 'all'
    ? pools
    : pools.filter(pool => pool.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mock Mode Banner */}
      {env.mockMode && (
        <div className="bg-yellow-500 text-black px-4 py-1.5 text-center font-bold text-sm">
          🧪 MOCK MODE ENABLED - Using sample data with real Polymarket traders
        </div>
      )}

      {/* Realtime Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-brutal flex items-center space-x-3">
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

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <Link to="/" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 body-font text-sm mb-2">
                <FiArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold comic-font mb-2">
                💥 Betting Arenas
              </h1>
              <p className="text-gray-600 body-font text-lg">
                Choose an arena and bet on which trader will outperform
              </p>
            </div>
            {/* WebSocket Status, Wallet Balance, and Connect Button */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* WebSocket Status Indicator - Hide in mock mode */}
              {!env.mockMode && (
                <>
                  {/* Desktop */}
                  <div className="hidden lg:flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-600 body-font font-medium">
                      {isConnected ? '🟢 Live' : '🔴 Disconnected'}
                    </span>
                  </div>

                  {/* Mobile: Just the dot */}
                  <div className="lg:hidden">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  </div>
                </>
              )}

              {/* Wallet Balance Display */}
              {connected && (
                <div className="hidden md:flex flex-col items-end text-sm">
                  <span className="text-gray-600 body-font text-xs">Wallet</span>
                  <span className="font-bold text-green-600">Connected ({balance.toFixed(2)} SOL)</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'locked', 'active', 'settled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`comic-button px-4 py-2 text-sm border-2 transition-all ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white border-black shadow-brutal'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {status === 'all' ? 'All Arenas' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredPools.length === 0 ? (
          <div className="bg-white comic-card halftone-bg p-12 text-center">
            <div className="text-6xl mb-4">🏟️</div>
            <h3 className="text-2xl font-bold comic-font text-gray-900 mb-2">
              No Arenas Found
            </h3>
            <p className="text-gray-600 body-font mb-6">
              {statusFilter === 'all'
                ? 'There are no arenas at the moment. Check back later!'
                : `No ${statusFilter} arenas available.`
              }
            </p>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="comic-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
              >
                View All Arenas
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 body-font">
                Showing {filteredPools.length} {filteredPools.length === 1 ? 'arena' : 'arenas'}
              </p>
              <button
                onClick={() => refetch()}
                className="text-sm text-blue-600 hover:text-blue-700 body-font font-medium"
              >
                🔄 Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPools.map((pool) => (
                <PoolCard
                  key={pool.id}
                  pool={pool}
                  onClick={(pool) => {
                    navigate(`/arena/${pool.id}`);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
