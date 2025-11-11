# Product Requirements Document (Master)

**Project:** Polymarket Trader Rumble (PolyRumble)
**Version:** 1.0
**Last Updated:** 2025-10-31
**Status:** Phase 0 Complete | Phase 1 Planning

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Target Users](#target-users)
4. [Phase Overview](#phase-overview)
5. [Core Features](#core-features)
6. [User Flows](#user-flows)
7. [Success Metrics](#success-metrics)
8. [Technical Requirements](#technical-requirements)
9. [Dependencies](#dependencies)

---

## Executive Summary

### What is PolyRumble?

PolyRumble is a **prediction market trader comparison and betting platform** built on top of Polymarket. Users can create "rumbles" (side-by-side comparisons) of Polymarket traders, analyze their performance, and (in Phase 1) bet on which trader will have better ROI% over a specific timeframe.

### Key Value Propositions

1. **For Traders:** Showcase your Polymarket trading performance publicly
2. **For Spectators:** Follow and compare top prediction market traders
3. **For Bettors:** (Phase 1) Bet on trader performance using parimutuel pools
4. **For Community:** Create a competitive, gamified layer on top of Polymarket

### Current Status

- **Phase 0:** ✅ COMPLETE - Rumble creation and display
- **Phase 1:** 🎯 NEXT - Parimutuel betting system
- **Phase 2:** 🔮 FUTURE - Diamond hands mechanics

### Live Product

- **URL:** https://stage.polyrumble.com
- **Telegram Bot:** @polyrumble_bot

---

## Product Vision

### Mission Statement

> "Make prediction market trading competitive, social, and entertaining through gamified trader comparisons and betting."

### Long-Term Vision (12-24 months)

1. **Social Layer:** Build a community around Polymarket trading
2. **Competitive Platform:** Leaderboards, tournaments, trader rankings
3. **Betting Ecosystem:** Pool-based betting on trader performance
4. **Analytics Hub:** Deep insights into trader strategies and performance
5. **Multi-Chain:** Expand beyond Polymarket to other prediction markets

### Differentiation

| Feature | PolyRumble | Competitors |
|---------|------------|-------------|
| Trader Comparisons | ✅ Side-by-side with charts | ❌ Not available |
| Betting on Traders | 🎯 Phase 1 | ❌ Not available |
| Telegram Integration | ✅ Create rumbles via bot | ❌ Web-only |
| Comic Book Design | ✅ Unique, gamified | ❌ Generic UI |
| Parimutuel Pools | 🎯 Phase 1 | ❌ Not available |

---

## Target Users

### Primary Personas

#### 1. The Competitive Trader
- **Profile:** Active Polymarket trader, wants recognition
- **Goals:** Showcase performance, compete with others
- **Needs:** Public comparison tools, share results on social media
- **Pain Points:** No way to publicly compare with other traders

#### 2. The Spectator
- **Profile:** Follows Polymarket, doesn't trade much
- **Goals:** Watch top traders, learn strategies
- **Needs:** Easy-to-understand performance comparisons
- **Pain Points:** Hard to track multiple traders

#### 3. The Bettor (Phase 1)
- **Profile:** Has SOL, likes to bet on outcomes
- **Goals:** Make money betting on trader performance
- **Needs:** Transparent betting pools, fair settlement
- **Pain Points:** Limited betting options in prediction markets

#### 4. The Content Creator
- **Profile:** Crypto Twitter influencer, Polymarket advocate
- **Goals:** Create engaging content about traders
- **Needs:** Shareable rumble links, visual comparisons
- **Pain Points:** Polymarket data is hard to visualize

### User Demographics

- **Age:** 18-45
- **Location:** Global (English-speaking focus)
- **Crypto Experience:** Intermediate to advanced
- **Income:** $50k+ (for betting features)

---

## Phase Overview

### Phase 0: Rumble Creation & Display ✅ COMPLETE

**Timeline:** Completed 2025-10-28

**Goal:** Allow users to create and view trader comparisons publicly

**Key Features:**
- Side-by-side trader comparison interface
- Live P&L charts with percentage growth
- Telegram bot for rumble creation
- Public rumble detail pages
- Share functionality

**Deliverables:**
- ✅ Frontend: React app with comparison UI
- ✅ Backend: Express API for rumble CRUD
- ✅ Database: PostgreSQL with rumbles table
- ✅ Telegram Bot: Create rumbles via `/rumble` command
- ✅ Deployment: Live on Hetzner VPS with HTTPS

**Success Criteria:**
- ✅ Users can create rumbles
- ✅ Rumbles display live Polymarket data
- ✅ Rumbles are publicly shareable
- ✅ Mobile responsive

---

### Phase 1: Parimutuel Betting 🎯 NEXT

**Timeline:** Estimated 8-12 weeks

**Goal:** Add betting pools to rumbles with SOL

**Key Features:**
- SOL wallet integration (Phantom)
- Bet on Pool A (Trader A) or Pool B (Trader B)
- Grace period mechanics (6 hours after match)
- Automated settlement based on ROI%
- Claim winnings interface

**Deliverables:**
- Frontend: Wallet integration, betting UI
- Backend: Betting endpoints, settlement job
- Database: Bets table, pool tracking
- Smart Contract OR Escrow: SOL handling
- Cron Jobs: Settlement automation

**Success Criteria:**
- Users can connect Solana wallet
- Users can place bets in SOL
- Pools match and lock after grace period
- Settlement calculates winner correctly
- Winners can claim payouts

---

### Phase 2: Diamond Hands System 🔮 FUTURE

**Timeline:** Estimated 6-8 weeks after Phase 1

**Goal:** Reward users who hold bets until settlement

**Key Features:**
- Early exit mechanics (10% penalty)
- Diamond hands bonus pool
- Consolation prizes for losers who held
- Time-weighted bonuses

**Deliverables:**
- Frontend: Exit UI, diamond pool display
- Backend: Exit endpoints, diamond calculations
- Database: Exit tracking, penalty pools
- Smart Contract Updates: Diamond distribution

**Success Criteria:**
- Users can exit early (with penalty)
- Penalties fund diamond pool
- Diamond bonuses distributed correctly
- Incentives encourage holding

---

## Core Features

### Feature Matrix

| Feature | Phase 0 | Phase 1 | Phase 2 |
|---------|---------|---------|---------|
| Trader Comparison | ✅ | ✅ | ✅ |
| Live P&L Charts | ✅ | ✅ | ✅ |
| Rumble Creation (Web) | ❌ | 🎯 | ✅ |
| Rumble Creation (Telegram) | ✅ | ✅ | ✅ |
| Public Rumble Listing | ❌ | 🎯 | ✅ |
| Wallet Connection | ❌ | 🎯 | ✅ |
| Place Bets | ❌ | 🎯 | ✅ |
| Pool Matching | ❌ | 🎯 | ✅ |
| Grace Period | ❌ | 🎯 | ✅ |
| Settlement | ❌ | 🎯 | ✅ |
| Claim Winnings | ❌ | 🎯 | ✅ |
| Early Exit | ❌ | ❌ | 🎯 |
| Diamond Bonuses | ❌ | ❌ | 🎯 |

---

## User Flows

### Phase 0: Create & View Rumble

```
User Journey:
1. User opens Telegram → @polyrumble_bot
2. User sends /rumble command
3. Bot asks for Trader A wallet address
4. User provides address, bot validates
5. Bot asks for Trader B wallet address
6. User provides address, bot validates
7. Bot asks for timeframe (7/30/90 days)
8. User selects timeframe
9. Bot creates rumble in database
10. Bot sends link to rumble detail page
11. User opens link → sees comparison
12. User shares link on Twitter
```

### Phase 1: Place Bet & Claim Winnings

```
Betting Journey:
1. User opens rumble detail page
2. User sees "BET ON TRADER A" / "BET ON TRADER B" buttons
3. User clicks "BET ON TRADER A"
4. Modal opens: "Connect Wallet"
5. User connects Phantom wallet
6. User enters bet amount (e.g., 1 SOL)
7. User sees odds: "If you win, you'll get ~1.5 SOL"
8. User confirms bet
9. Solana transaction executes
10. Bet recorded in database
11. Pool sizes update in real-time
12. [6 hours grace period]
13. Grace period ends → betting locks
14. [7/30/90 days pass]
15. Settlement triggers automatically
16. Winner determined (Trader A)
17. User sees "CLAIM WINNINGS" button
18. User clicks, receives 1.47 SOL (47% profit)
```

### Phase 2: Early Exit

```
Exit Journey:
1. User has active bet (Pool A, 1 SOL)
2. User opens "My Bets" dashboard
3. User sees bet with "EXIT EARLY" button
4. User clicks "EXIT EARLY"
5. Modal shows: "Exit penalty: 10% (0.1 SOL)"
6. User confirms exit
7. User receives 0.9 SOL back
8. 0.1 SOL added to diamond pool
9. Remaining bettors share diamond pool at settlement
```

---

## Success Metrics

### Phase 0 Metrics (Current)

**Engagement:**
- ✅ Rumbles created: Track total count
- ✅ Unique visitors: Google Analytics
- ✅ Telegram bot users: Track unique user IDs
- ✅ Social shares: Track Twitter shares

**Performance:**
- ✅ Page load time: < 2s
- ✅ API response time: < 500ms
- ✅ Uptime: 99.5%+

### Phase 1 Target Metrics (Future)

**Financial:**
- Total betting volume: $10k+ SOL in first month
- Platform fees collected: 5% of volume
- Average bet size: 0.5-2 SOL

**User Growth:**
- Monthly active bettors: 100+ in first month
- Rumbles with bets: 50+ in first month
- Wallet connections: 200+ in first month

**Engagement:**
- Bets per rumble: 5+ average
- Repeat bettors: 30%+ come back
- Claim rate: 90%+ of winners claim

### Phase 2 Target Metrics (Future)

**Diamond Hands:**
- Exit rate: <20% of bets
- Average hold time: >90% of full duration
- Diamond pool size: 5-10% of total pools

---

## Technical Requirements

### Performance Requirements

| Metric | Target | Critical |
|--------|--------|----------|
| Page Load Time | < 2s | < 5s |
| API Response Time | < 500ms | < 2s |
| Chart Rendering | < 1s | < 3s |
| Database Query | < 100ms | < 500ms |
| Wallet Connection | < 3s | < 10s |
| Transaction Confirmation | < 30s | < 2min |

### Scalability Requirements

**Phase 0-1:**
- Support 1,000 concurrent users
- Support 10,000 rumbles
- Support 100,000 total bets

**Phase 2+:**
- Support 10,000 concurrent users
- Support 100,000 rumbles
- Support 1,000,000 total bets

### Security Requirements

**Authentication:**
- Wallet signature verification (Phase 1+)
- Telegram webhook verification (Phase 0+)
- API rate limiting (all phases)

**Data Protection:**
- HTTPS only (all phases)
- Database encryption at rest (Phase 1+)
- Secure environment variables (all phases)

**Smart Contract Security (Phase 1+):**
- Multi-sig wallet for platform fees
- Audited smart contract code
- Emergency pause functionality
- Time-locked settlements

### Reliability Requirements

**Uptime:**
- 99.5% uptime target
- Planned maintenance windows
- Automatic failover for critical services

**Data Integrity:**
- Database backups every 6 hours
- Transaction logs for all bets
- Audit trail for settlements

**Monitoring:**
- Real-time error tracking (Sentry or similar)
- Performance monitoring (New Relic or similar)
- Uptime monitoring (UptimeRobot or similar)

---

## Dependencies

### External APIs

**Polymarket APIs:**
- User PNL API: `https://user-pnl-api.polymarket.com`
- Data API: `https://data-api.polymarket.com`
- Gamma API: `https://gamma-api.polymarket.com`
- **Risk:** API changes, rate limits, downtime
- **Mitigation:** Caching (5 min), fallback data, error handling

**Telegram Bot API:**
- Webhook-based bot
- **Risk:** Telegram downtime, API changes
- **Mitigation:** Polling fallback, queue system

### Blockchain Dependencies

**Solana (Phase 1+):**
- Phantom wallet integration
- Solana RPC nodes
- **Risk:** Network congestion, wallet compatibility
- **Mitigation:** Multiple RPC providers, wallet fallbacks

### Infrastructure Dependencies

**Hetzner Cloud:**
- VPS hosting
- PostgreSQL database
- Nginx web server
- **Risk:** Provider downtime, resource limits
- **Mitigation:** Backups, scaling plan, monitoring

### Third-Party Libraries

**Critical Dependencies:**
- React 18 (frontend framework)
- Express (backend framework)
- PostgreSQL (database)
- @solana/wallet-adapter (Phase 1)
- Telegraf (Telegram bot)

**Risk Mitigation:**
- Lock dependency versions
- Regular security audits
- Update strategy for CVEs

---

## Non-Functional Requirements

### Accessibility

- WCAG 2.1 AA compliance target
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance

### Internationalization

**Phase 0-1:**
- English only

**Phase 2+:**
- Multi-language support (Spanish, Chinese, etc.)
- Timezone-aware displays
- Currency conversion (SOL → USD)

### Compliance

**Legal:**
- Terms of Service (required for Phase 1)
- Privacy Policy (required for Phase 0)
- Gambling regulations (research needed for Phase 1)

**Jurisdictions:**
- May need to block certain countries
- Age verification (18+) for betting
- KYC/AML considerations (Phase 2+)

### Browser Support

**Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Not Supported:**
- Internet Explorer
- Opera Mini

---

## Open Questions

### Phase 1 Questions

1. **Smart Contract vs Escrow?**
   - Option A: Deploy Solana smart contract (more complex, more trust)
   - Option B: Platform escrow wallet (simpler, less decentralized)
   - **Decision Needed:** Week 1 of Phase 1

2. **Minimum Bet Amount?**
   - Option A: 0.1 SOL ($20 at current prices)
   - Option B: 0.5 SOL ($100 at current prices)
   - **Decision Needed:** Before Phase 1 launch

3. **Platform Fee Percentage?**
   - Current plan: 5% of total pool
   - Alternative: 2-3% (more competitive)
   - **Decision Needed:** Before Phase 1 launch

4. **Settlement Timing?**
   - Exact timestamps for portfolio snapshots
   - Handling of timezone differences
   - **Decision Needed:** During Phase 1 dev

5. **Handling Ties?**
   - If Trader A ROI% = Trader B ROI%, what happens?
   - Option A: Split pot 50/50
   - Option B: Refund all bets
   - **Decision Needed:** During Phase 1 dev

### Phase 2 Questions

1. **Exit Penalty Percentage?**
   - Current plan: 10% flat penalty
   - Alternative: Time-based penalty (higher early, lower late)
   - **Decision Needed:** Phase 2 planning

2. **Diamond Distribution Formula?**
   - How to weight early bettors vs late bettors
   - How to distribute consolation to losers
   - **Decision Needed:** Phase 2 planning

---

## Appendix

### Related Documents

- [PRD_FRONTEND.md](PRD_FRONTEND.md) - Frontend requirements
- [PRD_BACKEND.md](PRD_BACKEND.md) - Backend requirements
- [PRD_TELEGRAM.md](PRD_TELEGRAM.md) - Telegram bot requirements
- [DATABASE_DESIGN.md](DATABASE_DESIGN.md) - Database schema
- [ERD.md](ERD.md) - Entity relationship diagrams
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture

### Glossary

- **Rumble:** A side-by-side comparison of two Polymarket traders
- **Pool:** A betting pool (Pool A for Trader A, Pool B for Trader B)
- **Grace Period:** 6-hour period after pools match, before betting locks
- **Settlement:** Process of determining winner and distributing payouts
- **Diamond Hands:** Holding a bet until settlement (no early exit)
- **ROI%:** Return on Investment percentage over timeframe
- **Parimutuel:** Betting pool system where winners share losing pool

### Version History

| Version | Date       | Author  | Changes                          |
|---------|------------|---------|----------------------------------|
| 1.0     | 2025-10-31 | kinartan | Initial PRD creation            |

---

**Document Owner:** kinartan
**Next Review:** 2025-11-15 (before Phase 1 kick-off)
