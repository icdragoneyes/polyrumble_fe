# API Integration Guide

## Overview

The frontend communicates with the backend through two channels:
- **REST API** for request/response operations
- **WebSocket** for real-time updates

## REST API Client

### Configuration

**Location**: `src/services/api.ts`

**Base Setup**:
```typescript
import axios from 'axios'
import { env } from '../config/env'

const apiClient = axios.create({
  baseURL: env.apiUrl,        // http://localhost:3333
  timeout: 30000,             // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### Request Interceptor

Automatically adds authentication token to requests:

```typescript
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Debug logging
    if (env.enableDebug) {
      console.log('[API Request]', config.method?.toUpperCase(), config.url)
    }

    return config
  },
  (error) => Promise.reject(error)
)
```

### Response Interceptor

Handles errors and automatic redirects:

```typescript
apiClient.interceptors.response.use(
  (response) => {
    if (env.enableDebug) {
      console.log('[API Response]', response.config.url, response.status)
    }
    return response
  },
  (error) => {
    const { status, data } = error.response

    switch (status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('auth_token')
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login'
        }
        break

      case 403:
        console.error('Access forbidden')
        break

      case 404:
        console.error('Resource not found')
        break

      case 500:
        console.error('Server error')
        break
    }

    return Promise.reject(error)
  }
)
```

---

## API Endpoints

### Pool Endpoints

**List All Pools**:
```typescript
api.pools.list()

// Usage with React Query
const { data } = useQuery({
  queryKey: ['pools'],
  queryFn: () => api.pools.list(),
})

// Response
{
  success: true,
  data: [
    {
      id: "uuid",
      poolNumber: 1,
      rumbleId: "rumble-uuid",
      traderA: "Trader A Name",
      traderB: "Trader B Name",
      status: "active",
      totalPoolSize: "1000.00",
      createdAt: "2025-01-07T10:00:00.000Z"
    }
  ]
}
```

**Get Single Pool**:
```typescript
api.pools.get(poolId)

// Usage
const { data: pool } = useQuery({
  queryKey: ['pools', poolId],
  queryFn: () => api.pools.get(poolId),
})
```

**Get Active Pools**:
```typescript
api.pools.active()

// Usage
const { data: activePools } = useQuery({
  queryKey: ['pools', 'active'],
  queryFn: () => api.pools.active(),
  refetchInterval: 30000, // Refresh every 30s
})
```

### Bet Endpoints

**List User Bets**:
```typescript
api.bets.list(walletAddress)

// Usage
const { data: bets } = useQuery({
  queryKey: ['bets', walletAddress],
  queryFn: () => api.bets.list(walletAddress),
  enabled: !!walletAddress,
})
```

**Get Single Bet**:
```typescript
api.bets.get(betId)

// Usage
const { data: bet } = useQuery({
  queryKey: ['bets', betId],
  queryFn: () => api.bets.get(betId),
})
```

**Create Bet**:
```typescript
api.bets.create({
  poolId: 'pool-uuid',
  side: 'yes' | 'no',
  amount: 100,
})

// Usage with mutation
const mutation = useMutation({
  mutationFn: (data) => api.bets.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['bets'] })
  },
})

// Call mutation
mutation.mutate({
  poolId: 'abc123',
  side: 'yes',
  amount: 100,
})
```

**Get Pool Bets**:
```typescript
api.bets.poolBets(poolId)

// Usage
const { data: poolBets } = useQuery({
  queryKey: ['bets', 'pool', poolId],
  queryFn: () => api.bets.poolBets(poolId),
})
```

### User Endpoints

**Get User Profile**:
```typescript
api.users.get(walletAddress)

// Usage
const { data: user } = useQuery({
  queryKey: ['users', walletAddress],
  queryFn: () => api.users.get(walletAddress),
  enabled: !!walletAddress,
})
```

**Get User Statistics**:
```typescript
api.users.stats(walletAddress)

// Usage
const { data: stats } = useQuery({
  queryKey: ['users', walletAddress, 'stats'],
  queryFn: () => api.users.stats(walletAddress),
})

// Response
{
  success: true,
  data: {
    totalBets: 25,
    totalWinnings: 5000.50,
    winRate: 0.68
  }
}
```

### Admin Endpoints

**Admin Login**:
```typescript
api.admin.login({ email, password })

// Usage
const mutation = useMutation({
  mutationFn: (credentials) => api.admin.login(credentials),
  onSuccess: (response) => {
    // Store token
    localStorage.setItem('auth_token', response.data.token)
    // Redirect to dashboard
    navigate('/admin/dashboard')
  },
})
```

**Admin Stats**:
```typescript
api.admin.stats()

// Usage
const { data: adminStats } = useQuery({
  queryKey: ['admin', 'stats'],
  queryFn: () => api.admin.stats(),
})
```

**Admin Pool Management**:
```typescript
// List pools with pagination
api.admin.pools.list({
  page: 1,
  perPage: 20,
  status: 'active'
})

// Create pool
api.admin.pools.create({
  rumbleId: 'rumble-uuid',
  traderA: 'Trader A',
  traderB: 'Trader B',
  duration: 3600,
})

// Update pool
api.admin.pools.update(poolId, {
  status: 'locked'
})

// Delete pool
api.admin.pools.delete(poolId)

// Lock pool
api.admin.pools.lock(poolId)

// Settle pool
api.admin.pools.settle(poolId, {
  winningSide: 'yes'
})
```

---

## React Query Integration

### Query Patterns

**Basic Query**:
```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

function PoolList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pools'],
    queryFn: () => api.pools.list(),
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      {data?.data.map(pool => (
        <PoolCard key={pool.id} pool={pool} />
      ))}
    </div>
  )
}
```

**Query with Options**:
```typescript
const { data } = useQuery({
  queryKey: ['pools', 'active'],
  queryFn: () => api.pools.active(),
  staleTime: 5000,           // Data fresh for 5 seconds
  cacheTime: 60000,          // Cache for 1 minute
  refetchInterval: 30000,    // Auto-refetch every 30 seconds
  refetchOnWindowFocus: true, // Refetch when window focused
  retry: 2,                  // Retry failed requests twice
})
```

**Dependent Queries**:
```typescript
function UserBets({ walletAddress }: { walletAddress: string }) {
  // Only fetch bets if user exists
  const { data: user } = useQuery({
    queryKey: ['users', walletAddress],
    queryFn: () => api.users.get(walletAddress),
  })

  const { data: bets } = useQuery({
    queryKey: ['bets', walletAddress],
    queryFn: () => api.bets.list(walletAddress),
    enabled: !!user?.data, // Wait for user to load
  })

  return <div>...</div>
}
```

### Mutation Patterns

**Basic Mutation**:
```typescript
function PlaceBet({ poolId }: { poolId: string }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: BetData) => api.bets.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['pools'] })
    },
    onError: (error) => {
      console.error('Failed to place bet:', error)
      alert('Failed to place bet')
    },
  })

  const handleSubmit = (amount: number, side: 'yes' | 'no') => {
    mutation.mutate({ poolId, amount, side })
  }

  return (
    <form>
      {mutation.isPending && <LoadingSpinner />}
      {mutation.isError && <ErrorMessage error={mutation.error} />}
      {mutation.isSuccess && <SuccessMessage />}
      <button onClick={() => handleSubmit(100, 'yes')}>
        Place Bet
      </button>
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

    // Optimistically update UI
    queryClient.setQueryData(['bets'], (old: any) => ({
      ...old,
      data: [...old.data, { id: 'temp-id', ...newBet, status: 'pending' }]
    }))

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

---

## WebSocket Client

### Configuration

**Location**: `src/services/websocket.ts`

```typescript
import { io, Socket } from 'socket.io-client'
import { env } from '../config/env'

class WebSocketService {
  private socket: Socket | null = null
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket
    }

    const wsUrl = env.apiUrl.replace('/api/v1', '')

    this.socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
    })

    this.setupEventListeners()

    return this.socket
  }

  private setupEventListeners() {
    this.socket?.on('connect', () => {
      console.log('[WebSocket] Connected')
      this.socket?.emit('join_room', { room: 'global' })
    })

    this.socket?.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason)
    })

    this.socket?.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error)
    })
  }
}

export const websocketService = new WebSocketService()
```

### Event Types

```typescript
// Pool updated
interface PoolUpdatedEvent {
  type: 'pool:updated'
  data: {
    poolId: string
    poolNumber: number
    poolATotal: string
    poolBTotal: string
    totalPoolSize: string
  }
  timestamp: string
}

// Pool created
interface PoolCreatedEvent {
  type: 'pool:created'
  data: {
    poolId: string
    poolNumber: number
    rumbleId: string
    totalPoolSize: string
    status: string
  }
  timestamp: string
}

// Pool status changed
interface PoolStatusChangedEvent {
  type: 'pool:status_changed'
  data: {
    poolId: string
    oldStatus: string
    newStatus: string
  }
  timestamp: string
}

// Pool cancelled
interface PoolCancelledEvent {
  type: 'pool:cancelled'
  data: {
    poolId: string
    poolNumber: number
    status: string
    isCancelled: boolean
  }
  timestamp: string
}
```

### useWebSocket Hook

**Location**: `src/hooks/useWebSocket.ts`

```typescript
import { useEffect, useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import websocketService from '../services/websocket'

export function useWebSocket() {
  const queryClient = useQueryClient()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = websocketService.connect()

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    setIsConnected(socket.connected)

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  const onPoolUpdated = useCallback(
    (callback: (event: PoolUpdatedEvent) => void) => {
      websocketService.onPoolUpdated((event) => {
        callback(event)
        queryClient.invalidateQueries({ queryKey: ['pools'] })
      })

      return () => websocketService.off('pool:updated')
    },
    [queryClient]
  )

  return {
    isConnected,
    onPoolUpdated,
    onPoolCreated,
    onPoolStatusChanged,
    onPoolCancelled,
  }
}
```

### Usage Example

```typescript
function PoolUpdates() {
  const { isConnected, onPoolUpdated, onPoolCreated } = useWebSocket()
  const updatePool = usePoolStore(state => state.updatePool)

  useEffect(() => {
    const cleanup1 = onPoolUpdated((event) => {
      console.log('Pool updated:', event.data)
      updatePool(event.data.poolId, {
        totalPoolSize: event.data.totalPoolSize,
      })
    })

    const cleanup2 = onPoolCreated((event) => {
      console.log('New pool created:', event.data)
      // Refetch pools list
    })

    return () => {
      cleanup1()
      cleanup2()
    }
  }, [onPoolUpdated, onPoolCreated, updatePool])

  return (
    <div>
      WebSocket: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
    </div>
  )
}
```

---

## Error Handling

### API Error Types

```typescript
interface ApiError {
  error: string
  message: string
  statusCode: number
}
```

### Handling Errors

**In Components**:
```typescript
const { data, error, isError } = useQuery({
  queryKey: ['pools'],
  queryFn: () => api.pools.list(),
})

if (isError) {
  return (
    <div className="error">
      <h3>Error loading pools</h3>
      <p>{error.message}</p>
    </div>
  )
}
```

**In Mutations**:
```typescript
const mutation = useMutation({
  mutationFn: (data) => api.bets.create(data),
  onError: (error: any) => {
    const message = error.response?.data?.message || 'An error occurred'
    toast.error(message)
  },
})
```

**Global Error Boundary**:
```typescript
// See components/common/ErrorBoundary.tsx
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

---

## Best Practices

### 1. Use TypeScript Types

```typescript
// Define API response types
import type { ApiResponse, Pool, Bet } from '@/types'

const { data } = useQuery<ApiResponse<Pool[]>>({
  queryKey: ['pools'],
  queryFn: () => api.pools.list(),
})
```

### 2. Centralize API Calls

```typescript
// Don't call axios directly in components
// ❌ Bad
const response = await axios.get('/api/v1/pools')

// ✅ Good
const response = await api.pools.list()
```

### 3. Handle Loading States

```typescript
const { data, isLoading, isFetching } = useQuery({
  queryKey: ['pools'],
  queryFn: () => api.pools.list(),
})

if (isLoading) return <LoadingSpinner />
if (isFetching) return <div>Updating...</div>
```

### 4. Invalidate Related Queries

```typescript
const mutation = useMutation({
  mutationFn: (data) => api.bets.create(data),
  onSuccess: () => {
    // Invalidate all related data
    queryClient.invalidateQueries({ queryKey: ['bets'] })
    queryClient.invalidateQueries({ queryKey: ['pools'] })
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
```

### 5. Use Query Keys Wisely

```typescript
// Hierarchical structure
['pools']                    // All pools
['pools', 'active']          // Active pools only
['pools', poolId]            // Single pool
['bets']                     // All bets
['bets', walletAddress]      // User's bets
['bets', 'pool', poolId]     // Pool's bets
```

---

**Last Updated**: 2025-01-07
**Version**: 1.0.0
