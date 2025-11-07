# Architecture Overview

## Application Architecture

The Polymarket Trader Rumble frontend is built with a modern, scalable architecture using React 19, TypeScript, and Vite.

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Browser Client                         │
├──────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐  │
│  │              React Application                      │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │  Components (UI Layer)                      │   │  │
│  │  │  - Betting Pages                            │   │  │
│  │  │  - Admin Dashboard                          │   │  │
│  │  │  - Common Components                        │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │  State Management                           │   │  │
│  │  │  - Zustand Stores (Client State)            │   │  │
│  │  │  - React Query (Server State)               │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │  Services                                   │   │  │
│  │  │  - API Client (REST)                        │   │  │
│  │  │  - WebSocket Client                         │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │  Solana Integration                         │   │  │
│  │  │  - Wallet Adapter                           │   │  │
│  │  │  - Web3.js                                  │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
              ↕ HTTP/WebSocket           ↕ RPC
   ┌──────────────────────┐    ┌─────────────────────┐
   │   Backend API        │    │   Solana Blockchain │
   │   (AdonisJS)         │    │   (Devnet/Mainnet)  │
   └──────────────────────┘    └─────────────────────┘
```

## Core Technologies

### Framework & Build Tools

**React 19.1.1**
- Latest React with concurrent features
- Automatic batching for better performance
- Enhanced hooks and component patterns
- Better TypeScript support

**Vite 7.1.7**
- Lightning-fast HMR (Hot Module Replacement)
- Optimized build with Rollup
- Native ESM support
- Advanced code splitting

**TypeScript 5.9**
- Full type safety across the application
- Strict mode enabled
- Enhanced IDE support
- Better refactoring capabilities

### State Management

**Zustand 5.0.8** (Client State)
- Lightweight state management
- Minimal boilerplate
- DevTools integration
- Type-safe stores

**TanStack React Query 5.90.7** (Server State)
- Automatic caching and background refetching
- Optimistic updates
- Query invalidation
- Loading and error states

### Styling

**Tailwind CSS 4.1.17**
- Utility-first CSS framework
- Dark mode support
- Responsive design
- Custom theme configuration

**Headless UI & Radix UI**
- Accessible, unstyled components
- Full keyboard navigation
- ARIA attributes
- Customizable styling

### Blockchain Integration

**Solana Web3.js 1.95.8**
- Blockchain interactions
- Transaction building
- Account management
- RPC communication

**Wallet Adapter**
- Multi-wallet support (Phantom, Solflare)
- Auto-connect functionality
- Unified wallet interface
- React hooks for wallet state

### Data Fetching & Real-Time

**Axios 1.13.2**
- HTTP client for REST API
- Request/response interceptors
- Automatic retries
- Error handling

**Socket.io Client 4.8.1**
- WebSocket for real-time updates
- Auto-reconnection
- Room-based subscriptions
- Event-driven architecture

## Project Structure

```
frontend/
├── public/                     # Static assets
│   └── vite.svg
├── src/
│   ├── components/            # React components
│   │   ├── admin/            # Admin-specific components
│   │   ├── betting/          # Betting interface components
│   │   ├── common/           # Shared/reusable components
│   │   └── layout/           # Layout components
│   ├── config/               # Configuration files
│   │   └── env.ts           # Environment configuration
│   ├── hooks/                # Custom React hooks
│   │   └── useWebSocket.ts  # WebSocket integration hook
│   ├── lib/                  # Core libraries & utilities
│   │   ├── queryClient.ts   # React Query configuration
│   │   ├── router.tsx       # React Router setup
│   │   ├── utils.ts         # Utility functions
│   │   └── walletConfig.tsx # Solana wallet configuration
│   ├── pages/                # Page components
│   │   ├── admin/           # Admin pages
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── LoginPage.tsx
│   │   └── betting/         # Betting pages
│   │       └── HomePage.tsx
│   ├── services/             # API services
│   │   ├── api.ts           # REST API client
│   │   └── websocket.ts     # WebSocket client
│   ├── stores/               # Zustand state stores
│   │   ├── betStore.ts      # Bet state management
│   │   ├── poolStore.ts     # Pool state management
│   │   ├── walletStore.ts   # Wallet state management
│   │   └── index.ts         # Store exports
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── docs/                      # Documentation
├── .env.example               # Environment variables template
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies & scripts
```

## Design Patterns

### Component Architecture

**Composition Pattern**
```typescript
// App.tsx - Provider composition
<ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <WalletConfig>
      <RouterProvider router={router} />
    </WalletConfig>
  </QueryClientProvider>
</ErrorBoundary>
```

**Container/Presentational Pattern**
- Pages act as containers (business logic)
- Components are presentational (UI)
- Clear separation of concerns

### State Management Patterns

**Client State (Zustand)**
- UI state (selected pool, filters)
- User preferences
- Wallet connection state

**Server State (React Query)**
- Pool data from API
- Bet history
- User statistics
- Admin data

**Derived State**
- Computed values from stores
- Selectors for data transformation
- Memoized calculations

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
API Service Call → React Query Mutation
    ↓
Backend API
    ↓
WebSocket Event Broadcast
    ↓
WebSocket Client
    ↓
React Query Invalidation
    ↓
Component Re-render
```

## Module Organization

### Path Aliases

Configured in `vite.config.ts`:

```typescript
'@': './src'
'@/components': './src/components'
'@/services': './src/services'
'@/stores': './src/stores'
'@/hooks': './src/hooks'
'@/lib': './src/lib'
'@/types': './src/types'
'@/config': './src/config'
```

Usage:
```typescript
import { api } from '@/services/api'
import { usePoolStore } from '@/stores/poolStore'
import { PoolCard } from '@/components/betting/PoolCard'
```

### Dependency Management

**Vendor Code Splitting** (vite.config.ts):
- `react-vendor`: React core libraries
- `solana-vendor`: Blockchain libraries
- `ui-vendor`: UI component libraries
- `data-vendor`: State management libraries

Benefits:
- Better caching (vendor code changes less frequently)
- Faster initial load
- Parallel downloads
- Smaller bundle updates

## Key Architectural Decisions

### 1. React 19 Adoption

**Rationale**:
- Latest features and performance improvements
- Better concurrent rendering
- Enhanced TypeScript support

**Trade-offs**:
- Smaller ecosystem (newer version)
- Requires compatible libraries

### 2. Zustand for Client State

**Rationale**:
- Minimal boilerplate vs Redux
- Excellent TypeScript support
- Small bundle size (3KB)
- DevTools integration

**Trade-offs**:
- Less middleware ecosystem vs Redux
- Simpler, less powerful than MobX

### 3. React Query for Server State

**Rationale**:
- Automatic caching and revalidation
- Built-in loading/error states
- Optimistic updates
- Request deduplication

**Trade-offs**:
- Learning curve for complex scenarios
- Another dependency

### 4. Vite Build Tool

**Rationale**:
- Extremely fast HMR
- Native ESM support
- Simple configuration
- Great TypeScript support

**Trade-offs**:
- Newer ecosystem vs Webpack
- Some plugins still in development

### 5. Tailwind CSS

**Rationale**:
- Rapid UI development
- Consistent design system
- Small production bundle
- Dark mode built-in

**Trade-offs**:
- Utility class verbosity
- Learning curve for newcomers

## Performance Optimizations

### Code Splitting

**Route-based splitting**:
```typescript
// Automatic with React Router
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'))
```

**Vendor chunk splitting**:
- Separate bundles for React, Solana, UI libraries
- Better caching and parallel loading

### React Query Caching

**Stale-while-revalidate strategy**:
```typescript
{
  staleTime: 5000,      // Consider fresh for 5s
  cacheTime: 300000,    // Keep in cache for 5min
  refetchOnWindowFocus: true
}
```

### Asset Optimization

- Image lazy loading
- SVG sprites
- CSS purging with Tailwind
- Tree shaking

### Build Optimization

```typescript
// vite.config.ts
{
  build: {
    target: 'es2022',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: { /* vendor splitting */ }
      }
    }
  }
}
```

## Security Considerations

### Authentication

- JWT tokens stored in localStorage
- Token included in API requests via interceptor
- Auto-redirect on 401 responses

### Environment Variables

- All sensitive config via `.env`
- Validated on app startup
- Never committed to repository

### XSS Protection

- React's built-in XSS protection
- Sanitized user inputs
- Content Security Policy headers

### Wallet Security

- Never store private keys
- User controls transaction signing
- Secure connection to Solana RPCs

## Scalability Considerations

### Component Reusability

- Shared components in `/components/common`
- Composable UI primitives
- Props-based customization

### State Scalability

- Normalized state in stores (using Map)
- Efficient selectors
- Memoized computations

### API Efficiency

- Request deduplication (React Query)
- Automatic retries with exponential backoff
- Background refetching
- Optimistic updates

### WebSocket Efficiency

- Room-based subscriptions
- Auto-reconnection with backoff
- Event filtering on client

## Testing Strategy

### Unit Testing
- Component logic
- Utility functions
- Store actions

### Integration Testing
- API integration
- WebSocket events
- Wallet interactions

### E2E Testing
- User flows
- Critical paths
- Cross-browser testing

## Future Enhancements

### Planned Improvements

1. **Progressive Web App (PWA)**
   - Offline support
   - Push notifications
   - App install prompt

2. **Enhanced Caching**
   - Service worker
   - IndexedDB for offline data

3. **Performance Monitoring**
   - Real User Monitoring (RUM)
   - Error tracking
   - Performance metrics

4. **Internationalization (i18n)**
   - Multi-language support
   - Locale-based formatting

5. **Advanced Analytics**
   - User behavior tracking
   - Conversion funnels
   - A/B testing

---

**Last Updated**: 2025-01-07
**Version**: 1.0.0
**Framework**: React 19.1.1
