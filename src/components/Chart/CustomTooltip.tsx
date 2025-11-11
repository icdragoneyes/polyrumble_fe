import {
  formatDate,
  formatCurrency,
  formatPercent,
} from "../../utils/formatting";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  trader1Name: string;
  trader2Name: string;
}

export function CustomTooltip({
  active,
  payload,
  trader1Name,
  trader2Name,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[280px]">
      <p className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
        {formatDate(data.timestamp)}
      </p>

      {/* Trader 1 Section */}
      <div className="mb-3 pb-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-trader1 mb-2">{trader1Name}</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Growth:</span>
            <span
              className={`font-semibold ${
                data.trader1Percent >= 0 ? "text-positive" : "text-negative"
              }`}
            >
              {formatPercent(data.trader1Percent)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Portfolio Value:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(data.trader1Value)}
            </span>
          </div>
        </div>
      </div>

      {/* Trader 2 Section */}
      <div>
        <p className="text-sm font-semibold text-trader2 mb-2">{trader2Name}</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Growth:</span>
            <span
              className={`font-semibold ${
                data.trader2Percent >= 0 ? "text-positive" : "text-negative"
              }`}
            >
              {formatPercent(data.trader2Percent)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Portfolio Value:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(data.trader2Value)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
