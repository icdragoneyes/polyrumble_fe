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
        <span className="px-4 py-2 rounded-full text-sm font-bold border-2 border-yellow-600 bg-yellow-100 text-yellow-800">
          ⏳ Locked
        </span>
      );
    }

    switch (pool.status) {
      case 'active':
        return (
          <span className="px-4 py-2 rounded-full text-sm font-bold border-2 border-green-600 bg-green-100 text-green-800">
            🟢 Active
          </span>
        );
      case 'settled':
        return (
          <span className="px-4 py-2 rounded-full text-sm font-bold border-2 border-gray-600 bg-gray-100 text-gray-800">
            ✅ Settled
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-4 py-2 rounded-full text-sm font-bold border-2 border-red-600 bg-red-100 text-red-800">
            ❌ Cancelled
          </span>
        );
      default:
        return (
          <span className="px-4 py-2 rounded-full text-sm font-bold border-2 border-gray-600 bg-gray-100 text-gray-800">
            {pool.status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white comic-card p-4 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <div className="text-sm text-gray-600">
            Pool #{pool.poolNumber || pool.id}
          </div>
        </div>

        {/* Timeframe */}
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-gray-600">Timeframe:</span>{' '}
            <span className="font-bold text-gray-900">{pool.timeframeDays || 0} Days</span>
          </div>

          {bettingClosesAt && pool.status !== 'settled' && pool.status !== 'cancelled' && (
            <div>
              <span className="text-gray-600">Betting closes:</span>{' '}
              <span className="font-bold text-gray-900">{timeUntilClose}</span>
            </div>
          )}
        </div>
      </div>

      {/* Locked Period Info */}
      {pool.status === 'locked' && bettingOpensAt && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Locked:</strong> Betting will open{' '}
            {formatDistanceToNow(bettingOpensAt, { addSuffix: true })}.
            The competition has already started!
          </p>
        </div>
      )}

      {/* Settlement Info */}
      {pool.status === 'settled' && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border-2 border-green-200">
          <p className="text-sm text-green-800">
            <strong>Settled:</strong> This arena has been settled. Winners can claim their rewards!
          </p>
        </div>
      )}
    </div>
  );
}
