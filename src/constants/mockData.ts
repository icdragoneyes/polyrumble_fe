/**
 * Mock data for development and testing
 * Used when VITE_MOCK_MODE=true
 */

import type { Pool } from '../types';

/**
 * Real Polymarket traders for mock arenas
 * These traders exist on Polymarket and will fetch real data
 */
export const MOCK_TRADERS = [
  {
    trader_name: 'FirstOrder',
    trader_wallet: '0xeffcc79a8572940cee2238b44eac89f2c48fda88',
  },
  {
    trader_name: 'tcp2',
    trader_wallet: '0x6b7c75862e64d6e976d2c08ad9f9b54add6c5f83',
  },
  {
    trader_name: 'LambSaauce',
    trader_wallet: '0x1a4249cd596a8e51b267dfe3c56cacc25815a00b',
  },
  {
    trader_name: '0xD9E0AACa471f48F91A26E8669A805f2',
    trader_wallet: '0xd9e0aaca471f489be338fd0f91a26e8669a805f2',
  },
  {
    trader_name: 'kingofcoinflips',
    trader_wallet: '0xe9c6312464b52aa3eff13d822b003282075995c9',
  },
  {
    trader_name: 'scottilicious',
    trader_wallet: '0x000d257d2dc7616feaef4ae0f14600fdf50a758e',
  },
  {
    trader_name: 'gopfan2',
    trader_wallet: '0xf2f6af4f27ec2dcf4072095ab804016e14cd5817',
  },
  {
    trader_name: 'Annica',
    trader_wallet: '0x689ae12e11aa489adb3605afd8f39040ff52779e',
  },
  {
    trader_name: 'Anjun',
    trader_wallet: '0x43372356634781eea88d61bbdd7824cdce958882',
  },
  {
    trader_name: 'bigmoneyloser00',
    trader_wallet: '0xdbb9b3616f733e19278d1ca6f3207a8344b5ed8d',
  },
] as const;

/**
 * Shuffle array using Fisher-Yates algorithm with a seed for consistency
 * Using a simple seeded random to ensure same order each time
 */
function shuffleArray<T>(array: readonly T[], seed: number = 12345): T[] {
  const shuffled = [...array] as T[];
  let currentSeed = seed;

  // Simple seeded random number generator
  const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate random number between min and max
 */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random SOL amount with 2 decimal places
 */
function randomSOL(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

/**
 * Generate random date in the future (1-7 days from now)
 * Returns timestamp in seconds (to match API format)
 */
function randomFutureDate(minDays: number, maxDays: number): number {
  const now = new Date();
  const daysAhead = randomBetween(minDays, maxDays);
  const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  return Math.floor(futureDate.getTime() / 1000); // Convert to seconds
}

/**
 * Generate 4 mock arenas with random trader pairings
 * Each arena has 2 unique traders from the MOCK_TRADERS list
 */
export function generateMockArenas(): Pool[] {
  // Shuffle traders and select first 8 (for 4 arenas with 2 traders each)
  const shuffledTraders = shuffleArray(MOCK_TRADERS);
  const selectedTraders = shuffledTraders.slice(0, 8);

  const timeframes = [7, 30, 90] as const;
  const mockArenas: Pool[] = [];

  for (let i = 0; i < 4; i++) {
    const traderA = selectedTraders[i * 2] as typeof MOCK_TRADERS[number];
    const traderB = selectedTraders[i * 2 + 1] as typeof MOCK_TRADERS[number];
    const timeframe = timeframes[randomBetween(0, timeframes.length - 1)];

    // Generate realistic pool sizes
    const poolASize = randomSOL(5, 50);
    const poolBSize = randomSOL(5, 50);

    const totalPool = poolASize + poolBSize;
    const poolARatio = poolASize / totalPool;
    const poolBRatio = poolBSize / totalPool;

    // Convert SOL to lamports (must be whole numbers for BigInt)
    const poolALamports = Math.floor(poolASize * 1_000_000_000);
    const poolBLamports = Math.floor(poolBSize * 1_000_000_000);
    const totalLamports = poolALamports + poolBLamports;

    const arena: Pool = {
      id: `mock-arena-${i + 1}`,
      status: 'active',
      poolNumber: i + 1,
      traderAAddress: traderA.trader_wallet,
      traderBAddress: traderB.trader_wallet,
      timeframeDays: timeframe,
      poolATotal: poolALamports.toString(), // Whole number lamports
      poolBTotal: poolBLamports.toString(), // Whole number lamports
      totalPoolSize: totalLamports.toString(), // Whole number lamports
      poolARatio,
      poolBRatio,
      currentOddsA: poolBRatio > 0 ? totalPool / poolBSize : 1,
      currentOddsB: poolARatio > 0 ? totalPool / poolASize : 1,
      minBetAmount: '100000000', // 0.1 SOL in lamports (100,000,000)
      maxBetAmount: '100000000000', // 100 SOL in lamports (100,000,000,000)
      bettingClosesAt: randomFutureDate(1, 7),
      createdAt: new Date(Date.now() - randomBetween(1, 48) * 60 * 60 * 1000),
      updatedAt: new Date(),
    };

    mockArenas.push(arena);
  }

  return mockArenas;
}

/**
 * Get a specific mock arena by ID
 */
export function getMockArenaById(id: string): Pool | null {
  const arenas = generateMockArenas();
  return arenas.find(arena => arena.id === id) || null;
}

/**
 * Check if an arena ID is a mock arena
 */
export function isMockArenaId(id: string): boolean {
  return id.startsWith('mock-arena-');
}
