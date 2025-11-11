# Product Requirements Document - Backend

**Component:** Express.js Backend API
**Tech Stack:** Node.js + Express + TypeScript + PostgreSQL
**Version:** 1.0
**Last Updated:** 2025-10-31

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [API Endpoints](#api-endpoints)
5. [Database Integration](#database-integration)
6. [Authentication & Security](#authentication--security)
7. [Error Handling](#error-handling)
8. [Performance & Scalability](#performance--scalability)
9. [Monitoring & Logging](#monitoring--logging)

---

## Overview

### Purpose

The backend provides:
- REST API for rumble CRUD operations
- Telegram webhook handling
- (Phase 1) Betting logic and settlement
- (Phase 1) Wallet signature verification
- Data validation and business logic

### Architecture Pattern

**Model-Controller-Service Pattern:**
```
Routes → Controllers → Services → Database
         ↓
    Middleware (validation, auth, rate limiting)
```

---

## Tech Stack

### Core Technologies

```json
{
  "runtime": "Node.js 18+",
  "framework": "Express 4.18+",
  "language": "TypeScript 5.2",
  "database": "PostgreSQL 15+",
  "orm": "pg (node-postgres)",
  "validation": "Zod",
  "processManager": "PM2"
}
```

### Development Dependencies

```json
{
  "transpiler": "ts-node",
  "watcher": "nodemon",
  "linting": "ESLint",
  "typeChecking": "TypeScript strict mode"
}
```

---

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── arenaController.ts      # Rumble CRUD logic
│   │   └── telegramController.ts   # Telegram webhook handler
│   ├── services/
│   │   ├── arenaService.ts         # Rumble business logic
│   │   └── telegramService.ts      # Telegram bot logic
│   ├── db/
│   │   ├── connection.ts           # PostgreSQL connection pool
│   │   ├── schema.sql              # Database schema
│   │   └── migrations/             # Database migrations
│   │       └── 001_add_telegram_users.sql
│   ├── middleware/
│   │   ├── errorHandler.ts         # Global error handler
│   │   ├── validation.ts           # Request validation (Zod)
│   │   ├── rateLimit.ts            # Rate limiting
│   │   └── botAuth.ts              # Telegram webhook auth
│   ├── routes/
│   │   ├── arenas.ts               # /api/rumbles routes
│   │   └── telegram.ts             # /telegram/* routes
│   ├── types/
│   │   ├── arena.types.ts          # Rumble type definitions
│   │   └── telegram.types.ts       # Telegram type definitions
│   ├── utils/
│   │   ├── logger.ts               # Winston logger
│   │   └── helpers.ts              # Utility functions
│   └── index.ts                    # Express app entry point
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## API Endpoints

### Phase 0: Rumble CRUD ✅ COMPLETE

#### Base URL

- **Development:** `http://localhost:3001`
- **Production:** `http://157.180.68.185/api` (or domain)

#### Endpoints

##### **1. Create Rumble**

```http
POST /api/rumbles
```

**Request Body:**
```json
{
  "creatorWallet": "0x8e900d70...",       // Optional
  "telegramUserId": 123456789,            // Optional
  "traderAAddress": "0x123...",
  "traderAName": "Alice",
  "traderAImage": "https://...",
  "traderBAddress": "0x456...",
  "traderBName": "Bob",
  "traderBImage": "https://...",
  "timeframe": 30                         // 7 | 30 | 90
}
```

**Response:**
```json
{
  "success": true,
  "rumble": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "creatorWallet": "0x8e900d70...",
    "telegramUserId": 123456789,
    "traderAAddress": "0x123...",
    "traderAName": "Alice",
    "traderAImage": "https://...",
    "traderBAddress": "0x456...",
    "traderBName": "Bob",
    "traderBImage": "https://...",
    "timeframe": 30,
    "status": "active",
    "createdAt": "2025-10-31T10:00:00Z",
    "updatedAt": "2025-10-31T10:00:00Z"
  }
}
```

**Validation:**
- `traderAAddress`: Valid Ethereum address (0x + 40 hex)
- `traderBAddress`: Valid Ethereum address, different from A
- `timeframe`: Must be 7, 30, or 90
- (Phase 1) Check max 3 active rumbles per wallet

**Errors:**
- `400` - Invalid request body
- `409` - Max rumbles limit reached (Phase 1)
- `500` - Database error

---

##### **2. List Rumbles**

```http
GET /api/rumbles
```

**Query Parameters:**
- `status` (optional): `active` | `cancelled` | `settled`
- `timeframe` (optional): `7` | `30` | `90`
- `search` (optional): Search by trader name or address
- `limit` (optional): Results per page (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `sortBy` (optional): `created_at` | `updated_at` (default: `created_at`)
- `sortOrder` (optional): `asc` | `desc` (default: `desc`)

**Response:**
```json
{
  "success": true,
  "rumbles": [
    {
      "id": "550e8400-...",
      "traderAAddress": "0x123...",
      "traderAName": "Alice",
      "traderBName": "Bob",
      "timeframe": 30,
      "status": "active",
      "createdAt": "2025-10-31T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

##### **3. Get Single Rumble**

```http
GET /api/rumbles/:id
```

**Path Parameters:**
- `id`: Rumble UUID

**Response:**
```json
{
  "success": true,
  "rumble": {
    "id": "550e8400-...",
    "creatorWallet": "0x8e900d70...",
    "traderAAddress": "0x123...",
    "traderAName": "Alice",
    "traderAImage": "https://...",
    "traderBAddress": "0x456...",
    "traderBName": "Bob",
    "traderBImage": "https://...",
    "timeframe": 30,
    "status": "active",
    "createdAt": "2025-10-31T10:00:00Z",
    "updatedAt": "2025-10-31T10:00:00Z"
  }
}
```

**Errors:**
- `404` - Rumble not found
- `500` - Database error

---

##### **4. Update Rumble**

```http
PATCH /api/rumbles/:id
```

**Request Body:**
```json
{
  "status": "cancelled"  // Only status updates allowed in Phase 0
}
```

**Response:**
```json
{
  "success": true,
  "rumble": { /* updated rumble */ }
}
```

**Validation:**
- Only creator can update (Phase 1: verify wallet signature)
- Only status field can be updated in Phase 0

---

##### **5. Delete Rumble**

```http
DELETE /api/rumbles/:id
```

**Query Parameters:**
- `creatorWallet`: Wallet address of creator (for verification)

**Response:**
```json
{
  "success": true,
  "message": "Rumble deleted successfully"
}
```

**Validation:**
- Only creator can delete
- (Phase 1) Can't delete if bets exist

---

##### **6. Get Creator's Rumbles**

```http
GET /api/rumbles/creator/:wallet
```

**Path Parameters:**
- `wallet`: Creator wallet address

**Query Parameters:**
- `status` (optional): Filter by status
- `limit` (optional): Results per page
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "rumbles": [ /* array of rumbles */ ],
  "pagination": { /* pagination info */ }
}
```

---

### Phase 1: Betting API 🎯 NEXT

##### **7. Place Bet**

```http
POST /api/bets
```

**Request Body:**
```json
{
  "rumbleId": "550e8400-...",
  "userWallet": "0x789...",
  "pool": "A",                    // "A" or "B"
  "amount": 1.5,                  // SOL amount
  "transactionSignature": "5J7Wm..." // Solana tx signature
}
```

**Response:**
```json
{
  "success": true,
  "bet": {
    "id": "bet-uuid",
    "rumbleId": "550e8400-...",
    "userWallet": "0x789...",
    "pool": "A",
    "amount": 1.5,
    "status": "active",
    "createdAt": "2025-10-31T11:00:00Z"
  },
  "rumble": {
    "poolATotal": 10.5,
    "poolBTotal": 8.2,
    "status": "waiting_for_match"
  }
}
```

**Validation:**
- Verify transaction signature on Solana
- Check rumble status (must be `waiting_for_match` or `grace_period`)
- Minimum bet amount (e.g., 0.1 SOL)
- User wallet must match transaction sender

---

##### **8. Get User's Bets**

```http
GET /api/bets/user/:wallet
```

**Path Parameters:**
- `wallet`: User wallet address

**Query Parameters:**
- `status` (optional): Filter by bet status
- `limit` (optional): Results per page
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "bets": [
    {
      "id": "bet-uuid",
      "rumbleId": "550e8400-...",
      "pool": "A",
      "amount": 1.5,
      "status": "active",
      "createdAt": "2025-10-31T11:00:00Z",
      "rumble": {
        "traderAName": "Alice",
        "traderBName": "Bob",
        "status": "grace_period"
      }
    }
  ]
}
```

---

##### **9. Claim Winnings**

```http
POST /api/bets/:id/claim
```

**Request Body:**
```json
{
  "userWallet": "0x789...",
  "transactionSignature": "5J7Wm..."
}
```

**Response:**
```json
{
  "success": true,
  "bet": {
    "id": "bet-uuid",
    "status": "claimed",
    "payout": 2.94,
    "claimedAt": "2025-10-31T12:00:00Z"
  }
}
```

**Validation:**
- Rumble must be settled
- Bet must be on winning pool
- User must be bet owner
- Bet not already claimed

---

##### **10. Get Rumble Pools**

```http
GET /api/rumbles/:id/pools
```

**Response:**
```json
{
  "success": true,
  "pools": {
    "poolATotal": 10.5,
    "poolBTotal": 8.2,
    "status": "waiting_for_match",
    "gracePeriodEnd": null,
    "settlementDate": null
  }
}
```

---

##### **11. Settle Rumble (Admin/Cron)**

```http
POST /api/admin/rumbles/:id/settle
```

**Authentication:** Admin API key required

**Response:**
```json
{
  "success": true,
  "settlement": {
    "winner": "A",
    "traderAROI": 15.2,
    "traderBROI": 8.7,
    "settledAt": "2025-11-07T11:00:00Z"
  }
}
```

**Settlement Logic:**
1. Fetch portfolio values at match time and end time
2. Calculate ROI% for both traders
3. Determine winner (higher ROI%)
4. Calculate payouts for all bets
5. Update rumble status to `settled`

---

### Telegram Webhook

##### **12. Telegram Webhook**

```http
POST /telegram/webhook
```

**Request Body:** Telegram Update object

**Authentication:** Telegram secret token validation

**Handled Commands:**
- `/start` - Welcome message
- `/rumble` - Start rumble creation flow
- `/help` - Show help
- `/mybrawls` - Show user's rumbles (future)

---

## Database Integration

### Connection Pool

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'polyrumble',
  user: process.env.DB_USER || 'polyrumble_user',
  password: process.env.DB_PASSWORD,
  max: 20,                    // Max connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Connection timeout
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

export default pool;
```

### Query Interface

```typescript
// Type-safe query wrapper
async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    logger.error('Query error', { text, error });
    throw error;
  }
}

// Transaction wrapper
async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

---

## Authentication & Security

### Phase 0: No Authentication

Currently, no authentication required for:
- Creating rumbles (via Telegram bot)
- Viewing rumbles (public)
- Listing rumbles (public)

### Phase 1: Wallet Signature Verification

**For betting operations:**

```typescript
import { verify } from '@noble/ed25519';

async function verifyWalletSignature(
  message: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Buffer.from(signature, 'base64');
    const publicKeyBytes = Buffer.from(publicKey, 'base64');

    return await verify(signatureBytes, messageBytes, publicKeyBytes);
  } catch (error) {
    logger.error('Signature verification failed', { error });
    return false;
  }
}
```

**Middleware:**

```typescript
async function requireWalletAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { wallet, signature, message } = req.body;

  if (!wallet || !signature || !message) {
    return res.status(401).json({ error: 'Wallet authentication required' });
  }

  const isValid = await verifyWalletSignature(message, signature, wallet);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  req.wallet = wallet;
  next();
}
```

### Telegram Webhook Security

```typescript
import crypto from 'crypto';

function verifyTelegramWebhook(req: Request): boolean {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secretPath = crypto
    .createHash('sha256')
    .update(token!)
    .digest('hex');

  return req.path === `/telegram/webhook/${secretPath}`;
}
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.',
});

// Create rumble rate limit (stricter)
const createRumbleLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 rumbles per minute
  message: 'Too many rumbles created, please slow down.',
});

// Betting rate limit (Phase 1)
const bettingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 bets per minute
  message: 'Too many bets, please slow down.',
});

app.use('/api', apiLimiter);
app.use('/api/rumbles', createRumbleLimiter);
app.use('/api/bets', bettingLimiter); // Phase 1
```

### Input Validation (Zod)

```typescript
import { z } from 'zod';

// Rumble creation schema
const createRumbleSchema = z.object({
  creatorWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  telegramUserId: z.number().int().positive().optional(),
  traderAAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  traderAName: z.string().min(1).max(255),
  traderAImage: z.string().url().optional(),
  traderBAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  traderBName: z.string().min(1).max(255),
  traderBImage: z.string().url().optional(),
  timeframe: z.enum(['7', '30', '90']).transform(Number),
});

// Validation middleware
function validate(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      }
      next(error);
    }
  };
}
```

---

## Error Handling

### Global Error Handler

```typescript
function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors,
    });
  }

  if (err.name === 'DatabaseError') {
    return res.status(500).json({
      error: 'Database error',
      message: 'An error occurred while processing your request.',
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred.',
  });
}

app.use(errorHandler);
```

### Custom Error Classes

```typescript
class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
```

---

## Performance & Scalability

### Database Optimization

**1. Indexes (already in schema.sql):**
```sql
CREATE INDEX idx_rumbles_creator ON rumbles(creator_wallet);
CREATE INDEX idx_rumbles_status ON rumbles(status);
CREATE INDEX idx_rumbles_created ON rumbles(created_at DESC);
CREATE INDEX idx_rumbles_trader_a ON rumbles(trader_a_address);
CREATE INDEX idx_rumbles_trader_b ON rumbles(trader_b_address);
```

**2. Connection Pooling:**
- Max 20 concurrent connections
- Idle timeout: 30 seconds
- Connection timeout: 2 seconds

**3. Query Optimization:**
- Use prepared statements
- Limit result sets (pagination)
- Avoid N+1 queries

### Caching Strategy (Phase 1+)

**Redis for:**
- Pool sizes (real-time updates)
- Rumble status (reduce DB reads)
- User session data

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

// Cache rumble pools
async function cacheRumblePools(rumbleId: string, pools: any) {
  await redis.setex(
    `rumble:${rumbleId}:pools`,
    60, // 1 minute TTL
    JSON.stringify(pools)
  );
}

// Get cached pools
async function getCachedPools(rumbleId: string): Promise<any | null> {
  const cached = await redis.get(`rumble:${rumbleId}:pools`);
  return cached ? JSON.parse(cached) : null;
}
```

### Horizontal Scaling

**Load Balancing:**
- Nginx load balancer
- Multiple backend instances
- Sticky sessions (if using sessions)

**Stateless Design:**
- No in-memory session storage
- Use Redis for shared state
- All instances interchangeable

---

## Monitoring & Logging

### Logging (Winston)

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

export default logger;
```

### Health Check Endpoint

```typescript
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});
```

### Metrics (Optional: Prometheus)

```typescript
import promClient from 'prom-client';

const register = new promClient.Registry();

// Request duration histogram
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Middleware to track metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.route?.path || req.path, res.statusCode.toString()).observe(duration);
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});
```

---

## Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=polyrumble
DB_USER=polyrumble_user
DB_PASSWORD=your_secure_password
DB_SSL=false

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_SECRET=your_webhook_secret

# Solana (Phase 1)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta

# Redis (Phase 1, optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Logging
LOG_LEVEL=info

# Security
API_SECRET_KEY=your_secret_key
CORS_ORIGIN=https://stage.polyrumble.com

# Platform (Phase 1)
PLATFORM_FEE_PERCENT=5
MIN_BET_AMOUNT=0.1
GRACE_PERIOD_HOURS=6
```

---

## Deployment

### PM2 Process Manager

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'polyrumble-api',
    script: './dist/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }],
};
```

**Commands:**
```bash
# Start
pm2 start ecosystem.config.js

# Restart
pm2 restart polyrumble-api

# Stop
pm2 stop polyrumble-api

# Logs
pm2 logs polyrumble-api

# Monitor
pm2 monit
```

### Build & Deploy

```bash
# Build TypeScript
npm run build

# Copy files to server
scp -r dist/ root@157.180.68.185:/root/polyrumble-backend/

# Restart PM2
ssh root@157.180.68.185 'cd /root/polyrumble-backend && pm2 restart ecosystem.config.js'
```

---

## Testing

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { arenaService } from '../services/arenaService';

describe('ArenaService', () => {
  it('should create a rumble', async () => {
    const rumble = await arenaService.createRumble({
      traderAAddress: '0x123...',
      traderAName: 'Alice',
      traderBAddress: '0x456...',
      traderBName: 'Bob',
      timeframe: 30,
    });

    expect(rumble).toHaveProperty('id');
    expect(rumble.status).toBe('active');
  });
});
```

### Integration Tests (Supertest)

```typescript
import request from 'supertest';
import app from '../index';

describe('POST /api/rumbles', () => {
  it('should create a rumble', async () => {
    const response = await request(app)
      .post('/api/rumbles')
      .send({
        traderAAddress: '0x123...',
        traderAName: 'Alice',
        traderBAddress: '0x456...',
        traderBName: 'Bob',
        timeframe: 30,
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.rumble).toHaveProperty('id');
  });
});
```

---

## Appendix

### Related Documents

- [PRD_MASTER.md](PRD_MASTER.md) - Master requirements
- [PRD_FRONTEND.md](PRD_FRONTEND.md) - Frontend requirements
- [DATABASE_DESIGN.md](DATABASE_DESIGN.md) - Database schema
- [../api/README.md](../api/README.md) - API documentation

---

**Document Owner:** Backend Team
**Last Review:** 2025-10-31
**Next Review:** Before Phase 1 development
