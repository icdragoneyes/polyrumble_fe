import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { HiPencil } from "react-icons/hi";
import { formatTimestamp } from "../../utils/formatting";
import { CustomTooltip } from "./CustomTooltip";
import type { ChartDataPoint } from "../../types";

interface ChartProps {
  data: ChartDataPoint[];
  trader1Name: string;
  trader2Name: string;
  trader1Image?: string | null;
  trader2Image?: string | null;
  onEditTrader1?: () => void;
  onEditTrader2?: () => void;
  hideEditButtons?: boolean;
}

export function Chart({
  data,
  trader1Name,
  trader2Name,
  trader1Image,
  trader2Image,
  onEditTrader1,
  onEditTrader2,
  hideEditButtons = false,
}: ChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white comic-card halftone-bg p-8 text-center text-gray-500 shake">
        <p className="comic-font text-xl">No chart data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white comic-card halftone-bg p-6 slide-in-up">
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center comic-font flex items-center justify-center gap-3">
        <img src="/burst-small.svg" alt="" className="w-6 h-6 text-trader1" />
        Portfolio Growth Comparison
        <img src="/burst-small.svg" alt="" className="w-6 h-6 text-trader2" />
      </h2>
      <p className="text-sm text-gray-600 mb-6 text-center body-font font-medium">
        % Change Over Time
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E7" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTimestamp}
            stroke="#6B7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            stroke="#6B7280"
            style={{ fontSize: "12px" }}
          />
          <Tooltip
            content={
              <CustomTooltip
                trader1Name={trader1Name}
                trader2Name={trader2Name}
              />
            }
          />
          <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />

          <Line
            type="monotone"
            dataKey="trader1Percent"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: "#3B82F6" }}
            name={trader1Name}
          />
          <Line
            type="monotone"
            dataKey="trader2Percent"
            stroke="#F97316"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: "#F97316" }}
            name={trader2Name}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Desktop Legend - Hidden on mobile as it's in the bottom bar */}
      <div className="hidden md:flex flex-col items-center gap-3 mt-6">
        {!hideEditButtons && (
          <p className="text-xs text-gray-500 font-medium">
            Click on traders to change comparison
          </p>
        )}
        <div className="flex justify-center items-center gap-6">
          {/* Trader 1 */}
          <button
            onClick={hideEditButtons ? undefined : onEditTrader1}
            disabled={hideEditButtons}
            className={`group flex items-center gap-2 rounded-lg px-4 py-2.5 transition-all shadow-sm ${
              hideEditButtons
                ? "cursor-default"
                : "hover:bg-blue-50 border-2 border-transparent hover:border-blue-200 cursor-pointer hover:shadow-md"
            }`}
          >
            {trader1Image && (
              <img
                src={trader1Image}
                alt={trader1Name}
                className="w-8 h-8 rounded-full border-2 border-trader1"
              />
            )}
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-trader1 rounded"></div>
              <span className="text-sm font-semibold text-gray-700">
                {trader1Name}
              </span>
            </div>
            {!hideEditButtons && (
              <HiPencil className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            )}
          </button>

          {/* VS Logo */}
          <img src="/vs-logo.svg" alt="VS" className="w-16 h-16" />

          {/* Trader 2 */}
          <button
            onClick={hideEditButtons ? undefined : onEditTrader2}
            disabled={hideEditButtons}
            className={`group flex items-center gap-2 rounded-lg px-4 py-2.5 transition-all shadow-sm ${
              hideEditButtons
                ? "cursor-default"
                : "hover:bg-orange-50 border-2 border-transparent hover:border-orange-200 cursor-pointer hover:shadow-md"
            }`}
          >
            {trader2Image && (
              <img
                src={trader2Image}
                alt={trader2Name}
                className="w-8 h-8 rounded-full border-2 border-trader2"
              />
            )}
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-trader2 rounded"></div>
              <span className="text-sm font-semibold text-gray-700">
                {trader2Name}
              </span>
            </div>
            {!hideEditButtons && (
              <HiPencil className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
