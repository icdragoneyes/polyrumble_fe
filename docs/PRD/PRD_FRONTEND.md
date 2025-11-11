# Product Requirements Document - Frontend

**Component:** React Frontend Application
**Tech Stack:** React 19 + TypeScript + Vite + Tailwind CSS
**Version:** 1.0 - Phase 1 (90% Complete) ✅
**Last Updated:** 2025-01-11

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features by Phase](#features-by-phase)
5. [Component Specifications](#component-specifications)
6. [State Management](#state-management)
7. [Routing](#routing)
8. [API Integration](#api-integration)
9. [Design System](#design-system)
10. [Performance Requirements](#performance-requirements)

---

## Overview

### Purpose

The frontend is a single-page application (SPA) that provides:
- Trader comparison interface with live charts ✅
- Three-page architecture (Landing, Arenas, Arena Detail) ✅
- Betting interface with Solana wallet integration ✅ (90% complete)
- Real-time WebSocket updates ✅
- Admin dashboard (stub implementation)

### Key Principles

1. **Mobile-First:** Design for mobile, enhance for desktop
2. **Performance:** Fast loading, smooth interactions
3. **Accessibility:** WCAG 2.1 AA compliance
4. **Visual Impact:** Comic book aesthetic, bold colors
5. **Data-Driven:** Real-time Polymarket data

---

## Tech Stack

### Core Technologies

```json
{
  "framework": "React 19.1.1",
  "language": "TypeScript 5.9.3",
  "build": "Vite 7.1.7",
  "styling": "Tailwind CSS 4.1.17",
  "charts": "Recharts 3.3.0",
  "routing": "React Router DOM 7.9.5",
  "state": "Zustand 5.0.8",
  "serverState": "@tanstack/react-query 5.90.7",
  "http": "Axios 1.13.2",
  "websocket": "socket.io-client 4.8.1",
  "wallet": "@solana/wallet-adapter 0.15.35",
  "blockchain": "@solana/web3.js 1.95.8",
  "anchor": "@coral-xyz/anchor 0.30.1",
  "qr": "qrcode.react 4.2.0",
  "icons": "react-icons 5.0.1",
  "dates": "date-fns 4.1.0",
  "validation": "zod 3.25.76"
}
```

### Development Tools

```json
{
  "linting": "ESLint 9.36.0",
  "typeChecking": "TypeScript 5.9.3 strict mode",
  "formatting": "Prettier (recommended)",
  "devServer": "Vite 7.1.7 dev server (HMR enabled)"
}
```

---

## Project Structure

### Directory Layout

```
src/
├── components/          # React components
│   ├── betting/        # Betting interface (Phase 1) ✅
│   │   ├── PoolCard.tsx           # Pool display card
│   │   ├── BettingPanel.tsx       # Main betting interface
│   │   ├── ArenaStatus.tsx        # Status badges & countdowns
│   │   └── BetConfirmModal.tsx    # Bet confirmation dialog
│   ├── comparison/     # Trader comparison (Phase 0) ✅
│   │   ├── PositionCard.tsx
│   │   ├── WalletInput.tsx
│   │   ├── ProfileSearchInput.tsx
│   │   ├── ProfileSearchModal.tsx
│   │   ├── ROIBarChart.tsx
│   │   ├── TimeRangeSelector.tsx
│   │   ├── MobileBottomBar.tsx
│   │   └── TraderEditModal.tsx
│   ├── common/         # Shared components ✅
│   │   ├── Header.tsx
│   │   ├── ErrorDisplay.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   ├── Chart/          # Data visualization (Phase 0) ✅
│   │   ├── Chart.tsx              # P&L line chart
│   │   └── CustomTooltip.tsx      # Chart tooltip
│   ├── TraderCard/     # Trader metrics (Phase 0) ✅
│   │   └── TraderCard.tsx
│   ├── telegram/       # Telegram integration (Phase 0) ✅
│   │   ├── StartBrawlModal.tsx
│   │   └── TelegramQRCode.tsx
│   └── wallet/         # Wallet integration (Phase 1) ✅
│       └── WalletSync.tsx         # Syncs wallet to Zustand
├── config/             # Configuration
│   └── env.ts          # Environment validation
├── hooks/              # Custom React hooks
│   ├── useAutoRefresh.ts     # 5-min auto-refresh (Phase 0) ✅
│   ├── useProfileSearch.ts   # Debounced search (Phase 0) ✅
│   ├── useTraderData.ts      # Fetch trader data (Phase 0) ✅
│   ├── useWebSocket.ts       # WebSocket integration (Phase 1) ✅
│   ├── useBetting.ts         # Betting logic (Phase 1) ✅
│   ├── useTransaction.ts     # Solana transactions (Phase 1) ✅
│   └── useWalletBalance.ts   # Balance tracking (Phase 1) ✅
├── lib/                # Core libraries & config
│   ├── router.tsx      # React Router config ✅
│   ├── walletConfig.tsx # Solana wallet setup ✅
│   ├── queryClient.ts  # React Query config ✅
│   └── utils.ts        # Utility functions
├── pages/              # Page components (routes)
│   ├── LandingPage.tsx        # Hero page (Phase 1) ✅
│   ├── ArenaDetailPage.tsx    # Trader comparison + betting (Phase 1) ✅
│   ├── betting/
│   │   └── ArenasPage.tsx     # Arenas listing (Phase 1) ✅
│   └── admin/
│       ├── AdminDashboard.tsx # Admin interface (STUB)
│       └── LoginPage.tsx      # Admin login (STUB)
├── services/           # API services
│   ├── api.ts              # Backend API client ✅
│   ├── polymarketApi.ts    # Polymarket API client ✅
│   └── websocket.ts        # WebSocket client ✅
├── stores/             # Zustand stores (Phase 1) ✅
│   ├── betStore.ts         # Bet state management
│   ├── poolStore.ts        # Pool state management
│   ├── walletStore.ts      # Wallet state management
│   └── index.ts            # Store exports
├── types/              # TypeScript types
│   └── index.ts            # All type definitions ✅
├── utils/              # Utility functions
│   ├── calculations.ts     # ROI calculations (Phase 0) ✅
│   ├── formatting.ts       # Display formatters (Phase 0) ✅
│   ├── validation.ts       # Input validation (Phase 0) ✅
│   ├── solana.ts           # Solana utilities (Phase 1) ✅
│   └── betting.ts          # Betting utilities (Phase 1) ✅
├── styles/             # Global styles
│   ├── comic-theme.css     # Comic design system ✅
│   └── index.css           # Tailwind + global CSS
├── App.tsx             # Root component with providers ✅
├── main.tsx            # App entry point
└── vite-env.d.ts       # Vite type definitions
```

### File Naming Conventions

- **Components:** PascalCase (`TraderCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`useTraderData.ts`)
- **Pages:** PascalCase with `Page` suffix (`HomePage.tsx`)
- **Utils:** camelCase (`calculations.ts`)
- **Types:** camelCase (`index.ts`)

---

## Features by Phase

### Phase 0: Rumble Display ✅ COMPLETE

#### Implemented Features

**1. Trader Comparison Interface**
- Side-by-side trader comparison
- Live P&L line chart (Recharts)
- Percentage growth normalization
- Trader metrics cards
- Top 5 positions display
- ROI bar chart (mobile)

**2. Input & Search**
- Wallet address input
- Profile name search (debounced)
- Search dropdown (desktop)
- Full-screen search modal (mobile)
- Validation and error handling

**3. Timeframe Selection**
- 7 days / 30 days / 90 days options
- Desktop: Button group
- Mobile: Integrated into bottom bar
- Auto-refresh when timeframe changes

**4. Auto-Refresh**
- 5-minute countdown timer
- Automatic data refresh
- Manual refresh button
- Only active after first comparison

**5. Sharing**
- URL parameter loading (`?trader1=...&trader2=...&timeframe=...`)
- Share buttons (Twitter, copy link)
- Telegram "Start Brawl" modal with QR code

**6. Responsive Design**
- Mobile-first approach
- 1 column mobile, 2 columns desktop
- Fixed bottom bar on mobile
- Adaptive chart sizing

#### Component Breakdown

| Component | Purpose | Phase |
|-----------|---------|-------|
| `HomePage` | Main comparison page | Phase 0 ✅ |
| `Header` | Navigation + auto-refresh timer | Phase 0 ✅ |
| `WalletInput` | Trader selection inputs | Phase 0 ✅ |
| `ProfileSearchInput` | Search by trader name | Phase 0 ✅ |
| `ProfileSearchModal` | Full-screen search (mobile) | Phase 0 ✅ |
| `Chart` | P&L line chart | Phase 0 ✅ |
| `CustomTooltip` | Chart hover tooltip | Phase 0 ✅ |
| `ROIBarChart` | Mobile ROI comparison | Phase 0 ✅ |
| `TraderCard` | Trader metrics display | Phase 0 ✅ |
| `PositionCard` | Individual position card | Phase 0 ✅ |
| `TimeRangeSelector` | Timeframe buttons | Phase 0 ✅ |
| `MobileBottomBar` | Mobile-only bottom bar | Phase 0 ✅ |
| `TraderEditModal` | Edit trader display name/image | Phase 0 ✅ |
| `StartBrawlModal` | Telegram rumble creation | Phase 0 ✅ |
| `TelegramQRCode` | QR code for Telegram bot | Phase 0 ✅ |
| `ErrorDisplay` | Error message display | Phase 0 ✅ |
| `LoadingSpinner` | Loading state indicator | Phase 0 ✅ |

---

### Phase 1: Betting Platform ✅ 90% COMPLETE

#### Implemented Features (90%)

**1. Three-Page Architecture** ✅
- **LandingPage** (`/`) - Hero section, features, how it works, CTAs
- **ArenasPage** (`/arenas`) - Browse all betting pools with real-time updates
- **ArenaDetailPage** (`/arena/:id`) - Merged trader comparison + betting interface

**2. Solana Wallet Integration** ✅
- Multi-wallet support (Phantom, Solflare)
- Auto-connect on return visit
- Wallet connection modal (@solana/wallet-adapter-react-ui)
- Balance tracking with 30s auto-refresh
- Public key management
- Transaction signing capability
- Address validation
- SOL/lamports conversion utilities

**Implemented Components:**
- `WalletConfig` provider (wraps entire app) ✅
- `WalletSync` component (syncs to Zustand) ✅
- Wallet button in Header ✅

**3. Betting Interface** ✅
- "BET ON TRADER A" / "BET ON TRADER B" buttons with visual indicators
- Bet amount input with validation (min/max checks, balance checking)
- Quick bet buttons (25%, 50%, 75%, Max)
- Real-time bet simulation with debouncing (500ms)
- Pool size display with live updates
- Odds calculation and display
- Expected payout calculation
- Platform fee display (5%)
- Transaction preparation
- Status-aware UI (disables when locked/settled)

**Implemented Components:**
- `BettingPanel.tsx` - Full implementation ✅
- `PoolCard.tsx` - Pool display cards ✅
- `BetConfirmModal.tsx` - Transaction confirmation ✅

**4. Arena Status Display** ✅
- Status badges (Active/Locked/Settled/Cancelled)
- Countdown timers (betting closes, grace period)
- Status-specific messages
- Visual indicators

**Implemented Components:**
- `ArenaStatus.tsx` - Complete implementation ✅

**5. Real-Time Updates** ✅
- WebSocket client (`socket.io-client`)
- Event handlers:
  - `pool:created` - New pool notifications
  - `pool:updated` - Pool size/odds changes
  - `pool:status_changed` - Status transitions
  - `pool:cancelled` - Pool cancellations
- Toast notifications for events
- Auto-invalidation of React Query caches
- Connection status indicator

**Implemented:**
- `useWebSocket` hook ✅
- `websocket.ts` service ✅
- Integration in ArenasPage and ArenaDetailPage ✅

**6. State Management** ✅
- `poolStore` - Pool data management
- `betStore` - User bets management
- `walletStore` - Wallet connection state
- React Query for server state
- Zustand for client state

**7. API Integration** ✅ (Frontend Complete)
- Backend API client with interceptors
- Endpoints:
  - Pools: list, get, active ✅
  - Bets: simulate ✅, create (ready), poolBets ✅
  - Users: get, stats ✅
  - Admin: stubs
- Polymarket API client ✅
- WebSocket client ✅

**8. Share Functionality** ✅
- Twitter share button
- Copy link to clipboard
- URL parameter support

---

#### Pending (10% - Blocked by Backend/Blockchain)

**1. Blockchain Transaction Execution** ⏳
- Actual bet placement on Solana blockchain
- Transaction signature verification
- On-chain transaction confirmation
- *Frontend is ready, awaiting backend integration*

**2. Settlement Automation** ⏳
- Automated pool settlement
- Winner determination
- Payout distribution
- Claim winnings flow (UI ready)
- *Requires backend implementation*

**3. Solana Program Deployment** ⏳
- Betting smart contract
- Program ID configuration
- Escrow accounts
- *Requires smart contract development*

**4. Admin Dashboard** ⏳
- Pool creation form
- Pool management (lock/settle/cancel)
- User management
- Analytics
- *Currently stub implementation*

**5. End-to-End Testing** ⏳
- Full transaction flow testing
- Integration tests with backend
- *Awaiting backend completion*

---

#### Component Inventory (Phase 1)

| Component | Purpose | Status |
|-----------|---------|--------|
| `LandingPage` | Hero page | ✅ COMPLETE |
| `ArenasPage` | Arenas listing | ✅ COMPLETE |
| `ArenaDetailPage` | Trader comparison + betting | ✅ COMPLETE |
| `BettingPanel` | Main betting interface | ✅ COMPLETE |
| `BetConfirmModal` | Bet confirmation | ✅ COMPLETE |
| `ArenaStatus` | Status display | ✅ COMPLETE |
| `PoolCard` | Pool display card | ✅ COMPLETE |
| `WalletSync` | Wallet state sync | ✅ COMPLETE |
| `useWebSocket` | WebSocket hook | ✅ COMPLETE |
| `useBetting` | Betting logic hook | ✅ COMPLETE |
| `useTransaction` | Transaction hook | ✅ COMPLETE |
| `AdminDashboard` | Admin interface | STUB |
| `LoginPage` | Admin login | STUB |

---

### Phase 2: Diamond Hands 🔮 FUTURE

#### Features to Implement

**1. Early Exit Interface**
- "Exit Bet" button with penalty warning
- Exit confirmation modal
- Penalty calculation display
- Diamond pool visualization

**Components Needed:**
- `ExitBetButton.tsx` - Exit bet button
- `ExitConfirmModal.tsx` - Show penalty + confirm
- `DiamondPoolDisplay.tsx` - Show diamond fund stats
- `PenaltyCalculator.tsx` - Real-time penalty calculation

**2. Diamond Rewards Display**
- Diamond weight badge (entry time)
- Projected bonuses
- Consolation prize estimator
- "Diamond hands" leaderboard

**Components Needed:**
- `DiamondBadge.tsx` - Show diamond weight %
- `DiamondProjections.tsx` - Estimated rewards
- `DiamondLeaderboard.tsx` - Top diamond hands

---

## Component Specifications

### Core Components (Phase 0)

#### `HomePage.tsx`

**Purpose:** Main comparison page

**Props:** None (route component)

**State:**
```typescript
{
  trader1Selection: TraderSelection | null;
  trader2Selection: TraderSelection | null;
  selectedTimeframe: Timeframe;  // 7 | 30 | 90
  trader1Data: TraderData | null;
  trader2Data: TraderData | null;
  hasCompared: boolean;
  error: string | null;
  isEditingTrader1: boolean;
  isEditingTrader2: boolean;
  showBrawlModal: boolean;
}
```

**Key Functions:**
- `handleCompare()` - Fetch and compare traders
- `handleTimeframeChange()` - Update timeframe
- `handleTrader1Edit()` - Edit trader 1 display
- `handleTrader2Edit()` - Edit trader 2 display

**Renders:**
- `Header` (with auto-refresh)
- `WalletInput` (before comparison)
- `Chart` (after comparison)
- `TimeRangeSelector` (desktop)
- `ROIBarChart` (mobile)
- `TraderCard` × 2
- `MobileBottomBar` (mobile)
- `TraderEditModal` × 2
- `StartBrawlModal`

---

#### `Chart.tsx`

**Purpose:** P&L line chart

**Props:**
```typescript
{
  data: ChartDataPoint[];          // Merged chart data
  trader1Name: string;
  trader2Name: string;
  trader1Image: string;
  trader2Image: string;
  onEditTrader1?: () => void;     // Edit trader 1
  onEditTrader2?: () => void;     // Edit trader 2
}
```

**Features:**
- Recharts LineChart
- Dual Y-axis (percentage growth)
- Custom tooltip with both traders
- Responsive container
- Burst graphics background
- Edit buttons for trader names

**Visual Specs:**
- Height: 400px desktop, 300px mobile
- Colors: Blue (#3B82F6) vs Orange (#F97316)
- Line width: 3px
- Grid: Dotted lines
- Background: White with burst SVGs

---

#### `TraderCard.tsx`

**Purpose:** Display trader metrics

**Props:**
```typescript
{
  traderData: TraderData;
  traderColor: string;      // #3B82F6 or #F97316
  traderNumber: 1 | 2;
  bio?: string;
  walletAddress: string;
}
```

**Metrics Displayed:**
- Portfolio value (current)
- Total P&L ($ and %)
- Win rate (closed positions)
- Active positions count
- Total trades count
- Average position size
- Top 5 positions (with ROI%)

**Visual Specs:**
- Border: 4px solid (trader color)
- Shadow: "brutal" black shadow
- Profile image: Circular, 80px
- Font: Bangers for name, system for data
- Responsive: Full width mobile, 50% desktop

---

#### `WalletInput.tsx`

**Purpose:** Trader selection inputs

**Props:**
```typescript
{
  trader1: TraderSelection | null;
  trader2: TraderSelection | null;
  onTrader1Change: (trader: TraderSelection | null) => void;
  onTrader2Change: (trader: TraderSelection | null) => void;
  onCompare: () => void;
  loading: boolean;
}
```

**Features:**
- Profile search integration
- Wallet address validation
- Auto-progression (Trader 1 → Trader 2 → Compare)
- Prevent duplicate selection
- Loading states

**Layout:**
- Desktop: 2-column grid
- Mobile: Stacked inputs
- Compare button: Centered, prominent

---

### Phase 1 Components (Implemented)

#### `BettingPanel.tsx` ✅

**Purpose:** Main betting interface

**Props:**
```typescript
{
  poolId: string;
  traderAName: string;
  traderBName: string;
  poolASize: number;  // SOL
  poolBSize: number;  // SOL
  status: 'active' | 'locked' | 'settled' | 'cancelled';
  minBet: number;     // SOL
  maxBet: number;     // SOL
}
```

**Implemented Features:**
- Pool A/B selection with visual indicators
- Bet amount input with validation
- Quick bet buttons (25%, 50%, 75%, Max)
- Debounced bet simulation (500ms)
- Real-time payout calculation
- Platform fee display
- Wallet balance checking
- Status-aware UI (disables when locked/settled)
- Transaction preparation
- Loading states and error handling

**State Management:**
- Local state for selected pool, amount, simulation
- Uses `useBetting` hook for logic
- Uses `useWallet` for balance checks

**Visual Specs:**
- Position: In ArenaDetailPage, below status
- Layout: Responsive (stack mobile, side-by-side desktop)
- Buttons: Comic-style with trader colors
- Animations: Smooth transitions

---

#### `BetConfirmModal.tsx` ✅

**Purpose:** Confirm bet transaction

**Props:**
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  traderName: string;
  amount: number;        // SOL
  expectedPayout: number; // SOL
  platformFee: number;    // SOL
  pool: 'A' | 'B';
  loading: boolean;
}
```

**Implemented Features:**
- Bet summary with all details
- Expected payout display
- Platform fee breakdown (5%)
- Risk warning
- Confirmation button with loading state
- Error handling
- Success feedback
- Transaction signature display

**Implementation:**
- Headless UI Dialog component
- Backdrop blur effect
- Responsive sizing
- Keyboard navigation (Escape to close)

**Visual Specs:**
- Modal: Centered overlay
- Size: 500px max width, responsive
- Buttons: Large "CONFIRM BET" and "CANCEL"
- Loading spinner during transaction

---

#### `ArenaStatus.tsx` ✅

**Purpose:** Display arena/pool status

**Props:**
```typescript
{
  status: 'active' | 'locked' | 'settled' | 'cancelled';
  bettingClosesAt?: Date;
  gracePeriodEnd?: Date;
  settlementDate?: Date;
}
```

**Implemented Features:**
- Status badge with color coding
- Countdown timers
- Status-specific messages
- Visual indicators

**Status Colors:**
- Active: Green (#10B981)
- Locked: Yellow (#F59E0B)
- Settled: Gray (#6B7280)
- Cancelled: Red (#EF4444)

---

#### `LandingPage.tsx` ✅

**Purpose:** Hero landing page

**Route:** `/`

**Implemented Features:**
- Hero section with gradient title
- Feature highlights (4 features)
- "How It Works" steps (4 steps)
- CTA buttons to `/arenas`
- Fully responsive
- Share buttons

---

#### `ArenasPage.tsx` ✅

**Purpose:** Browse all betting pools/arenas

**Route:** `/arenas`

**Implemented Features:**
- Fetches active pools from `/api/v1/pools/active`
- Status filter (all/active/locked/settled)
- Pool cards grid (1/2/3 columns responsive)
- Real-time WebSocket integration
- Toast notifications
- Empty state
- Loading/error states

**WebSocket Events:**
- `pool:created`, `pool:updated`, `pool:status_changed`, `pool:cancelled`

---

#### `ArenaDetailPage.tsx` ✅

**Purpose:** Trader comparison + betting interface

**Route:** `/arena/:id`

**Implemented Features:**
- Fetches pool and trader data
- ArenaStatus component
- BettingPanel component
- Chart (P&L comparison)
- ROIBarChart (mobile)
- TraderCard × 2
- Share buttons (Twitter, copy link)
- WebSocket live updates
- Auto-refresh (5 min)
- Real-time notifications

---

## State Management

### Zustand Stores (Phase 1 Implementation) ✅

**1. `poolStore.ts`** - Pool State Management

```typescript
interface PoolStore {
  // State
  pools: Map<string, Pool>;
  activePools: string[];  // Pool IDs
  selectedPoolId: string | null;

  // Actions
  setPools: (pools: Pool[]) => void;
  addPool: (pool: Pool) => void;
  updatePool: (poolId: string, updates: Partial<Pool>) => void;
  removePool: (poolId: string) => void;
  setSelectedPoolId: (poolId: string | null) => void;

  // Selectors
  getPool: (poolId: string) => Pool | undefined;
  getActivePools: () => Pool[];
}
```

**2. `betStore.ts`** - Bet State Management

```typescript
interface BetStore {
  // State
  bets: Map<string, Bet>;
  userBets: string[];      // Bet IDs for current user
  pendingBets: string[];   // Bet IDs

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
```

**3. `walletStore.ts`** - Wallet State Management

```typescript
interface WalletStore {
  // State
  connected: boolean;
  publicKey: string | null;
  balance: number;  // SOL

  // Actions
  setConnected: (connected: boolean) => void;
  setPublicKey: (publicKey: string | null) => void;
  setBalance: (balance: number) => void;
  disconnect: () => void;
}
```

### React Query Integration ✅

Used for server state management:

**Queries:**
- `['pools', 'active']` - Active pools list
- `['pool', poolId]` - Individual pool details
- `['poolBets', poolId]` - Bets for a pool
- `['userBets', walletAddress]` - User's bets
- `['traderData', address, timeframe]` - Polymarket trader data

**Mutations:**
- `useMutation` for bet placement
- `useMutation` for bet simulation

**Features:**
- Auto-invalidation on WebSocket events
- 30s refetch interval on arenas page
- Background refetching
- Optimistic updates

### Local Component State

Use local state (useState) for:
- Form inputs
- Modal open/close
- Loading states specific to component
- UI-only state (hover, focus, etc.)

Use Zustand for:
- Cross-component shared state
- User data (wallet, bets)
- Cached data (arenas, rumbles)
- Global UI state (modals that affect multiple components)

---

## Routing

### Current Routes (Phase 1 Implementation) ✅

```typescript
<Routes>
  {/* Main Pages */}
  <Route path="/" element={<LandingPage />} />          {/* ✅ COMPLETE */}
  <Route path="/arenas" element={<ArenasPage />} />     {/* ✅ COMPLETE */}
  <Route path="/arena/:id" element={<ArenaDetailPage />} /> {/* ✅ COMPLETE */}

  {/* Admin Pages */}
  <Route path="/admin" element={<AdminDashboard />} />  {/* STUB */}
  <Route path="/admin/login" element={<LoginPage />} /> {/* STUB */}

  {/* 404 */}
  <Route path="*" element={<NotFound />} />              {/* ✅ COMPLETE */}
</Routes>
```

### Route Implementation Status

| Route | Component | Status | Description |
|-------|-----------|--------|-------------|
| `/` | LandingPage | ✅ COMPLETE | Hero, features, how it works |
| `/arenas` | ArenasPage | ✅ COMPLETE | Browse all pools with filters |
| `/arena/:id` | ArenaDetailPage | ✅ COMPLETE | Trader comparison + betting |
| `/admin` | AdminDashboard | STUB | Admin interface placeholder |
| `/admin/login` | LoginPage | STUB | Admin login placeholder |
| `*` | NotFound | ✅ COMPLETE | 404 error page |

### URL Parameters

**ArenaDetailPage:**
- `/arena/:id` - Pool UUID
- Query params support for future sharing features

**ArenasPage:**
- `?status=all|active|locked|settled` - Filter by status (implemented)

### Future Routes (Phase 1+)

```typescript
{/* Future additions */}
<Route path="/dashboard" element={<DashboardPage />} />
<Route path="/my-bets" element={<DashboardPage />} />
<Route path="/leaderboard" element={<LeaderboardPage />} />
```

---

## API Integration

### Backend API (`src/services/api.ts`) ✅

**Base URL:**
- Development: `http://localhost:3333`
- Production: `VITE_API_URL` environment variable

**Implementation Status:**

| Endpoint Category | Status | Notes |
|-------------------|--------|-------|
| **Pools** | ✅ WORKING | list(), get(), active() |
| **Bets** | ⏳ PARTIAL | simulate() ✅, create() (ready), claim() (ready) |
| **Users** | ✅ WORKING | get(), stats() |
| **Admin** | STUB | Placeholder implementations |

**Endpoints Implemented:**

```typescript
// Pools - ✅ WORKING
GET    /api/v1/pools              // List all pools
GET    /api/v1/pools/:id          // Get single pool
GET    /api/v1/pools/active       // Get active pools

// Bets - ⏳ PARTIAL
POST   /api/v1/bets/simulate      // Simulate bet (WORKING) ✅
POST   /api/v1/bets               // Place bet (READY, awaits blockchain) ⏳
GET    /api/v1/bets/pool/:poolId  // Get pool bets (WORKING) ✅
GET    /api/v1/bets/user/:wallet  // Get user's bets (WORKING) ✅
POST   /api/v1/bets/:id/claim     // Claim winnings (READY, awaits backend) ⏳

// Users - ✅ WORKING
GET    /api/v1/users/:wallet      // Get user info
GET    /api/v1/users/:wallet/stats // Get user stats

// Admin - STUB
POST   /api/v1/admin/login        // Admin login (stub)
GET    /api/v1/admin/stats        // Admin dashboard (stub)
```

**Client Configuration:**

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth in Phase 1)
apiClient.interceptors.request.use((config) => {
  // Add wallet signature header if needed
  return config;
});

// Response interceptor (error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

---

### WebSocket (`src/services/websocket.ts`) ✅

**Base URL:**
- Development: `ws://localhost:3333`
- Production: `VITE_WS_URL` environment variable

**Implementation Status:** ✅ COMPLETE (Client-side)

**Events Handled:**
```typescript
// Emitted by server, handled by client
'pool:created'         // New pool notification
'pool:updated'         // Pool size/odds changed
'pool:status_changed'  // Status transition
'pool:cancelled'       // Pool cancellation
```

**Features:**
- Auto-connection on mount
- Auto-reconnection on disconnect
- Room subscriptions (pool-specific updates)
- React Query cache invalidation
- Toast notifications
- Connection status tracking

**Integration:**
- `useWebSocket()` hook in ArenasPage and ArenaDetailPage
- Auto-invalidates relevant queries on events
- Displays connection status indicator

**Note:** WebSocket **client is ready**, awaiting **server implementation**.

---

### Polymarket API (`src/services/polymarketApi.ts`) ✅

**Implementation Status:** ✅ COMPLETE

**APIs Used:**

1. **User PNL API** ✅
   - Endpoint: `https://user-pnl-api.polymarket.com/user-pnl`
   - Purpose: P&L time-series data
   - Caching: 5 minutes

2. **Data API** ✅
   - Endpoint: `https://data-api.polymarket.com`
   - Routes: `/value`, `/positions`, `/trades`, `/activity`
   - Purpose: Portfolio value, positions, trades
   - Caching: 5 minutes

3. **Gamma API** ✅
   - Endpoint: `https://gamma-api.polymarket.com`
   - Purpose: Trader profiles (name, image, bio)
   - Profile search by name
   - Caching: 5 minutes

**Caching Strategy:**

```typescript
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}
```

---

## Current Blockers (10% Remaining)

### What's Preventing 100% Completion

**1. Backend Blockchain Integration** 🔴 CRITICAL
- **Issue:** Backend `/api/v1/bets` (POST) endpoint needs Solana transaction building
- **Frontend Status:** Ready - `useBetting` hook and `BetConfirmModal` fully implemented
- **Required:** Backend to build and sign transactions with escrow accounts
- **Impact:** Cannot place actual bets, only simulations work

**2. Solana Betting Program** 🔴 CRITICAL
- **Issue:** Smart contract not yet deployed
- **Frontend Status:** Ready - `useTransaction` hook and wallet integration complete
- **Required:**
  - Betting program deployment
  - Program ID configuration in `VITE_BETTING_PROGRAM_ID`
  - Escrow account creation
  - Bet placement instructions
  - Settlement instructions
- **Impact:** No on-chain bet validation or payout distribution

**3. WebSocket Server Implementation** 🟡 MEDIUM
- **Issue:** WebSocket server not fully operational
- **Frontend Status:** Complete - `useWebSocket` hook handles all events
- **Required:** Server to emit `pool:created`, `pool:updated`, `pool:status_changed`, `pool:cancelled`
- **Impact:** No real-time updates (frontend relies on polling)

**4. Settlement Automation** 🟡 MEDIUM
- **Issue:** No automated pool settlement
- **Frontend Status:** UI ready - claim buttons and status displays implemented
- **Required:** Backend cron job or worker to:
  - Lock pools at `bettingClosesAt`
  - Determine winner from Polymarket API
  - Settle pools
  - Enable claim flow
- **Impact:** Pools cannot be settled, winners cannot claim

**5. Admin Dashboard** 🟢 LOW
- **Issue:** Only stub implementation
- **Frontend Status:** Placeholder exists
- **Required:**
  - Pool creation form
  - Pool management (lock, settle, cancel)
  - User management
  - Analytics dashboard
- **Impact:** Manual pool management difficult

---

### Dependency Chain

```
Frontend (90%) ✅
    ↓
    ├─ Solana Program (0%) 🔴 ← BLOCKER
    │   ↓
    │   └─ Program ID → Frontend Config
    │
    ├─ Backend API (60%) 🟡
    │   ├─ Bet Creation Endpoint (needs Solana program) 🔴
    │   ├─ WebSocket Server (needs implementation) 🟡
    │   └─ Settlement Worker (needs implementation) 🟡
    │
    └─ Admin UI (10%) 🟢 ← LOW PRIORITY
```

---

### Frontend Readiness Checklist

| Feature | Frontend | Backend | Blockchain | Status |
|---------|----------|---------|------------|--------|
| **Pool Display** | ✅ | ✅ | N/A | 100% |
| **Wallet Connection** | ✅ | N/A | N/A | 100% |
| **Bet Simulation** | ✅ | ✅ | N/A | 100% |
| **Bet Placement** | ✅ | ⏳ | 🔴 | 33% |
| **Real-time Updates** | ✅ | ⏳ | N/A | 50% |
| **Settlement** | ✅ | 🔴 | 🔴 | 33% |
| **Claim Winnings** | ✅ | 🔴 | 🔴 | 33% |

**Legend:**
- ✅ Complete
- ⏳ In Progress / Partial
- 🔴 Not Started / Blocked

---

## Design System

### Colors

**Primary Colors:**
```css
--trader-1-color: #3B82F6;  /* Blue */
--trader-2-color: #F97316;  /* Orange */
--background: #F9FAFB;      /* Light gray */
--text-primary: #111827;    /* Dark gray */
--text-secondary: #6B7280;  /* Medium gray */
```

**Status Colors:**
```css
--status-active: #10B981;   /* Green */
--status-waiting: #F59E0B;  /* Yellow */
--status-settled: #6B7280;  /* Gray */
--error: #EF4444;           /* Red */
--success: #10B981;         /* Green */
```

### Typography

**Font Families:**
```css
--font-display: 'Bangers', cursive;       /* Headers */
--font-body: system-ui, sans-serif;       /* Body text */
--font-mono: 'Courier New', monospace;    /* Code/addresses */
```

**Font Sizes:**
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Spacing

**Scale:** 4px base unit

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### Shadows

**Brutal Shadows (Comic Style):**
```css
--shadow-brutal-sm: 2px 2px 0 0 #000;
--shadow-brutal: 4px 4px 0 0 #000;
--shadow-brutal-lg: 6px 6px 0 0 #000;
--shadow-brutal-xl: 8px 8px 0 0 #000;
```

### Borders

```css
--border-width: 3px;
--border-color: #000;
--border-radius: 0.5rem;  /* 8px, slightly rounded */
```

### Buttons

**Comic Button Style:**
```css
.comic-button {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  padding: var(--space-3) var(--space-6);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-brutal);
  transition: transform 0.2s, box-shadow 0.2s;
}

.comic-button:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #000;
}

.comic-button:active {
  transform: translate(4px, 4px);
  box-shadow: none;
}
```

### Responsive Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

**Mobile-First Approach:**
- Default styles: Mobile (< 640px)
- Use `md:` prefix for tablet+
- Use `lg:` prefix for desktop+

---

## Performance Requirements

### Loading Targets

| Metric | Target | Critical |
|--------|--------|----------|
| Initial Page Load | < 2s | < 5s |
| Chart Render | < 1s | < 3s |
| Search Results | < 500ms | < 2s |
| Route Transition | < 300ms | < 1s |

### Optimization Strategies

**1. Code Splitting**
- Lazy load routes
- Lazy load heavy components (Chart)
- Use dynamic imports

```typescript
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const RumblesPage = lazy(() => import('./pages/RumblesPage'));
```

**2. Image Optimization**
- Use Polymarket's optimized images when available
- Lazy load images below fold
- Use appropriate image sizes

**3. Data Caching**
- 5-minute cache for Polymarket API calls
- LocalStorage for user preferences
- SWR or React Query (future consideration)

**4. Bundle Size**
- Vite tree-shaking enabled
- Remove unused dependencies
- Monitor bundle size (< 500KB gzipped target)

**5. Rendering Performance**
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed as props
- Avoid unnecessary re-renders (React.memo for heavy components)

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text on background: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

**Keyboard Navigation:**
- All interactive elements keyboard accessible
- Visible focus indicators
- Logical tab order

**Screen Readers:**
- Semantic HTML (header, nav, main, footer)
- ARIA labels for icon buttons
- ARIA live regions for dynamic content

**Forms:**
- Label all inputs
- Error messages associated with inputs
- Required fields indicated

### Implementation Checklist

- [ ] All images have alt text
- [ ] All buttons have accessible labels
- [ ] Color is not the only indicator of status
- [ ] Focus visible on all interactive elements
- [ ] Page title updates on route change
- [ ] Loading states announced to screen readers
- [ ] Error messages announced to screen readers

---

## Testing Strategy

### Unit Tests

**Tools:** Vitest + React Testing Library

**Coverage Targets:**
- Utilities: 90%+
- Hooks: 80%+
- Components: 70%+

**Priority Components:**
- `useTraderData` hook
- `calculations.ts` utils
- `validation.ts` utils
- `BettingPanel` (Phase 1)

### Integration Tests

**Tools:** Playwright or Cypress

**Critical Flows:**
1. Load traders → Compare → View results
2. Search trader → Select → Compare
3. Change timeframe → Data refreshes
4. (Phase 1) Connect wallet → Place bet → Confirm

### Visual Regression Tests

**Tools:** Percy or Chromatic

**Test:**
- Component library
- Key pages (before/after changes)
- Mobile vs desktop layouts

### Performance Tests

**Tools:** Lighthouse CI

**Targets:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 90+
- SEO: 90+

---

## Environment Variables

### Required Variables (Phase 1)

```bash
# Backend API Configuration
VITE_API_URL=http://localhost:3333        # Development
# VITE_API_URL=https://api.polyrumble.com  # Production

# WebSocket Configuration
VITE_WS_URL=ws://localhost:3333           # Development
# VITE_WS_URL=wss://api.polyrumble.com     # Production

# Solana Configuration (Phase 1) ✅
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com      # Development
# VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com  # Production
VITE_SOLANA_NETWORK=devnet  # devnet | testnet | mainnet-beta
VITE_BETTING_PROGRAM_ID=    # Required once Solana program deployed

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### Variable Status

| Variable | Required | Phase | Status |
|----------|----------|-------|--------|
| `VITE_API_URL` | Yes | 1 | ✅ In use |
| `VITE_WS_URL` | Yes | 1 | ✅ In use |
| `VITE_SOLANA_RPC_URL` | Yes | 1 | ✅ In use |
| `VITE_SOLANA_NETWORK` | Yes | 1 | ✅ In use |
| `VITE_BETTING_PROGRAM_ID` | Yes* | 1 | ⏳ Awaiting program deployment |
| `VITE_ENABLE_ANALYTICS` | No | 2 | Not implemented |
| `VITE_ENABLE_DEBUG` | No | 1 | ✅ In use |

**Note:** `VITE_BETTING_PROGRAM_ID` is required once the Solana betting program is deployed.

### Configuration Files

**`.env.development`:**
```bash
VITE_API_URL=http://localhost:3333
VITE_WS_URL=ws://localhost:3333
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_SOLANA_NETWORK=devnet
VITE_BETTING_PROGRAM_ID=
VITE_ENABLE_DEBUG=true
```

**`.env.production`:**
```bash
VITE_API_URL=https://api.polyrumble.com
VITE_WS_URL=wss://api.polyrumble.com
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_SOLANA_NETWORK=mainnet-beta
VITE_BETTING_PROGRAM_ID=<program_id>
VITE_ENABLE_ANALYTICS=true
```

---

## Build & Deployment

### Development Build

```bash
npm run dev
# Runs on http://localhost:5173
# Hot module replacement enabled
```

### Production Build

```bash
npm run build
# Output: dist/
# Assets hashed for cache busting
# Minified and optimized
```

### Preview Build

```bash
npm run preview
# Preview production build locally
# Useful for testing before deployment
```

### Deployment Steps

1. Build with production env vars
2. Copy `dist/` to server
3. Deploy to nginx web root: `/var/www/polyarena/dist`
4. Verify deployment

```bash
# Build
npm run build

# Deploy
scp -r dist/* root@157.180.68.185:/var/www/polyarena/dist/

# Verify
curl -s http://157.180.68.185 | grep -o 'index-[^"]*\.js'
```

---

## Future Enhancements

### Phase 1+ Considerations

**1. Notifications**
- Browser push notifications
- Email notifications (bet settled, claim winnings)
- In-app notification center

**2. Analytics**
- Google Analytics 4
- Custom event tracking
- User behavior analytics

**3. Progressive Web App (PWA)**
- Service worker for offline support
- App install prompt
- Push notification support

**4. Internationalization**
- Multi-language support (i18next)
- Currency localization
- Timezone handling

**5. Advanced Features**
- Live chat (rumble comments)
- Trader profiles (follow system)
- Tournament brackets
- Leaderboards

---

## Appendix

### Related Documents

- [PRD_MASTER.md](PRD_MASTER.md) - Master product requirements
- [PRD_BACKEND.md](PRD_BACKEND.md) - Backend requirements
- [DATABASE_DESIGN.md](DATABASE_DESIGN.md) - Database schema
- [../DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md) - Full design system guide

### Type Definitions

See `src/types/index.ts` for complete type definitions.

**Key Types:**
```typescript
type Timeframe = 7 | 30 | 90;

interface TraderSelection {
  walletAddress: string;
  name?: string;
  bio?: string;
  profileImage?: string;
  source: 'wallet' | 'profile';
}

interface TraderData {
  profile: TraderProfile;
  pnlTimeSeries: PNLDataPoint[];
  metrics: TraderMetrics;
  positions: Position[];
  trades: Trade[];
}

interface Arena {
  id: string;
  creatorWallet: string;
  traderAAddress: string;
  traderAName: string;
  traderAImage?: string;
  traderBAddress: string;
  traderBName: string;
  traderBImage?: string;
  timeframe: number;
  status: string;
  createdAt: string;
}
```

---

**Document Owner:** Frontend Team
**Last Review:** 2025-01-11
**Next Review:** After Solana program deployment
**Status:** Phase 1 - 90% Complete ✅
**Blocking:** Solana betting program deployment, backend blockchain integration
