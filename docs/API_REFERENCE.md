# API Reference

## Base URL

```
Development: http://localhost:3333
Production:  https://api.polymarket-rumble.com
```

## Interactive Documentation

For complete interactive API documentation, visit:
- **Swagger UI**: `http://localhost:3333/docs`
- **OpenAPI Spec**: `http://localhost:3333/swagger`

This document provides quick reference and code examples.

## Authentication

### JWT Bearer Token

```http
Authorization: Bearer <access_token>
```

### API Key (for services)

```http
Authorization: ApiKey <api_key>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    // Optional metadata (pagination, etc.)
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {} // Optional, dev mode only
  }
}
```

## Endpoints

### Health & Info

#### Get Service Info
```http
GET /
```

**Response:**
```json
{
  "success": true,
  "data": {
    "service": "Polymarket Trader Rumble API",
    "version": "1.0.0",
    "status": "operational"
  }
}
```

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-07T10:00:00.000Z"
  }
}
```

---

### Authentication

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "role": "admin"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 900
    }
  }
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

---

### Pools

#### List All Pools
```http
GET /api/v1/pools?page=1&perPage=20&status=Active&sort=-createdAt
```

**Query Parameters:**
- `page` (integer, default: 1)
- `perPage` (integer, default: 20, max: 100)
- `status` (string): Active, Settled, Cancelled, etc.
- `rumbleId` (string): Filter by rumble ID
- `sort` (string): Field to sort by (prefix with `-` for desc)
- `search` (string): Search pool pubkey or trader addresses

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "poolPubkey": "...",
      "rumbleId": "rumble-001",
      "poolNumber": 1,
      "traderAAddress": "...",
      "traderBAddress": "...",
      "timeframeDays": 7,
      "status": "Active",
      "totalPoolSize": "1000000000",
      "poolARatio": 0.6,
      "poolBRatio": 0.4,
      "currentOddsA": 1.67,
      "currentOddsB": 2.5,
      "bettingClosesAt": 1704672000,
      "createdAt": "2025-01-07T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 5
  }
}
```

#### Get Active Pools
```http
GET /api/v1/pools/active
```

#### Get Pool Details
```http
GET /api/v1/pools/:id
```

#### Get Pool Statistics
```http
GET /api/v1/pools/:id/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "poolId": "uuid",
    "totalBets": 150,
    "uniqueBettors": 75,
    "totalVolume": "10000000000",
    "averageBetSize": "66666666",
    "poolARatio": 0.6,
    "poolBRatio": 0.4,
    "currentOddsA": 1.67,
    "currentOddsB": 2.5
  }
}
```

#### Create Pool (Admin Only)
```http
POST /api/v1/pools
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "rumbleId": "rumble-001",
  "traderAAddress": "...",
  "traderBAddress": "...",
  "timeframeDays": 7,
  "minBetAmount": "1000000",
  "maxBetAmount": "1000000000",
  "bettingOpensAt": 1704585600,
  "bettingClosesAt": 1704672000
}
```

---

### Bets

#### List All Bets
```http
GET /api/v1/bets?page=1&perPage=20&status=Active
```

**Query Parameters:**
- `page`, `perPage`, `sort` (same as pools)
- `status` (string): Active, Won, Lost, Cancelled, Claimed
- `traderChoice` (integer): 0 (Trader A) or 1 (Trader B)
- `poolId` (uuid): Filter by pool

#### Get Bet Details
```http
GET /api/v1/bets/:id
```

#### Get User Bets
```http
GET /api/v1/bets/user/:wallet
```

#### Get Pool Bets
```http
GET /api/v1/bets/pool/:poolId
```

#### Simulate Bet
```http
POST /api/v1/bets/simulate
Content-Type: application/json

{
  "poolId": "uuid",
  "amount": "100000000",
  "traderChoice": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "amount": "100000000",
    "traderChoice": 0,
    "currentOdds": 1.67,
    "potentialPayout": "167000000",
    "platformFee": "1000000",
    "netPayout": "166000000"
  }
}
```

#### Place Bet (Authenticated)
```http
POST /api/v1/bets
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "poolId": "uuid",
  "amount": "100000000",
  "traderChoice": 0
}
```

#### Claim Winnings (Authenticated)
```http
PATCH /api/v1/bets/:id/claim
Authorization: Bearer <access_token>
```

---

### Statistics

#### Global Statistics
```http
GET /api/v1/statistics/global
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPools": 150,
    "activePools": 25,
    "settledPools": 120,
    "totalBets": 5000,
    "totalVolume": "500000000000",
    "totalUsers": 1200,
    "platformFees": "5000000000"
  }
}
```

#### Pool Statistics
```http
GET /api/v1/statistics/pool/:poolId
```

#### User Statistics
```http
GET /api/v1/statistics/user/:wallet
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet": "...",
    "totalBets": 45,
    "totalWagered": "4500000000",
    "totalWon": "3000000000",
    "totalLost": "2000000000",
    "netProfit": "1000000000",
    "winRate": 0.67,
    "roi": 0.22,
    "rank": 15
  }
}
```

#### Leaderboard
```http
GET /api/v1/statistics/leaderboard?timeframe=all&limit=100
```

**Query Parameters:**
- `timeframe` (string): all, 7d, 30d, 90d
- `limit` (integer, default: 100, max: 1000)
- `sort` (string): roi, totalWon, winRate, totalBets

#### Trends
```http
GET /api/v1/statistics/trends?period=7d
```

**Query Parameters:**
- `period` (string): 24h, 7d, 30d, 90d

---

### Settlements

#### List Settlements
```http
GET /api/v1/settlements?page=1&perPage=20
```

#### Pending Settlements
```http
GET /api/v1/settlements/pending
```

#### Get Settlement Details
```http
GET /api/v1/settlements/:id
```

#### Get Pool Settlement
```http
GET /api/v1/settlements/pool/:poolId
```

#### Create Settlement (Admin/Oracle Only)
```http
POST /api/v1/settlements
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "poolId": "uuid",
  "traderAStartPortfolio": "1000000000",
  "traderAEndPortfolio": "1200000000",
  "traderBStartPortfolio": "1000000000",
  "traderBEndPortfolio": "1100000000",
  "oracleWallet": "...",
  "oracleConfidence": 0.95
}
```

---

### Admin Operations

All admin endpoints require authentication with admin role.

#### Dashboard Data
```http
GET /api/v1/admin/dashboard
Authorization: Bearer <admin_token>
```

#### System Health
```http
GET /api/v1/admin/system/health
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "database": "healthy",
    "redis": "healthy",
    "solana": "healthy",
    "websocket": "healthy",
    "scheduler": "running"
  }
}
```

#### Trigger System Sync
```http
POST /api/v1/admin/system/sync
Authorization: Bearer <admin_token>
```

---

### Scheduler Management

All scheduler endpoints require admin authentication.

#### Get Scheduler Status
```http
GET /api/v1/scheduler/status
Authorization: Bearer <admin_token>
```

#### List All Jobs
```http
GET /api/v1/scheduler/jobs
Authorization: Bearer <admin_token>
```

#### Get Job Details
```http
GET /api/v1/scheduler/jobs/:jobName
Authorization: Bearer <admin_token>
```

#### Trigger Job Manually
```http
POST /api/v1/scheduler/jobs/:jobName/trigger
Authorization: Bearer <admin_token>
```

#### Enable/Disable Job
```http
POST /api/v1/scheduler/jobs/:jobName/enable
POST /api/v1/scheduler/jobs/:jobName/disable
Authorization: Bearer <admin_token>
```

#### Job Execution History
```http
GET /api/v1/scheduler/history?jobName=SettlementCheck&limit=50
Authorization: Bearer <admin_token>
```

#### Job Metrics
```http
GET /api/v1/scheduler/metrics
Authorization: Bearer <admin_token>
```

#### Job Alerts
```http
GET /api/v1/scheduler/alerts
Authorization: Bearer <admin_token>
```

#### Job Logs
```http
GET /api/v1/scheduler/logs/:jobName?limit=100
Authorization: Bearer <admin_token>
```

---

### WebSocket Management

#### WebSocket Health
```http
GET /api/v1/websocket/health
```

#### WebSocket Status
```http
GET /api/v1/websocket/status
```

#### WebSocket Metrics (Authenticated)
```http
GET /api/v1/websocket/metrics
Authorization: Bearer <access_token>
```

#### Active Connections (Admin Only)
```http
GET /api/v1/websocket/connections
Authorization: Bearer <admin_token>
```

#### Active Rooms (Admin Only)
```http
GET /api/v1/websocket/rooms
Authorization: Bearer <admin_token>
```

#### Broadcast Message (Admin Only)
```http
POST /api/v1/websocket/broadcast
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "room": "global",
  "event": "announcement",
  "data": {
    "message": "System maintenance in 10 minutes"
  }
}
```

---

## Pagination

All list endpoints support pagination with standardized parameters:

```http
GET /api/v1/pools?page=2&perPage=50
```

**Response includes meta:**
```json
{
  "data": [...],
  "meta": {
    "total": 500,
    "perPage": 50,
    "currentPage": 2,
    "lastPage": 10,
    "firstPage": 1,
    "firstPageUrl": "/?page=1",
    "lastPageUrl": "/?page=10",
    "nextPageUrl": "/?page=3",
    "previousPageUrl": "/?page=1"
  }
}
```

## Filtering & Sorting

### Filtering

```http
GET /api/v1/pools?status=Active&rumbleId=rumble-001
```

### Sorting

**Ascending:**
```http
GET /api/v1/pools?sort=createdAt
```

**Descending:**
```http
GET /api/v1/pools?sort=-createdAt
```

Multiple sorts (comma-separated):
```http
GET /api/v1/pools?sort=-status,createdAt
```

## Rate Limiting

### Login Endpoints

- **Limit**: 5 attempts per 15 minutes
- **Key**: IP + email combination
- **Response**: 429 Too Many Requests

```json
{
  "success": false,
  "error": {
    "message": "Too many login attempts. Please try again in 15 minutes.",
    "code": "TOO_MANY_REQUESTS",
    "retryAfter": 900
  }
}
```

### API Endpoints

- **Limit**: 100 requests per minute (per IP)
- **Headers**:
  - `X-RateLimit-Limit`: Max requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid input data |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `SOLANA_ERROR` | 500 | Blockchain operation failed |

## Code Examples

### JavaScript/TypeScript

```typescript
const BASE_URL = 'http://localhost:3333'

// Login
async function login(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await response.json()
  return data.data.tokens.accessToken
}

// Get active pools
async function getActivePools(token: string) {
  const response = await fetch(`${BASE_URL}/api/v1/pools/active`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return await response.json()
}

// Place bet
async function placeBet(token: string, poolId: string, amount: string, traderChoice: number) {
  const response = await fetch(`${BASE_URL}/api/v1/bets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ poolId, amount, traderChoice })
  })
  return await response.json()
}
```

### Python

```python
import requests

BASE_URL = 'http://localhost:3333'

# Login
def login(email, password):
    response = requests.post(f'{BASE_URL}/api/v1/auth/login', json={
        'email': email,
        'password': password
    })
    data = response.json()
    return data['data']['tokens']['accessToken']

# Get active pools
def get_active_pools(token):
    response = requests.get(
        f'{BASE_URL}/api/v1/pools/active',
        headers={'Authorization': f'Bearer {token}'}
    )
    return response.json()

# Place bet
def place_bet(token, pool_id, amount, trader_choice):
    response = requests.post(
        f'{BASE_URL}/api/v1/bets',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        },
        json={
            'poolId': pool_id,
            'amount': amount,
            'traderChoice': trader_choice
        }
    )
    return response.json()
```

### cURL

```bash
# Login
curl -X POST http://localhost:3333/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"SecurePassword123!"}'

# Get active pools
curl -X GET http://localhost:3333/api/v1/pools/active \
  -H "Authorization: Bearer <token>"

# Place bet
curl -X POST http://localhost:3333/api/v1/bets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"poolId":"uuid","amount":"100000000","traderChoice":0}'
```

---

**Last Updated**: 2025-01-07
**Version**: 1.0.0

For complete API documentation with interactive examples, visit: `http://localhost:3333/docs`
