import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface WalletState {
  // Wallet connection state
  connected: boolean;
  publicKey: string | null;
  balance: number;

  // Actions
  setConnected: (connected: boolean) => void;
  setPublicKey: (publicKey: string | null) => void;
  setBalance: (balance: number) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(
  devtools(
    (set) => ({
      // Initial state
      connected: false,
      publicKey: null,
      balance: 0,

      // Actions
      setConnected: (connected) => {
        console.log('[WalletStore] setConnected called with:', connected);
        set({ connected });
      },

      setPublicKey: (publicKey) => {
        console.log('[WalletStore] setPublicKey called with:', publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : null);
        set({ publicKey });
      },

      setBalance: (balance) => {
        console.log('[WalletStore] setBalance called with:', balance, 'SOL');
        set({ balance });
      },

      disconnect: () => {
        console.log('[WalletStore] disconnect called');
        set({
          connected: false,
          publicKey: null,
          balance: 0,
        });
      },
    }),
    { name: 'WalletStore' }
  )
);
