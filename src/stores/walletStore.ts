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
      setConnected: (connected) => set({ connected }),

      setPublicKey: (publicKey) => set({ publicKey }),

      setBalance: (balance) => set({ balance }),

      disconnect: () => set({
        connected: false,
        publicKey: null,
        balance: 0,
      }),
    }),
    { name: 'WalletStore' }
  )
);
