import { formatDistanceToNow } from 'date-fns';

interface Pool {
  id: string;
  rumbleId: string;
  poolNumber: number;
  traderAAddress: string;
  traderBAddress: string;
  timeframeDays: number;
  poolATotal: string;
  poolBTotal: string;
  totalPoolSize: string;
  status: string;
  bettingOpensAt: string;
  bettingClosesAt: string;
  gracePeriodEndsAt: string;
  createdAt: string;
}

interface PoolCardProps {
  pool: Pool;
  onClick?: (pool: Pool) => void;
}

export function PoolCard({ pool, onClick }: PoolCardProps) {
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

  const bettingClosesTime = new Date(Number(pool.bettingClosesAt) * 1000);
  const timeUntilClose = formatDistanceToNow(bettingClosesTime, { addSuffix: true });

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick?.(pool)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Pool #{pool.poolNumber}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {pool.timeframeDays} Day Competition
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          pool.status === 'Active'
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
              Trader A
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {pool.traderAAddress.slice(0, 8)}...{pool.traderAAddress.slice(-6)}
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
              Trader B
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {pool.traderBAddress.slice(0, 8)}...{pool.traderBAddress.slice(-6)}
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
