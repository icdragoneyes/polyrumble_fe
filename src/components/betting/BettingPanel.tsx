import { useState, useEffect, useMemo, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import type { Pool } from '../../types';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { useBetting } from '../../hooks/useBetting';
import { formatSOL, formatSOLWithSymbol, validateBetAmount } from '../../utils/solana';
import { getTraderChoice, isBettingAllowed, getPoolSize } from '../../utils/betting';

interface BettingPanelProps {
  pool: Pool;
  onPlaceBet?: (traderChoice: number, amount: number, signature: string) => Promise<void>;
}

export function BettingPanel({ pool, onPlaceBet }: BettingPanelProps) {
  const { connected } = useWallet();
  const { balance, getAvailableBalance } = useWalletBalance();
  const { simulateBet, placeBet, isSimulating, isPlacingBet, lastSimulation, simulationError, placeBetError } = useBetting(pool.id);

  const [selectedPool, setSelectedPool] = useState<'A' | 'B' | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Use ref to track debounce timeout
  const simulationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Use ref to track last simulation params to avoid duplicate calls
  const lastSimulationParamsRef = useRef<string>('');

  // Pool amounts
  const poolASizeSOL = useMemo(() => getPoolSize(pool, 'A'), [pool]);
  const poolBSizeSOL = useMemo(() => getPoolSize(pool, 'B'), [pool]);
  const totalSizeSOL = useMemo(() => getPoolSize(pool, 'total'), [pool]);

  // Pool percentages
  const poolAPercent = pool.poolARatio * 100;
  const poolBPercent = pool.poolBRatio * 100;

  // Check if betting is allowed
  const bettingAllowed = isBettingAllowed(pool);

  // Validate bet amount on change
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

    // Get min/max from pool or use defaults
    const minBet = pool.minBetAmount ? parseFloat(pool.minBetAmount) / 1_000_000_000 : 0.01;
    const maxBet = pool.maxBetAmount ? parseFloat(pool.maxBetAmount) / 1_000_000_000 : 100;

    const validation = validateBetAmount(amount, minBet, maxBet, balance);
    setValidationError(validation.valid ? null : validation.error || null);
  }, [betAmount, balance, connected, pool.minBetAmount, pool.maxBetAmount]);

  // Handle bet amount change with debounced simulation
  const handleBetAmountChange = (value: string) => {
    setBetAmount(value);

    // Clear existing timeout
    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
    }

    // Only simulate if we have all required data
    if (!selectedPool || !value || !connected || validationError) {
      return;
    }

    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) return;

    const traderChoice = getTraderChoice(selectedPool);
    const params = `${pool.id}-${amount}-${traderChoice}`;

    // Avoid duplicate simulations
    if (params === lastSimulationParamsRef.current) {
      return;
    }

    // Debounce the API call
    simulationTimeoutRef.current = setTimeout(() => {
      lastSimulationParamsRef.current = params;
      simulateBet(pool.id, amount, traderChoice);
    }, 500);
  };

  // Handle pool selection change
  const handlePoolSelection = (side: 'A' | 'B') => {
    setSelectedPool(side);

    // Trigger simulation if amount is already set
    if (betAmount && connected && !validationError) {
      const amount = parseFloat(betAmount);
      if (!isNaN(amount) && amount > 0) {
        const traderChoice = getTraderChoice(side);
        const params = `${pool.id}-${amount}-${traderChoice}`;

        if (params !== lastSimulationParamsRef.current) {
          lastSimulationParamsRef.current = params;
          simulateBet(pool.id, amount, traderChoice);
        }
      }
    }
  };

  const handlePlaceBet = async () => {
    if (!selectedPool || !betAmount || !connected) return;

    const amount = parseFloat(betAmount);
    if (amount <= 0 || isNaN(amount) || validationError) return;

    const traderChoice = getTraderChoice(selectedPool);

    try {
      const result = await placeBet(pool.id, amount, traderChoice);

      if (result && result.transactionSignature) {
        // Clear form on success
        setBetAmount('');
        setSelectedPool(null);

        // Notify parent component
        if (onPlaceBet) {
          await onPlaceBet(traderChoice, amount, result.transactionSignature);
        }
      }
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  };

  // Quick bet amount buttons
  const setQuickAmount = (percentage: number) => {
    if (!connected) return;
    const availableBalance = getAvailableBalance();
    const amount = (availableBalance * percentage).toFixed(4);
    handleBetAmountChange(amount);
  };

  return (
    <div className="bg-white comic-card halftone-bg p-6 my-6">
      <h3 className="text-2xl font-bold text-center comic-font mb-6 flex items-center justify-center gap-2">
        <img src="/burst-small.svg" alt="" className="w-6 h-6" />
        BETTING POOLS
        <img src="/burst-small.svg" alt="" className="w-6 h-6" />
      </h3>

      {/* Wallet Connection Notice */}
      {!connected && (
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <p className="text-yellow-800 font-medium text-center">
            Connect your wallet to place bets
          </p>
        </div>
      )}

      {/* Pool Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Pool A */}
        <button
          onClick={() => bettingAllowed && connected && handlePoolSelection('A')}
          disabled={!bettingAllowed || !connected}
          className={`p-6 rounded-lg border-4 transition-all ${
            selectedPool === 'A'
              ? 'border-blue-600 bg-blue-50 shadow-brutal'
              : 'border-gray-300 hover:border-blue-400'
          } ${!bettingAllowed || !connected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="text-center">
            <h4 className="text-lg font-bold comic-font text-blue-600 mb-2">
              TRADER A
            </h4>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatSOL(poolASizeSOL)} SOL
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {poolAPercent.toFixed(1)}% of total pool
            </div>
            <div className="text-sm font-bold text-blue-600">
              Odds: {pool.currentOddsA?.toFixed(2) || '1.00'}x
            </div>
            {/* Visual bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${poolAPercent}%` }}
              />
            </div>
          </div>
        </button>

        {/* Pool B */}
        <button
          onClick={() => bettingAllowed && connected && handlePoolSelection('B')}
          disabled={!bettingAllowed || !connected}
          className={`p-6 rounded-lg border-4 transition-all ${
            selectedPool === 'B'
              ? 'border-orange-600 bg-orange-50 shadow-brutal'
              : 'border-gray-300 hover:border-orange-400'
          } ${!bettingAllowed || !connected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="text-center">
            <h4 className="text-lg font-bold comic-font text-orange-600 mb-2">
              TRADER B
            </h4>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatSOL(poolBSizeSOL)} SOL
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {poolBPercent.toFixed(1)}% of total pool
            </div>
            <div className="text-sm font-bold text-orange-600">
              Odds: {pool.currentOddsB?.toFixed(2) || '1.00'}x
            </div>
            {/* Visual bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div
                className="bg-orange-600 h-3 rounded-full transition-all"
                style={{ width: `${poolBPercent}%` }}
              />
            </div>
          </div>
        </button>
      </div>

      {/* Total Pool Size */}
      <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
        <div className="text-sm text-gray-600 mb-1">Total Pool Size</div>
        <div className="text-2xl font-bold text-gray-900">
          {formatSOL(totalSizeSOL)} SOL
        </div>
      </div>

      {/* Bet Input */}
      {bettingAllowed && connected && (
        <div className="space-y-4">
          {/* Balance Display */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Your Balance:</span>
            <span className="font-bold text-gray-900">{formatSOLWithSymbol(balance)}</span>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Bet Amount (SOL) {selectedPool && `- Betting on Trader ${selectedPool}`}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={betAmount}
              onChange={(e) => handleBetAmountChange(e.target.value)}
              placeholder="0.00"
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 ${
                validationError
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={!selectedPool || isPlacingBet}
            />
            {validationError && (
              <p className="mt-1 text-sm text-red-600">{validationError}</p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          {selectedPool && (
            <div className="flex gap-2">
              <button
                onClick={() => setQuickAmount(0.25)}
                className="flex-1 comic-button bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2"
                disabled={isPlacingBet}
              >
                25%
              </button>
              <button
                onClick={() => setQuickAmount(0.5)}
                className="flex-1 comic-button bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2"
                disabled={isPlacingBet}
              >
                50%
              </button>
              <button
                onClick={() => setQuickAmount(0.75)}
                className="flex-1 comic-button bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2"
                disabled={isPlacingBet}
              >
                75%
              </button>
              <button
                onClick={() => setQuickAmount(1)}
                className="flex-1 comic-button bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2"
                disabled={isPlacingBet}
              >
                Max
              </button>
            </div>
          )}

          {/* Simulation Results */}
          {isSimulating && (
            <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200 animate-pulse">
              <div className="text-sm text-gray-700">Calculating potential payout...</div>
            </div>
          )}

          {lastSimulation && !isSimulating && selectedPool && betAmount && !validationError && (
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Your Bet:</span>
                <span className="font-bold">{formatSOLWithSymbol(parseFloat(betAmount))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Current Odds:</span>
                <span className="font-bold">{lastSimulation.currentOdds.toFixed(2)}x</span>
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

          {simulationError && (
            <div className="p-3 bg-red-50 rounded-lg border-2 border-red-200">
              <p className="text-sm text-red-600">Failed to calculate payout. Please try again.</p>
            </div>
          )}

          {placeBetError && (
            <div className="p-3 bg-red-50 rounded-lg border-2 border-red-200">
              <p className="text-sm text-red-600">
                {placeBetError instanceof Error ? placeBetError.message : 'Failed to place bet. Please try again.'}
              </p>
            </div>
          )}

          {/* Place Bet Button */}
          <button
            onClick={handlePlaceBet}
            disabled={
              !selectedPool ||
              !betAmount ||
              parseFloat(betAmount) <= 0 ||
              isPlacingBet ||
              !!validationError ||
              isSimulating
            }
            className="w-full comic-button bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPlacingBet ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Placing Bet...
              </span>
            ) : (
              `Place Bet on Trader ${selectedPool || ''}`
            )}
          </button>
        </div>
      )}

      {/* Betting Closed Message */}
      {!bettingAllowed && (
        <div className="text-center p-4 bg-gray-100 rounded-lg border-2 border-gray-300">
          <p className="text-gray-600 font-medium">
            {pool.status !== 'active'
              ? `Betting is ${pool.status} for this arena`
              : 'Betting window has closed for this arena'
            }
          </p>
        </div>
      )}
    </div>
  );
}
