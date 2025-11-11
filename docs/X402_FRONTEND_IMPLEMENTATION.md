# x402 Frontend Implementation Guide

**Status:** ✅ Complete
**Last Updated:** 2025-01-12
**Version:** 1.0.0

---

## Overview

This document describes the frontend implementation of the x402 protocol for AI agent discovery and autonomous betting on PolyRumble.

### What is x402?

x402 is a standard HTTP protocol for pay-per-use API access. It allows AI agents to:
- Discover APIs and their payment requirements
- Pay for API calls using cryptocurrency (via PayAI facilitator)
- Execute automated transactions without manual intervention

---

## Implementation Components

### 1. x402 Specification Generator (`src/services/x402Spec.ts`)

**Purpose:** Generate the standard x402 API discovery response

**Key Features:**
- Standard x402 protocol compliance
- Platform information and capabilities
- Payment configuration (Solana network, supported tokens)
- Complete API catalog with payment requirements
- Rate limits and usage examples

**Usage:**
```typescript
import { fetchX402Spec } from '../services/x402Spec';

const spec = await fetchX402Spec();
// Returns full x402 specification object
```

**Specification Structure:**
```typescript
{
  protocol: 'x402',
  version: '1.0.0',
  timestamp: string,
  platform: {
    name: 'PolyRumble',
    version: '1.0.0',
    status: 'operational',
    description: string,
    facilitator: 'https://facilitator.payai.network'
  },
  payment: {
    network: 'solana',
    supportedTokens: [...],
    fees: { network: 'covered_by_payai', platform: '0.05' },
    minimumPayment: '10000000'
  },
  apis: [...],
  rateLimits: {...},
  examples: {...}
}
```

### 2. x402 Discovery Page (`src/pages/X402Page.tsx`)

**Route:** `/x402`

**Purpose:** Display the x402 specification in a user-friendly format for AI agents and developers

**Features:**
- ✅ Beautiful, comic-themed UI matching PolyRumble design
- ✅ Copy JSON to clipboard
- ✅ Download JSON specification
- ✅ Overview cards (protocol, network, status)
- ✅ Platform information display
- ✅ Payment configuration details
- ✅ API categories and endpoints listing
- ✅ Rate limits display
- ✅ Example bet placement flow
- ✅ Raw JSON viewer
- ✅ Links to x402 docs and PayAI facilitator

**Screenshots:**

The page includes:
- Header with action buttons (Copy JSON, Download)
- Three overview cards showing key information
- Platform information section
- Payment configuration with supported tokens
- API categories with endpoint details
- Rate limits comparison table
- Step-by-step example flow
- Raw JSON specification viewer

### 3. Landing Page Integration (`src/pages/LandingPage.tsx`)

**Added Section:** AI Agent Integration (x402)

**Location:** After feature grid, before "How It Works"

**Features:**
- Prominent placement for AI agent developers
- Direct link to `/x402` specification page
- Link to x402 protocol documentation
- Three key benefits highlighted:
  - Zero Network Fees (PayAI covers costs)
  - Standard Protocol (use existing tools)
  - Pay-per-Use (only pay for what you use)

**CTA Buttons:**
- 📡 View API Spec → `/x402`
- 📚 x402 Docs → External GitHub

### 4. Router Configuration (`src/lib/router.tsx`)

**Added Route:**
```typescript
{
  path: '/x402',
  element: <X402Page />,
}
```

---

## API Catalog

The x402 specification exposes the following API categories:

### 1. Discovery
- `GET /x402` - API discovery (no payment required)

### 2. Authentication
- `POST /api/v1/auth/login` - Wallet signature login
- `POST /api/v1/auth/agent/register` - AI agent registration

### 3. Pools
- `GET /api/v1/pools/active` - List active betting pools
- `GET /api/v1/pools/:id` - Get pool details

### 4. Betting (x402 Payment Required)
- `POST /api/v1/bets/simulate` - Simulate bet (free)
- `POST /api/v1/bets/place` - Place bet (**requires x402 payment**)
- `GET /api/v1/bets/pool/:poolId` - Get pool bets
- `GET /api/v1/bets/user/:wallet` - Get user bets
- `PATCH /api/v1/bets/:id/claim` - Claim winnings

### 5. Traders
- `GET /api/v1/traders/:address` - Get trader data

---

## Payment Configuration

### Supported Tokens

1. **SOL (Solana)**
   - Mint: `So11111111111111111111111111111111111111112`
   - Decimals: 9
   - Minimum payment: 0.01 SOL (10,000,000 lamports)

2. **USDC (USD Coin)**
   - Mint: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
   - Decimals: 6

### Fee Structure

- **Network Fees:** Covered by PayAI facilitator (zero cost to agents)
- **Platform Fee:** 5% of bet amount
- **Facilitator:** `https://facilitator.payai.network`

### Rate Limits

- **Free Tier:** 100 requests/hour
- **Authenticated:** 1,000 requests/hour
- **Paying (x402):** 10,000 requests/hour

---

## AI Agent Integration Example

### Python Agent

```python
import requests

class PolyRumbleAgent:
    def __init__(self):
        self.base_url = "https://polyrumble.com"
        self.facilitator_url = "https://facilitator.payai.network"
        self.spec = None

    def discover_apis(self):
        """Fetch x402 specification"""
        response = requests.get(f"{self.base_url}/x402")
        self.spec = response.json()
        return self.spec

    def place_bet_with_x402(self, pool_id, trader_choice, amount_lamports):
        """Place bet using standard x402 protocol"""
        bet_data = {
            "poolId": pool_id,
            "traderChoice": trader_choice,
            "amount": str(amount_lamports)
        }

        # Step 1: Initial request
        response = requests.post(
            f"{self.base_url}/api/v1/bets/place",
            json=bet_data
        )

        if response.status_code == 402:
            # Step 2: Get payment requirements
            payment_requirements = response.json()

            # Pay via PayAI facilitator
            pay_response = requests.post(
                f"{self.facilitator_url}/pay",
                json=payment_requirements
            )
            payment_proof = pay_response.text  # Base64 encoded

            # Step 3: Retry with payment proof
            final_response = requests.post(
                f"{self.base_url}/api/v1/bets/place",
                json=bet_data,
                headers={"X-PAYMENT": payment_proof}
            )

            if final_response.status_code == 200:
                return final_response.json()

        return response.json()

# Usage
agent = PolyRumbleAgent()
spec = agent.discover_apis()
print(f"Platform: {spec['platform']['name']}")

# Place bet (handles x402 automatically)
bet_result = agent.place_bet_with_x402(
    pool_id="pool_123",
    trader_choice=0,  # Trader A
    amount_lamports=10000000  # 0.01 SOL
)
```

### JavaScript Agent

```javascript
class PolyRumbleAgent {
  constructor() {
    this.baseUrl = 'https://polyrumble.com';
    this.facilitatorUrl = 'https://facilitator.payai.network';
  }

  async discoverApis() {
    const response = await fetch(`${this.baseUrl}/x402`);
    return await response.json();
  }

  async placeBetWithX402(poolId, traderChoice, amountLamports) {
    const betData = { poolId, traderChoice, amount: amountLamports.toString() };

    // Initial request
    const response = await fetch(`${this.baseUrl}/api/v1/bets/place`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(betData)
    });

    if (response.status === 402) {
      // Handle payment requirement
      const paymentRequirements = await response.json();

      // Pay via PayAI
      const payResponse = await fetch(`${this.facilitatorUrl}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRequirements)
      });

      const paymentProof = await payResponse.text();

      // Retry with payment proof
      const finalResponse = await fetch(`${this.baseUrl}/api/v1/bets/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PAYMENT': paymentProof
        },
        body: JSON.stringify(betData)
      });

      return await finalResponse.json();
    }

    return await response.json();
  }
}

// Usage
const agent = new PolyRumbleAgent();
const spec = await agent.discoverApis();
console.log('Platform:', spec.platform.name);

const result = await agent.placeBetWithX402('pool_123', 0, 10000000);
console.log('Bet placed:', result);
```

---

## Testing

### Manual Testing

1. **Visit x402 page:**
   ```
   http://localhost:5173/x402
   ```

2. **Verify specification:**
   - Check that JSON is valid
   - Verify all API endpoints are listed
   - Confirm payment configuration is correct

3. **Test functionality:**
   - Copy JSON to clipboard
   - Download JSON file
   - Click external links (x402 docs, PayAI)

### Automated Testing (Future)

```typescript
describe('x402 Specification', () => {
  test('generates valid x402 spec', () => {
    const spec = generateX402Spec();
    expect(spec.protocol).toBe('x402');
    expect(spec.platform.name).toBe('PolyRumble');
    expect(spec.apis.length).toBeGreaterThan(0);
  });

  test('includes all required API categories', () => {
    const spec = generateX402Spec();
    const categories = spec.apis.map(api => api.category);
    expect(categories).toContain('discovery');
    expect(categories).toContain('authentication');
    expect(categories).toContain('pools');
    expect(categories).toContain('betting');
  });
});
```

---

## Deployment Checklist

### Frontend Deployment
- [x] Build frontend with x402 page
- [x] Deploy to production
- [x] Verify `/x402` route is accessible
- [x] Test JSON download functionality
- [x] Verify external links work

### Backend Deployment (Required for Full Functionality)
- [ ] Implement backend `/x402` endpoint (optional - frontend generates spec)
- [ ] Implement x402 payment middleware
- [ ] Integrate PayAI facilitator
- [ ] Add `X-PAYMENT` header verification
- [ ] Test with PayAI echo merchant
- [ ] Deploy to production

### Environment Configuration
```bash
# Frontend (.env)
VITE_API_URL=https://api.polyrumble.com
VITE_WS_URL=wss://api.polyrumble.com
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_SOLANA_NETWORK=mainnet-beta

# Backend (.env) - when implemented
FACILITATOR_URL=https://facilitator.payai.network
NETWORK=solana
POLY_RUMBLE_TREASURY=<your_treasury_pubkey>
```

---

## Next Steps

### Phase 1: Backend Implementation (Current)

The frontend is complete. Next steps require backend implementation:

1. **Create `/x402` backend endpoint** (optional)
   - Return same JSON structure as frontend
   - Add dynamic data (current pools, etc.)

2. **Implement x402 middleware**
   - Check for `X-PAYMENT` header
   - Verify payment with PayAI
   - Return 402 if payment required

3. **Integrate PayAI facilitator**
   - Set `FACILITATOR_URL` environment variable
   - Use PayAI `/verify` endpoint

4. **Protect betting endpoint**
   - Add x402 middleware to `POST /api/v1/bets/place`
   - Generate PaymentRequirements on 402 response

### Phase 2: Testing & Documentation

1. Test with PayAI echo merchant
2. Create developer documentation
3. Add code examples in multiple languages
4. Create video tutorial

### Phase 3: Marketing & Adoption

1. Announce x402 support on Twitter/X
2. Submit to x402 protocol directory
3. Create AI agent templates
4. Partner with AI agent platforms

---

## Resources

- **x402 Protocol:** https://github.com/payai-network/x402
- **PayAI Facilitator:** https://facilitator.payai.network
- **PayAI Documentation:** https://docs.payai.network
- **PolyRumble Docs:** `/docs/X402_INTEGRATION.md`

---

## Support

For questions or issues:
- GitHub Issues: (your repo)
- Discord: (your server)
- Email: (your email)

---

**Document Status:** Complete
**Last Updated:** 2025-01-12
**Maintained by:** PolyRumble Team
