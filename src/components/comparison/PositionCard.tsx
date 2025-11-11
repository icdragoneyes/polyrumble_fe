import clsx from "clsx";
import { formatCurrency, formatPercent } from "../../utils/formatting";
import { getPositionSide } from "../../utils/calculations";
import type { Position } from "../../types";

interface PositionCardProps {
  position: Position;
}

export function PositionCard({ position }: PositionCardProps) {
  const isProfit = position.cashPnl > 0;

  return (
    <div
      className={clsx(
        "bg-gray-50 rounded-lg p-4 comic-outline-thin transition-all hover:-translate-y-1",
        isProfit
          ? "border-left-positive hover:comic-shadow"
          : "border-left-negative hover:comic-shadow",
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        {position.icon && (
          <img
            src={position.icon}
            alt=""
            className="w-10 h-10 flex-shrink-0 object-cover comic-outline-thin"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <span
              className={clsx(
                "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide comic-font border-2 border-black",
                getPositionSide(position).toLowerCase() === "yes"
                  ? "bg-green-100 text-green-800"
                  : getPositionSide(position).toLowerCase() === "no"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800",
              )}
            >
              {getPositionSide(position)}
            </span>
          </div>
          <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
            {position.title}
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Size</p>
          <p className="font-medium text-gray-900">
            {position.size.toFixed(2)} tokens
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Entry Price</p>
          <p className="font-medium text-gray-900">
            ${position.avgPrice.toFixed(4)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Current Price</p>
          <p className="font-medium text-gray-900">
            ${position.curPrice.toFixed(4)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">P&L</p>
          <p
            className={clsx(
              "font-bold",
              isProfit ? "text-positive" : "text-negative",
            )}
          >
            {formatCurrency(position.cashPnl)}
            <span className="text-xs ml-1">
              ({formatPercent(position.percentPnl)})
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
