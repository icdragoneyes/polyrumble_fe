import { useState, useRef, useEffect } from "react";
import { ProfileSearchInput } from "./ProfileSearchInput";
import { ProfileSearchModal } from "./ProfileSearchModal";
import type { TraderSelection } from "../../types";

interface WalletInputProps {
  trader1: TraderSelection | null;
  trader2: TraderSelection | null;
  onTrader1Change: (selection: TraderSelection | null) => void;
  onTrader2Change: (selection: TraderSelection | null) => void;
  onCompare: () => void;
  loading: boolean;
}

export function WalletInput({
  trader1,
  trader2,
  onTrader1Change,
  onTrader2Change,
  onCompare,
  loading,
}: WalletInputProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeInput, setActiveInput] = useState<1 | 2 | null>(null);

  const trader2Ref = useRef<HTMLDivElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-focus trader 2 when trader 1 is selected
  const handleTrader1Select = () => {
    if (isMobile) {
      // Open modal for trader 2 on mobile
      setTimeout(() => {
        setActiveInput(2);
        setShowModal(true);
      }, 300);
    } else {
      // Focus trader 2 input on desktop
      setTimeout(() => {
        const input = trader2Ref.current?.querySelector("input");
        input?.focus();
      }, 100);
    }
  };

  // Auto-compare when both traders selected
  useEffect(() => {
    if (trader1 && trader2 && !loading) {
      // Small delay to show both selections before comparing
      setTimeout(() => {
        onCompare();
      }, 500);
    }
  }, [trader1, trader2, loading, onCompare]);

  const canCompare = trader1 && trader2 && !loading;

  return (
    <>
      <div className="bg-white comic-outline-thick comic-shadow-lg halftone-bg rounded-lg p-6 my-6 slide-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end relative z-10">
          {/* Trader 1 Input */}
          {isMobile ? (
            <div>
              <button
                onClick={() => {
                  setActiveInput(1);
                  setShowModal(true);
                }}
                className="w-full text-left"
                disabled={loading}
              >
                {trader1 ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-green-400 rounded-md">
                    {trader1.profileImage && (
                      <img
                        src={trader1.profileImage}
                        alt={trader1.name || "Trader"}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">
                        {trader1.name || "Selected Trader"}
                      </p>
                      {trader1.bio && (
                        <p className="text-sm text-gray-600 truncate">
                          {trader1.bio}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {trader1.walletAddress.slice(0, 6)}...
                        {trader1.walletAddress.slice(-4)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 border-2 border-gray-300 rounded-md text-gray-500">
                    Tap to search Trader 1
                  </div>
                )}
              </button>
            </div>
          ) : (
            <ProfileSearchInput
              value={trader1}
              onChange={onTrader1Change}
              onSelect={handleTrader1Select}
              label="Trader 1"
              disabled={loading}
            />
          )}

          {/* VS Divider - Hidden on mobile */}
          <div className="hidden md:flex items-center justify-center pb-3">
            <div className="relative">
              <img src="/burst-large.svg" alt="VS" className="w-24 h-24" />
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white comic-font comic-text-outline-thick">
                VS
              </span>
            </div>
          </div>

          {/* Trader 2 Input */}
          <div ref={trader2Ref}>
            {isMobile ? (
              <button
                onClick={() => {
                  setActiveInput(2);
                  setShowModal(true);
                }}
                className="w-full text-left"
                disabled={loading}
              >
                {trader2 ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-green-400 rounded-md">
                    {trader2.profileImage && (
                      <img
                        src={trader2.profileImage}
                        alt={trader2.name || "Trader"}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">
                        {trader2.name || "Selected Trader"}
                      </p>
                      {trader2.bio && (
                        <p className="text-sm text-gray-600 truncate">
                          {trader2.bio}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {trader2.walletAddress.slice(0, 6)}...
                        {trader2.walletAddress.slice(-4)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 border-2 border-gray-300 rounded-md text-gray-500">
                    Tap to search Trader 2
                  </div>
                )}
              </button>
            ) : (
              <ProfileSearchInput
                value={trader2}
                onChange={onTrader2Change}
                onSelect={() => {}}
                label="Trader 2"
                disabled={loading}
              />
            )}
          </div>
        </div>

        {/* Compare Button - Only show if manual comparison needed */}
        {canCompare && (
          <div className="mt-6 flex justify-center relative z-10">
            <button
              onClick={onCompare}
              disabled={loading}
              className="comic-button text-lg px-8 py-3"
            >
              {loading ? "Loading..." : "Compare Traders"}
            </button>
          </div>
        )}

        {/* Mobile hint */}
        {isMobile && !trader1 && !trader2 && (
          <p className="text-sm text-gray-500 text-center mt-4">
            Tap the fields above to search for traders
          </p>
        )}
      </div>

      {/* Mobile Modal */}
      {isMobile && (
        <ProfileSearchModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setActiveInput(null);
          }}
          onSelect={(selection) => {
            if (activeInput === 1) {
              onTrader1Change(selection);
              // Auto-open trader 2 modal
              setTimeout(() => {
                setActiveInput(2);
                setShowModal(true);
              }, 300);
            } else if (activeInput === 2) {
              onTrader2Change(selection);
            }
            setShowModal(false);
          }}
          label={activeInput === 1 ? "Search Trader 1" : "Search Trader 2"}
        />
      )}
    </>
  );
}
