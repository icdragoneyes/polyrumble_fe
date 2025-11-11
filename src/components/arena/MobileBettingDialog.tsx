import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import type { Pool } from '../../types';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { useBetting } from '../../hooks/useBetting';
import { formatSOLWithSymbol, validateBetAmount } from '../../utils/solana';
import { getTraderChoice } from '../../utils/betting';

interface MobileBettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pool: Pool;
  selectedTrader: 'A' | 'B';
  traderName: string;
  traderImage?: string;
  traderData?: { metrics: { portfolioValue: number; totalPnl: number } };
  onPlaceBet?: (traderChoice: number, amount: number, signature: string) => Promise<void>;
}

export function MobileBettingDialog({
  isOpen,
  onClose,
  pool,
  selectedTrader,
  traderName,
  traderImage,
  traderData,
  onPlaceBet,
}: MobileBettingDialogProps) {
  const { connected } = useWallet();
  const { balance } = useWalletBalance();
  const { simulateBet, placeBet, isSimulating, isPlacingBet, lastSimulation } = useBetting(pool.id);

  const [betAmount, setBetAmount] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentOdds = selectedTrader === 'A' ? pool.currentOddsA : pool.currentOddsB;

  useEffect(() => {
    if (!betAmount || !connected) {
      setValidationError(null);
      return;
    }

    const amount = parseFloat(betAmount);
    if (isNaN(amount)) {
      setValidationError('Invalid amount');
      return;
    }

    const minBet = pool.minBetAmount ? parseFloat(pool.minBetAmount) / 1_000_000_000 : 0.01;
    const maxBet = pool.maxBetAmount ? parseFloat(pool.maxBetAmount) / 1_000_000_000 : 100;

    const validation = validateBetAmount(amount, minBet, maxBet, balance);
    setValidationError(validation.valid ? null : validation.error || null);
  }, [betAmount, balance, connected, pool.minBetAmount, pool.maxBetAmount]);

  const handleBetAmountChange = (value: string) => {
    setBetAmount(value);

    if (!value || !connected || validationError) return;

    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) return;

    const traderChoice = getTraderChoice(selectedTrader);
    setTimeout(() => {
      simulateBet(pool.id, amount, traderChoice);
    }, 500);
  };

  const handlePlaceBet = async () => {
    if (!betAmount || !connected) return;

    const amount = parseFloat(betAmount);
    if (amount <= 0 || isNaN(amount) || validationError) return;

    const traderChoice = getTraderChoice(selectedTrader);

    try {
      const result = await placeBet(pool.id, amount, traderChoice);

      if (result && result.transactionSignature) {
        setBetAmount('');
        onClose();

        if (onPlaceBet) {
          await onPlaceBet(traderChoice, amount, result.transactionSignature);
        }
      }
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-lg border-4 border-black shadow-brutal max-w-md mx-auto">
        {/* Header */}
        <div className={`p-4 border-b-4 border-black ${
          selectedTrader === 'A' ? 'bg-blue-50' : 'bg-orange-50'
        }`}>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold comic-font">
              Bet on {traderName}
            </h3>
            <button
              onClick={onClose}
              className="text-2xl leading-none hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {!connected ? (
            <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg text-center">
              <p className="text-yellow-800 text-sm font-medium">
                Connect your wallet to place bets
              </p>
            </div>
          ) : (
            <>
              {/* Trader Summary */}
              <div className={`p-3 rounded-lg border-2 ${
                selectedTrader === 'A'
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-orange-200 bg-orange-50'
              }`}>
                <div className="flex items-center gap-3">
                  {traderImage && (
                    <img src={traderImage} alt={traderName} className="w-12 h-12 rounded-full" />
                  )}
                  <div className="flex-1">
                    <div className={`text-sm font-bold ${
                      selectedTrader === 'A' ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {traderName}
                    </div>
                    {traderData && (
                      <div className="text-xs text-gray-600">
                        Portfolio: ${(traderData.metrics.portfolioValue / 1000).toFixed(1)}k • {' '}
                        PNL: <span className={traderData.metrics.totalPnl > 0 ? 'text-green-600' : 'text-red-600'}>
                          ${(traderData.metrics.totalPnl / 1000).toFixed(1)}k
                        </span>
                      </div>
                    )}
                    <div className="text-xs text-gray-600 mt-1">
                      Odds: {currentOdds?.toFixed(2)}x
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Your Balance:</span>
                <span className="font-bold">{formatSOLWithSymbol(balance)}</span>
              </div>

              {/* Bet Amount */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Bet amount for Trader {selectedTrader}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={betAmount}
                  onChange={(e) => handleBetAmountChange(e.target.value)}
                  placeholder="0.00 SOL"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    validationError
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isPlacingBet}
                />
                {validationError && (
                  <p className="mt-1 text-sm text-red-600">{validationError}</p>
                )}
              </div>

              {/* Simulation Result */}
              {lastSimulation && !isSimulating && betAmount && !validationError && (
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Your Bet:</span>
                    <span className="font-bold">{formatSOLWithSymbol(parseFloat(betAmount))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Platform Fee:</span>
                    <span className="font-bold">{formatSOLWithSymbol(parseFloat(lastSimulation.platformFee) / 1_000_000_000)}</span>
                  </div>
                  <div className="border-t-2 border-green-400 pt-2 flex justify-between">
                    <span className="font-bold text-green-800">Potential Payout:</span>
                    <span className="font-bold text-green-800 text-lg">
                      {formatSOLWithSymbol(parseFloat(lastSimulation.netPayout) / 1_000_000_000)}
                    </span>
                  </div>
                </div>
              )}

              {/* Place Bet Button */}
              <button
                onClick={handlePlaceBet}
                disabled={
                  !betAmount ||
                  parseFloat(betAmount) <= 0 ||
                  isPlacingBet ||
                  !!validationError ||
                  isSimulating
                }
                className={`w-full py-4 text-lg font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedTrader === 'A'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                }`}
              >
                {isPlacingBet ? 'Placing Bet...' : 'BET'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
