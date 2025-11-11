import { formatPercent } from "../../utils/formatting";

interface ROIBarChartProps {
  trader1Name: string;
  trader2Name: string;
  trader1Image?: string | null;
  trader2Image?: string | null;
  trader1ROI: number; // Total P&L in dollars
  trader2ROI: number;
  trader1Percent: number; // P&L percentage
  trader2Percent: number;
}

export function ROIBarChart({
  trader1Name,
  trader2Name,
  trader1Image,
  trader2Image,
  trader1ROI,
  trader2ROI,
  trader1Percent,
  trader2Percent,
}: ROIBarChartProps) {
  // Calculate the maximum ROI to scale the bars
  const maxROI = Math.max(Math.abs(trader1ROI), Math.abs(trader2ROI));

  // Calculate bar heights (percentage of max)
  const trader1Height =
    maxROI === 0 ? 50 : (Math.abs(trader1ROI) / maxROI) * 100;
  const trader2Height =
    maxROI === 0 ? 50 : (Math.abs(trader2ROI) / maxROI) * 100;

  // Determine colors based on positive/negative
  const trader1Color =
    trader1ROI >= 0
      ? "from-purple-500 to-purple-600"
      : "from-red-500 to-red-600";
  const trader2Color =
    trader2ROI >= 0 ? "from-blue-500 to-blue-600" : "from-red-500 to-red-600";

  return (
    <div className="bg-white comic-card halftone-bg p-6 my-6">
      <h3 className="text-lg font-bold text-center comic-font mb-6 flex items-center justify-center gap-2">
        <img src="/burst-small.svg" alt="" className="w-5 h-5 text-trader1" />
        ROI COMPARISON
        <img src="/burst-small.svg" alt="" className="w-5 h-5 text-trader2" />
      </h3>

      <div className="flex items-end justify-center gap-8 px-4">
        {/* Trader 1 Bar */}
        <div className="flex flex-col items-center flex-1 max-w-[140px]">
          {/* ROI Percentage Only */}
          <div className="mb-2 text-center">
            <p
              className={`text-xl font-bold comic-font ${trader1ROI >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatPercent(trader1Percent)}
            </p>
          </div>

          {/* Bar */}
          <div className="w-full relative">
            <div
              className={`w-full bg-gradient-to-b ${trader1Color} comic-outline-thin comic-shadow rounded-t-lg relative transition-all duration-500 flex items-end justify-center pb-3`}
              style={{ height: `${Math.max(trader1Height * 1.5, 80)}px` }}
            >
              {/* Avatar at bottom of bar */}
              {trader1Image && (
                <img
                  src={trader1Image}
                  alt={trader1Name}
                  className="w-12 h-12 rounded-full comic-outline-thin bg-white p-0.5"
                />
              )}
            </div>
          </div>

          {/* Trader Name */}
          <div className="mt-2 text-center">
            <p className="text-xs font-bold text-gray-900 truncate w-full">
              {trader1Name.length > 10
                ? trader1Name.substring(0, 10) + "..."
                : trader1Name}
            </p>
          </div>
        </div>

        {/* Trader 2 Bar */}
        <div className="flex flex-col items-center flex-1 max-w-[140px]">
          {/* ROI Percentage Only */}
          <div className="mb-2 text-center">
            <p
              className={`text-xl font-bold comic-font ${trader2ROI >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatPercent(trader2Percent)}
            </p>
          </div>

          {/* Bar */}
          <div className="w-full relative">
            <div
              className={`w-full bg-gradient-to-b ${trader2Color} comic-outline-thin comic-shadow rounded-t-lg relative transition-all duration-500 flex items-end justify-center pb-3`}
              style={{ height: `${Math.max(trader2Height * 1.5, 80)}px` }}
            >
              {/* Avatar at bottom of bar */}
              {trader2Image && (
                <img
                  src={trader2Image}
                  alt={trader2Name}
                  className="w-12 h-12 rounded-full comic-outline-thin bg-white p-0.5"
                />
              )}
            </div>
          </div>

          {/* Trader Name */}
          <div className="mt-2 text-center">
            <p className="text-xs font-bold text-gray-900 truncate w-full">
              {trader2Name.length > 10
                ? trader2Name.substring(0, 10) + "..."
                : trader2Name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
