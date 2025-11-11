import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Pool } from '../../types';
import { fetchTraderProfile } from '../../services/polymarketApi';

interface PoolCardProps {
  pool: Pool;
  onClick?: (pool: Pool) => void;
}

export function PoolCard({ pool, onClick }: PoolCardProps) {
  const [traderAName, setTraderAName] = useState<string>('Trader A');
  const [traderBName, setTraderBName] = useState<string>('Trader B');
  const [loadingNames, setLoadingNames] = useState(true);

  // Fetch trader names
  useEffect(() => {
    const loadTraderNames = async () => {
      if (!pool.traderAAddress || !pool.traderBAddress) {
        setLoadingNames(false);
        return;
      }

      try {
        const [profileA, profileB] = await Promise.all([
          fetchTraderProfile(pool.traderAAddress),
          fetchTraderProfile(pool.traderBAddress),
        ]);

        setTraderAName(profileA.name || 'Trader A');
        setTraderBName(profileB.name || 'Trader B');
      } catch (error) {
        console.error('Error loading trader names:', error);
        // Keep default names on error
      } finally {
        setLoadingNames(false);
      }
    };

    loadTraderNames();
  }, [pool.traderAAddress, pool.traderBAddress]);
  const poolAAmount = BigInt(pool.poolATotal || '0');
  const poolBAmount = BigInt(pool.poolBTotal || '0');
  const totalAmount = BigInt(pool.totalPoolSize || '0');

  // Calculate percentages
  const poolAPercent = totalAmount > 0n
    ? Number((poolAAmount * 100n) / totalAmount)
    : 50;
  const poolBPercent = totalAmount > 0n
    ? Number((poolBAmount * 100n) / totalAmount)
    : 50;

  // Format amounts in SOL
  const formatSOL = (amount: bigint) => {
    return (Number(amount) / 1_000_000_000).toFixed(2);
  };

  const bettingClosesTime = pool.bettingClosesAt ? new Date(Number(pool.bettingClosesAt) * 1000) : new Date();
  const timeUntilClose = pool.bettingClosesAt ? formatDistanceToNow(bettingClosesTime, { addSuffix: true }) : 'N/A';

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick?.(pool)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Pool #{pool.poolNumber || 'N/A'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {pool.timeframeDays || 0} Day Competition
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          pool.status === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {pool.status}
        </span>
      </div>

      {/* Traders */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {loadingNames ? 'Loading...' : traderAName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {pool.traderAAddress ? `${pool.traderAAddress.slice(0, 8)}...${pool.traderAAddress.slice(-6)}` : 'N/A'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatSOL(poolAAmount)} SOL
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {poolAPercent.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {loadingNames ? 'Loading...' : traderBName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {pool.traderBAddress ? `${pool.traderBAddress.slice(0, 8)}...${pool.traderBAddress.slice(-6)}` : 'N/A'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {formatSOL(poolBAmount)} SOL
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {poolBPercent.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Total Pool Size */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Pool Size</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {formatSOL(totalAmount)} SOL
          </span>
        </div>
      </div>

      {/* Time Until Close */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Betting closes</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {timeUntilClose}
        </span>
      </div>
    </div>
  );
}
