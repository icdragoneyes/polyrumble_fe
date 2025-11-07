# Development Guide

## Prerequisites

### Required Software

```
Node.js >= 18.0.0
npm >= 9.0.0 (or yarn >= 1.22.0)
```

### Recommended Tools

```
VS Code or WebStorm
Git
Solana CLI (optional, for blockchain testing)
```

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/polymarket-trader-rumble/frontend.git
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

This installs all dependencies listed in `package.json`.

### 3. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit with your configuration
nano .env
```

**Environment Variables:**

```env
# API Configuration
VITE_API_URL=http://localhost:3333
VITE_WS_URL=ws://localhost:3333

# Solana Configuration
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_SOLANA_NETWORK=devnet

# Program IDs (Optional for development)
VITE_BETTING_PROGRAM_ID=

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### 4. Start Development Server

```bash
npm run dev
```

Application runs at `http://localhost:5173` with hot module replacement enabled.

---

## Development Commands

### Core Commands

```bash
# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Type check
npm run typecheck
```

### Development Workflow

```bash
# Terminal 1: Run development server
npm run dev

# Terminal 2: Run backend API (in admin directory)
cd ../admin && npm run dev

# Terminal 3: Watch TypeScript types
npm run typecheck -- --watch
```

---

## Project Structure Deep Dive

### Source Directory Organization

```
src/
├── components/              # React components
│   ├── admin/              # Admin dashboard components
│   │   ├── PoolForm.tsx
│   │   ├── BetList.tsx
│   │   └── StatsCard.tsx
│   ├── betting/            # Betting interface components
│   │   ├── PoolCard.tsx
│   │   ├── BetForm.tsx
│   │   └── PoolList.tsx
│   ├── common/             # Shared components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── ErrorBoundary.tsx
│   └── layout/             # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
├── config/                 # Configuration
│   └── env.ts             # Environment variables
├── hooks/                  # Custom React hooks
│   ├── useWebSocket.ts    # WebSocket integration
│   ├── useWallet.ts       # Wallet utilities
│   └── usePools.ts        # Pool data fetching
├── lib/                    # Core libraries
│   ├── queryClient.ts     # React Query setup
│   ├── router.tsx         # React Router config
│   ├── utils.ts           # Utility functions
│   └── walletConfig.tsx   # Solana wallet setup
├── pages/                  # Page components
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   └── LoginPage.tsx
│   └── betting/
│       └── HomePage.tsx
├── services/               # API services
│   ├── api.ts             # REST API client
│   └── websocket.ts       # WebSocket client
├── stores/                 # Zustand stores
│   ├── betStore.ts        # Bet state
│   ├── poolStore.ts       # Pool state
│   ├── walletStore.ts     # Wallet state
│   └── index.ts           # Store exports
├── types/                  # TypeScript types
│   └── index.ts
├── App.tsx                 # Root component
├── main.tsx                # Entry point
└── index.css               # Global styles
```

---

## Code Style & Conventions

### TypeScript Conventions

**Function Components:**
```typescript
import { FC } from 'react'

interface PoolCardProps {
  pool: Pool
  onSelect?: (pool: Pool) => void
}

export const PoolCard: FC<PoolCardProps> = ({ pool, onSelect }) => {
  // Component logic
  return <div>{/* JSX */}</div>
}
```

**Hooks:**
```typescript
export function usePoolData(poolId: string) {
  return useQuery({
    queryKey: ['pools', poolId],
    queryFn: () => api.pools.get(poolId),
  })
}
```

**Type Definitions:**
```typescript
// types/index.ts
export interface Pool {
  id: string
  status: 'active' | 'locked' | 'settled' | 'cancelled'
  traderA: string
  traderB: string
  totalPoolSize: string
}
```

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `PoolCard.tsx`)
- Hooks: `camelCase.ts` (e.g., `useWebSocket.ts`)
- Utilities: `camelCase.ts` (e.g., `formatters.ts`)
- Types: `camelCase.ts` or `index.ts`

**Variables:**
- Constants: `UPPER_SNAKE_CASE`
- Functions: `camelCase`
- Components: `PascalCase`
- Types/Interfaces: `PascalCase`

**Example:**
```typescript
// Constants
const MAX_RETRIES = 3

// Component
export const PoolCard: FC<PoolCardProps> = ({ pool }) => {
  // State
  const [isExpanded, setIsExpanded] = useState(false)

  // Function
  const handleClick = () => setIsExpanded(!isExpanded)

  return <div onClick={handleClick}>{pool.title}</div>
}
```

### Import Organization

```typescript
// 1. External libraries
import { FC, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal modules (using aliases)
import { api } from '@/services/api'
import { usePoolStore } from '@/stores/poolStore'
import { Pool } from '@/types'

// 3. Relative imports
import { PoolCard } from './PoolCard'
import styles from './styles.module.css'
```

---

## State Management

### Zustand Store Pattern

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface PoolState {
  // State
  pools: Map<string, Pool>
  selectedPoolId: string | null

  // Actions
  setPools: (pools: Pool[]) => void
  setSelectedPoolId: (id: string | null) => void

  // Selectors
  getPool: (id: string) => Pool | undefined
}

export const usePoolStore = create<PoolState>()(
  devtools(
    (set, get) => ({
      // Initial state
      pools: new Map(),
      selectedPoolId: null,

      // Actions
      setPools: (pools) => set({
        pools: new Map(pools.map(p => [p.id, p]))
      }),

      setSelectedPoolId: (id) => set({ selectedPoolId: id }),

      // Selectors
      getPool: (id) => get().pools.get(id),
    }),
    { name: 'PoolStore' }
  )
)
```

### React Query Pattern

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'

// Fetch pools
export function usePools() {
  return useQuery({
    queryKey: ['pools'],
    queryFn: () => api.pools.list(),
    staleTime: 5000,
    refetchInterval: 30000,
  })
}

// Create bet mutation
export function useCreateBet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BetData) => api.bets.create(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['pools'] })
    },
  })
}
```

---

## Component Development

### Creating New Components

**1. Create component file:**
```bash
touch src/components/betting/NewComponent.tsx
```

**2. Component template:**
```typescript
import { FC } from 'react'

interface NewComponentProps {
  title: string
  onAction?: () => void
}

export const NewComponent: FC<NewComponentProps> = ({ title, onAction }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
      {onAction && (
        <button onClick={onAction} className="mt-2 btn-primary">
          Action
        </button>
      )}
    </div>
  )
}
```

**3. Export from index (if needed):**
```typescript
// components/betting/index.ts
export { NewComponent } from './NewComponent'
export { PoolCard } from './PoolCard'
```

### Component Best Practices

**Use hooks for logic:**
```typescript
export const PoolCard: FC<PoolCardProps> = ({ pool }) => {
  // Custom hook for data fetching
  const { data: bets } = usePoolBets(pool.id)

  // Custom hook for WebSocket
  const { isConnected } = useWebSocket()

  // Component logic
  const handleBet = () => {
    // ...
  }

  return <div>{/* UI */}</div>
}
```

**Memoize expensive computations:**
```typescript
const sortedPools = useMemo(
  () => pools.sort((a, b) => a.totalPoolSize - b.totalPoolSize),
  [pools]
)
```

**Use callback for event handlers:**
```typescript
const handleClick = useCallback(
  (poolId: string) => {
    onSelect(poolId)
  },
  [onSelect]
)
```

---

## API Integration

### Making API Calls

**Using React Query:**
```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

function PoolList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pools'],
    queryFn: () => api.pools.list(),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.data.map(pool => (
        <PoolCard key={pool.id} pool={pool} />
      ))}
    </div>
  )
}
```

**Adding new API endpoints:**
```typescript
// services/api.ts
export const api = {
  pools: {
    list: () => apiClient.get<ApiResponse<Pool[]>>('/api/v1/pools'),
    get: (id: string) => apiClient.get<ApiResponse<Pool>>(`/api/v1/pools/${id}`),
    // Add new endpoint
    featured: () => apiClient.get<ApiResponse<Pool[]>>('/api/v1/pools/featured'),
  },
}
```

---

## WebSocket Integration

### Using WebSocket Hook

```typescript
import { useEffect } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { usePoolStore } from '@/stores/poolStore'

export function PoolUpdates() {
  const { isConnected, onPoolUpdated } = useWebSocket()
  const updatePool = usePoolStore(state => state.updatePool)

  useEffect(() => {
    const cleanup = onPoolUpdated((event) => {
      console.log('Pool updated:', event.data)
      updatePool(event.data.poolId, {
        totalPoolSize: event.data.totalPoolSize,
      })
    })

    return cleanup
  }, [onPoolUpdated, updatePool])

  return (
    <div>
      Status: {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  )
}
```

---

## Debugging

### React DevTools

Install browser extension:
- Chrome: [React Developer Tools](https://chrome.google.com/webstore)
- Firefox: [React Developer Tools](https://addons.mozilla.org/en-US/firefox/)

Features:
- Component tree inspection
- Props and state viewing
- Performance profiling

### Zustand DevTools

Automatically enabled in development:

```typescript
// Already configured in stores
devtools(
  (set, get) => ({ /* store */ }),
  { name: 'PoolStore' }
)
```

Open Redux DevTools in browser to inspect Zustand state.

### React Query DevTools

Add to your app:

```typescript
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

### Console Debugging

```typescript
// Enable debug mode in .env
VITE_ENABLE_DEBUG=true

// Debug logs are automatically shown
// See config/env.ts and services/api.ts
```

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

---

## Testing

### Unit Tests (Example)

```typescript
import { render, screen } from '@testing-library/react'
import { PoolCard } from './PoolCard'

describe('PoolCard', () => {
  it('renders pool information', () => {
    const pool = {
      id: '1',
      traderA: 'Trader A',
      traderB: 'Trader B',
      status: 'active',
    }

    render(<PoolCard pool={pool} />)

    expect(screen.getByText('Trader A')).toBeInTheDocument()
    expect(screen.getByText('Trader B')).toBeInTheDocument()
  })
})
```

---

## Build & Optimization

### Production Build

```bash
npm run build
```

Output: `dist/` directory

### Build Analysis

```bash
# Install bundle analyzer
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    // ...
    visualizer({ open: true })
  ]
})

# Build and open analyzer
npm run build
```

### Performance Optimization

**1. Code Splitting:**
```typescript
// Lazy load routes
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

// Lazy load components
const HeavyComponent = lazy(() => import('./components/HeavyComponent'))
```

**2. Memoization:**
```typescript
const expensiveValue = useMemo(() => computeExpensive(data), [data])
```

**3. Virtualization:**
```typescript
// For long lists, use virtualization
import { VirtualList } from 'react-virtual'
```

---

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

---

**Last Updated**: 2025-01-07
**Version**: 1.0.0
