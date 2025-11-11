import { useMemo } from 'react';
import { getTopPositions } from '../../utils/calculations';
import { PositionCard } from '../comparison/PositionCard';
import type { TraderData } from '../../types';

interface PositionsTabContentProps {
  trader1Data: TraderData;
  trader2Data: TraderData;
  trader1Name: string;
  trader2Name: string;
  trader1Image?: string;
  trader2Image?: string;
}

export function PositionsTabContent({
  trader1Data,
  trader2Data,
  trader1Name,
  trader2Name,
  trader1Image,
  trader2Image,
}: PositionsTabContentProps) {
  const trader1TopPositions = useMemo(
    () => getTopPositions(trader1Data.positions, 5),
    [trader1Data.positions],
  );

  const trader2TopPositions = useMemo(
    () => getTopPositions(trader2Data.positions, 5),
    [trader2Data.positions],
  );

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trader 1 Positions */}
        <div>
          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-blue-600">
            {trader1Image && (
              <img
                src={trader1Image}
                alt={trader1Name}
                className="w-10 h-10 rounded-full border-2 border-blue-600"
              />
            )}
            <h3 className="text-lg font-bold text-blue-600 comic-font">
              {trader1Name} - Top 5 Positions
            </h3>
          </div>
          {trader1TopPositions.length > 0 ? (
            <div className="space-y-2">
              {trader1TopPositions.map((position, index) => (
                <PositionCard key={index} position={position} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No positions found</p>
          )}
        </div>

        {/* Trader 2 Positions */}
        <div>
          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-orange-600">
            {trader2Image && (
              <img
                src={trader2Image}
                alt={trader2Name}
                className="w-10 h-10 rounded-full border-2 border-orange-600"
              />
            )}
            <h3 className="text-lg font-bold text-orange-600 comic-font">
              {trader2Name} - Top 5 Positions
            </h3>
          </div>
          {trader2TopPositions.length > 0 ? (
            <div className="space-y-2">
              {trader2TopPositions.map((position, index) => (
                <PositionCard key={index} position={position} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No positions found</p>
          )}
        </div>
      </div>
    </div>
  );
}
