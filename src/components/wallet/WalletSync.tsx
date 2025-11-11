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
      setBalance(0);
      return;
    }

    const fetchBalance = async () => {
      try {
        const balance = await connection.getBalance(publicKey);
        // Convert lamports to SOL
        setBalance(balance / 1_000_000_000);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
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
