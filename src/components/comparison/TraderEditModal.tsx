import { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import { ProfileSearchInput } from "./ProfileSearchInput";
import { truncateAddress } from "../../utils/validation";
import type { TraderSelection } from "../../types";

interface TraderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  traderNumber: 1 | 2;
  currentTrader: TraderSelection | null;
  onTraderChange: (trader: TraderSelection | null) => void;
  currentTraderName?: string;
  currentTraderImage?: string | null;
  currentTraderBio?: string;
}

export function TraderEditModal({
  isOpen,
  onClose,
  traderNumber,
  currentTrader,
  onTraderChange,
  currentTraderName,
  currentTraderImage,
  currentTraderBio,
}: TraderEditModalProps) {
  const [tempTrader, setTempTrader] = useState<TraderSelection | null>(
    currentTrader,
  );

  useEffect(() => {
    setTempTrader(currentTrader);
  }, [currentTrader, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onTraderChange(tempTrader);
    onClose();
  };

  const handleSelect = () => {
    // Auto-save when a trader is selected from search
    setTimeout(() => {
      if (tempTrader) {
        handleSave();
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full max-h-[85vh] flex flex-col">
          {/* Header - Fixed */}
          <div className="bg-white px-4 pt-5 pb-4 sm:px-6 flex-shrink-0 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Trader {traderNumber}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            {/* Current Trader Info */}
            {currentTrader && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-3">
                  Current Trader
                </p>
                <div className="flex items-start gap-3">
                  {currentTraderImage && (
                    <img
                      src={currentTraderImage}
                      alt={currentTraderName || "Trader"}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {currentTraderName || "Unknown Trader"}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {truncateAddress(currentTrader.walletAddress)}
                    </p>
                    {currentTraderBio && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {currentTraderBio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Search Input */}
            <div className="mt-4">
              <ProfileSearchInput
                value={tempTrader}
                onChange={setTempTrader}
                onSelect={handleSelect}
                placeholder={`Search by name or enter wallet address...`}
                label="Search for new trader"
              />
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3 flex-shrink-0 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={!tempTrader}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
