import clsx from "clsx";
import { HiPencil } from "react-icons/hi";
import type { Timeframe } from "../../types";

interface MobileBottomBarProps {
  trader1Name: string;
  trader2Name: string;
  trader1Image?: string | null;
  trader2Image?: string | null;
  selectedTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
  onEditTrader1: () => void;
  onEditTrader2: () => void;
}

const timeframes: Timeframe[] = [7, 30, 90];

export function MobileBottomBar({
  trader1Name,
  trader2Name,
  trader1Image,
  trader2Image,
  selectedTimeframe,
  onTimeframeChange,
  onEditTrader1,
  onEditTrader2,
}: MobileBottomBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black comic-shadow-lg z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Traders Row - Matching Chart Legend Design */}
        <div className="flex items-center justify-center gap-4 mb-3">
          {/* Trader 1 */}
          <button
            onClick={onEditTrader1}
            className="group flex items-center gap-2 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200 rounded-lg px-3 py-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
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
              <span className="text-sm font-semibold text-gray-700 max-w-[70px] truncate">
                {trader1Name}
              </span>
            </div>
            <HiPencil className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* VS Logo */}
          <img
            src="/vs-logo.svg"
            alt="VS"
            className="w-12 h-12 flex-shrink-0"
          />

          {/* Trader 2 */}
          <button
            onClick={onEditTrader2}
            className="group flex items-center gap-2 hover:bg-orange-50 border-2 border-transparent hover:border-orange-200 rounded-lg px-3 py-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
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
              <span className="text-sm font-semibold text-gray-700 max-w-[70px] truncate">
                {trader2Name}
              </span>
            </div>
            <HiPencil className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
          </button>
        </div>

        {/* Timeframe Selector Row */}
        <div className="flex justify-center gap-2">
          {timeframes.map((days) => (
            <button
              key={days}
              onClick={() => onTimeframeChange(days)}
              className={clsx(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all comic-font border-2",
                selectedTimeframe === days
                  ? "bg-trader1 text-white border-black shadow-[2px_2px_0px_#1A1A1A]"
                  : "bg-white text-black border-black border-dashed hover:bg-blue-50",
              )}
              aria-label={`${days} day timeframe`}
              aria-pressed={selectedTimeframe === days}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
