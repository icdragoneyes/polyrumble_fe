# Product Requirements Document - Frontend

**Component:** React Frontend Application
**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS
**Version:** 1.0
**Last Updated:** 2025-10-31

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
- Trader comparison interface with live charts
- Rumble creation and viewing (via Telegram bot)
- Betting interface (Phase 1)
- User dashboard (Phase 1)

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
  "framework": "React 18.3.1",
  "language": "TypeScript 5.2",
  "build": "Vite 5.0.8",
  "styling": "Tailwind CSS 3.4.0",
  "charts": "Recharts 2.10.3",
  "routing": "React Router DOM 7.9.4",
  "state": "Zustand 5.0.8",
  "http": "Axios 1.6.2",
  "wallet": "@solana/wallet-adapter 0.15.39",
  "qr": "qrcode.react 4.2.0",
  "animation": "animejs 4.2.2",
  "icons": "react-icons 5.0.1",
  "dates": "date-fns 3.0.6"
}
```

### Development Tools

```json
{
  "linting": "ESLint 8.55.0",
  "typeChecking": "TypeScript strict mode",
  "formatting": "Prettier (recommended)",
  "devServer": "Vite dev server (HMR enabled)"
}
```

---

## Project Structure

### Directory Layout

```
src/
├── components/          # React components
│   ├── Chart/          # Chart components
│   │   ├── Chart.tsx           # Main line chart
│   │   └── CustomTooltip.tsx   # Chart tooltip
│   ├── telegram/       # Telegram-related components
│   │   ├── StartBrawlModal.tsx
│   │   └── TelegramQRCode.tsx
│   ├── wallet/         # Wallet components (Phase 1)
│   │   ├── WalletProvider.tsx
│   │   └── WalletConnectButton.tsx
│   ├── ErrorDisplay.tsx
│   ├── Header.tsx
│   ├── LoadingSpinner.tsx
│   ├── MobileBottomBar.tsx
│   ├── PositionCard.tsx
│   ├── ProfileSearchInput.tsx
│   ├── ProfileSearchModal.tsx
│   ├── ROIBarChart.tsx
│   ├── TimeRangeSelector.tsx
│   ├── TraderCard/
│   │   └── TraderCard.tsx
│   ├── TraderEditModal.tsx
│   └── WalletInput.tsx
├── hooks/              # Custom React hooks
│   ├── useAutoRefresh.ts    # 5-min auto-refresh
│   ├── useProfileSearch.ts  # Debounced search
│   └── useTraderData.ts     # Fetch all trader data
├── pages/              # Page components (routes)
│   ├── HomePage.tsx         # Main comparison page
│   ├── ArenasPage.tsx       # Rumbles listing (stub)
│   └── ArenaDetailPage.tsx  # Single rumble view
├── services/           # API services
│   ├── api.ts              # Backend API client
│   └── polymarketApi.ts    # Polymarket API client
├── store/              # Zustand stores
│   └── arenaStore.ts       # Rumble state management
├── types/              # TypeScript types
│   └── index.ts            # All type definitions
├── utils/              # Utility functions
│   ├── calculations.ts     # ROI calculations
│   ├── formatting.ts       # Display formatters
│   └── validation.ts       # Input validation
├── styles/             # Global styles
│   ├── comic-theme.css     # Comic design system
│   └── index.css           # Tailwind + global CSS
├── App.tsx             # Main app component (legacy)
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

### Phase 1: Betting Interface 🎯 NEXT

#### Features to Implement

**1. Wallet Integration**
- Connect/disconnect Phantom wallet
- Display connected wallet address
- Wallet context provider
- Transaction signing

**Components Needed:**
- `WalletConnectButton.tsx` - Header button ✅ (exists, needs activation)
- `WalletProvider.tsx` - Context provider ✅ (exists, needs activation)
- `WalletModal.tsx` - Connection modal (optional)

**2. Betting Interface**
- "BET ON TRADER A" / "BET ON TRADER B" buttons
- Bet amount input
- Pool size display
- Odds calculator
- Transaction confirmation modal

**Components Needed:**
- `BettingPanel.tsx` - Main betting interface
- `BetButton.tsx` - Individual bet button
- `BetAmountInput.tsx` - SOL amount input with USD conversion
- `BetConfirmModal.tsx` - Confirm transaction
- `PoolDisplay.tsx` - Real-time pool sizes
- `OddsCalculator.tsx` - Show expected payout

**3. Rumble Status Display**
- Status badges (waiting/grace/active/settled)
- Countdown timers (grace period, settlement)
- Pool matching indicator
- Settlement results

**Components Needed:**
- `RumbleStatus.tsx` - Status badge + countdown
- `PoolMatcher.tsx` - Visual pool matching indicator
- `SettlementDisplay.tsx` - Show winner + ROI%

**4. My Bets Dashboard**
- List all user's bets
- Filter by status (active/settled)
- Unrealized P&L
- "Claim Winnings" buttons

**Pages/Components Needed:**
- `DashboardPage.tsx` - My bets page
- `BetCard.tsx` - Individual bet display
- `BetFilters.tsx` - Filter controls
- `ClaimButton.tsx` - Claim winnings

**5. Rumbles Listing Page**
- Grid of rumble cards
- Search and filter
- Sort options
- Pagination

**Pages/Components Needed:**
- `RumblesPage.tsx` - Listing page (currently stub) ✅
- `RumbleCard.tsx` - Individual rumble card
- `RumbleFilters.tsx` - Search + filters
- `RumblePagination.tsx` - Pagination controls

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

### Phase 1 Components (Future)

#### `BettingPanel.tsx`

**Purpose:** Main betting interface

**Props:**
```typescript
{
  rumbleId: string;
  poolASizeSOL: number;
  poolBSizeSOL: number;
  status: RumbleStatus;  // waiting_for_match | grace_period | active | settled
  gracePeriodEnd?: Date;
  settlementDate?: Date;
  userWallet?: string;
  userBets?: UserBet[];
}
```

**Features:**
- "BET ON TRADER A" / "BET ON TRADER B" buttons
- Pool size display with real-time updates
- Bet amount input with SOL → USD conversion
- Odds calculator ("You'll get ~X SOL if you win")
- Status-aware UI (disable betting when locked)
- Grace period countdown

**Visual Specs:**
- Position: Below chart, above trader cards
- Layout: 2-column (Pool A | Pool B)
- Buttons: Large, comic-style, trader colors
- Animations: Pool fill animations

---

#### `BetConfirmModal.tsx`

**Purpose:** Confirm bet transaction

**Props:**
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  pool: 'A' | 'B';
  amount: number;  // SOL
  odds: number;    // Expected payout
  platformFee: number;  // 5% in SOL
}
```

**Features:**
- Bet summary
- Expected payout
- Platform fee breakdown
- Wallet transaction approval
- Error handling
- Success confirmation

**Visual Specs:**
- Modal: Centered overlay
- Size: 500px max width
- Buttons: Large "CONFIRM BET" and "CANCEL"
- Loading state during transaction

---

#### `DashboardPage.tsx`

**Purpose:** User's bets dashboard

**Route:** `/dashboard` or `/my-bets`

**State:**
```typescript
{
  userBets: UserBet[];
  filter: 'all' | 'active' | 'settled';
  loading: boolean;
  error: string | null;
}
```

**Features:**
- List all user's bets
- Filter by status
- Sort by date (newest first)
- Show unrealized P&L for active bets
- "Claim Winnings" buttons for won bets
- Empty state ("No bets yet")

**Layout:**
- Header with filters
- Grid of bet cards (1 col mobile, 2 col desktop)
- Pagination if > 20 bets

---

## State Management

### Zustand Store: `arenaStore.ts`

**Current Implementation:**

```typescript
interface ArenaStore {
  // State
  arenas: Arena[];
  selectedArena: Arena | null;
  loading: boolean;
  creating: boolean;

  // Actions
  setArenas: (arenas: Arena[]) => void;
  setSelectedArena: (arena: Arena | null) => void;
  addArena: (arena: Arena) => void;
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
}
```

**Phase 1 Additions:**

```typescript
interface ArenaStore {
  // ... existing state

  // Phase 1 additions
  userBets: Bet[];
  connectedWallet: string | null;

  // Actions
  setUserBets: (bets: Bet[]) => void;
  addUserBet: (bet: Bet) => void;
  updateBet: (betId: string, updates: Partial<Bet>) => void;
  setConnectedWallet: (wallet: string | null) => void;
}
```

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

### Current Routes (Phase 0)

```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/rumbles" element={<RumblesPage />} />
  <Route path="/rumble/:id" element={<RumbleDetailPage />} />
</Routes>
```

### Phase 1 Routes (Future)

```typescript
<Routes>
  {/* Existing */}
  <Route path="/" element={<HomePage />} />
  <Route path="/rumbles" element={<RumblesPage />} />
  <Route path="/rumble/:id" element={<RumbleDetailPage />} />

  {/* Phase 1 additions */}
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/my-bets" element={<DashboardPage />} />

  {/* Optional */}
  <Route path="/leaderboard" element={<LeaderboardPage />} />
  <Route path="/trader/:address" element={<TraderProfilePage />} />
</Routes>
```

### URL Parameters

**HomePage:**
- `?trader1=<wallet>` - Pre-fill trader 1
- `?trader2=<wallet>` - Pre-fill trader 2
- `?timeframe=7|30|90` - Pre-select timeframe

**RumblesPage:**
- `?status=active|settled` - Filter by status
- `?timeframe=7|30|90` - Filter by timeframe
- `?search=<query>` - Search term
- `?page=<number>` - Pagination

**RumbleDetailPage:**
- `/rumble/:id` - Rumble UUID

---

## API Integration

### Backend API (`src/services/api.ts`)

**Base URL:**
- Development: `http://localhost:3001`
- Production: `http://157.180.68.185` (or domain)

**Endpoints Used:**

```typescript
// Phase 0
GET    /api/rumbles              // List rumbles
GET    /api/rumbles/:id          // Get single rumble
POST   /api/rumbles              // Create rumble (via bot)
DELETE /api/rumbles/:id          // Delete rumble

// Phase 1 (future)
POST   /api/bets                 // Place bet
GET    /api/bets/user/:wallet    // Get user's bets
POST   /api/bets/:id/claim       // Claim winnings
GET    /api/rumbles/:id/pools    // Get pool sizes
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

### Polymarket API (`src/services/polymarketApi.ts`)

**APIs Used:**

1. **User PNL API**
   - Endpoint: `https://user-pnl-api.polymarket.com/user-pnl`
   - Purpose: P&L time-series data
   - Caching: 5 minutes

2. **Data API**
   - Endpoint: `https://data-api.polymarket.com`
   - Routes: `/value`, `/positions`, `/trades`, `/activity`
   - Purpose: Portfolio value, positions, trades
   - Caching: 5 minutes

3. **Gamma API**
   - Endpoint: `https://gamma-api.polymarket.com`
   - Purpose: Trader profiles (name, image, bio)
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

### Required Variables

```bash
# Backend API URL
VITE_API_URL=http://157.180.68.185   # Production
# VITE_API_URL=http://localhost:3001  # Development

# Telegram Bot
VITE_TELEGRAM_BOT_USERNAME=polyrumble_bot

# Solana (Phase 1)
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# VITE_SOLANA_RPC_URL=https://api.devnet.solana.com  # Development

# Analytics (optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Configuration Files

**`.env.development`:**
```bash
VITE_API_URL=http://localhost:3001
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
```

**`.env.production`:**
```bash
VITE_API_URL=http://157.180.68.185
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_TELEGRAM_BOT_USERNAME=polyrumble_bot
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
**Last Review:** 2025-10-31
**Next Review:** Before Phase 1 development
