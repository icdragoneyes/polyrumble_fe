import { useMemo } from 'react';
import { Chart } from '../Chart/Chart';
import type { TraderData, ChartDataPoint } from '../../types';
import { calculatePercentageGrowth, mergeChartData } from '../../utils/calculations';

interface PNLTabContentProps {
  trader1Data: TraderData;
  trader2Data: TraderData;
  trader1Name: string;
  trader2Name: string;
  trader1Image?: string;
  trader2Image?: string;
}

export function PNLTabContent({
  trader1Data,
  trader2Data,
  trader1Name,
  trader2Name,
  trader1Image,
  trader2Image,
}: PNLTabContentProps) {
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!trader1Data || !trader2Data) return [];

    const trader1Growth = calculatePercentageGrowth(
      trader1Data.pnlTimeSeries,
      trader1Data.metrics.portfolioValue,
    );

    const trader2Growth = calculatePercentageGrowth(
      trader2Data.pnlTimeSeries,
      trader2Data.metrics.portfolioValue,
    );

    return mergeChartData(
      trader1Growth,
      trader2Growth,
      trader1Data.pnlTimeSeries,
      trader2Data.pnlTimeSeries,
    );
  }, [trader1Data, trader2Data]);

  return (
    <div className="p-4">
      <Chart
        data={chartData}
        trader1Name={trader1Name}
        trader2Name={trader2Name}
        trader1Image={trader1Image}
        trader2Image={trader2Image}
        onEditTrader1={() => {}}
        onEditTrader2={() => {}}
        hideEditButtons={true}
      />
    </div>
  );
}
