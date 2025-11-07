import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { env } from '../config/env';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletConfigProps {
  children: React.ReactNode;
}

/**
 * Solana wallet adapter configuration provider
 * Wraps the app with wallet connection functionality
 */
export function WalletConfig({ children }: WalletConfigProps) {
  // Determine network from environment
  const network = env.solanaNetwork as WalletAdapterNetwork;

  // RPC endpoint - use custom or default cluster URL
  const endpoint = useMemo(() => {
    if (env.solanaRpcUrl) {
      return env.solanaRpcUrl;
    }
    return clusterApiUrl(network);
  }, [network]);

  // Configure supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
