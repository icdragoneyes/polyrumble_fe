# State Management Guide

## Overview

The application uses a hybrid state management approach:
- **Zustand** for client-side application state
- **TanStack React Query** for server-side data management

This separation provides optimal performance and developer experience.

## Zustand Stores (Client State)

### Architecture

```
Store Layer
├── Pool Store (poolStore.ts)
├── Bet Store (betStore.ts)
└── Wallet Store (walletStore.ts)
```

### Pool Store

**Location**: `src/stores/poolStore.ts`

**Purpose**: Manages betting pool state and selections

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Pool } from '../types'

interface PoolState {
  // State
  pools: Map<string, Pool>
  activePools: string[]
  selectedPoolId: string | null

  // Actions
  setPools: (pools: Pool[]) => void
  addPool: (pool: Pool) => void
  updatePool: (poolId: string, updates: Partial<Pool>) => void
  removePool: (poolId: string) => void
  setSelectedPoolId: (poolId: string | null) => void

  // Selectors
  getPool: (poolId: string) => Pool | undefined
  getActivePools: () => Pool[]
}
```

**Key Features**:
- Uses `Map` for O(1) lookups
- Tracks active pools separately for quick access
- Provides selector functions for derived state

**Usage Example**:
```typescript
import { usePoolStore } from '@/stores/poolStore'

function PoolList() {
  // Subscribe to specific state
  const pools = usePoolStore(state => state.pools)
  const activePools = usePoolStore(state => state.getActivePools())

  // Get actions
  const updatePool = usePoolStore(state => state.updatePool)
  const setSelectedPoolId = usePoolStore(state => state.setSelectedPoolId)

  const handleSelect = (poolId: string) => {
    setSelectedPoolId(poolId)
  }

  return (
    <div>
      {activePools.map(pool => (
        <PoolCard
          key={pool.id}
          pool={pool}
          onSelect={() => handleSelect(pool.id)}
        />
      ))}
    </div>
  )
}
```

**Optimized Selectors**:
```typescript
// Only re-render when specific pool changes
const pool = usePoolStore(state => state.getPool('pool-123'))

// Only re-render when active pools change
const activePools = usePoolStore(state => state.getActivePools())
```

### Bet Store

**Location**: `src/stores/betStore.ts`

**Purpose**: Manages user bets and bet history

```typescript
interface BetState {
  // State
  bets: Map<string, Bet>
  userBets: string[]
  pendingBets: string[]

  // Actions
  setBets: (bets: Bet[]) => void
  addBet: (bet: Bet) => void
  updateBet: (betId: string, updates: Partial<Bet>) => void
  removeBet: (betId: string) => void

  // Selectors
  getBet: (betId: string) => Bet | undefined
  getUserBets: () => Bet[]
  getPendingBets: () => Bet[]
  getBetsByPool: (poolId: string) => Bet[]
}
```

**Usage Example**:
```typescript
function MyBets() {
  const userBets = useBetStore(state => state.getUserBets())
  const pendingBets = useBetStore(state => state.getPendingBets())

  return (
    <div>
      <h3>Pending Bets ({pendingBets.length})</h3>
      {pendingBets.map(bet => (
        <BetCard key={bet.id} bet={bet} />
      ))}

      <h3>All Bets ({userBets.length})</h3>
      {userBets.map(bet => (
        <BetCard key={bet.id} bet={bet} />
      ))}
    </div>
  )
}
```

**Filter by Pool**:
```typescript
const poolBets = useBetStore(state => state.getBetsByPool(poolId))
```

### Wallet Store

**Location**: `src/stores/walletStore.ts`

**Purpose**: Manages wallet connection state

```typescript
interface WalletState {
  // State
  connected: boolean
  publicKey: string | null
  balance: number

  // Actions
  setConnected: (connected: boolean) => void
  setPublicKey: (publicKey: string | null) => void
  setBalance: (balance: number) => void
  disconnect: () => void
}
```

**Usage Example**:
```typescript
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletStore } from '@/stores/walletStore'

function WalletButton() {
  const { connect, disconnect } = useWallet()
  const walletStore = useWalletStore()

  const handleConnect = async () => {
    await connect()
    walletStore.setConnected(true)
  }

  const handleDisconnect = async () => {
    await disconnect()
    walletStore.disconnect()
  }

  return (
    <button onClick={walletStore.connected ? handleDisconnect : handleConnect}>
      {walletStore.connected ? 'Disconnect' : 'Connect Wallet'}
    </button>
  )
}
```

### Store Best Practices

**1. Use Selectors**:
```typescript
// ❌ Bad - re-renders on any store change
const store = usePoolStore()

// ✅ Good - only re-renders when pools change
const pools = usePoolStore(state => state.pools)
```

**2. Shallow Equality for Objects**:
```typescript
import { shallow } from 'zustand/shallow'

// Only re-render if both values change
const { pools, activePools } = usePoolStore(
  state => ({ pools: state.pools, activePools: state.activePools }),
  shallow
)
```

**3. Actions Outside Components**:
```typescript
// Can be called from anywhere
import { usePoolStore } from '@/stores/poolStore'

export function updatePoolFromWebSocket(poolId: string, data: Partial<Pool>) {
  const updatePool = usePoolStore.getState().updatePool
  updatePool(poolId, data)
}
```

---

## React Query (Server State)

### Configuration

**Location**: `src/lib/queryClient.ts`

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,           // Data fresh for 5 seconds
      cacheTime: 5 * 60 * 1000,  // Cache for 5 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
})
```

### Query Patterns

**Basic Query**:
```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

function PoolList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pools'],
    queryFn: () => api.pools.list(),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading pools</div>

  return (
    <div>
      {data?.data.map(pool => (
        <PoolCard key={pool.id} pool={pool} />
      ))}
    </div>
  )
}
```

**Query with Parameters**:
```typescript
function PoolDetail({ poolId }: { poolId: string }) {
  const { data: pool } = useQuery({
    queryKey: ['pools', poolId],
    queryFn: () => api.pools.get(poolId),
    enabled: !!poolId, // Only run if poolId exists
  })

  return <div>{pool?.data.title}</div>
}
```

**Dependent Queries**:
```typescript
function UserBets({ walletAddress }: { walletAddress: string }) {
  // First query
  const { data: user } = useQuery({
    queryKey: ['users', walletAddress],
    queryFn: () => api.users.get(walletAddress),
  })

  // Second query depends on first
  const { data: bets } = useQuery({
    queryKey: ['bets', walletAddress],
    queryFn: () => api.bets.list(walletAddress),
    enabled: !!user?.data, // Only run after user is loaded
  })

  return <div>Bets: {bets?.data.length}</div>
}
```

**Polling**:
```typescript
// Auto-refetch every 30 seconds
const { data: pools } = useQuery({
  queryKey: ['pools'],
  queryFn: () => api.pools.list(),
  refetchInterval: 30000,
})
```

### Mutation Patterns

**Basic Mutation**:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

function PlaceBet({ poolId }: { poolId: string }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: BetData) => api.bets.create(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['pools', poolId] })
    },
  })

  const handleSubmit = (amount: number, side: 'yes' | 'no') => {
    mutation.mutate({ poolId, amount, side })
  }

  return (
    <form onSubmit={() => handleSubmit(100, 'yes')}>
      {mutation.isPending && <div>Submitting...</div>}
      {mutation.isError && <div>Error: {mutation.error.message}</div>}
      {mutation.isSuccess && <div>Bet placed!</div>}
    </form>
  )
}
```

**Optimistic Updates**:
```typescript
const mutation = useMutation({
  mutationFn: (data: BetData) => api.bets.create(data),
  onMutate: async (newBet) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['bets'] })

    // Snapshot previous value
    const previousBets = queryClient.getQueryData(['bets'])

    // Optimistically update
    queryClient.setQueryData(['bets'], (old: any) => {
      return {
        ...old,
        data: [...old.data, newBet]
      }
    })

    return { previousBets }
  },
  onError: (err, newBet, context) => {
    // Rollback on error
    queryClient.setQueryData(['bets'], context?.previousBets)
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['bets'] })
  },
})
```

### Cache Management

**Invalidate Queries**:
```typescript
// Invalidate all pools queries
queryClient.invalidateQueries({ queryKey: ['pools'] })

// Invalidate specific pool
queryClient.invalidateQueries({ queryKey: ['pools', poolId] })

// Invalidate multiple
queryClient.invalidateQueries({ queryKey: ['pools'] })
queryClient.invalidateQueries({ queryKey: ['bets'] })
```

**Prefetch Data**:
```typescript
// Prefetch for better UX
const handleMouseEnter = (poolId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['pools', poolId],
    queryFn: () => api.pools.get(poolId),
  })
}
```

**Manual Cache Update**:
```typescript
// Update cache without refetching
queryClient.setQueryData(['pools', poolId], (oldData: any) => {
  return {
    ...oldData,
    data: {
      ...oldData.data,
      totalPoolSize: newSize,
    }
  }
})
```

---

## WebSocket Integration with State

### Real-Time Updates

**Hook**: `src/hooks/useWebSocket.ts`

```typescript
import { useEffect } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { usePoolStore } from '@/stores/poolStore'
import { useQueryClient } from '@tanstack/react-query'

function PoolUpdates() {
  const queryClient = useQueryClient()
  const updatePool = usePoolStore(state => state.updatePool)
  const { onPoolUpdated, onPoolCreated } = useWebSocket()

  useEffect(() => {
    // Pool updated event
    const cleanup1 = onPoolUpdated((event) => {
      // Update Zustand store
      updatePool(event.data.poolId, {
        totalPoolSize: event.data.totalPoolSize,
      })

      // Invalidate React Query cache
      queryClient.invalidateQueries({
        queryKey: ['pools', event.data.poolId]
      })
    })

    // Pool created event
    const cleanup2 = onPoolCreated((event) => {
      queryClient.invalidateQueries({ queryKey: ['pools'] })
    })

    return () => {
      cleanup1()
      cleanup2()
    }
  }, [onPoolUpdated, onPoolCreated, updatePool, queryClient])

  return null
}
```

**Direct Cache Update (Faster)**:
```typescript
const cleanup = onPoolUpdated((event) => {
  // Update cache directly (no refetch)
  queryClient.setQueryData(['pools', event.data.poolId], (old: any) => {
    return {
      ...old,
      data: {
        ...old.data,
        totalPoolSize: event.data.totalPoolSize,
      }
    }
  })
})
```

---

## State Synchronization

### Syncing Zustand with React Query

```typescript
// Sync pools from API to Zustand store
function useSyncPools() {
  const setPools = usePoolStore(state => state.setPools)

  const { data } = useQuery({
    queryKey: ['pools'],
    queryFn: () => api.pools.list(),
  })

  useEffect(() => {
    if (data?.data) {
      setPools(data.data)
    }
  }, [data, setPools])
}

// Use in App component
function App() {
  useSyncPools()
  return <YourApp />
}
```

---

## Performance Optimization

### Memoization

```typescript
import { useMemo } from 'react'

function PoolList() {
  const pools = usePoolStore(state => state.pools)

  // Memoize expensive computation
  const sortedPools = useMemo(() => {
    return Array.from(pools.values())
      .sort((a, b) => Number(b.totalPoolSize) - Number(a.totalPoolSize))
  }, [pools])

  return (
    <div>
      {sortedPools.map(pool => (
        <PoolCard key={pool.id} pool={pool} />
      ))}
    </div>
  )
}
```

### Selector Optimization

```typescript
// Create selector outside component
const selectActivePools = (state: PoolState) => state.getActivePools()

function PoolList() {
  // Reuse selector
  const activePools = usePoolStore(selectActivePools)

  return <div>...</div>
}
```

---

## Debugging State

### Zustand DevTools

```typescript
// Already enabled in stores via devtools middleware
import { devtools } from 'zustand/middleware'

export const usePoolStore = create<PoolState>()(
  devtools(
    (set, get) => ({ /* store */ }),
    { name: 'PoolStore' } // Shows in Redux DevTools
  )
)
```

**View in Browser**:
1. Open Redux DevTools extension
2. Select "PoolStore", "BetStore", or "WalletStore"
3. See state changes in real-time

### React Query DevTools

```typescript
// Add to App.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}
```

**Features**:
- View all queries and their states
- See cache data
- Manually refetch or invalidate
- Track mutations

---

**Last Updated**: 2025-01-07
**Version**: 1.0.0
