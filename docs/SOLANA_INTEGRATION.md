# Solana Integration Guide

## Overview

The application integrates with Solana blockchain for:
- Wallet connection (Phantom, Solflare)
- Transaction signing
- Balance tracking
- Bet placement on-chain

## Wallet Adapter Setup

### Configuration

**Location**: `src/lib/walletConfig.tsx`

```typescript
import { useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import { env } from '../config/env'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

export function WalletConfig({ children }: { children: React.ReactNode }) {
  // Network configuration
  const network = env.solanaNetwork as WalletAdapterNetwork

  // RPC endpoint
  const endpoint = useMemo(() => {
    return env.solanaRpcUrl || clusterApiUrl(network)
  }, [network])

  // Supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
```

### App Integration

**Location**: `src/App.tsx`

```typescript
import { WalletConfig } from './lib/walletConfig'

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WalletConfig>
          <RouterProvider router={router} />
        </WalletConfig>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
```

---

## Wallet Hooks

### useWallet Hook

Provided by `@solana/wallet-adapter-react`:

```typescript
import { useWallet } from '@solana/wallet-adapter-react'

function WalletButton() {
  const {
    publicKey,        // User's public key
    connected,        // Connection status
    connecting,       // Connecting status
    disconnecting,    // Disconnecting status
    wallet,          // Current wallet
    connect,         // Connect function
    disconnect,      // Disconnect function
    select,          // Select wallet function
    wallets,         // Available wallets
    signTransaction, // Sign transaction function
    signAllTransactions, // Sign multiple transactions
    signMessage,     // Sign message function
  } = useWallet()

  return (
    <button onClick={connected ? disconnect : connect}>
      {connected ? `Disconnect ${publicKey?.toBase58().slice(0, 4)}...` : 'Connect Wallet'}
    </button>
  )
}
```

### useConnection Hook

Access Solana RPC connection:

```typescript
import { useConnection } from '@solana/wallet-adapter-react'

function Balance() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()

  const getBalance = async () => {
    if (!publicKey) return

    const balance = await connection.getBalance(publicKey)
    console.log('Balance:', balance / 1e9, 'SOL') // Convert lamports to SOL
  }

  useEffect(() => {
    if (publicKey) {
      getBalance()
    }
  }, [publicKey])

  return <div>...</div>
}
```

---

## Wallet Components

### WalletMultiButton

Pre-built button component:

```typescript
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

function Header() {
  return (
    <header>
      <h1>Polymarket Trader Rumble</h1>
      <WalletMultiButton />
    </header>
  )
}
```

### Custom Wallet Button

```typescript
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

function CustomWalletButton() {
  const { publicKey, connected, disconnect } = useWallet()
  const { setVisible } = useWalletModal()

  const handleClick = () => {
    if (connected) {
      disconnect()
    } else {
      setVisible(true)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="btn-primary"
    >
      {connected
        ? `${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`
        : 'Connect Wallet'
      }
    </button>
  )
}
```

---

## Wallet State Management

### Zustand Store Integration

**Location**: `src/stores/walletStore.ts`

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface WalletState {
  connected: boolean
  publicKey: string | null
  balance: number

  setConnected: (connected: boolean) => void
  setPublicKey: (publicKey: string | null) => void
  setBalance: (balance: number) => void
  disconnect: () => void
}

export const useWalletStore = create<WalletState>()(
  devtools(
    (set) => ({
      connected: false,
      publicKey: null,
      balance: 0,

      setConnected: (connected) => set({ connected }),
      setPublicKey: (publicKey) => set({ publicKey }),
      setBalance: (balance) => set({ balance }),
      disconnect: () => set({
        connected: false,
        publicKey: null,
        balance: 0,
      }),
    }),
    { name: 'WalletStore' }
  )
)
```

### Syncing Wallet State

```typescript
import { useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useWalletStore } from '@/stores/walletStore'

export function WalletSync() {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const walletStore = useWalletStore()

  // Sync connection state
  useEffect(() => {
    walletStore.setConnected(connected)
    walletStore.setPublicKey(publicKey?.toBase58() || null)
  }, [connected, publicKey, walletStore])

  // Fetch and sync balance
  useEffect(() => {
    if (!publicKey) {
      walletStore.setBalance(0)
      return
    }

    const fetchBalance = async () => {
      try {
        const balance = await connection.getBalance(publicKey)
        walletStore.setBalance(balance / 1e9) // Convert to SOL
      } catch (error) {
        console.error('Failed to fetch balance:', error)
      }
    }

    fetchBalance()

    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000)

    return () => clearInterval(interval)
  }, [publicKey, connection, walletStore])

  return null // This component doesn't render anything
}

// Add to App.tsx
function App() {
  return (
    <WalletConfig>
      <WalletSync />
      <YourApp />
    </WalletConfig>
  )
}
```

---

## Transaction Handling

### Signing Transactions

```typescript
import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'

function SendTransaction() {
  const { publicKey, signTransaction, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const handleSend = async () => {
    if (!publicKey || !signTransaction) {
      throw new Error('Wallet not connected')
    }

    try {
      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('RECIPIENT_ADDRESS'),
          lamports: 0.001 * 1e9, // 0.001 SOL
        })
      )

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      // Sign transaction
      const signedTransaction = await signTransaction(transaction)

      // Send transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      )

      // Confirm transaction
      await connection.confirmTransaction(signature, 'confirmed')

      console.log('Transaction successful:', signature)
      return signature
    } catch (error) {
      console.error('Transaction failed:', error)
      throw error
    }
  }

  return (
    <button onClick={handleSend}>
      Send 0.001 SOL
    </button>
  )
}
```

### Bet Placement Transaction

```typescript
import { PublicKey, Transaction } from '@solana/web3.js'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { env } from '@/config/env'

function PlaceBet({ poolId, amount, side }: BetProps) {
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()

  const placeBet = async () => {
    if (!publicKey || !signTransaction) {
      throw new Error('Wallet not connected')
    }

    try {
      // Build bet transaction
      const programId = new PublicKey(env.bettingProgramId)

      const transaction = new Transaction()
      // Add your program instruction here
      // transaction.add(...)

      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      // Sign transaction
      const signedTx = await signTransaction(transaction)

      // Send to backend for processing
      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      )

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed')

      console.log('Bet placed:', signature)
      return signature
    } catch (error) {
      console.error('Failed to place bet:', error)
      throw error
    }
  }

  return (
    <button onClick={placeBet}>
      Place Bet: {amount} SOL on {side}
    </button>
  )
}
```

### Message Signing

```typescript
function SignMessage() {
  const { publicKey, signMessage } = useWallet()

  const handleSign = async () => {
    if (!publicKey || !signMessage) {
      throw new Error('Wallet not connected')
    }

    try {
      const message = new TextEncoder().encode(
        `Sign this message to verify your wallet: ${Date.now()}`
      )

      const signature = await signMessage(message)

      console.log('Message signed:', signature)
      return signature
    } catch (error) {
      console.error('Failed to sign message:', error)
      throw error
    }
  }

  return (
    <button onClick={handleSign}>
      Sign Message
    </button>
  )
}
```

---

## Network Configuration

### Environment Variables

```env
# Devnet (Development)
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_SOLANA_NETWORK=devnet
VITE_BETTING_PROGRAM_ID=YourDevnetProgramID

# Mainnet (Production)
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_SOLANA_NETWORK=mainnet-beta
VITE_BETTING_PROGRAM_ID=YourMainnetProgramID
```

### Premium RPC Providers

For better performance and reliability:

**Helius**:
```env
VITE_SOLANA_RPC_URL=https://rpc.helius.xyz/?api-key=YOUR_API_KEY
```

**QuickNode**:
```env
VITE_SOLANA_RPC_URL=https://YOUR_ENDPOINT.solana-mainnet.quiknode.pro/YOUR_TOKEN/
```

**Alchemy**:
```env
VITE_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

---

## Error Handling

### Common Errors

```typescript
import { WalletError } from '@solana/wallet-adapter-base'

function handleWalletError(error: Error) {
  if (error instanceof WalletError) {
    switch (error.name) {
      case 'WalletNotConnectedError':
        console.error('Wallet not connected')
        break

      case 'WalletNotReadyError':
        console.error('Wallet not ready')
        break

      case 'WalletLoadError':
        console.error('Failed to load wallet')
        break

      case 'WalletConnectionError':
        console.error('Failed to connect wallet')
        break

      case 'WalletDisconnectedError':
        console.error('Wallet disconnected')
        break

      case 'WalletSignTransactionError':
        console.error('Failed to sign transaction')
        break

      default:
        console.error('Unknown wallet error:', error)
    }
  } else {
    console.error('Error:', error)
  }
}
```

### Transaction Errors

```typescript
async function handleTransaction() {
  try {
    const signature = await sendTransaction(...)
    await connection.confirmTransaction(signature)
  } catch (error: any) {
    if (error.message?.includes('insufficient funds')) {
      alert('Insufficient SOL balance')
    } else if (error.message?.includes('User rejected')) {
      console.log('User cancelled transaction')
    } else if (error.message?.includes('Blockhash not found')) {
      console.error('Transaction expired, please retry')
    } else {
      console.error('Transaction failed:', error)
    }
  }
}
```

---

## Best Practices

### 1. Always Check Wallet Connection

```typescript
const placeBet = async () => {
  if (!publicKey) {
    alert('Please connect your wallet first')
    return
  }

  if (!signTransaction) {
    alert('Wallet does not support transaction signing')
    return
  }

  // Proceed with transaction
}
```

### 2. Handle Loading States

```typescript
function PlaceBet() {
  const [isLoading, setIsLoading] = useState(false)
  const { connected } = useWallet()

  const handleBet = async () => {
    setIsLoading(true)
    try {
      await placeBetTransaction()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button disabled={!connected || isLoading}>
      {isLoading ? 'Processing...' : 'Place Bet'}
    </button>
  )
}
```

### 3. Confirm Transactions

```typescript
// Always wait for confirmation
const signature = await sendTransaction(transaction, connection)

// Wait for confirmation
await connection.confirmTransaction(signature, 'confirmed')

// Or use finalized for higher confidence
await connection.confirmTransaction(signature, 'finalized')
```

### 4. Use Try-Catch

```typescript
try {
  await walletOperation()
} catch (error) {
  console.error('Wallet operation failed:', error)
  // Show user-friendly error message
  toast.error('Failed to complete transaction')
}
```

### 5. Disconnect on Unmount

```typescript
useEffect(() => {
  return () => {
    // Clean up on component unmount
    if (connected) {
      disconnect()
    }
  }
}, [connected, disconnect])
```

---

## Testing

### Devnet Testing

```bash
# Use Solana CLI to airdrop SOL
solana airdrop 2 YOUR_WALLET_ADDRESS --url devnet

# Check balance
solana balance YOUR_WALLET_ADDRESS --url devnet
```

### Test Wallets

- **Phantom**: Install from browser extension store
- **Solflare**: Install from browser extension store
- Switch to Devnet in wallet settings

---

## Resources

- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Solana Documentation](https://docs.solana.com/)
- [Phantom Wallet](https://phantom.app/)
- [Solflare Wallet](https://solflare.com/)

---

**Last Updated**: 2025-01-07
**Version**: 1.0.0
