import { formatCurrency, formatPercent } from '../../utils/formatting';
import type { TraderData } from '../../types';

interface MetricsTabContentProps {
  trader1Data: TraderData;
  trader2Data: TraderData;
  trader1Name: string;
  trader2Name: string;
  trader1Image?: string;
  trader2Image?: string;
}

export function MetricsTabContent({
  trader1Data,
  trader2Data,
  trader1Name,
  trader2Name,
  trader1Image,
  trader2Image,
}: MetricsTabContentProps) {
  const metrics = [
    {
      label: 'Total Value',
      trader1: formatCurrency(trader1Data.metrics.portfolioValue),
      trader2: formatCurrency(trader2Data.metrics.portfolioValue),
      icon: '💰',
    },
    {
      label: 'Total P&L',
      trader1: formatCurrency(trader1Data.metrics.totalPnl),
      trader2: formatCurrency(trader2Data.metrics.totalPnl),
      trader1Color: trader1Data.metrics.totalPnl > 0 ? 'text-green-600' : 'text-red-600',
      trader2Color: trader2Data.metrics.totalPnl > 0 ? 'text-green-600' : 'text-red-600',
      icon: '📊',
    },
    {
      label: 'P&L %',
      trader1: formatPercent(trader1Data.metrics.totalPnlPercent),
      trader2: formatPercent(trader2Data.metrics.totalPnlPercent),
      trader1Color: trader1Data.metrics.totalPnlPercent > 0 ? 'text-green-600' : 'text-red-600',
      trader2Color: trader2Data.metrics.totalPnlPercent > 0 ? 'text-green-600' : 'text-red-600',
      icon: '📈',
    },
    {
      label: 'Active Positions',
      trader1: trader1Data.metrics.activePositions.toString(),
      trader2: trader2Data.metrics.activePositions.toString(),
      icon: '🎯',
    },
    {
      label: 'Avg Position Size',
      trader1: formatCurrency(trader1Data.metrics.avgPositionSize),
      trader2: formatCurrency(trader2Data.metrics.avgPositionSize),
      icon: '⚖️',
    },
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trader 1 Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-blue-600">
            {trader1Image && (
              <img
                src={trader1Image}
                alt={trader1Name}
                className="w-10 h-10 rounded-full border-2 border-blue-600"
              />
            )}
            <h3 className="text-lg font-bold text-blue-600 comic-font">{trader1Name}</h3>
          </div>
          {metrics.map((metric, idx) => (
            <div key={idx} className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <span>{metric.icon}</span>
                <span>{metric.label}</span>
              </div>
              <div className={`text-xl font-bold ${metric.trader1Color || 'text-gray-900'}`}>
                {metric.trader1}
              </div>
            </div>
          ))}
        </div>

        {/* Trader 2 Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-orange-600">
            {trader2Image && (
              <img
                src={trader2Image}
                alt={trader2Name}
                className="w-10 h-10 rounded-full border-2 border-orange-600"
              />
            )}
            <h3 className="text-lg font-bold text-orange-600 comic-font">{trader2Name}</h3>
          </div>
          {metrics.map((metric, idx) => (
            <div key={idx} className="p-3 bg-orange-50 rounded-lg border-2 border-orange-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <span>{metric.icon}</span>
                <span>{metric.label}</span>
              </div>
              <div className={`text-xl font-bold ${metric.trader2Color || 'text-gray-900'}`}>
                {metric.trader2}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
