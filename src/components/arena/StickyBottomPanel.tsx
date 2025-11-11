import { type ReactNode } from 'react';

interface StickyBottomPanelProps {
  activeTab: 'pnl' | 'metrics' | 'positions';
  onTabChange: (tab: 'pnl' | 'metrics' | 'positions') => void;
  poolInfoSection: ReactNode;
  showMobileBettingModal: boolean;
  onToggleMobileBetting: () => void;
  connected: boolean;
}

type TabType = 'pnl' | 'metrics' | 'positions';

export function StickyBottomPanel({
  activeTab,
  onTabChange,
  poolInfoSection,
  showMobileBettingModal,
  onToggleMobileBetting,
  connected,
}: StickyBottomPanelProps) {
  const tabs = [
    { id: 'pnl' as TabType, label: 'PNL', icon: '📈' },
    { id: 'metrics' as TabType, label: 'Metrics', icon: '📊' },
    { id: 'positions' as TabType, label: 'Positions', icon: '💼' },
  ];

  return (
    <>
      {/* Mobile Betting Modal/Dialog */}
      {showMobileBettingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:hidden">
          <div className="bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-2xl border-t-4 border-black shadow-brutal-xl">
            <div className="sticky top-0 bg-white border-b-4 border-black p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold comic-font">Place Your Bet</h2>
              <button
                onClick={onToggleMobileBetting}
                className="text-2xl font-bold text-gray-600 hover:text-gray-900 p-2"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              {poolInfoSection}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-4 border-black shadow-brutal">
        {/* Mobile: Place Bet Button - Full Width Above Tabs */}
        <div className="lg:hidden border-b-4 border-black bg-white">
          <div className="container mx-auto px-4 max-w-7xl py-2">
            <button
              onClick={onToggleMobileBetting}
              className={`w-full py-4 px-6 font-bold text-base border-2 border-black rounded-lg shadow-brutal-sm transition-all duration-200 hover:shadow-none active:translate-x-1 active:translate-y-1 ${
                connected
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{connected ? '💰' : '🔗'}</span>
                <span className="text-lg">{connected ? 'PLACE YOUR BET' : 'CONNECT WALLET'}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="bg-gradient-to-b from-gray-200 to-gray-300">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex gap-0.5">
              {/* Tab Buttons - Desktop & Mobile */}
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex-1 px-4 py-3 font-bold body-font transition-all duration-200 border-r-4 border-black relative ${
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
    </>
  );
}
