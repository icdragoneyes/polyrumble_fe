import clsx from "clsx";
import type { Timeframe } from "../../types";

interface TimeRangeSelectorProps {
  selected: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

const timeframes: Timeframe[] = [7, 30, 90];

export function TimeRangeSelector({
  selected,
  onChange,
}: TimeRangeSelectorProps) {
  return (
    <div className="flex justify-center my-6">
      <div className="inline-flex gap-3">
        {timeframes.map((days) => (
          <button
            key={days}
            onClick={() => onChange(days)}
            className={clsx(
              "px-6 py-2 rounded-full font-bold transition-all comic-font border-3",
              selected === days
                ? "bg-trader1 text-white comic-outline-thick comic-shadow scale-105"
                : "bg-white text-black comic-outline border-dashed hover:bg-blue-50 hover:scale-102",
            )}
            aria-label={`${days} day timeframe`}
            aria-pressed={selected === days}
          >
            {days}D
          </button>
        ))}
      </div>
    </div>
  );
}
