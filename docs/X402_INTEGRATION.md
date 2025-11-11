# Product Requirements Document: x402 Agent Payment API

**Project:** PolyRumble x402 Integration
**Version:** 1.0
**Last Updated:** 2025-01-11
**Status:** Design Phase
**Author:** Generated for CTO

---

## Executive Summary

### Problem Statement

As PolyRumble grows, AI agents and automated systems need a standardized way to:
- Pay per API call (bet placement, data access, premium features)
- Use existing x402 infrastructure rather than building custom payment systems
- Leverage PayAI facilitator for fee-free transactions on Solana
- Integrate with other x402-compatible services in the AI agent ecosystem

### Solution Overview

Implement the **standard x402 protocol** with PolyRumble-specific PaymentRequirements objects:
1. **x402 Discovery Endpoint**: Standard `/x402` for API catalog and payment terms
2. **PayAI Facilitator Integration**: Use PayAI for transaction processing (covers network fees)
3. **Standard HTTP Flow**: 402 responses with PaymentRequirements → payment → X-PAYMENT header → verification
4. **Solana Native**: Support all SPL tokens through PayAI's Solana-first infrastructure

### Key Value Propositions

**For AI Agents:**
- **Standard Protocol**: Use existing x402 libraries and infrastructure
- **Pay-per-Use**: Pay only for API calls actually made
- **No Network Fees**: PayAI covers Solana transaction fees
- **Multi-Token Support**: Use any SPL token on Solana

**For PolyRumble:**
- **No Transaction Fees**: PayAI covers buyer and merchant network fees
- **Drop-in Setup**: Simple facilitator URL configuration
- **Built for Scale**: 100K settlements/month on free plan
- **AI Agent Ready**: Native support for autonomous agent transactions

---

## Technical Architecture

### x402 Protocol Flow (Standard Implementation)

```
┌─────────────────┐    HTTP Request    ┌──────────────────────┐
│   AI Agent      │ ──────────────────► │  PolyRumble API      │
│                 │                    │                      │
│ - x402 Client   │                    │ - Protected Endpoint │
│ - Wallet        │   402 Payment      │ - PaymentRequirements│
└─────────────────┘ ◄───────────────── │                      │
     Required +     JSON Object        └──────────────────────┘
   PaymentRequirements                        │
                                             ▼
                                    ┌──────────────────────┐
                                    │   PayAI Facilitator   │
                                    │                      │
                                    │ - Fee Processing     │
                                    │ - Solana Settlement  │
                                    │ - SPL Token Support  │
                                    └──────────────────────┘
                                             │
                        X-PAYMENT Header    │
                        (Base64 Proof)      ▼
┌─────────────────┐    HTTP Request    ┌──────────────────────┐
│   AI Agent      │ ──────────────────► │  PolyRumble API      │
│                 │  X-PAYMENT Header  │                      │
│ - Paid Access   │                    │ - Verify Payment     │
│ - API Response  │                    │ - Return 200 OK      │
└─────────────────┘ ◄───────────────── │                      │
      200 OK +        API Response     └──────────────────────┘
      Data
```

### PayAI Facilitator Integration

**Configuration:**
```bash
FACILITATOR_URL=https://facilitator.payai.network
NETWORK=solana
```

**Key Benefits:**
- **No API Keys Required** - Just set FACILITATOR_URL
- **Network Fees Covered** - PayAI covers all buyer and merchant fees
- **Multi-Token Support** - Any SPL token on Solana
- **Built for Scale** - 100,000 settlements/month free, 4 requests/second

### Standard x402 Implementation

**PaymentRequirements Object:**
```json
{
  "quoteId": "polyrumble_bet_001",
  "amount": "10000000",  // lamports (0.01 SOL)
  "token": "So11111111111111111111111111111111111111112",  // SOL
  "deadline": 1640995200,
  "recipient": "POLY_RUMBLE_TREASURY_ADDRESS",
  "memo": "bet_on_trader_A_pool_123",
  "facilitator": "https://facilitator.payai.network"
}
```

**Standard Response Flow:**
1. **First Request:** `402 Payment Required` + PaymentRequirements JSON
2. **Agent Payment:** Agent pays via PayAI facilitator
3. **Second Request:** Same request + `X-PAYMENT: base64(payment_proof)`
4. **Verification:** Server verifies payment with PayAI `/verify` endpoint
5. **Response:** `200 OK` + actual API response

### Discovery Endpoint Specification

**URL:** `/x402`
**Method:** `GET`
**Response:** `application/json`
**Purpose:** API discovery and payment terms catalog

### Standard x402 Response Structure

```json
{
  "protocol": "x402",
  "version": "1.0.0",
  "timestamp": "2025-01-11T10:00:00.000Z",
  "platform": {
    "name": "PolyRumble",
    "version": "1.0.0",
    "status": "operational",
    "description": "Polymarket trader comparison and betting platform",
    "facilitator": "https://facilitator.payai.network"
  },
  "payment": {
    "network": "solana",
    "supportedTokens": [
      {
        "mint": "So11111111111111111111111111111111111111112",
        "symbol": "SOL",
        "name": "Solana",
        "decimals": 9
      }
      // Add other SPL tokens as needed
    ],
    "fees": {
      "network": "covered_by_payai",
      "platform": "0.05"  // 5% platform fee
    },
    "minimumPayment": "10000000"  // 0.01 SOL minimum
  },
  "apis": [
    {
      "category": "discovery",
      "endpoints": [
        {
          "path": "/x402",
          "method": "GET",
          "paymentRequired": false,
          "description": "Discover API catalog and payment terms"
        }
      ]
    },
    {
      "category": "betting",
      "endpoints": [
        {
          "path": "/api/v1/bets/place",
          "method": "POST",
          "paymentRequired": true,
          "baseCost": "10000000",  // 0.01 SOL per bet
          "description": "Place bet on trader performance"
        },
        {
          "path": "/api/v1/pools/active",
          "method": "GET",
          "paymentRequired": false,
          "description": "List active betting pools"
        }
      ]
    }
  ],
  "rateLimits": {
    "free": "100/hour",
    "authenticated": "1000/hour",
    "paying": "10000/hour"
  },
  "examples": {
    "betPlacementFlow": {
      "description": "Place bet using x402 protocol",
      "steps": [
        "POST /api/v1/bets/place with bet data",
        "Receive 402 Payment Required + PaymentRequirements",
        "Pay via PayAI facilitator",
        "Retry request with X-PAYMENT header",
        "Receive 200 OK + bet confirmation"
      ]
    }
  }
}
```

---

## User Experience

### Landing Page Integration

**Current State:** Landing page has "Browse Arenas" CTA
**New Addition:** Add "AI Integration (x402)" button/section

**UI Design:**
```jsx
<div className="bg-white border-4 border-black rounded-lg p-8 shadow-brutal">
  <div className="flex items-center mb-4">
    <div className="text-3xl mr-3">🤖</div>
    <h3 className="text-xl font-bold comic-font">AI Integration (x402)</h3>
  </div>
  <p className="text-gray-600 mb-4 body-font">
    Integrate PolyRumble with your AI agents. Discover APIs and payment methods.
  </p>
  <button
    onClick={() => window.open('/x402', '_blank')}
    className="comic-button bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3"
  >
    📡 Fetch x402 Spec
  </button>
</div>
```

### Agent Integration Flow

```
1. Agent discovers PolyRumble → Visits /x402
2. Agent parses JSON response → Understands capabilities
3. Agent follows payment instructions → Sets up SOL wallet
4. Agent authenticates → Gets JWT token
5. Agent places bets → Via betting API
6. Agent monitors results → Via WebSocket
7. Agent claims winnings → Automated process
```

---

## API Catalog Design

### 1. Authentication APIs

```json
{
  "category": "authentication",
  "description": "Authenticate agents and users for platform access",
  "endpoints": [
    {
      "path": "/api/v1/auth/login",
      "method": "POST",
      "description": "Login with wallet signature",
      "request": {
        "walletAddress": "string",
        "signature": "string",
        "message": "string"
      },
      "response": {
        "accessToken": "string",
        "refreshToken": "string",
        "expiresIn": "number"
      },
      "paymentRequired": false
    },
    {
      "path": "/api/v1/auth/agent/register",
      "method": "POST",
      "description": "Register AI agent",
      "request": {
        "agentName": "string",
        "description": "string",
        "capabilities": ["array"],
        "walletAddress": "string"
      },
      "response": {
        "agentId": "string",
        "apiKey": "string"
      },
      "paymentRequired": false
    }
  ]
}
```

### 2. Pool & Arena APIs

```json
{
  "category": "pools",
  "description": "Access trading arenas and pool information",
  "endpoints": [
    {
      "path": "/api/v1/pools/active",
      "method": "GET",
      "description": "List all active betting arenas",
      "response": {
        "pools": [
          {
            "id": "string",
            "traderA": {...},
            "traderB": {...},
            "poolSize": "string",
            "odds": {...}
          }
        ]
      },
      "paymentRequired": false
    }
  ]
}
```

### 3. Betting APIs

```json
{
  "category": "betting",
  "description": "Place and manage bets on trader performance",
  "endpoints": [
    {
      "path": "/api/v1/bets/place",
      "method": "POST",
      "description": "Place bet on trader performance",
      "request": {
        "poolId": "string",
        "traderChoice": "number",
        "amount": "string",
        "walletSignature": "string"
      },
      "response": {
        "betId": "string",
        "transactionHash": "string",
        "potentialPayout": "string"
      },
      "paymentRequired": true
    }
  ]
}
```

---

## x402 Payment Flow Design

### Standard x402 Implementation with PayAI

**Payment Method:** PayAI facilitator on Solana network
**Currency:** Any SPL token (SOL, USDC, etc.)
**Protocol:** Standard x402 HTTP 402 Payment Required pattern

### x402 Payment Flow for Agents

1. **Agent Makes API Request**
   ```javascript
   const response = await fetch('/api/v1/bets/place', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       poolId: 'pool_123',
       traderChoice: 0,
       amount: '1000000'  // lamports
     })
   });
   ```

2. **Receive 402 Payment Required**
   ```json
   // Response: 402 Payment Required
   {
     "quoteId": "polyrumble_abc123",
     "amount": "10000000",
     "token": "So11111111111111111111111111111111111111112",
     "deadline": 1640995200,
     "recipient": "POLY_RUMBLE_TREASURY",
     "facilitator": "https://facilitator.payai.network"
   }
   ```

3. **Pay via PayAI Facilitator**
   ```javascript
   // Agent pays using PayAI facilitator
   const paymentResponse = await fetch('https://facilitator.payai.network/pay', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(paymentRequirements)
   });

   const paymentProof = await paymentResponse.text(); // Base64 encoded
   ```

4. **Retry Request with X-PAYMENT Header**
   ```javascript
   const finalResponse = await fetch('/api/v1/bets/place', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'X-PAYMENT': paymentProof  // Base64 payment proof
     },
     body: JSON.stringify(betData)
   });

   // Response: 200 OK + bet confirmation
   ```

### Server-Side Payment Verification

```javascript
// PayAI verification endpoint
app.use('/api/*', async (req, res, next) => {
  const paymentHeader = req.headers['x-payment'];

  if (paymentHeader) {
    // Verify payment with PayAI
    const verifyResponse = await fetch(`${process.env.FACILITATOR_URL}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: paymentHeader
    });

    const verification = await verifyResponse.json();
    if (verification.verified) {
      req.payment = verification; // Attach payment info to request
      return next();
    }
  }

  // Check if endpoint requires payment
  if (requiresPayment(req.path)) {
    const paymentRequirements = generatePaymentRequirements(req);
    return res.status(402).json(paymentRequirements);
  }

  next();
});
```

### PayAI Facilitator Integration

**Environment Setup:**
```bash
# No API keys needed - just set the facilitator URL
FACILITATOR_URL=https://facilitator.payai.network
NETWORK=solana

# PolyRumble treasury address for receiving payments
POLY_RUMBLE_TREASURY=POLY_RUMBLE_TREASURY_PUBKEY
```

**PayAI Endpoints:**
- `/pay` - Process payment (no auth required)
- `/verify` - Verify payment proof
- `/settle` - Settle payments to merchant
- `/list` - List payment history

**Benefits:**
- **Zero Transaction Fees** - PayAI covers all Solana network fees
- **No API Keys** - Simple URL-based integration
- **Multi-Token Support** - Any SPL token on Solana
- **Scale Ready** - 100K settlements/month free tier

---

## Integration Examples

### Python Agent Example (Standard x402)

```python
import requests
import base64
import json

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

        # Step 1: Make initial request
        response = requests.post(
            f"{self.base_url}/api/v1/bets/place",
            json=bet_data
        )

        if response.status_code == 402:
            # Step 2: Get payment requirements and pay
            payment_requirements = response.json()

            # Pay via PayAI facilitator
            pay_response = requests.post(
                f"{self.facilitator_url}/pay",
                json=payment_requirements
            )

            payment_proof = pay_response.text  # Base64 encoded

            # Step 3: Retry request with payment proof
            final_response = requests.post(
                f"{self.base_url}/api/v1/bets/place",
                json=bet_data,
                headers={"X-PAYMENT": payment_proof}
            )

            if final_response.status_code == 200:
                return final_response.json()

        return response.json()

    def get_active_pools(self):
        """Get active pools (no payment required)"""
        response = requests.get(f"{self.base_url}/api/v1/pools/active")
        return response.json()

# Usage
agent = PolyRumbleAgent()
spec = agent.discover_apis()
print(f"Platform: {spec['platform']['name']}")
print(f"Payment Network: {spec['payment']['network']}")

# Place bet (will handle x402 payment automatically)
bet_result = agent.place_bet_with_x402(
    pool_id="pool_123",
    trader_choice=0,  # Trader A
    amount_lamports=10000000  # 0.01 SOL
)
print("Bet result:", bet_result)
```

### JavaScript Agent Example (Standard x402)

```javascript
class PolyRumbleAgent {
  constructor() {
    this.baseUrl = 'https://polyrumble.com';
    this.facilitatorUrl = 'https://facilitator.payai.network';
    this.spec = null;
  }

  async discoverApis() {
    const response = await fetch(`${this.baseUrl}/x402`);
    this.spec = await response.json();
    return this.spec;
  }

  async placeBetWithX402(poolId, traderChoice, amountLamports) {
    const betData = {
      poolId,
      traderChoice,
      amount: amountLamports.toString()
    };

    try {
      // Step 1: Initial request
      const response = await fetch(`${this.baseUrl}/api/v1/bets/place`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(betData)
      });

      if (response.status === 402) {
        // Step 2: Handle payment requirement
        const paymentRequirements = await response.json();

        // Pay via PayAI facilitator
        const payResponse = await fetch(`${this.facilitatorUrl}/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentRequirements)
        });

        const paymentProof = await payResponse.text();

        // Step 3: Retry with payment proof
        const finalResponse = await fetch(`${this.baseUrl}/api/v1/bets/place`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-PAYMENT': paymentProof
          },
          body: JSON.stringify(betData)
        });

        if (finalResponse.status === 200) {
          return await finalResponse.json();
        }
      }

      return await response.json();
    } catch (error) {
      console.error('Bet placement failed:', error);
      throw error;
    }
  }

  async getActivePools() {
    const response = await fetch(`${this.baseUrl}/api/v1/pools/active`);
    return await response.json();
  }
}

// Usage
async function main() {
  const agent = new PolyRumbleAgent();

  // Discover platform capabilities
  await agent.discoverApis();
  console.log('Platform:', agent.spec.platform.name);
  console.log('Payment Network:', agent.spec.payment.network);

  // Get active pools
  const pools = await agent.getActivePools();
  console.log('Active pools:', pools.length);

  // Place bet (handles x402 automatically)
  if (pools.length > 0) {
    const betResult = await agent.placeBetWithX402(
      pools[0].id,
      0,  // Trader A
      10000000  // 0.01 SOL in lamports
    );
    console.log('Bet placed:', betResult);
  }
}

main().catch(console.error);
```

### Agent Testing with PayAI Echo Merchant

```javascript
// Test x402 flow with PayAI's live echo merchant
class X402Tester {
  async testWithEchoMerchant() {
    const echoUrl = 'https://facilitator.payai.network/echo';

    // Make request to echo merchant
    const response = await fetch(echoUrl);

    if (response.status === 402) {
      const paymentReq = await response.json();
      console.log('Payment required:', paymentReq);

      // Pay and test full flow
      const payResponse = await fetch('https://facilitator.payai.network/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentReq)
      });

      const paymentProof = await payResponse.text();

      // Retry with payment
      const finalResponse = await fetch(echoUrl, {
        headers: { 'X-PAYMENT': paymentProof }
      });

      console.log('Final response:', await finalResponse.text());
    }
  }
}
```

---

## Security Considerations

### Authentication Security

1. **Wallet Signature Verification**
   - Validate cryptographic signatures
   - Prevent replay attacks
   - Rate limiting per wallet

2. **API Key Management**
   - Unique API keys for registered agents
   - Key rotation capabilities
   - Usage tracking and limits

### Payment Security

1. **Solana Transaction Validation**
   - Verify transaction signatures
   - Confirm network confirmations
   - Prevent double-spending

2. **Smart Contract Security**
   - Audited betting program
   - Emergency pause functionality
   - Multi-signature controls

### Rate Limiting

```json
{
  "rateLimits": {
    "discovery": "100/minute",
    "authentication": "10/minute",
    "betting": "1000/hour",
    "payment": "5000/day"
  },
  "enforcement": "token-bucket",
  "penalties": {
    "abuse": "temporary-ban",
    "fraud": "permanent-blacklist"
  }
}
```

---

## Implementation Plan

### Phase 1: Standard x402 Integration (Week 1-2)

**Backend Tasks:**
- [ ] Implement PayAI facilitator integration (no API keys required)
- [ ] Add x402 middleware for payment verification
- [ ] Create `/x402` discovery endpoint with standard schema
- [ ] Generate PaymentRequirements objects for betting endpoints
- [ ] Integrate with PayAI `/verify` endpoint for payment confirmation
- [ ] Test with PayAI echo merchant for validation

**Environment Setup:**
```bash
# Add to .env
FACILITATOR_URL=https://facilitator.payai.network
NETWORK=solana
POLY_RUMBLE_TREASURY=YOUR_TREASURY_PUBKEY
```

**Deliverables:**
- Standard x402 protocol implementation
- PayAI facilitator integration
- Working payment flow for betting APIs
- Echo merchant testing validation

### Phase 2: API x402 Protection (Week 3)

**Protected Endpoints:**
- [ ] `/api/v1/bets/place` - Pay-per-bet (0.01 SOL minimum)
- [ ] `/api/v1/statistics/advanced` - Premium analytics
- [ ] `/api/v1/predictions/ai` - AI-powered predictions (future)

**Middleware Implementation:**
```javascript
// x402 protection middleware
const requirePayment = (costLamports) => async (req, res, next) => {
  const paymentHeader = req.headers['x-payment'];

  if (paymentHeader) {
    // Verify with PayAI
    const verified = await verifyPayment(paymentHeader);
    if (verified && verified.amount >= costLamports) {
      req.payment = verified;
      return next();
    }
  }

  // Return PaymentRequirements
  const paymentReq = generatePaymentRequirements(costLamports, req.path);
  res.status(402).json(paymentReq);
};

// Apply to betting endpoint
app.post('/api/v1/bets/place', requirePayment(10000000), betController.place);
```

**Deliverables:**
- Payment-protected betting endpoints
- Standard PaymentRequirements generation
- PayAI verification integration

### Phase 3: Landing Page & Developer Experience (Week 4)

**Frontend Tasks:**
- [ ] Add x402 integration section to landing page
- [ ] "Test x402 Flow" button that calls echo merchant
- [ ] Interactive API documentation with payment costs
- [ ] Code examples for Python and JavaScript agents
- [ ] Developer sandbox environment

**Landing Page Component:**
```jsx
<div className="bg-white border-4 border-black rounded-lg p-8 shadow-brutal">
  <div className="flex items-center mb-4">
    <div className="text-3xl mr-3">🤖</div>
    <h3 className="text-xl font-bold comic-font">AI Integration (x402)</h3>
  </div>
  <p className="text-gray-600 mb-4 body-font">
    Pay-per-use API access with standard x402 protocol. Powered by PayAI.
  </p>
  <div className="flex gap-4">
    <button
      onClick={() => window.open('/x402', '_blank')}
      className="comic-button bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3"
    >
      📡 Fetch x402 Spec
    </button>
    <button
      onClick={testX402Flow}
      className="comic-button bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3"
    >
      🧪 Test Payment Flow
    </button>
  </div>
</div>
```

**Deliverables:**
- Updated landing page with x402 integration
- Interactive testing with PayAI echo merchant
- Developer-friendly documentation

### Phase 4: Advanced Agent Features (Future)

**Agent Analytics:**
- [ ] Agent registration and identification
- [ ] Usage tracking per agent
- [ ] Advanced rate limiting for agents
- [ ] Agent performance analytics

**Enhanced Features:**
- [ ] Multi-token support (USDC, other SPL tokens)
- [ ] Subscription-based API access
- [ ] Agent-to-agent payments
- [ ] Batch payment processing

---

## Testing Strategy

### Endpoint Testing

```javascript
// Test cases for /x402 endpoint
describe('x402 Endpoint', () => {
  test('returns valid JSON structure', async () => {
    const response = await request(app).get('/x402');
    expect(response.status).toBe(200);
    expect(response.body.protocol).toBe('x402');
    expect(response.body.platform).toBeDefined();
  });

  test('includes all API categories', async () => {
    const response = await request(app).get('/x402');
    const categories = response.body.apis.map(api => api.category);
    expect(categories).toContain('authentication');
    expect(categories).toContain('betting');
    expect(categories).toContain('pools');
  });

  test('rate limits excessive requests', async () => {
    // Test rate limiting implementation
  });
});
```

### Integration Testing

```python
# Python integration test
def test_agent_integration():
    agent = PolyRumbleAgent()

    # Test discovery
    spec = agent.discover_apis()
    assert spec['protocol'] == 'x402'

    # Test authentication flow
    # Note: Requires test SOL for actual betting tests

    # Test pool listing
    pools = agent.get_active_pools()
    assert len(pools) >= 0
```

---

## Success Metrics

### Adoption Metrics

- **x402 Endpoint Usage:** 1,000+ requests/day in first month
- **Agent Registrations:** 50+ registered AI agents
- **Integration Projects:** 10+ third-party integrations
- **API Calls:** 10,000+ authenticated calls/day

### Business Metrics

- **Betting Volume from Agents:** 15% of total volume
- **New Revenue Streams:** Agent-based betting fees
- **Platform Reach:** Integration with trading bots, analytics platforms
- **Developer Engagement:** GitHub stars, forks, contributions

### Technical Metrics

- **Endpoint Uptime:** 99.9% availability
- **Response Time:** < 200ms average
- **Error Rate:** < 0.1% for x402 endpoint
- **Security:** Zero successful attacks

---
## Appendix

### Related Documents

- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API documentation
- [PRD_MASTER.md](./PRD/PRD_MASTER.md) - Overall platform requirements
- [SOLANA_INTEGRATION.md](./SOLANA_INTEGRATION.md) - Blockchain integration details
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture

### JSON Schema (Complete)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["protocol", "version", "platform", "payment", "apis"],
  "properties": {
    "protocol": {
      "type": "string",
      "enum": ["x402"]
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "platform": {
      "$ref": "#/definitions/Platform"
    },
    "payment": {
      "$ref": "#/definitions/Payment"
    },
    "apis": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/APICategory"
      }
    },
    "rateLimits": {
      "$ref": "#/definitions/RateLimits"
    },
    "examples": {
      "$ref": "#/definitions/Examples"
    }
  },
  "definitions": {
    "Platform": {
      "type": "object",
      "required": ["name", "status"],
      "properties": {
        "name": {"type": "string"},
        "version": {"type": "string"},
        "status": {"enum": ["operational", "degraded", "down"]},
        "description": {"type": "string"}
      }
    },
    "Payment": {
      "type": "object",
      "required": ["currency", "network"],
      "properties": {
        "currency": {"type": "string"},
        "network": {"type": "string"},
        "acceptedWallets": {
          "type": "array",
          "items": {"type": "string"}
        },
        "minimumBet": {"type": "string"},
        "platformFee": {"type": "string"}
      }
    }
  }
}
```

### Example x402 Response

```json
{
  "protocol": "x402",
  "version": "1.0.0",
  "timestamp": "2025-01-11T10:00:00.000Z",
  "platform": {
    "name": "PolyRumble",
    "version": "1.0.0",
    "status": "operational",
    "description": "Polymarket trader comparison and betting platform"
  },
  "payment": {
    "currency": "SOL",
    "network": "solana",
    "acceptedWallets": ["phantom", "solflare", "backpack"],
    "minimumBet": "0.1",
    "platformFee": "0.05",
    "paymentFlow": "solana-program",
    "instructions": {
      "setupWallet": "Create Solana wallet using @solana/web3.js",
      "fundWallet": "Transfer SOL to wallet address",
      "approveTransaction": "Sign betting transaction with wallet",
      "confirmBet": "Wait for blockchain confirmation"
    }
  },
  "apis": [
    {
      "category": "authentication",
      "description": "Authenticate users and agents",
      "endpoints": [
        {
          "path": "/api/v1/auth/login",
          "method": "POST",
          "description": "Login with wallet signature",
          "paymentRequired": false,
          "authRequired": false
        }
      ]
    }
  ],
  "rateLimits": {
    "default": "100/minute",
    "authenticated": "1000/minute",
    "paymentVerified": "5000/minute"
  },
  "examples": {
    "authentication": {
      "description": "Authenticate with wallet signature",
      "code": {
        "javascript": "const response = await fetch('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ walletAddress, signature }) });"
      }
    }
  }
}
```

---

**Document Status:** Ready for implementation
**Generated:** 2025-01-11
**Framework:** Based on existing PolyRumble architecture
**Dependencies:** Current API reference documentation