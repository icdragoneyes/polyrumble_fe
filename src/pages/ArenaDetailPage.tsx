/**
 * Arena Detail Page - Merged Implementation
 * Combines trader comparison (from kin/phase-0) with betting interface (from master)
 * Shows side-by-side trader comparison with charts + betting pools
 */

import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { api } from "../services/api";
import { useWebSocket } from "../hooks/useWebSocket";
import { useTraderData } from "../hooks/useTraderData";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { StickyBottomPanel } from "../components/arena/StickyBottomPanel";
import { CompactBettingPanel } from "../components/arena/CompactBettingPanel";
import { PNLTabContent } from "../components/arena/PNLTabContent";
import { MetricsTabContent } from "../components/arena/MetricsTabContent";
import { PositionsTabContent } from "../components/arena/PositionsTabContent";
import { ErrorDisplay } from "../components/common/ErrorDisplay";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import type { TraderData } from "../types";
import { FiArrowLeft, FiCopy, FiCheck } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { env } from "../config/env";
import { isMockArenaId, getMockArenaById } from "../constants/mockData";

export default function ArenaDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Pool/Arena data state
  const [notification, setNotification] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Trader data state
  const [trader1Data, setTrader1Data] = useState<TraderData | null>(null);
  const [trader2Data, setTrader2Data] = useState<TraderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { fetchAllTraderData, loading } = useTraderData();
  const { isConnected, onPoolUpdated, onPoolStatusChanged } = useWebSocket();

  // Check if this is a mock arena
  const isMockArena = id ? isMockArenaId(id) : false;

  // Fetch pool/arena data from backend (or use mock data)
  const { data: poolResponse, isLoading: poolLoading, error: poolError } = useQuery({
    queryKey: ['pool', id],
    queryFn: async () => {
      if (!id) throw new Error('Pool ID is required');

      // If mock mode and mock arena, return mock data
      if (env.mockMode && isMockArena) {
        const mockPool = getMockArenaById(id);
        if (!mockPool) throw new Error('Mock arena not found');
        return {
          success: true,
          data: mockPool,
        };
      }

      // Otherwise fetch from API
      const response = await api.pools.get(id);
      return response.data;
    },
    enabled: !!id,
  });

  const pool = poolResponse?.data;

  // Fetch trader data when pool is loaded
  const fetchTraderData = useCallback(async () => {
    if (!pool || !pool.traderAAddress || !pool.traderBAddress || !pool.timeframeDays) return;

    try {
      setError(null);
      const [data1, data2] = await Promise.all([
        fetchAllTraderData(pool.traderAAddress, pool.timeframeDays as 7 | 30 | 90),
        fetchAllTraderData(pool.traderBAddress, pool.timeframeDays as 7 | 30 | 90),
      ]);

      setTrader1Data(data1);
      setTrader2Data(data2);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch trader data",
      );
      console.error("Error fetching trader data:", err);
    }
  }, [pool, fetchAllTraderData]);

  useEffect(() => {
    if (pool && !poolLoading) {
      fetchTraderData();
    }
  }, [pool, poolLoading, fetchTraderData]);

  // Setup WebSocket event listeners for real-time updates
  useEffect(() => {
    if (!pool) return;

    const cleanupPoolUpdated = onPoolUpdated((event) => {
      if (event.data.poolId === pool.id) {
        setNotification(`Pool updated! New total: ${(Number(event.data.totalPoolSize) / 1_000_000_000).toFixed(2)} SOL`);
        setTimeout(() => setNotification(null), 5000);
      }
    });

    const cleanupPoolStatusChanged = onPoolStatusChanged((event) => {
      if (event.data.poolId === pool.id && event.data.metadata?.alert) {
        setNotification(event.data.metadata.alert);
        setTimeout(() => setNotification(null), 5000);
      }
    });

    return () => {
      cleanupPoolUpdated();
      cleanupPoolStatusChanged();
    };
  }, [pool, onPoolUpdated, onPoolStatusChanged]);


  // Auto-refresh trader data every 5 minutes
  useAutoRefresh(
    fetchTraderData,
    300000,
    !!trader1Data && !!trader2Data,
  );

  // Share functionality
  const handleCopyLink = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleTwitterShare = useCallback(() => {
    if (!pool || !trader1Data || !trader2Data) return;

    const traderAName = trader1Data.profile.name || "Trader A";
    const traderBName = trader2Data.profile.name || "Trader B";
    const url = window.location.href;
    const text = `Check out this PolyRumble arena: ${traderAName} vs ${traderBName}! Who will win?`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  }, [pool, trader1Data, trader2Data]);

  // Loading state
  if (poolLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  // Error state - pool not found
  if (poolError || !pool) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <ErrorDisplay
            error={poolError instanceof Error ? poolError.message : "Arena not found"}
            onRetry={() => window.location.reload()}
          />
          <div className="text-center mt-6">
            <Link
              to="/arenas"
              className="inline-flex items-center gap-2 comic-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
            >
              <FiArrowLeft />
              Back to Arenas
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Format trader names and images
  const traderAName = trader1Data?.profile.name || "Trader A";
  const traderBName = trader2Data?.profile.name || "Trader B";
  const traderAImage =
    trader1Data?.profile.profileImageOptimized ||
    trader1Data?.profile.profileImage;
  const traderBImage =
    trader2Data?.profile.profileImageOptimized ||
    trader2Data?.profile.profileImage;

  return (
    <div className="min-h-screen bg-gray-50 pb-[500px]">
      {/* Mock Mode Banner */}
      {env.mockMode && isMockArena && (
        <div className="bg-yellow-500 text-black px-2 py-1 text-center font-bold text-xs">
          🧪 MOCK MODE - Sample arena with real Polymarket trader data. Betting is simulated.
        </div>
      )}

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

      <main className="container mx-auto px-4 py-2 max-w-7xl">
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <Link
              to="/arenas"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 body-font text-sm"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>

            <h1 className="text-lg md:text-xl font-bold comic-font leading-tight">
              {traderAName} vs {traderBName}
            </h1>
          </div>

          {/* Status and Share */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full font-bold border text-xs ${
              pool.status === 'active'
                ? 'border-green-600 bg-green-100 text-green-800'
                : pool.status === 'locked'
                ? 'border-yellow-600 bg-yellow-100 text-yellow-800'
                : pool.status === 'settled'
                ? 'border-gray-600 bg-gray-100 text-gray-800'
                : 'border-red-600 bg-red-100 text-red-800'
            }`}>
              {pool.status === 'active' ? '🟢 Active' : pool.status === 'locked' ? '⏳ Locked' : pool.status === 'settled' ? '✅ Settled' : '❌ Cancelled'}
            </span>
            <span className="text-gray-600 text-xs">#{pool.poolNumber}</span>
            <span className="text-gray-600 text-xs">•</span>
            <span className="text-gray-600 text-xs">{pool.timeframeDays}d</span>
            <span className="text-gray-600 text-xs">•</span>
            <span className="font-bold text-gray-900 text-sm">
              {((Number(pool.totalPoolSize) || 0) / 1_000_000_000).toFixed(2)} SOL
            </span>

            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={handleCopyLink}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Copy link"
              >
                {copied ? <FiCheck className="w-4 h-4 text-green-600" /> : <FiCopy className="w-4 h-4 text-gray-600" />}
              </button>
              <button
                onClick={handleTwitterShare}
                disabled={!trader1Data || !trader2Data}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                title="Share on Twitter"
              >
                <FaXTwitter className="w-4 h-4 text-gray-900" />
              </button>
              <div className={`w-2 h-2 rounded-full ml-1 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && <ErrorDisplay error={error} onRetry={fetchTraderData} />}

        {/* Loading state */}
        {loading && <LoadingSpinner />}
      </main>

      {/* Sticky Bottom Panel with Tabs */}
      {trader1Data && trader2Data && !loading && (
        <StickyBottomPanel
          poolInfoSection={
            <CompactBettingPanel
              pool={pool}
              traderAName={traderAName}
              traderBName={traderBName}
              traderAImage={traderAImage || undefined}
              traderBImage={traderBImage || undefined}
              traderAData={trader1Data}
              traderBData={trader2Data}
              onPlaceBet={async (traderChoice, amount, signature) => {
                setNotification(
                  `Bet placed successfully! ${amount} SOL on Trader ${traderChoice === 0 ? 'A' : 'B'}. Transaction: ${signature.slice(0, 8)}...`
                );
                setTimeout(() => setNotification(null), 8000);
              }}
            />
          }
          pnlContent={
            <PNLTabContent
              trader1Data={trader1Data}
              trader2Data={trader2Data}
              trader1Name={traderAName}
              trader2Name={traderBName}
              trader1Image={traderAImage || undefined}
              trader2Image={traderBImage || undefined}
            />
          }
          metricsContent={
            <MetricsTabContent
              trader1Data={trader1Data}
              trader2Data={trader2Data}
              trader1Name={traderAName}
              trader2Name={traderBName}
              trader1Image={traderAImage || undefined}
              trader2Image={traderBImage || undefined}
            />
          }
          positionsContent={
            <PositionsTabContent
              trader1Data={trader1Data}
              trader2Data={trader2Data}
              trader1Name={traderAName}
              trader2Name={traderBName}
              trader1Image={traderAImage || undefined}
              trader2Image={traderBImage || undefined}
            />
          }
        />
      )}
    </div>
  );
}
