import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Bet } from '../types';

interface BetState {
  // State
  bets: Map<string, Bet>;
  userBets: string[];
  pendingBets: string[];

  // Actions
  setBets: (bets: Bet[]) => void;
  addBet: (bet: Bet) => void;
  updateBet: (betId: string, updates: Partial<Bet>) => void;
  removeBet: (betId: string) => void;

  // Selectors
  getBet: (betId: string) => Bet | undefined;
  getUserBets: () => Bet[];
  getPendingBets: () => Bet[];
  getBetsByPool: (poolId: string) => Bet[];
}

export const useBetStore = create<BetState>()(
  devtools(
    (set, get) => ({
      // Initial state
      bets: new Map(),
      userBets: [],
      pendingBets: [],

      // Actions
      setBets: (bets) => {
        const betMap = new Map(bets.map(bet => [bet.id, bet]));
        const userBets = bets.map(b => b.id);
        const pendingBets = bets
          .filter(b => b.status === 'pending')
          .map(b => b.id);

        set({ bets: betMap, userBets, pendingBets });
      },

      addBet: (bet) => set((state) => {
        const bets = new Map(state.bets);
        bets.set(bet.id, bet);

        const userBets = [...state.userBets, bet.id];
        const pendingBets = bet.status === 'pending'
          ? [...state.pendingBets, bet.id]
          : state.pendingBets;

        return { bets, userBets, pendingBets };
      }),

      updateBet: (betId, updates) => set((state) => {
        const bet = state.bets.get(betId);
        if (!bet) return state;

        const updatedBet = { ...bet, ...updates };
        const bets = new Map(state.bets);
        bets.set(betId, updatedBet);

        // Update pendingBets if status changed
        let pendingBets = state.pendingBets;
        if (updates.status) {
          if (updates.status === 'pending' && !pendingBets.includes(betId)) {
            pendingBets = [...pendingBets, betId];
          } else if (updates.status !== 'pending') {
            pendingBets = pendingBets.filter(id => id !== betId);
          }
        }

        return { bets, pendingBets };
      }),

      removeBet: (betId) => set((state) => {
        const bets = new Map(state.bets);
        bets.delete(betId);

        const userBets = state.userBets.filter(id => id !== betId);
        const pendingBets = state.pendingBets.filter(id => id !== betId);

        return { bets, userBets, pendingBets };
      }),

      // Selectors
      getBet: (betId) => get().bets.get(betId),

      getUserBets: () => {
        const state = get();
        return state.userBets
          .map(id => state.bets.get(id))
          .filter((bet): bet is Bet => bet !== undefined);
      },

      getPendingBets: () => {
        const state = get();
        return state.pendingBets
          .map(id => state.bets.get(id))
          .filter((bet): bet is Bet => bet !== undefined);
      },

      getBetsByPool: (poolId) => {
        const state = get();
        return Array.from(state.bets.values())
          .filter(bet => bet.poolId === poolId);
      },
    }),
    { name: 'BetStore' }
  )
);
