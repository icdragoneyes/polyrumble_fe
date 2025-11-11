import type { PNLDataPoint, ChartDataPoint, Position } from "../types";

/**
 * Calculate PNL percentage growth from PNL data
 *
 * The PNL API returns cumulative realized P&L over time.
 * We show the percentage change in PNL from the starting point.
 *
 * Note: We use PNL growth, not portfolio value, because:
 * - Traders can withdraw profits (PNL increases but portfolio decreases)
 * - Unrealized losses don't show in realized PNL
 * - This matches how Polymarket displays trader performance
 *
 * Formula: PNL % Change = ((PNL at T - Starting PNL) / |Starting PNL|) * 100
 */
export function calculatePercentageGrowth(
  pnlData: PNLDataPoint[],
  _currentValue: number, // Kept for API compatibility but not used in PNL-based calculation
  commonStartTimestamp?: number,
): Array<{ timestamp: number; percentage: number; value: number }> {
  if (pnlData.length === 0) return [];

  // Filter data to common starting point if provided
  let filteredData = pnlData;
  if (commonStartTimestamp) {
    filteredData = pnlData.filter((point) => point.t >= commonStartTimestamp);
  }

  if (filteredData.length === 0) return [];

  const firstPnl = filteredData[0].p;

  // Use absolute value of first PNL as base for percentage calculation
  // This ensures we always get positive percentages for profit growth
  const basePnl = Math.abs(firstPnl) || 100; // Use 100 if starting PNL is 0

  return filteredData.map((point) => {
    // Calculate PNL change from starting point
    const pnlChange = point.p - firstPnl;

    // Calculate percentage change based on starting PNL
    const percentChange = (pnlChange / basePnl) * 100;

    // For display value, show the actual PNL at this point
    const displayValue = point.p;

    return {
      timestamp: point.t,
      percentage: percentChange,
      value: displayValue,
    };
  });
}

/**
 * Merge two traders' data into chart format
 */
export function mergeChartData(
  trader1Data: Array<{ timestamp: number; percentage: number; value: number }>,
  trader2Data: Array<{ timestamp: number; percentage: number; value: number }>,
  trader1Pnl: PNLDataPoint[],
  trader2Pnl: PNLDataPoint[],
): ChartDataPoint[] {
  // Create lookup maps for PNL data by timestamp
  const trader1PnlMap = new Map(trader1Pnl.map((point) => [point.t, point.p]));
  const trader2PnlMap = new Map(trader2Pnl.map((point) => [point.t, point.p]));

  // Create a map of timestamps to data
  const dataMap = new Map<number, Partial<ChartDataPoint>>();

  // Add trader 1 data - match by timestamp instead of index
  trader1Data.forEach((point) => {
    dataMap.set(point.timestamp, {
      timestamp: point.timestamp,
      trader1Percent: point.percentage,
      trader1Value: point.value,
      trader1RealizedPnl: trader1PnlMap.get(point.timestamp) || 0,
      trader1UnrealizedPnl: 0, // Will be calculated if needed
    });
  });

  // Add trader 2 data - match by timestamp instead of index
  trader2Data.forEach((point) => {
    const existing = dataMap.get(point.timestamp) || {
      timestamp: point.timestamp,
    };
    dataMap.set(point.timestamp, {
      ...existing,
      trader2Percent: point.percentage,
      trader2Value: point.value,
      trader2RealizedPnl: trader2PnlMap.get(point.timestamp) || 0,
      trader2UnrealizedPnl: 0,
    });
  });

  // Convert to array and sort by timestamp
  return Array.from(dataMap.values())
    .sort((a, b) => a.timestamp! - b.timestamp!)
    .map((point) => ({
      timestamp: point.timestamp || 0,
      trader1Percent: point.trader1Percent || 0,
      trader2Percent: point.trader2Percent || 0,
      trader1Value: point.trader1Value || 0,
      trader2Value: point.trader2Value || 0,
      trader1RealizedPnl: point.trader1RealizedPnl || 0,
      trader1UnrealizedPnl: point.trader1UnrealizedPnl || 0,
      trader2RealizedPnl: point.trader2RealizedPnl || 0,
      trader2UnrealizedPnl: point.trader2UnrealizedPnl || 0,
    }));
}

/**
 * Calculate total P&L from positions
 */
export function calculateTotalPnl(positions: Position[]): {
  totalPnl: number;
  totalValue: number;
} {
  const totalPnl = positions.reduce((sum, pos) => sum + pos.cashPnl, 0);
  const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);

  return { totalPnl, totalValue };
}

/**
 * Calculate average position size
 */
export function calculateAvgPositionSize(positions: Position[]): number {
  if (positions.length === 0) return 0;
  const total = positions.reduce((sum, pos) => sum + pos.currentValue, 0);
  return total / positions.length;
}

/**
 * Get top N positions by cash P&L (highest positive to lowest)
 */
export function getTopPositions(
  positions: Position[],
  n: number = 5,
): Position[] {
  return [...positions].sort((a, b) => b.cashPnl - a.cashPnl).slice(0, n);
}

/**
 * Get position side display text
 */
export function getPositionSide(position: Position): string {
  return position.outcome;
}
