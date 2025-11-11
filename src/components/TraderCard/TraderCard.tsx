import { useMemo, useState } from "react";
import { HiClipboardCopy, HiCheck } from "react-icons/hi";
import { formatCurrency, formatPercent } from "../../utils/formatting";
import { getTopPositions } from "../../utils/calculations";
import { PositionCard } from "../comparison/PositionCard";
import { truncateAddress } from "../../utils/validation";
import type { TraderData } from "../../types";

interface TraderCardProps {
  traderData: TraderData;
  traderColor: string;
  traderNumber: number;
  bio?: string;
  walletAddress: string;
}

export function TraderCard({
  traderData,
  traderColor,
  traderNumber,
  bio,
  walletAddress,
}: TraderCardProps) {
  const [copied, setCopied] = useState(false);

  const topPositions = useMemo(
    () => getTopPositions(traderData.positions, 5),
    [traderData.positions],
  );

  const { profile, metrics } = traderData;
  const isPositivePnl = metrics.totalPnl > 0;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const cardClass =
    traderNumber === 1 ? "comic-card-trader1" : "comic-card-trader2";
  const halftoneClass =
    traderNumber === 1 ? "halftone-bg-trader1" : "halftone-bg-trader2";

  return (
    <div
      className={`comic-card ${cardClass} ${halftoneClass} ${traderNumber === 1 ? "slide-in-left" : "slide-in-right"} overflow-hidden`}
    >
      {/* Profile Section */}
      <div className="p-6 bg-white min-h-[140px]">
        <div className="flex items-start gap-4">
          <img
            src={
              profile.profileImageOptimized ||
              profile.profileImage ||
              `https://ui-avatars.com/api/?name=Trader+${traderNumber}&background=random`
            }
            alt={profile.name}
            className="w-12 h-12 rounded-full comic-outline-thin comic-shadow"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {profile.name}
            </h3>
            <div className="h-8 mt-1">
              {bio && (
                <p className="text-xs text-gray-600 line-clamp-2">{bio}</p>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500">
                {truncateAddress(walletAddress)}
              </span>
              <button
                onClick={handleCopyAddress}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy wallet address"
              >
                {copied ? (
                  <HiCheck className="w-3 h-3 text-green-500" />
                ) : (
                  <HiClipboardCopy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="p-6 border-t-2 border-black border-dashed">
        <h4 className="text-base font-bold text-gray-900 mb-4 comic-font flex items-center gap-2">
          <img
            src="/burst-small.svg"
            alt=""
            className="w-4 h-4"
            style={{ color: traderColor }}
          />
          Key Metrics
        </h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">
              Total Value
            </p>
            <p className="text-base font-semibold text-gray-900">
              {formatCurrency(metrics.portfolioValue)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Total P&L</p>
            <p
              className={`text-base font-semibold ${
                isPositivePnl ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(metrics.totalPnl)}{" "}
              <span className="text-sm">
                ({formatPercent(metrics.totalPnlPercent)})
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">
              Active Positions
            </p>
            <p className="text-base font-semibold text-gray-900">
              {metrics.activePositions}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">
              Avg Position Size
            </p>
            <p className="text-base font-semibold text-gray-900">
              {formatCurrency(metrics.avgPositionSize)}
            </p>
          </div>
        </div>
      </div>

      {/* Top Positions Section */}
      <div className="p-6 border-t-2 border-black border-dashed">
        <h4 className="text-base font-bold text-gray-900 mb-4 comic-font flex items-center gap-2">
          <img
            src="/burst-small.svg"
            alt=""
            className="w-4 h-4"
            style={{ color: traderColor }}
          />
          Top 5 Positions
        </h4>
        {topPositions.length > 0 ? (
          <div className="space-y-3">
            {topPositions.map((position, index) => (
              <PositionCard key={index} position={position} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No positions found</p>
        )}
      </div>
    </div>
  );
}
