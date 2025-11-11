/**
 * x402 Protocol Specification Generator
 * Generates standard x402 API discovery response for AI agents
 */

import { env } from '../config/env';

export interface X402Endpoint {
  path: string;
  method: string;
  paymentRequired: boolean;
  baseCost?: string;
  description: string;
  request?: Record<string, string>;
  response?: Record<string, string>;
}

export interface X402APICategory {
  category: string;
  description: string;
  endpoints: X402Endpoint[];
}

export interface X402Specification {
  protocol: string;
  version: string;
  timestamp: string;
  platform: {
    name: string;
    version: string;
    status: string;
    description: string;
    facilitator: string;
  };
  payment: {
    network: string;
    supportedTokens: Array<{
      mint: string;
      symbol: string;
      name: string;
      decimals: number;
    }>;
    fees: {
      platform: string;
    };
    minimumPayment: string;
  };
  apis: X402APICategory[];
  rateLimits: {
    free: string;
    authenticated: string;
    paying: string;
  };
  examples: {
    betPlacementFlow: {
      description: string;
      steps: string[];
    };
  };
}

/**
 * Generate x402 specification
 */
export function generateX402Spec(): X402Specification {
  return {
    protocol: 'x402',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    platform: {
      name: 'PolyRumble',
      version: '1.0.0',
      status: 'operational',
      description: 'Polymarket trader comparison and betting platform with x402 payment protocol for AI agents',
      facilitator: 'https://facilitator.payai.network',
    },
    payment: {
      network: 'solana',
      supportedTokens: [
        {
          mint: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          decimals: 9,
        },
        {
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
        },
      ],
      fees: {
        platform: '0.05', // 5% platform fee
      },
      minimumPayment: '10000000', // 0.01 SOL minimum
    },
    apis: [
      {
        category: 'discovery',
        description: 'API discovery and platform information',
        endpoints: [
          {
            path: '/x402',
            method: 'GET',
            paymentRequired: false,
            description: 'Discover API catalog and payment terms (standard x402 protocol)',
          },
        ],
      },
      {
        category: 'authentication',
        description: 'Authenticate agents and users for platform access',
        endpoints: [
          {
            path: '/api/v1/auth/login',
            method: 'POST',
            paymentRequired: false,
            description: 'Login with wallet signature',
            request: {
              walletAddress: 'string',
              signature: 'string',
              message: 'string',
            },
            response: {
              accessToken: 'string',
              refreshToken: 'string',
              expiresIn: 'number',
            },
          },
          {
            path: '/api/v1/auth/agent/register',
            method: 'POST',
            paymentRequired: false,
            description: 'Register AI agent for autonomous betting',
            request: {
              agentName: 'string',
              description: 'string',
              capabilities: 'array',
              walletAddress: 'string',
            },
            response: {
              agentId: 'string',
              apiKey: 'string',
            },
          },
        ],
      },
      {
        category: 'pools',
        description: 'Access trading arenas and pool information',
        endpoints: [
          {
            path: '/api/v1/pools/active',
            method: 'GET',
            paymentRequired: false,
            description: 'List all active betting arenas',
            response: {
              pools: 'Array<Pool>',
            },
          },
          {
            path: '/api/v1/pools/:id',
            method: 'GET',
            paymentRequired: false,
            description: 'Get detailed pool information',
            response: {
              pool: 'Pool',
            },
          },
        ],
      },
      {
        category: 'betting',
        description: 'Place and manage bets on trader performance using x402 payment protocol',
        endpoints: [
          {
            path: '/api/v1/bets/simulate',
            method: 'POST',
            paymentRequired: false,
            description: 'Simulate bet outcome and payout calculation',
            request: {
              poolId: 'string',
              traderChoice: 'number',
              amount: 'string',
            },
            response: {
              amount: 'string',
              traderChoice: 'number',
              currentOdds: 'number',
              potentialPayout: 'string',
              platformFee: 'string',
              netPayout: 'string',
            },
          },
          {
            path: '/api/v1/bets/place',
            method: 'POST',
            paymentRequired: true,
            baseCost: '10000000', // 0.01 SOL per bet
            description: 'Place bet on trader performance (requires x402 payment)',
            request: {
              poolId: 'string',
              traderChoice: 'number',
              amount: 'string',
              walletSignature: 'string',
            },
            response: {
              betId: 'string',
              transactionHash: 'string',
              potentialPayout: 'string',
            },
          },
          {
            path: '/api/v1/bets/pool/:poolId',
            method: 'GET',
            paymentRequired: false,
            description: 'Get all bets for a specific pool',
            response: {
              bets: 'Array<Bet>',
            },
          },
          {
            path: '/api/v1/bets/user/:wallet',
            method: 'GET',
            paymentRequired: false,
            description: 'Get all bets for a specific wallet address',
            response: {
              bets: 'Array<Bet>',
            },
          },
          {
            path: '/api/v1/bets/:id/claim',
            method: 'PATCH',
            paymentRequired: false,
            description: 'Claim winnings for a settled bet',
            response: {
              bet: 'Bet',
              transactionHash: 'string',
            },
          },
        ],
      },
      {
        category: 'traders',
        description: 'Access Polymarket trader data and analytics',
        endpoints: [
          {
            path: '/api/v1/traders/:address',
            method: 'GET',
            paymentRequired: false,
            description: 'Get trader profile and performance data',
            response: {
              profile: 'TraderProfile',
              metrics: 'TraderMetrics',
              positions: 'Array<Position>',
            },
          },
        ],
      },
    ],
    rateLimits: {
      free: '100/hour',
      authenticated: '1000/hour',
      paying: '10000/hour',
    },
    examples: {
      betPlacementFlow: {
        description: 'Place bet using x402 protocol',
        steps: [
          '1. GET /api/v1/pools/active to discover available betting pools',
          '2. POST /api/v1/bets/simulate to preview potential payout',
          '3. POST /api/v1/bets/place with bet data',
          '4. Receive 402 Payment Required + PaymentRequirements object',
          '5. Pay via PayAI facilitator (network fees covered)',
          '6. Retry request with X-PAYMENT header containing payment proof',
          '7. Receive 200 OK + bet confirmation with transaction hash',
          '8. Monitor bet status via WebSocket or polling',
          '9. PATCH /api/v1/bets/:id/claim to claim winnings when settled',
        ],
      },
    },
  };
}

/**
 * Get x402 specification from backend (if implemented) or generate locally
 */
export async function fetchX402Spec(): Promise<X402Specification> {
  try {
    // Try to fetch from backend first
    const response = await fetch(`${env.apiUrl}/x402`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('Backend /x402 endpoint not available, using frontend-generated spec');
  }

  // Fallback to frontend-generated spec
  return generateX402Spec();
}
