import { useState, useEffect, useMemo, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import type { Pool } from '../../types';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { useBetting } from '../../hooks/useBetting';
import { formatSOL, formatSOLWithSymbol, validateBetAmount } from '../../utils/solana';
import { getTraderChoice, isBettingAllowed, getPoolSize } from '../../utils/betting';
import { MobileBettingDialog } from './MobileBettingDialog';

interface CompactBettingPanelProps {
  pool: Pool;
  traderAName: string;
  traderBName: string;
  traderAImage?: string;
  traderBImage?: string;
  traderAData?: { metrics: { portfolioValue: number; totalPnl: number } };
  traderBData?: { metrics: { portfolioValue: number; totalPnl: number } };
  onPlaceBet?: (traderChoice: number, amount: number, signature: string) => Promise<void>;
}

export function CompactBettingPanel({
  pool,
  traderAName,
  traderBName,
  traderAImage,
  traderBImage,
  traderAData,
  traderBData,
  onPlaceBet
}: CompactBettingPanelProps) {
  const { connected } = useWallet();
  const { balance } = useWalletBalance();
  const { simulateBet, placeBet, isSimulating, isPlacingBet, lastSimulation } = useBetting(pool.id);

  const [selectedPool, setSelectedPool] = useState<'A' | 'B' | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Mobile dialog state
  const [mobileDialogOpen, setMobileDialogOpen] = useState(false);
  const [mobileSelectedTrader, setMobileSelectedTrader] = useState<'A' | 'B' | null>(null);

  const simulationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSimulationParamsRef = useRef<string>('');

  const poolASizeSOL = useMemo(() => getPoolSize(pool, 'A'), [pool]);
  const poolBSizeSOL = useMemo(() => getPoolSize(pool, 'B'), [pool]);

  const poolAPercent = pool.poolARatio * 100;
  const poolBPercent = pool.poolBRatio * 100;

  const bettingAllowed = isBettingAllowed(pool);

  // Truncate trader names with smart formatting
  const truncateTraderName = (name: string, maxLength: number = 18): string => {
    // If it looks like a wallet address (starts with 0x), format it specially
    if (name.startsWith('0x') && name.length > 10) {
      return `${name.substring(0, 6)}...${name.substring(name.length - 4)}`;
    }

    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

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

    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
    }

    if (!selectedPool || !value || !connected || validationError) {
      return;
    }

    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) return;

    const traderChoice = getTraderChoice(selectedPool);
    const params = `${pool.id}-${amount}-${traderChoice}`;

    if (params === lastSimulationParamsRef.current) {
      return;
    }

    simulationTimeoutRef.current = setTimeout(() => {
      lastSimulationParamsRef.current = params;
      simulateBet(pool.id, amount, traderChoice);
    }, 500);
  };

  const handlePoolSelection = (side: 'A' | 'B') => {
    setSelectedPool(side);

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
        setBetAmount('');
        setSelectedPool(null);

        if (onPlaceBet) {
          await onPlaceBet(traderChoice, amount, result.transactionSignature);
        }
      }
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  };

  const handleMobileBetClick = (trader: 'A' | 'B') => {
    setMobileSelectedTrader(trader);
    setMobileDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-3">
        {/* Mobile: Simple Bet Buttons */}
        <div className="lg:hidden space-y-2">
          <button
            onClick={() => handleMobileBetClick('A')}
            disabled={!bettingAllowed || !connected}
            className="w-full p-3 rounded-lg border-2 border-blue-600 bg-blue-50 hover:bg-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {traderAImage && (
                  <img src={traderAImage} alt={traderAName} className="w-8 h-8 rounded-full flex-shrink-0" />
                )}
                <div className="text-left min-w-0 flex-1">
                  <div className="text-sm font-bold text-blue-600 truncate">{truncateTraderName(traderAName, 20)}</div>
                  {traderAData && (
                    <div className="text-xs text-gray-600">
                      ${(traderAData.metrics.portfolioValue / 1000).toFixed(1)}k • {' '}
                      <span className={traderAData.metrics.totalPnl > 0 ? 'text-green-600' : 'text-red-600'}>
                        ${(traderAData.metrics.totalPnl / 1000).toFixed(1)}k
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <div className="text-xs text-gray-600">Odds: {pool.currentOddsA?.toFixed(2)}x</div>
                <div className="text-xs font-bold text-blue-600">Bet Trader A</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleMobileBetClick('B')}
            disabled={!bettingAllowed || !connected}
            className="w-full p-3 rounded-lg border-2 border-orange-600 bg-orange-50 hover:bg-orange-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {traderBImage && (
                  <img src={traderBImage} alt={traderBName} className="w-8 h-8 rounded-full flex-shrink-0" />
                )}
                <div className="text-left min-w-0 flex-1">
                  <div className="text-sm font-bold text-orange-600 truncate">{truncateTraderName(traderBName, 20)}</div>
                  {traderBData && (
                    <div className="text-xs text-gray-600">
                      ${(traderBData.metrics.portfolioValue / 1000).toFixed(1)}k • {' '}
                      <span className={traderBData.metrics.totalPnl > 0 ? 'text-green-600' : 'text-red-600'}>
                        ${(traderBData.metrics.totalPnl / 1000).toFixed(1)}k
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <div className="text-xs text-gray-600">Odds: {pool.currentOddsB?.toFixed(2)}x</div>
                <div className="text-xs font-bold text-orange-600">Bet Trader B</div>
              </div>
            </div>
          </button>
        </div>

        {/* Desktop: Vertical Card Layout */}
        <div className="hidden lg:block space-y-3">
          {/* Trader A Card */}
          <div className={`rounded-xl border-3 border-black bg-gradient-to-br from-blue-50 to-blue-100 p-3 shadow-brutal transition-all duration-300 ${
            selectedPool === 'A' ? 'scale-105 ring-4 ring-blue-500' : selectedPool === 'B' ? 'scale-95 opacity-60' : ''
          }`}>
            {/* Profile Picture - Top */}
            <div className="flex justify-center mb-3">
              {traderAImage && (
                <img
                  src={traderAImage}
                  alt={traderAName}
                  className="w-16 h-16 rounded-full border-4 border-blue-600 shadow-md"
                />
              )}
            </div>

            {/* Trader Details - Center */}
            <div className="text-center mb-3">
              <div className="font-bold text-blue-900 text-base mb-2 truncate px-2">
                {truncateTraderName(traderAName, 22)}
              </div>
              {traderAData && (
                <>
                  <div className="text-xs text-gray-800 mb-1">
                    Portfolio: <span className="font-bold">${(traderAData.metrics.portfolioValue / 1000).toFixed(1)}k</span>
                  </div>
                  <div className="text-xs text-gray-800 mb-1">
                    P&L: <span className={`font-bold ${traderAData.metrics.totalPnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${(traderAData.metrics.totalPnl / 1000).toFixed(1)}k
                    </span>
                  </div>
                </>
              )}
              <div className="text-xs text-gray-700 font-medium">
                {formatSOL(poolASizeSOL)} SOL • {poolAPercent.toFixed(0)}% • {pool.currentOddsA?.toFixed(2)}x odds
              </div>
            </div>

            {/* Bet Button - Bottom */}
            <button
              onClick={() => connected && bettingAllowed && handlePoolSelection('A')}
              disabled={!connected || !bettingAllowed}
              className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black shadow-brutal-sm hover:shadow-none active:translate-x-1 active:translate-y-1 ${
                selectedPool === 'A'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              title={`Bet on ${traderAName}`}
            >
              {selectedPool === 'A' ? '✓ SELECTED' : `Bet ${truncateTraderName(traderAName, 20)}`}
            </button>
          </div>

          {/* Trader B Card */}
          <div className={`rounded-xl border-3 border-black bg-gradient-to-br from-orange-50 to-orange-100 p-3 shadow-brutal transition-all duration-300 ${
            selectedPool === 'B' ? 'scale-105 ring-4 ring-orange-500' : selectedPool === 'A' ? 'scale-95 opacity-60' : ''
          }`}>
            {/* Profile Picture - Top */}
            <div className="flex justify-center mb-3">
              {traderBImage && (
                <img
                  src={traderBImage}
                  alt={traderBName}
                  className="w-16 h-16 rounded-full border-4 border-orange-600 shadow-md"
                />
              )}
            </div>

            {/* Trader Details - Center */}
            <div className="text-center mb-3">
              <div className="font-bold text-orange-900 text-base mb-2 truncate px-2">
                {truncateTraderName(traderBName, 22)}
              </div>
              {traderBData && (
                <>
                  <div className="text-xs text-gray-800 mb-1">
                    Portfolio: <span className="font-bold">${(traderBData.metrics.portfolioValue / 1000).toFixed(1)}k</span>
                  </div>
                  <div className="text-xs text-gray-800 mb-1">
                    P&L: <span className={`font-bold ${traderBData.metrics.totalPnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${(traderBData.metrics.totalPnl / 1000).toFixed(1)}k
                    </span>
                  </div>
                </>
              )}
              <div className="text-xs text-gray-700 font-medium">
                {formatSOL(poolBSizeSOL)} SOL • {poolBPercent.toFixed(0)}% • {pool.currentOddsB?.toFixed(2)}x odds
              </div>
            </div>

            {/* Bet Button - Bottom */}
            <button
              onClick={() => connected && bettingAllowed && handlePoolSelection('B')}
              disabled={!connected || !bettingAllowed}
              className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black shadow-brutal-sm hover:shadow-none active:translate-x-1 active:translate-y-1 ${
                selectedPool === 'B'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
              title={`Bet on ${traderBName}`}
            >
              {selectedPool === 'B' ? '✓ SELECTED' : `Bet ${truncateTraderName(traderBName, 20)}`}
            </button>
          </div>

          {/* Connection/Status Message or Betting Form */}
          {!connected ? (
            <div className="flex flex-col items-center gap-2">
              <WalletMultiButton className="!bg-yellow-500 hover:!bg-yellow-600 !rounded-lg !py-3 !px-6 !text-base !font-bold" />
              <p className="text-yellow-800 text-xs text-center">Connect your Solana wallet to place bets</p>
            </div>
          ) : !bettingAllowed ? (
            <div className="p-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-center">
              <p className="text-gray-600 text-sm font-medium">Betting {pool.status}</p>
            </div>
          ) : (
            <>
              {/* Bet Amount Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Bet amount for {selectedPool ? (selectedPool === 'A' ? traderAName : traderBName) : '...'}
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
                  disabled={!selectedPool || isPlacingBet}
                />
                {validationError && (
                  <p className="mt-1 text-xs text-red-600">{validationError}</p>
                )}
              </div>

              {/* Simulation Result */}
              {lastSimulation && !isSimulating && selectedPool && betAmount && !validationError && (
                <div className="p-3 bg-green-50 rounded-lg border-2 border-green-300 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Potential Payout:</span>
                    <span className="font-bold text-green-800">
                      {formatSOLWithSymbol(parseFloat(lastSimulation.netPayout) / 1_000_000_000)}
                    </span>
                  </div>
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
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 text-base font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isPlacingBet ? 'Placing Bet...' : 'BET'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Betting Dialog */}
      {mobileSelectedTrader && (
        <MobileBettingDialog
          isOpen={mobileDialogOpen}
          onClose={() => {
            setMobileDialogOpen(false);
            setMobileSelectedTrader(null);
          }}
          pool={pool}
          selectedTrader={mobileSelectedTrader}
          traderName={mobileSelectedTrader === 'A' ? traderAName : traderBName}
          traderImage={mobileSelectedTrader === 'A' ? traderAImage : traderBImage}
          traderData={mobileSelectedTrader === 'A' ? traderAData : traderBData}
          onPlaceBet={onPlaceBet}
        />
      )}
    </>
  );
}
