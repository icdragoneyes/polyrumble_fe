import { useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletStore } from '../../stores/walletStore';

/**
 * WalletSync Component
 * Syncs Solana wallet state to Zustand store
 * Automatically fetches and updates balance every 30 seconds
 */
export function WalletSync() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const setConnected = useWalletStore(state => state.setConnected);
  const setPublicKey = useWalletStore(state => state.setPublicKey);
  const setBalance = useWalletStore(state => state.setBalance);

  // Sync connection state and public key
  useEffect(() => {
    console.log('[WalletSync] Syncing wallet state:', { connected, publicKey: publicKey?.toBase58() });
    setConnected(connected);
    setPublicKey(publicKey?.toBase58() || null);

    // Clear balance when disconnected
    if (!connected) {
      setBalance(0);
    }
  }, [connected, publicKey, setConnected, setPublicKey, setBalance]);

  // Fetch and sync balance
  useEffect(() => {
    if (!publicKey || !connected) {
      console.log('[WalletSync] No publicKey or not connected, setting balance to 0');
      setBalance(0);
      return;
    }

    const fetchBalance = async () => {
      try {
        console.log('[WalletSync] Fetching balance for:', publicKey.toBase58());
        const balanceLamports = await connection.getBalance(publicKey);
        const balanceSOL = balanceLamports / 1_000_000_000;
        console.log('[WalletSync] Balance fetched:', {
          lamports: balanceLamports,
          sol: balanceSOL,
          publicKey: publicKey.toBase58()
        });
        setBalance(balanceSOL);
      } catch (error) {
        console.error('[WalletSync] Failed to fetch balance:', error);
        // Don't throw, just log - balance will retry on next interval
      }
    };

    // Initial fetch
    fetchBalance();

    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);

    return () => clearInterval(interval);
  }, [publicKey, connected, connection, setBalance]);

  // This component doesn't render anything
  return null;
}
