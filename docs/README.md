# Polymarket Trader Rumble - Frontend Documentation

Welcome to the comprehensive documentation for the Polymarket Trader Rumble Frontend Application.

## Overview

A modern **React 19 + TypeScript + Vite** frontend for a Solana-based betting platform. Users can bet on trader performance competitions with real-time updates and blockchain integration.

### Key Features

- ✅ **Modern Stack**: React 19, TypeScript, Vite 7
- ✅ **Real-time Updates**: Socket.io WebSocket integration
- ✅ **Blockchain**: Solana Web3.js & Wallet Adapter
- ✅ **State Management**: Zustand + React Query
- ✅ **Styling**: Tailwind CSS 4 with dark mode
- ✅ **Type-Safe**: Full TypeScript coverage
- ✅ **Optimized**: Code splitting, caching, lazy loading

### Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19.1.1 |
| **Language** | TypeScript 5.9 |
| **Build Tool** | Vite 7.1.7 |
| **Styling** | Tailwind CSS 4.1.17 |
| **State Management** | Zustand 5.0.8 |
| **Data Fetching** | TanStack React Query 5.90.7 |
| **Routing** | React Router 7.9.5 |
| **HTTP Client** | Axios 1.13.2 |
| **WebSocket** | Socket.io Client 4.8.1 |
| **Blockchain** | Solana Web3.js 1.95.8 |
| **Wallet** | Solana Wallet Adapter |
| **UI Components** | Radix UI, Headless UI |
| **Charts** | Recharts 3.3.0 |
| **Date Utils** | date-fns 4.1.0 |
| **Validation** | Zod 3.25.76 |

## Documentation Index

### Getting Started
- **[Development Guide](./DEVELOPMENT.md)** - Setup, run, and develop locally
- **[Deployment Guide](./DEPLOYMENT.md)** - Build and deployment instructions

### Architecture & Design
- **[Architecture Overview](./ARCHITECTURE.md)** - App structure and design patterns
- **[State Management](./STATE_MANAGEMENT.md)** - Zustand stores and React Query
- **[Component Library](./COMPONENTS.md)** - Component documentation

### Integration & Features
- **[API Integration](./API_INTEGRATION.md)** - REST API and WebSocket
- **[Solana Integration](./SOLANA_INTEGRATION.md)** - Blockchain features
- **[Styling Guide](./STYLING.md)** - Tailwind CSS and theming

### Operations
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions

## Quick Start

### Prerequisites

```bash
Node.js >= 18.0.0
npm or yarn
```

### Installation

```bash
# Clone repository
git clone https://github.com/polymarket-trader-rumble/frontend.git
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Application runs at `http://localhost:5173`

### Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3333
VITE_WS_URL=ws://localhost:3333

# Solana Configuration
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_SOLANA_NETWORK=devnet
VITE_BETTING_PROGRAM_ID=

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin components
│   │   ├── betting/        # Betting components
│   │   ├── common/         # Shared components
│   │   └── layout/         # Layout components
│   ├── config/             # Configuration
│   │   └── env.ts          # Environment config
│   ├── hooks/              # Custom React hooks
│   │   └── useWebSocket.ts # WebSocket hook
│   ├── lib/                # Utilities
│   │   ├── queryClient.ts  # React Query
│   │   ├── router.tsx      # Routing
│   │   ├── utils.ts        # Utilities
│   │   └── walletConfig.tsx # Wallet setup
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   └── betting/        # Betting pages
│   ├── services/           # API services
│   │   ├── api.ts          # REST API
│   │   └── websocket.ts    # WebSocket
│   ├── stores/             # State stores
│   │   ├── betStore.ts     # Bet state
│   │   ├── poolStore.ts    # Pool state
│   │   └── walletStore.ts  # Wallet state
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── docs/                   # Documentation
├── vite.config.ts          # Vite config
├── tailwind.config.js      # Tailwind config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

## Core Concepts

### 1. Betting Pools

Users bet on which trader (A or B) will perform better over a set timeframe.

**Pool States:**
- **Active**: Accepting bets
- **Locked**: Betting closed
- **Settled**: Winner determined
- **Cancelled**: Pool cancelled

### 2. Real-Time Updates

WebSocket provides live updates for:
- Pool statistics changes
- New pools created
- Pool status updates
- Bet placements

### 3. Solana Wallet Integration

**Supported Wallets:**
- Phantom Wallet
- Solflare Wallet

**Features:**
- Auto-connect on load
- Balance tracking
- Transaction signing
- Multi-wallet support

### 4. State Management

**Client State** (Zustand):
- Pool data
- Bet data
- Wallet connection

**Server State** (React Query):
- Automatic caching
- Background refetching
- Optimistic updates

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Lint code
npm run typecheck        # TypeScript check
```

### Code Structure

**Path Aliases:**
```typescript
import { api } from '@/services/api'
import { useWalletStore } from '@/stores/walletStore'
import { PoolCard } from '@/components/betting/PoolCard'
```

**Component Pattern:**
```typescript
// Functional component with TypeScript
interface Props {
  pool: Pool;
  onSelect?: (pool: Pool) => void;
}

export const PoolCard: React.FC<Props> = ({ pool, onSelect }) => {
  // Component logic
  return <div>{/* JSX */}</div>
}
```

## API Integration

### REST API

```typescript
// Fetch pools
const { data } = useQuery({
  queryKey: ['pools'],
  queryFn: () => api.pools.list()
})

// Place bet
const mutation = useMutation({
  mutationFn: (data) => api.bets.create(data)
})
```

### WebSocket

```typescript
// Use WebSocket hook
const { isConnected, onPoolUpdated } = useWebSocket();

useEffect(() => {
  const cleanup = onPoolUpdated((event) => {
    console.log('Pool updated:', event);
  });
  return cleanup;
}, []);
```

## Deployment

### Build for Production

```bash
# Build application
npm run build

# Output: dist/
# - Optimized bundles
# - Code splitting
# - Source maps
```

### Environment Configuration

Set environment variables before build:

```bash
VITE_API_URL=https://api.polymarket-rumble.com
VITE_WS_URL=wss://api.polymarket-rumble.com
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_SOLANA_NETWORK=mainnet-beta
```

### Hosting Options

- **Vercel** - Recommended (zero-config)
- **Netlify** - Easy deployment
- **AWS S3 + CloudFront** - Scalable
- **Nginx** - Self-hosted

## Support & Resources

### Documentation
- [Architecture](./ARCHITECTURE.md)
- [Development Guide](./DEVELOPMENT.md)
- [API Integration](./API_INTEGRATION.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

### External Resources
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Solana Docs](https://docs.solana.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query)

### Getting Help
- GitHub Issues
- Community Discord
- Stack Overflow

## Contributing

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

### Development Workflow
1. Create feature branch
2. Make changes with tests
3. Run linters and type check
4. Submit pull request

## License

MIT License - see LICENSE file for details

---

**Last Updated**: 2025-01-07
**Version**: 1.0.0
**Framework**: React 19.1.1
