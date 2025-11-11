# PolyRumble Frontend

> **Polymarket Trader Comparison & Betting Platform**
> Built with React, TypeScript, Solana, and WebSocket real-time updates

**Domain:** [polyrumble.com](https://polyrumble.com)
**Status:** Phase 1 - Betting Platform (90% Complete) ✅

---

## 🎯 What is PolyRumble?

PolyRumble is a competitive betting platform where users can:
1. Compare Polymarket traders side-by-side with real-time P&L charts
2. Bet on which trader will outperform over a set timeframe
3. Win SOL based on parimutuel betting pools

**Key Features:**
- 📊 Live trader comparison with interactive charts
- 💰 Pool-based betting (Trader A vs Trader B)
- 🔗 Solana wallet integration (Phantom, Solflare)
- ⚡ Real-time WebSocket updates
- 📱 Fully responsive design

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Solana wallet (Phantom or Solflare)
- Access to backend API (see [Backend Repository](#backend-integration))

### Installation

```bash
# Clone the repository
git clone https://github.com/talkinandy/polyarena.git
cd polyarena

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration (see Environment Variables section)

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# Built files will be in dist/
```

---

## ✨ Features

### Fully Implemented ✅

**Pages:**
- **Landing Page** (`/`) - Hero, features, how it works, CTAs
- **Arenas List** (`/arenas`) - Browse all betting pools with filters
- **Arena Detail** (`/arena/:id`) - Trader comparison + betting interface
- **Admin Dashboard** (`/admin`) - Pool management (admin only)

**Trader Comparison:**
- Side-by-side trader analysis
- Interactive P&L line charts (Recharts)
- ROI metrics and performance stats
- Trading positions display
- Trader bios and profile images
- Profile search by name
- Real-time data refresh (auto every 5 minutes)

**Betting Interface:**
- Pool A vs Pool B display
- Live odds calculation
- Pool size tracking in SOL
- Bet amount input with validation
- Quick bet buttons (25%, 50%, 75%, Max)
- Real-time bet simulation with payout preview
- Platform fee display
- Arena status (Active, Locked, Settled, Cancelled)
- Wallet balance checking
- Transaction preparation and signing

**Solana Integration:**
- Multi-wallet support (Phantom, Solflare)
- Wallet connection modal
- Auto-connect on return
- Balance tracking with 30s auto-refresh
- Transaction signing capability
- SOL/lamports conversion utilities
- Address validation

**Real-Time Updates:**
- WebSocket connection for live pool updates
- Pool creation events
- Pool status changes
- Odds recalculation on new bets
- Auto-reconnection on disconnect

**User Experience:**
- Share functionality (Twitter, copy link)
- Mobile responsive design
- Loading states and error handling
- Empty state displays
- Form validation
- Toast notifications
- Error boundaries

### In Progress ⏳ (10% Remaining)

**Requires Backend Integration:**
- Actual bet placement on blockchain (frontend ready, awaits backend)
- Pool size updates after bets (WebSocket handler ready)
- Settlement automation (claim UI ready)
- Transaction verification

**Requires Solana Program:**
- Betting smart contract deployment
- Program ID configuration
- Escrow and payout logic

---

## 🛠️ Tech Stack

### Core
- **React** 19.1.1 - UI library
- **TypeScript** 5.9.3 - Type safety
- **Vite** 7.1.7 - Build tool & dev server

### Solana & Blockchain
- **@solana/web3.js** 1.95.8 - Solana JavaScript SDK
- **@solana/wallet-adapter-base** 0.9.23 - Wallet adapter foundation
- **@solana/wallet-adapter-react** 0.15.35 - React hooks
- **@solana/wallet-adapter-react-ui** 0.9.35 - UI components
- **@solana/wallet-adapter-wallets** 0.19.32 - Phantom, Solflare support
- **@coral-xyz/anchor** 0.30.1 - Solana program framework
- **bs58** 6.0.0 - Base58 encoding

### State Management
- **Zustand** 5.0.8 - Lightweight state management
- **@tanstack/react-query** 5.90.7 - Server state management & caching

### Routing
- **react-router-dom** 7.9.5 - Client-side routing

### UI Libraries
- **Tailwind CSS** 4.1.17 - Utility-first CSS
- **@tailwindcss/vite** 4.1.17 - Vite plugin
- **@headlessui/react** 2.2.9 - Unstyled accessible components
- **Radix UI** - Accessible component primitives
  - @radix-ui/react-dialog 1.1.15
  - @radix-ui/react-dropdown-menu 2.1.16
  - @radix-ui/react-select 2.2.6
  - @radix-ui/react-switch 1.2.6
  - @radix-ui/react-tabs 1.1.13
  - @radix-ui/react-toast 1.2.15
- **react-icons** 5.0.1 - Icon library

### Data Visualization
- **recharts** 3.3.0 - Charting library

### HTTP & Real-Time
- **axios** 1.13.2 - HTTP client
- **socket.io-client** 4.8.1 - WebSocket client

### Utilities
- **date-fns** 4.1.0 - Date manipulation
- **qrcode.react** 4.2.0 - QR code generation
- **zod** 3.25.76 - Schema validation
- **clsx** 2.0.0 - Conditional classnames

### Development Tools
- **ESLint** 9.36.0 - Linting
- **TypeScript ESLint** 8.45.0 - TypeScript linting
- **@vitejs/plugin-react** 5.0.4 - React plugin for Vite

---

## 📁 Project Structure

```
polyrumble-frontend/
├── public/                  # Static assets
│   ├── burst-small.svg
│   ├── burst-medium.svg
│   ├── burst-large.svg
│   ├── vs-logo.svg
│   └── og-image.png
├── src/
│   ├── App.tsx             # Root component with providers
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles
│   ├── components/
│   │   ├── betting/        # Betting-related components
│   │   │   ├── PoolCard.tsx
│   │   │   ├── BettingPanel.tsx
│   │   │   ├── ArenaStatus.tsx
│   │   │   └── BetConfirmModal.tsx
│   │   ├── comparison/     # Trader comparison components
│   │   │   ├── PositionCard.tsx
│   │   │   ├── WalletInput.tsx
│   │   │   ├── ProfileSearchInput.tsx
│   │   │   ├── ProfileSearchModal.tsx
│   │   │   ├── ROIBarChart.tsx
│   │   │   ├── TimeRangeSelector.tsx
│   │   │   ├── MobileBottomBar.tsx
│   │   │   └── TraderEditModal.tsx
│   │   ├── common/         # Shared components
│   │   │   ├── ErrorDisplay.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── Chart/          # Chart components
│   │   │   ├── Chart.tsx
│   │   │   └── CustomTooltip.tsx
│   │   ├── TraderCard/     # Trader card components
│   │   │   └── TraderCard.tsx
│   │   ├── telegram/       # Telegram integration
│   │   │   ├── StartBrawlModal.tsx
│   │   │   └── TelegramQRCode.tsx
│   │   └── wallet/         # Wallet components
│   │       └── WalletSync.tsx
│   ├── config/
│   │   └── env.ts          # Environment validation
│   ├── hooks/              # Custom React hooks
│   │   ├── useWebSocket.ts
│   │   ├── useTraderData.ts
│   │   ├── useAutoRefresh.ts
│   │   ├── useProfileSearch.ts
│   │   ├── useTransaction.ts
│   │   ├── useWalletBalance.ts
│   │   └── useBetting.ts
│   ├── lib/                # Configuration & setup
│   │   ├── router.tsx      # React Router config
│   │   ├── walletConfig.tsx # Solana wallet setup
│   │   ├── queryClient.ts  # React Query config
│   │   └── utils.ts
│   ├── pages/              # Page components
│   │   ├── LandingPage.tsx
│   │   ├── ArenaDetailPage.tsx
│   │   ├── betting/
│   │   │   └── ArenasPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       └── LoginPage.tsx
│   ├── services/           # API clients
│   │   ├── api.ts          # Backend API client
│   │   ├── polymarketApi.ts # Polymarket API client
│   │   └── websocket.ts    # WebSocket client
│   ├── stores/             # Zustand state stores
│   │   ├── betStore.ts
│   │   ├── poolStore.ts
│   │   ├── walletStore.ts
│   │   └── index.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── calculations.ts
│   │   ├── formatting.ts
│   │   ├── validation.ts
│   │   ├── solana.ts
│   │   └── betting.ts
│   └── styles/
│       └── comic-theme.css
├── docs/                   # Comprehensive documentation
│   ├── PRD/
│   │   ├── PRD_MASTER.md
│   │   ├── PRD_FRONTEND.md
│   │   └── PRD_BACKEND.md
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   ├── SOLANA_INTEGRATION.md
│   ├── COMPONENTS.md
│   ├── STATE_MANAGEMENT.md
│   ├── STYLING.md
│   ├── DEVELOPMENT.md
│   ├── DEPLOYMENT.md
│   ├── TROUBLESHOOTING.md
│   └── README.md
├── .env.example            # Environment template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── package.json
└── README.md               # This file
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend API
VITE_API_URL=http://localhost:3333
VITE_WS_URL=ws://localhost:3333

# Solana Configuration
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_SOLANA_NETWORK=devnet
VITE_BETTING_PROGRAM_ID=your_program_id_here

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
```

### Variable Descriptions

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API base URL | `http://localhost:3333` |
| `VITE_WS_URL` | Yes | WebSocket server URL | `ws://localhost:3333` |
| `VITE_SOLANA_RPC_URL` | Yes | Solana RPC endpoint | `https://api.devnet.solana.com` |
| `VITE_SOLANA_NETWORK` | Yes | Network (devnet/testnet/mainnet-beta) | `devnet` |
| `VITE_BETTING_PROGRAM_ID` | Yes* | Solana betting program address | - |
| `VITE_ENABLE_ANALYTICS` | No | Enable analytics | `false` |
| `VITE_ENABLE_DEBUG` | No | Enable debug mode | `false` |

*Required once betting smart contract is deployed

---

## 🏗️ Architecture

### Page Flow

```
Landing Page (/)
    ↓
Arenas List (/arenas) ← Browse all pools
    ↓
Arena Detail (/arena/:id) ← Trader comparison + Betting
```

### State Management

**Zustand Stores:**
- `walletStore` - Wallet connection state, balance
- `poolStore` - Pool data, active pools
- `betStore` - User bets, pending/confirmed/settled

**React Query:**
- Server state caching
- Background refetching
- Automatic invalidation
- Optimistic updates

### API Integrations

1. **Backend API** (`src/services/api.ts`)
   - Pools, Bets, Users, Admin endpoints
   - JWT authentication
   - Request/response interceptors

2. **Polymarket API** (`src/services/polymarketApi.ts`)
   - Trader P&L data
   - Portfolio values
   - Profile search
   - 5-minute caching

3. **WebSocket** (`src/services/websocket.ts`)
   - Real-time pool updates
   - Event-based communication
   - Auto-reconnection

4. **Solana Wallet Adapter**
   - Multi-wallet support
   - Transaction signing
   - Balance tracking

---

## 💻 Development

### Available Scripts

```bash
npm run dev          # Start development server (localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Development Workflow

1. **Start Backend API**
   ```bash
   # See backend repository for setup
   # Backend should run on http://localhost:3333
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   ```

3. **Connect Wallet**
   - Click "Connect Wallet" in header
   - Select Phantom or Solflare
   - Approve connection

4. **Test Features**
   - Browse arenas at `/arenas`
   - Click an arena to view details
   - Try placing a bet (requires backend)

### Common Issues

**Wallet not connecting:**
- Ensure wallet extension is installed
- Check network matches (devnet/mainnet)
- Clear browser cache

**API errors:**
- Verify backend is running
- Check VITE_API_URL in .env
- Check CORS settings on backend

**WebSocket disconnects:**
- Check VITE_WS_URL matches backend
- Verify WebSocket server is running

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

### Essential Reading
- **[PRD_MASTER.md](./docs/PRD/PRD_MASTER.md)** - Complete product requirements
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture overview
- **[SOLANA_INTEGRATION.md](./docs/SOLANA_INTEGRATION.md)** - Wallet integration guide

### API & Backend
- **[API_REFERENCE.md](./docs/API_REFERENCE.md)** - Backend API documentation
- **[PRD_BACKEND.md](./docs/PRD/PRD_BACKEND.md)** - Backend specifications

### Frontend Development
- **[PRD_FRONTEND.md](./docs/PRD/PRD_FRONTEND.md)** - Frontend specifications
- **[COMPONENTS.md](./docs/COMPONENTS.md)** - Component documentation
- **[STATE_MANAGEMENT.md](./docs/STATE_MANAGEMENT.md)** - State patterns
- **[STYLING.md](./docs/STYLING.md)** - Styling guidelines

### Operations
- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - Development setup
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deployment procedures
- **[TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Common issues

---

## 🗺️ Roadmap

### Phase 1: Betting Platform (90% Complete) ✅

**Completed:**
- ✅ Three-page architecture
- ✅ Solana wallet integration
- ✅ Polymarket API integration
- ✅ Real-time WebSocket updates
- ✅ Trader comparison with charts
- ✅ Betting UI (pools, odds, amounts)
- ✅ Transaction preparation
- ✅ Share functionality
- ✅ Admin dashboard
- ✅ Mobile responsive

**Remaining (10%):**
- ⏳ Bet placement on blockchain (awaits backend)
- ⏳ Settlement automation (awaits backend)
- ⏳ Solana program deployment
- ⏳ Transaction verification
- ⏳ End-to-end testing

### Phase 2: Diamond Hands (Future)

- Early exit mechanics
- Exit penalties (burn %)
- Diamond hands bonus pool
- Time-weighted rewards
- Advanced game theory

---

## 🔗 Backend Integration

This is the **frontend repository only**. Backend API and infrastructure are maintained separately.

**Required for Full Functionality:**
- Backend API running (pools, bets, settlement)
- WebSocket server (real-time updates)
- Solana betting program deployed
- Database (PostgreSQL)

For backend setup, see the backend repository documentation.

---

## 🤝 Contributing

This is an active development project. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - see LICENSE file for details

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the [Troubleshooting Guide](./docs/TROUBLESHOOTING.md)
- Review [Documentation](./docs/)

---

**Last Updated:** 2025-01-11
**Version:** Phase 1 (90% Complete)
**Built with** ❤️ **using React, TypeScript, Solana, and Vite**
