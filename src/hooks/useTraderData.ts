import { useState, useCallback } from "react";
import {
  fetchTraderPNL,
  fetchPortfolioValue,
  fetchTraderPositions,
  fetchTraderProfile,
} from "../services/polymarketApi";
import { calculateAvgPositionSize } from "../utils/calculations";
import type { TraderData, Timeframe } from "../types";

/**
 * Hook to fetch and manage trader data
 */
export function useTraderData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllTraderData = useCallback(
    async (
      walletAddress: string,
      timeframe: Timeframe,
    ): Promise<TraderData> => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [pnlTimeSeries, portfolioValue, positions, profile] =
          await Promise.all([
            fetchTraderPNL(walletAddress, timeframe),
            fetchPortfolioValue(walletAddress),
            fetchTraderPositions(walletAddress),
            fetchTraderProfile(walletAddress),
          ]);

        // Calculate metrics
        // Use the latest PNL from time-series data (more accurate than summing positions)
        const totalPnl =
          pnlTimeSeries.length > 0
            ? pnlTimeSeries[pnlTimeSeries.length - 1].p
            : 0;

        const avgPositionSize = calculateAvgPositionSize(positions);
        const activePositions = positions.filter(
          (p) => !p.redeemable && p.size > 0,
        ).length;

        // Calculate total P&L percentage
        const totalPnlPercent =
          portfolioValue > 0 ? (totalPnl / portfolioValue) * 100 : 0;

        console.debug(
          `Trader ${walletAddress.slice(0, 6)}: Portfolio=$${portfolioValue.toFixed(2)}, PNL=$${totalPnl.toFixed(2)} (${totalPnlPercent.toFixed(2)}%)`,
        );

        const traderData: TraderData = {
          profile,
          metrics: {
            portfolioValue,
            totalPnl,
            totalPnlPercent,
            activePositions,
            avgPositionSize,
          },
          positions,
          pnlTimeSeries,
        };

        setLoading(false);
        return traderData;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch trader data";
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    [],
  );

  return {
    fetchAllTraderData,
    loading,
    error,
  };
}
