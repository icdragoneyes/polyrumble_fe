import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Pool } from '../types';

interface PoolState {
  // State
  pools: Map<string, Pool>;
  activePools: string[];
  selectedPoolId: string | null;

  // Actions
  setPools: (pools: Pool[]) => void;
  addPool: (pool: Pool) => void;
  updatePool: (poolId: string, updates: Partial<Pool>) => void;
  removePool: (poolId: string) => void;
  setSelectedPoolId: (poolId: string | null) => void;

  // Selectors (computed)
  getPool: (poolId: string) => Pool | undefined;
  getActivePools: () => Pool[];
}

export const usePoolStore = create<PoolState>()(
  devtools(
    (set, get) => ({
      // Initial state
      pools: new Map(),
      activePools: [],
      selectedPoolId: null,

      // Actions
      setPools: (pools) => {
        const poolMap = new Map(pools.map(pool => [pool.id, pool]));
        const active = pools
          .filter(p => p.status === 'active')
          .map(p => p.id);

        set({ pools: poolMap, activePools: active });
      },

      addPool: (pool) => set((state) => {
        const pools = new Map(state.pools);
        pools.set(pool.id, pool);

        const activePools = pool.status === 'active'
          ? [...state.activePools, pool.id]
          : state.activePools;

        return { pools, activePools };
      }),

      updatePool: (poolId, updates) => set((state) => {
        const pool = state.pools.get(poolId);
        if (!pool) return state;

        const updatedPool = { ...pool, ...updates };
        const pools = new Map(state.pools);
        pools.set(poolId, updatedPool);

        // Update activePools if status changed
        let activePools = state.activePools;
        if (updates.status) {
          if (updates.status === 'active' && !activePools.includes(poolId)) {
            activePools = [...activePools, poolId];
          } else if (updates.status !== 'active') {
            activePools = activePools.filter(id => id !== poolId);
          }
        }

        return { pools, activePools };
      }),

      removePool: (poolId) => set((state) => {
        const pools = new Map(state.pools);
        pools.delete(poolId);

        const activePools = state.activePools.filter(id => id !== poolId);

        return { pools, activePools };
      }),

      setSelectedPoolId: (poolId) => set({ selectedPoolId: poolId }),

      // Selectors
      getPool: (poolId) => get().pools.get(poolId),

      getActivePools: () => {
        const state = get();
        return state.activePools
          .map(id => state.pools.get(id))
          .filter((pool): pool is Pool => pool !== undefined);
      },
    }),
    { name: 'PoolStore' }
  )
);
