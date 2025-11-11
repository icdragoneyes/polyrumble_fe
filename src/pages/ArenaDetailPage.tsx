/**
 * Arena Detail Page - Merged Implementation
 * Combines trader comparison (from kin/phase-0) with betting interface (from master)
 * Shows side-by-side trader comparison with charts + betting pools
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { api } from "../services/api";
import { useWebSocket } from "../hooks/useWebSocket";
import { useTraderData } from "../hooks/useTraderData";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { Chart } from "../components/Chart/Chart";
import { TraderCard } from "../components/TraderCard/TraderCard";
import { ROIBarChart } from "../components/comparison/ROIBarChart";
import { BettingPanel } from "../components/betting/BettingPanel";
import { ArenaStatus } from "../components/betting/ArenaStatus";
import { ErrorDisplay } from "../components/common/ErrorDisplay";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import {
  calculatePercentageGrowth,
  mergeChartData,
} from "../utils/calculations";
import type { TraderData, ChartDataPoint } from "../types";
import { FiArrowLeft, FiCopy, FiCheck } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

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

  // Fetch pool/arena data from backend
  const { data: poolResponse, isLoading: poolLoading, error: poolError } = useQuery({
    queryKey: ['pool', id],
    queryFn: async () => {
      if (!id) throw new Error('Pool ID is required');
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

  // Calculate chart data
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!trader1Data || !trader2Data) return [];

    const trader1Growth = calculatePercentageGrowth(
      trader1Data.pnlTimeSeries,
      trader1Data.metrics.portfolioValue,
    );

    const trader2Growth = calculatePercentageGrowth(
      trader2Data.pnlTimeSeries,
      trader2Data.metrics.portfolioValue,
    );

    return mergeChartData(
      trader1Growth,
      trader2Growth,
      trader1Data.pnlTimeSeries,
      trader2Data.pnlTimeSeries,
    );
  }, [trader1Data, trader2Data]);

  // Calculate timeframe-specific ROI
  const timeframeROI = useMemo(() => {
    if (!trader1Data || !trader2Data || chartData.length === 0) {
      return {
        trader1ROI: 0,
        trader2ROI: 0,
        trader1Percent: 0,
        trader2Percent: 0,
      };
    }

    const lastPoint = chartData[chartData.length - 1];
    const trader1Percent = lastPoint.trader1Percent;
    const trader2Percent = lastPoint.trader2Percent;

    const trader1ROI =
      (trader1Percent / 100) * trader1Data.metrics.portfolioValue;
    const trader2ROI =
      (trader2Percent / 100) * trader2Data.metrics.portfolioValue;

    return {
      trader1ROI,
      trader2ROI,
      trader1Percent,
      trader2Percent,
    };
  }, [trader1Data, trader2Data, chartData]);

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
    <div className="min-h-screen bg-gray-50">
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

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <Link
            to="/arenas"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 body-font font-medium"
          >
            <FiArrowLeft />
            Back to Arenas
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold comic-font mb-2">
                💥🥊 {traderAName} vs {traderBName}
              </h1>
              <p className="text-gray-600 body-font">
                Pool #{pool.poolNumber} • {pool.timeframeDays}-day competition • Status: {pool.status}
              </p>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="comic-button bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-4 py-2 flex items-center gap-2"
                title="Copy link"
              >
                {copied ? (
                  <>
                    <FiCheck className="w-4 h-4" />
                    <span className="body-font">Copied!</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="w-4 h-4" />
                    <span className="body-font hidden sm:inline">
                      Copy Link
                    </span>
                  </>
                )}
              </button>
              <button
                onClick={handleTwitterShare}
                disabled={!trader1Data || !trader2Data}
                className="comic-button bg-black hover:bg-gray-800 text-white px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Share on Twitter"
              >
                <FaXTwitter className="w-4 h-4" />
                <span className="body-font hidden sm:inline">Share</span>
              </button>
              {/* WebSocket Status */}
              <div className="flex items-center gap-2 ml-4">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600 hidden md:inline">
                  {isConnected ? 'Live' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Arena Status */}
        <ArenaStatus pool={pool} />

        {/* Betting Panel */}
        <BettingPanel
          pool={pool}
          onPlaceBet={async (traderChoice, amount, signature) => {
            // Show success notification
            setNotification(
              `Bet placed successfully! ${amount} SOL on Trader ${traderChoice === 0 ? 'A' : 'B'}. Transaction: ${signature.slice(0, 8)}...`
            );
            setTimeout(() => setNotification(null), 8000);
          }}
        />

        {/* Error state */}
        {error && <ErrorDisplay error={error} onRetry={fetchTraderData} />}

        {/* Loading state */}
        {loading && <LoadingSpinner />}

        {/* Trader Comparison Section */}
        {trader1Data && trader2Data && !loading && (
          <>
            {/* Chart */}
            <div className="mb-8">
              <Chart
                data={chartData}
                trader1Name={traderAName}
                trader2Name={traderBName}
                trader1Image={traderAImage}
                trader2Image={traderBImage}
                onEditTrader1={() => {}}
                onEditTrader2={() => {}}
                hideEditButtons={true}
              />
            </div>

            {/* ROI Bar Chart - Mobile Only */}
            <div className="block md:hidden mb-8">
              <ROIBarChart
                trader1Name={traderAName}
                trader2Name={traderBName}
                trader1Image={traderAImage}
                trader2Image={traderBImage}
                trader1ROI={timeframeROI.trader1ROI}
                trader2ROI={timeframeROI.trader2ROI}
                trader1Percent={timeframeROI.trader1Percent}
                trader2Percent={timeframeROI.trader2Percent}
              />
            </div>

            {/* Trader Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TraderCard
                traderData={trader1Data}
                traderColor="#3B82F6"
                traderNumber={1}
                bio={trader1Data.profile.bio}
                walletAddress={pool.traderAAddress || ''}
              />
              <TraderCard
                traderData={trader2Data}
                traderColor="#F97316"
                traderNumber={2}
                bio={trader2Data.profile.bio}
                walletAddress={pool.traderBAddress || ''}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
