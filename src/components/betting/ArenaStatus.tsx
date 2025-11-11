import { formatDistanceToNow } from 'date-fns';
import type { Pool } from '../../types';

interface ArenaStatusProps {
  pool: Pool;
}

export function ArenaStatus({ pool }: ArenaStatusProps) {
  // Parse timestamps
  const bettingClosesAt = pool.bettingClosesAt ? Number(pool.bettingClosesAt) * 1000 : null;
  const bettingOpensAt = pool.bettingOpensAt ? Number(pool.bettingOpensAt) * 1000 : null;

  // Calculate time remaining
  const timeUntilClose = bettingClosesAt ? formatDistanceToNow(bettingClosesAt, { addSuffix: true }) : 'N/A';

  // Determine status badge
  const getStatusBadge = () => {
    // Handle 'locked' status as grace period equivalent
    if (pool.status === 'locked') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-bold border border-yellow-600 bg-yellow-100 text-yellow-800">
          ⏳ Locked
        </span>
      );
    }

    switch (pool.status) {
      case 'active':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold border border-green-600 bg-green-100 text-green-800">
            🟢 Active
          </span>
        );
      case 'settled':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold border border-gray-600 bg-gray-100 text-gray-800">
            ✅ Settled
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold border border-red-600 bg-red-100 text-red-800">
            ❌ Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold border border-gray-600 bg-gray-100 text-gray-800">
            {pool.status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white comic-card p-2 mb-3">
      <div className="flex items-center justify-between gap-2 text-xs">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {getStatusBadge()}
        </div>

        {/* Timeframe */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <span className="text-gray-600">Timeframe:</span>{' '}
            <span className="font-bold text-gray-900">{pool.timeframeDays || 0}d</span>
          </div>

          {bettingClosesAt && pool.status !== 'settled' && pool.status !== 'cancelled' && (
            <div>
              <span className="text-gray-600 hidden sm:inline">Closes:</span>{' '}
              <span className="font-bold text-gray-900">{timeUntilClose}</span>
            </div>
          )}
        </div>
      </div>

      {/* Locked Period Info */}
      {pool.status === 'locked' && bettingOpensAt && (
        <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-xs text-yellow-800">
            Betting opens {formatDistanceToNow(bettingOpensAt, { addSuffix: true })}
          </p>
        </div>
      )}

      {/* Settlement Info */}
      {pool.status === 'settled' && (
        <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
          <p className="text-xs text-green-800">
            Arena settled. Winners can claim rewards!
          </p>
        </div>
      )}
    </div>
  );
}
