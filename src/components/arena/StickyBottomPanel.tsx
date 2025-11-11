import { useState, type ReactNode } from 'react';

interface StickyBottomPanelProps {
  poolInfoSection: ReactNode;
  pnlContent: ReactNode;
  metricsContent: ReactNode;
  positionsContent: ReactNode;
}

type TabType = 'pnl' | 'metrics' | 'positions';

export function StickyBottomPanel({
  poolInfoSection,
  pnlContent,
  metricsContent,
  positionsContent,
}: StickyBottomPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pnl');

  const tabs = [
    { id: 'pnl' as TabType, label: 'PNL', icon: '📈' },
    { id: 'metrics' as TabType, label: 'Metrics', icon: '📊' },
    { id: 'positions' as TabType, label: 'Positions', icon: '💼' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-4 border-black shadow-brutal mb-[2%]">
      {/* Mobile: Pool Info & Betting at top */}
      <div className="lg:hidden border-b-4 border-black bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl py-3">
          {poolInfoSection}
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-2 max-w-7xl py-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Tab Content - 2/3 on desktop, full on mobile - Fixed height for all tabs */}
          <div className="lg:col-span-2 h-[75vh] overflow-hidden">
            {activeTab === 'pnl' && pnlContent}
            {activeTab === 'metrics' && <div className="h-full overflow-y-auto custom-scrollbar">{metricsContent}</div>}
            {activeTab === 'positions' && <div className="h-full overflow-y-auto custom-scrollbar">{positionsContent}</div>}
          </div>

          {/* Desktop: Betting Panel Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1 border-l-4 border-black pl-3">
            {poolInfoSection}
          </div>
        </div>
      </div>

      {/* Tab Buttons - At bottom */}
      <div className="border-t-4 border-black bg-gradient-to-b from-gray-200 to-gray-300">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 font-bold body-font transition-all duration-200 border-r-4 border-black relative ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-t from-blue-600 to-blue-500 text-white shadow-brutal-sm -mt-2 scale-105 rounded-t-lg'
                    : 'bg-gradient-to-t from-gray-400 to-gray-300 text-gray-800 hover:from-gray-500 hover:to-gray-400 hover:scale-102 hover:-mt-1 rounded-t-md'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">{tab.icon}</span>
                  <span className="hidden sm:inline text-base">{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
