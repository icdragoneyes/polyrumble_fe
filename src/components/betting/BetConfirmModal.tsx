import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { formatSOLWithSymbol } from '../../utils/solana';

interface BetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  traderName: string;
  traderSide: 'A' | 'B';
  betAmount: number;
  currentOdds: number;
  potentialPayout: number;
  platformFee: number;
  isConfirming?: boolean;
}

export function BetConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  traderName,
  traderSide,
  betAmount,
  currentOdds,
  potentialPayout,
  platformFee,
  isConfirming = false,
}: BetConfirmModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white comic-card shadow-brutal text-left align-middle transition-all">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                  <button
                    onClick={onClose}
                    disabled={isConfirming}
                    className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors disabled:opacity-50"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold comic-font text-white flex items-center gap-2"
                  >
                    <FiAlertCircle className="w-7 h-7" />
                    Confirm Your Bet
                  </Dialog.Title>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  {/* Warning */}
                  <div className="p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Please review your bet details carefully. This action cannot be undone once
                      confirmed on the blockchain.
                    </p>
                  </div>

                  {/* Bet Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 body-font">Betting on:</span>
                      <span
                        className={`font-bold comic-font text-lg ${
                          traderSide === 'A' ? 'text-blue-600' : 'text-orange-600'
                        }`}
                      >
                        Trader {traderSide}
                        {traderName && ` - ${traderName}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 body-font">Bet Amount:</span>
                      <span className="font-bold text-gray-900 text-lg">
                        {formatSOLWithSymbol(betAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 body-font">Current Odds:</span>
                      <span className="font-bold text-gray-900">{currentOdds.toFixed(2)}x</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 body-font">Platform Fee:</span>
                      <span className="font-bold text-gray-900">
                        {formatSOLWithSymbol(platformFee)}
                      </span>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 body-font font-bold">
                          Potential Payout:
                        </span>
                        <span className="font-bold text-green-700 text-xl">
                          {formatSOLWithSymbol(potentialPayout)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        (If Trader {traderSide} wins)
                      </p>
                    </div>
                  </div>

                  {/* Risk Disclaimer */}
                  <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                    <p className="text-xs text-red-800">
                      <strong>Risk Warning:</strong> Betting involves risk. Only bet what you can
                      afford to lose. Past performance does not guarantee future results.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={onClose}
                      disabled={isConfirming}
                      className="flex-1 comic-button bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-300 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onConfirm}
                      disabled={isConfirming}
                      className="flex-1 comic-button bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConfirming ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Confirming...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <FiCheckCircle className="w-5 h-5" />
                          Confirm Bet
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
