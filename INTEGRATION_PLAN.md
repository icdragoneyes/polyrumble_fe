# PolyRumble Frontend Integration Plan

**Date:** 2025-11-09
**Goal:** Integrate 3 main pages into master branch: Landing Page, Arenas Listing, Arena Detail (Trader Comparison + Betting)

---

## Architecture Overview

### Current State
- **draft branch**: Contains betting app with pool listing (HomePage showing PoolCards)
- **origin/example branch**: Same as draft (both at same commit)
- **polyrumble_core/kin/phase-0 branch**: Contains trader comparison tool with charts

### Target State (3 Pages)

```
┌─────────────────────────────────────────────────────────────┐
│                     1. Landing Page (/)                      │
│  - Hero section with PolyRumble branding                    │
│  - CTA: "Browse Arenas"                                     │
│  - Feature highlights                                        │
│  - Links to /arenas                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 2. Arenas Listing (/arenas)                  │
│  - Grid of active betting pools/arenas                      │
│  - PoolCard components (from draft branch)                  │
│  - Real-time WebSocket updates                              │
│  - Click pool → /arena/:id                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│            3. Arena Detail (/arena/:id) - MERGED             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Trader Comparison (from kin/phase-0)              │   │
│  │  - Side-by-side trader charts                       │   │
│  │  - TraderCard components                            │   │
│  │  - P&L visualization                                │   │
│  │  - ROI metrics                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Betting Interface (from draft branch)              │   │
│  │  - Pool A vs Pool B display                         │   │
│  │  - Bet buttons                                      │   │
│  │  - Wallet integration                               │   │
│  │  - Real-time pool updates                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Implementation Plan

### Phase 1: Import Components from kin/phase-0

#### 1.1 Copy Page Components
- [ ] Extract `src/pages/HomePage.tsx` from kin/phase-0 (trader comparison)
- [ ] Extract `src/pages/ArenaDetailPage.tsx` from kin/phase-0 (rumble detail view)
- [ ] Note: We'll merge ArenaDetailPage logic with betting UI later

#### 1.2 Copy Component Files
- [ ] `src/components/Chart/Chart.tsx` - P&L line chart
- [ ] `src/components/Chart/CustomTooltip.tsx` - Chart tooltip
- [ ] `src/components/TraderCard/TraderCard.tsx` - Trader metrics card
- [ ] `src/components/PositionCard.tsx` - Individual position display
- [ ] `src/components/ROIBarChart.tsx` - Mobile ROI comparison
- [ ] `src/components/TimeRangeSelector.tsx` - Timeframe selector (7/30/90 days)
- [ ] `src/components/MobileBottomBar.tsx` - Mobile bottom navigation
- [ ] `src/components/ProfileSearchInput.tsx` - Trader search by name
- [ ] `src/components/ProfileSearchModal.tsx` - Full-screen search modal
- [ ] `src/components/WalletInput.tsx` - Trader selection inputs
- [ ] `src/components/TraderEditModal.tsx` - Edit trader display
- [ ] `src/components/telegram/StartBrawlModal.tsx` - Telegram rumble creation
- [ ] `src/components/telegram/TelegramQRCode.tsx` - QR code component
- [ ] `src/components/ErrorDisplay.tsx` - Error display component
- [ ] `src/components/LoadingSpinner.tsx` - Loading indicator

#### 1.3 Copy Hooks
- [ ] `src/hooks/useAutoRefresh.ts` - 5-minute auto-refresh logic
- [ ] `src/hooks/useProfileSearch.ts` - Debounced trader search
- [ ] `src/hooks/useTraderData.ts` - Fetch all trader data from Polymarket

#### 1.4 Copy Services
- [ ] `src/services/polymarketApi.ts` - Polymarket API client (User PNL, Data API, Gamma API)
- [ ] Review `src/services/api.ts` - May need to merge with existing

#### 1.5 Copy Utilities
- [ ] `src/utils/calculations.ts` - ROI calculations, chart data merging
- [ ] `src/utils/formatting.ts` - Display formatters (currency, dates, addresses)
- [ ] `src/utils/validation.ts` - Input validation for traders

#### 1.6 Copy Styles
- [ ] `src/styles/comic-theme.css` - Comic book design system
- [ ] Review `src/index.css` - Merge any additional styles

#### 1.7 Copy Types
- [ ] Extract trader-related types from `src/types/index.ts`
- [ ] Merge with existing types in draft branch

---

### Phase 2: Restructure Current Draft Branch

#### 2.1 Rename Current HomePage
- [ ] Move `src/pages/betting/HomePage.tsx` → `src/pages/betting/ArenasPage.tsx`
- [ ] Update component name from `HomePage` to `ArenasPage`
- [ ] Keep all PoolCard logic and WebSocket integration

#### 2.2 Update PoolCard Component
- [ ] Update `src/components/betting/PoolCard.tsx` to be clickable
- [ ] Add `<Link to={/arena/${pool.id}>` wrapper or onClick navigation
- [ ] Add hover state to indicate clickability

---

### Phase 3: Create New Landing Page

#### 3.1 Create LandingPage Component
- [ ] Create `src/pages/LandingPage.tsx`
- [ ] Design hero section with PolyRumble branding
- [ ] Add tagline/description: "Compare Polymarket traders and bet on performance"
- [ ] Create CTA button: "Browse Arenas" → `/arenas`
- [ ] Add feature highlights section (3-4 key features)
- [ ] Use comic book theme styling
- [ ] Make mobile responsive

#### 3.2 Hero Section Content Ideas
- [ ] Main headline: "Polymarket Trader Rumble"
- [ ] Subheadline: "Watch traders battle. Bet on winners."
- [ ] Features: Real-time comparison, SOL betting, Live charts, Social sharing
- [ ] Optional: Add example trader comparison preview/screenshot

---

### Phase 4: Create Merged Arena Detail Page

#### 4.1 Design Combined ArenaDetailPage
- [ ] Create new `src/pages/ArenaDetailPage.tsx`
- [ ] Fetch arena/pool data from backend API (`/api/v1/pools/:id`)
- [ ] Fetch trader data from Polymarket API (traderA and traderB addresses)

#### 4.2 Top Section - Arena Info
- [ ] Display arena/pool metadata
- [ ] Pool number, status badge, timeframe
- [ ] "Back to Arenas" navigation link
- [ ] Share buttons (Twitter, copy link)

#### 4.3 Middle Section - Trader Comparison (from kin/phase-0)
- [ ] Render `<Chart />` component with P&L data
- [ ] Render `<TimeRangeSelector />` (if applicable to pool timeframe)
- [ ] Render `<ROIBarChart />` on mobile
- [ ] Display trader metrics in `<TraderCard />` components (side-by-side)
- [ ] Show trader positions, win rate, portfolio value

#### 4.4 Bottom Section - Betting Interface (from draft)
- [ ] Display Pool A vs Pool B sizes
- [ ] Show percentage distribution
- [ ] Show total pool size in SOL
- [ ] Display time until betting closes
- [ ] Add "Bet on Trader A" / "Bet on Trader B" buttons (placeholder for Phase 1)
- [ ] Show wallet connection status
- [ ] Display user's current bets on this arena (if any)

#### 4.5 Real-time Updates
- [ ] Integrate WebSocket for live pool updates
- [ ] Update pool sizes in real-time
- [ ] Update trader P&L data on auto-refresh (5 min)
- [ ] Show live notifications for pool events

---

### Phase 5: Update Routing

#### 5.1 Update Router Configuration
- [ ] Open `src/lib/router.tsx`
- [ ] Update routes:
  ```typescript
  / → LandingPage
  /arenas → ArenasPage (renamed from HomePage)
  /arena/:id → ArenaDetailPage (merged version)
  /admin/login → LoginPage
  /admin/dashboard → AdminDashboard
  * → 404 page
  ```

#### 5.2 Update Imports
- [ ] Import LandingPage component
- [ ] Import ArenasPage (renamed from HomePage)
- [ ] Import ArenaDetailPage (new merged version)
- [ ] Remove old ArenaDetailPage/HomePage references

---

### Phase 6: Update Navigation & Header

#### 6.1 Update Header Component
- [ ] Add navigation links (if not already present)
- [ ] Logo/title → `/` (Landing page)
- [ ] "Arenas" link → `/arenas`
- [ ] Wallet connect button (existing)
- [ ] Make responsive for mobile

#### 6.2 Update Footer (if exists)
- [ ] Add navigation links
- [ ] Social links
- [ ] Telegram bot link

---

### Phase 7: Dependencies & Configuration

#### 7.1 Merge package.json Dependencies
- [ ] Compare dependencies from kin/phase-0 and draft branches
- [ ] Add missing dependencies:
  - [ ] `recharts` (for charts) - check if already exists
  - [ ] `date-fns` (for date formatting) - check if already exists
  - [ ] `react-icons` (for icons) - check if already exists
  - [ ] `qrcode.react` (for QR codes) - check if already exists
  - [ ] Any other missing packages
- [ ] Run `npm install` to install new dependencies

#### 7.2 Update Environment Variables
- [ ] Review `.env.example` from both branches
- [ ] Merge environment variables:
  - [ ] `VITE_API_URL` (backend API - for betting/pools)
  - [ ] `VITE_WS_URL` (WebSocket URL)
  - [ ] `VITE_SOLANA_RPC_URL` (Solana RPC)
  - [ ] `VITE_SOLANA_NETWORK` (devnet/testnet/mainnet)
  - [ ] `VITE_BETTING_PROGRAM_ID` (Solana program)
  - [ ] `VITE_TELEGRAM_BOT_USERNAME` (Telegram bot)
  - [ ] Any Polymarket API configs (if needed)
- [ ] Update `.env` file with correct values

#### 7.3 Update TypeScript Configuration (if needed)
- [ ] Check `tsconfig.json` compatibility
- [ ] Ensure all path aliases work
- [ ] Verify strict mode settings

---

### Phase 8: Testing & Validation

#### 8.1 Route Testing
- [ ] Test `/` → Landing page loads correctly
- [ ] Test "Browse Arenas" CTA → navigates to `/arenas`
- [ ] Test `/arenas` → Pool cards display in grid
- [ ] Test clicking pool card → navigates to `/arena/:id`
- [ ] Test `/arena/:id` → Shows trader comparison + betting UI
- [ ] Test browser back/forward navigation
- [ ] Test direct URL access to each route

#### 8.2 Arena Detail Page Testing
- [ ] Verify trader data fetches from Polymarket API
- [ ] Verify pool data fetches from backend API
- [ ] Verify charts render correctly
- [ ] Verify trader cards display metrics
- [ ] Verify pool sizes display correctly
- [ ] Verify WebSocket updates pool data in real-time
- [ ] Test on mobile (responsive layout)

#### 8.3 Component Integration Testing
- [ ] Verify Chart component renders P&L data
- [ ] Verify TraderCard shows correct metrics
- [ ] Verify PoolCard is clickable and navigates correctly
- [ ] Verify TimeRangeSelector works (if used)
- [ ] Verify wallet connection works
- [ ] Verify share buttons work (Twitter, copy link)

#### 8.4 Error Handling
- [ ] Test arena/:id with invalid ID → shows error
- [ ] Test with network errors → shows error message
- [ ] Test with missing trader data → shows error
- [ ] Verify loading states display correctly

#### 8.5 Performance Testing
- [ ] Check page load times (< 2s target)
- [ ] Check chart rendering performance
- [ ] Verify no memory leaks (WebSocket cleanup)
- [ ] Test auto-refresh (5 min) doesn't cause issues

---

### Phase 9: Code Cleanup & Documentation

#### 9.1 Remove Unused Code
- [ ] Remove duplicate components (if any)
- [ ] Remove unused imports
- [ ] Remove console.logs (keep only essential ones)
- [ ] Clean up commented code

#### 9.2 Update Documentation
- [ ] Update README.md with new route structure
- [ ] Document environment variables
- [ ] Add setup instructions
- [ ] Update architecture diagrams (if any)

#### 9.3 Code Review
- [ ] Review all new files for code quality
- [ ] Ensure consistent naming conventions
- [ ] Verify TypeScript types are correct
- [ ] Check for accessibility (a11y) issues

---

### Phase 10: Deployment Preparation

#### 10.1 Build Testing
- [ ] Run `npm run build` → verify no errors
- [ ] Run `npm run lint` → fix any linting errors
- [ ] Test production build locally (`npm run preview`)
- [ ] Verify all routes work in production build

#### 10.2 Git Workflow
- [ ] Ensure we're on draft branch
- [ ] Stage all changes
- [ ] Create comprehensive commit message
- [ ] Push to remote

#### 10.3 Create Pull Request (if needed)
- [ ] Create PR from draft → master (if using PR workflow)
- [ ] Add description of changes
- [ ] Tag reviewers (if applicable)

---

## File Structure After Integration

```
src/
├── components/
│   ├── betting/
│   │   └── PoolCard.tsx              # Pool card (updated with navigation)
│   ├── common/
│   │   ├── ErrorBoundary.tsx         # Existing
│   │   ├── ErrorDisplay.tsx          # NEW from kin/phase-0
│   │   └── LoadingSpinner.tsx        # NEW from kin/phase-0
│   ├── Chart/                         # NEW from kin/phase-0
│   │   ├── Chart.tsx
│   │   └── CustomTooltip.tsx
│   ├── TraderCard/                    # NEW from kin/phase-0
│   │   └── TraderCard.tsx
│   ├── telegram/                      # NEW from kin/phase-0
│   │   ├── StartBrawlModal.tsx
│   │   └── TelegramQRCode.tsx
│   ├── PositionCard.tsx               # NEW from kin/phase-0
│   ├── ROIBarChart.tsx                # NEW from kin/phase-0
│   ├── TimeRangeSelector.tsx          # NEW from kin/phase-0
│   ├── MobileBottomBar.tsx            # NEW from kin/phase-0
│   ├── ProfileSearchInput.tsx         # NEW from kin/phase-0
│   ├── ProfileSearchModal.tsx         # NEW from kin/phase-0
│   ├── WalletInput.tsx                # NEW from kin/phase-0
│   └── TraderEditModal.tsx            # NEW from kin/phase-0
├── pages/
│   ├── LandingPage.tsx                # NEW - Hero page
│   ├── betting/
│   │   └── ArenasPage.tsx             # RENAMED from HomePage
│   ├── ArenaDetailPage.tsx            # NEW - Merged trader comparison + betting
│   └── admin/
│       ├── AdminDashboard.tsx
│       └── LoginPage.tsx
├── hooks/
│   ├── useWebSocket.ts                # Existing
│   ├── useAutoRefresh.ts              # NEW from kin/phase-0
│   ├── useProfileSearch.ts            # NEW from kin/phase-0
│   └── useTraderData.ts               # NEW from kin/phase-0
├── services/
│   ├── api.ts                         # Existing (backend API)
│   ├── polymarketApi.ts               # NEW from kin/phase-0
│   └── websocket.ts                   # Existing
├── stores/
│   ├── poolStore.ts                   # Existing
│   ├── betStore.ts                    # Existing
│   └── walletStore.ts                 # Existing
├── utils/
│   ├── calculations.ts                # NEW from kin/phase-0
│   ├── formatting.ts                  # NEW from kin/phase-0
│   └── validation.ts                  # NEW from kin/phase-0
├── types/
│   └── index.ts                       # MERGED types
├── styles/
│   ├── comic-theme.css                # NEW from kin/phase-0
│   └── index.css                      # MERGED styles
├── lib/
│   ├── router.tsx                     # UPDATED routes
│   ├── walletConfig.tsx               # Existing
│   ├── queryClient.ts                 # Existing
│   └── utils.ts                       # Existing
└── App.tsx                            # Root component
```

---

## Key Integration Points

### 1. Arena Detail Page Data Flow

```
ArenaDetailPage (/arena/:id)
    ↓
[Fetch Pool Data]
    ↓ GET /api/v1/pools/:id
Backend API → { poolId, traderAAddress, traderBAddress, poolASizeSOL, poolBSizeSOL, ... }
    ↓
[Fetch Trader Data]
    ↓ Polymarket API
useTraderData(traderAAddress) → TraderData
useTraderData(traderBAddress) → TraderData
    ↓
[Render Components]
    ├─ Chart (P&L comparison)
    ├─ TraderCards (metrics)
    └─ BettingPanel (pools + bet buttons)
    ↓
[WebSocket Updates]
    └─ Real-time pool size updates
```

### 2. API Integration Strategy

**Backend API (existing):**
- Base URL: `VITE_API_URL`
- Used for: Pool/arena data, betting operations, user bets
- Endpoints: `/api/v1/pools`, `/api/v1/bets`, etc.

**Polymarket API (from kin/phase-0):**
- Used for: Trader performance data, P&L, positions, trades
- APIs: User PNL API, Data API, Gamma API
- Cached for 5 minutes

### 3. State Management Strategy

**Zustand Stores:**
- `poolStore` - Pool/arena data (existing)
- `betStore` - User bets (existing)
- `walletStore` - Wallet connection (existing)

**React Query:**
- Used for fetching pool data
- Used for fetching trader data
- Auto-refetch and cache management

**Local State:**
- Component-specific UI state (modals, forms, etc.)

---

## Risk Assessment & Mitigation

### Potential Issues

1. **Dependency Conflicts**
   - Risk: Version conflicts between branches
   - Mitigation: Review package.json carefully, test thoroughly after merge

2. **API Integration**
   - Risk: Different API structures between branches
   - Mitigation: Keep APIs separate, create adapter layer if needed

3. **Type Conflicts**
   - Risk: Duplicate or conflicting TypeScript types
   - Mitigation: Carefully merge types, use namespaces if needed

4. **Routing Conflicts**
   - Risk: Route path collisions
   - Mitigation: Clear route hierarchy defined above

5. **Style Conflicts**
   - Risk: CSS class name collisions
   - Mitigation: Use BEM or component-scoped styles, review comic-theme.css

6. **WebSocket Connection**
   - Risk: Multiple WebSocket connections or memory leaks
   - Mitigation: Ensure proper cleanup in useEffect hooks

---

## Success Criteria

- [ ] All 3 pages load without errors
- [ ] Navigation between pages works smoothly
- [ ] Arena detail page shows both trader comparison AND betting interface
- [ ] Real-time updates work on arena detail page
- [ ] Charts render correctly with trader data
- [ ] Pool cards are clickable and navigate to detail page
- [ ] Wallet integration works
- [ ] Mobile responsive on all pages
- [ ] No console errors in production build
- [ ] Build completes successfully
- [ ] All environment variables configured

---

## Timeline Estimate

- Phase 1-2: Import & Restructure - 30 minutes
- Phase 3: Landing Page - 20 minutes
- Phase 4: Arena Detail Page - 45 minutes
- Phase 5-6: Routing & Navigation - 15 minutes
- Phase 7: Dependencies - 15 minutes
- Phase 8: Testing - 30 minutes
- Phase 9: Cleanup - 15 minutes
- Phase 10: Deployment Prep - 10 minutes

**Total Estimated Time: ~3 hours**

---

## Notes

- Keep all commits atomic and well-documented
- Test frequently after each phase
- Don't delete old code until new code is verified working
- Keep backup of current working state
- Focus on frontend only - backend is separate repo
- Prioritize getting basic integration working, then refine

---

**Status:** Ready for execution
**Next Step:** Begin Phase 1 - Import Components from kin/phase-0
