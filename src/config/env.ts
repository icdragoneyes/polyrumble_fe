/**
 * Environment configuration
 * Access environment variables with type safety
 */

interface EnvConfig {
  // API Configuration
  apiUrl: string;
  wsUrl: string;

  // Solana Configuration
  solanaRpcUrl: string;
  solanaNetwork: 'devnet' | 'testnet' | 'mainnet-beta';

  // Program IDs
  bettingProgramId: string;

  // Feature Flags
  enableAnalytics: boolean;
  enableDebug: boolean;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue;
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || '';
}

function getBooleanEnvVar(key: string, defaultValue = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

export const env: EnvConfig = {
  // API Configuration
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3333'),
  wsUrl: getEnvVar('VITE_WS_URL', 'ws://localhost:3333'),

  // Solana Configuration
  solanaRpcUrl: getEnvVar('VITE_SOLANA_RPC_URL', 'https://api.devnet.solana.com'),
  solanaNetwork: getEnvVar('VITE_SOLANA_NETWORK', 'devnet') as EnvConfig['solanaNetwork'],

  // Program IDs
  bettingProgramId: getEnvVar('VITE_BETTING_PROGRAM_ID', ''),

  // Feature Flags
  enableAnalytics: getBooleanEnvVar('VITE_ENABLE_ANALYTICS', false),
  enableDebug: getBooleanEnvVar('VITE_ENABLE_DEBUG', true),
};

// Validate required environment variables
export function validateEnv(): void {
  const required: (keyof EnvConfig)[] = ['apiUrl', 'solanaRpcUrl'];

  const missing = required.filter(key => !env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
  }
}

// Log configuration in development
if (env.enableDebug) {
  console.log('Environment Configuration:', {
    ...env,
    // Don't log sensitive data in production
  });
}
