import { HiRefresh } from "react-icons/hi";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletStore } from '../../stores/walletStore';

interface HeaderProps {
  countdown?: number;
  onRefresh?: () => void;
  isLoading?: boolean;
  showRefresh?: boolean;
}

export function Header({ countdown, onRefresh, isLoading, showRefresh = false }: HeaderProps) {
  const connected = useWalletStore(state => state.connected);
  const balance = useWalletStore(state => state.balance);

  console.log('[Header] Wallet state from store:', { connected, balance });

  return (
    <header className="bg-white border-b-4 border-black">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 relative">
            {/* Burst decoration behind logo */}
            <div className="absolute -left-2 -top-1 opacity-10">
              <img
                src="/burst-medium.svg"
                alt=""
                className="w-16 h-16 text-trader1"
              />
            </div>
            <img
              src="/vs-logo.svg"
              alt="VS"
              className="w-10 h-10 relative z-10 burst-pulse"
            />
            <h1 className="text-2xl font-bold text-black comic-font relative z-10">
              <span className="text-black">Polymarket Trader</span>{" "}
              <span className="text-orange-500">Rumble</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Debug: Show connection status */}
            <div className="text-xs px-2 py-1 rounded bg-gray-100 border">
              Store: {connected ? '✅' : '❌'}
            </div>

            {/* Balance display */}
            {connected && (
              <div className="hidden md:flex flex-col items-end text-sm">
                <span className="text-gray-600 body-font">Balance</span>
                <span className="font-bold text-gray-900">{balance.toFixed(4)} SOL</span>
              </div>
            )}

            {/* Refresh button */}
            {showRefresh && countdown !== undefined && onRefresh && (
              <>
                <span className="text-sm text-gray-700 font-medium body-font hidden lg:block">
                  Auto-refresh: {Math.floor(countdown / 60)}:
                  {String(countdown % 60).padStart(2, "0")}
                </span>
                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="comic-button flex items-center gap-2"
                  aria-label="Refresh trader data"
                >
                  <HiRefresh className={isLoading ? "spin" : ""} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </>
            )}

            {/* Wallet button */}
            <div className="wallet-adapter-button-trigger">
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
