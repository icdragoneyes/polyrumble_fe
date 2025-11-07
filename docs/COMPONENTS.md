# Component Library

## Component Structure

The application follows a hierarchical component organization:

```
components/
├── admin/              # Admin dashboard components
├── betting/            # Betting interface components
├── common/             # Shared/reusable components
└── layout/             # Layout components
```

## Common Components

### ErrorBoundary

**Location**: `src/components/common/ErrorBoundary.tsx`

**Purpose**: Catches React errors and displays fallback UI

```typescript
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

**Usage**:
```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Betting Components

### PoolCard

**Location**: `src/components/betting/PoolCard.tsx`

**Purpose**: Displays betting pool information

```typescript
import { FC } from 'react'
import type { Pool } from '@/types'

interface PoolCardProps {
  pool: Pool
  onSelect?: (pool: Pool) => void
}

export const PoolCard: FC<PoolCardProps> = ({ pool, onSelect }) => {
  const handleClick = () => {
    onSelect?.(pool)
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pool #{pool.poolNumber}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pool.status}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          pool.status === 'active' ? 'bg-green-100 text-green-800' :
          pool.status === 'locked' ? 'bg-yellow-100 text-yellow-800' :
          pool.status === 'settled' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {pool.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Trader A:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {pool.traderA}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Trader B:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {pool.traderB}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Total Pool:</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {pool.totalPoolSize} SOL
          </span>
        </div>
      </div>
    </div>
  )
}
```

**Usage**:
```typescript
<PoolCard
  pool={pool}
  onSelect={(pool) => setSelectedPool(pool)}
/>
```

---

## Component Patterns

### Functional Components with TypeScript

```typescript
import { FC } from 'react'

interface ComponentProps {
  title: string
  description?: string
  onAction: () => void
}

export const Component: FC<ComponentProps> = ({
  title,
  description,
  onAction
}) => {
  return (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <button onClick={onAction}>Action</button>
    </div>
  )
}
```

### Hooks Pattern

```typescript
import { useState, useEffect } from 'react'

export const DataComponent: FC = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData().then(data => {
      setData(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <LoadingSpinner />

  return <div>{/* render data */}</div>
}
```

### Composition Pattern

```typescript
// Card component
export const Card: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    {children}
  </div>
)

// Usage with composition
<Card>
  <CardHeader title="Pool #1" />
  <CardBody>
    <PoolDetails pool={pool} />
  </CardBody>
  <CardFooter>
    <Button onClick={handleBet}>Place Bet</Button>
  </CardFooter>
</Card>
```

---

## UI Component Library

### Button Variants

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled,
  onClick,
  children
}) => {
  const baseClasses = 'rounded-lg font-medium transition-colors'

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  )
}
```

**Usage**:
```typescript
<Button variant="primary" size="lg" onClick={handleSubmit}>
  Submit
</Button>
```

### Loading Spinner

```typescript
export const LoadingSpinner: FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      />
    </div>
  )
}
```

### Modal

```typescript
import { Dialog } from '@headlessui/react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {title}
          </Dialog.Title>

          <div className="mb-6">
            {children}
          </div>

          <button
            onClick={onClose}
            className="w-full btn-secondary"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
```

**Usage**:
```typescript
const [isOpen, setIsOpen] = useState(false)

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Place Bet"
>
  <BetForm poolId={poolId} />
</Modal>
```

---

## Best Practices

### 1. Type Safety

```typescript
// Always define prop types
interface Props {
  required: string
  optional?: number
  callback: (value: string) => void
}

export const Component: FC<Props> = ({ required, optional, callback }) => {
  // TypeScript enforces type safety
}
```

### 2. Prop Destructuring

```typescript
// ✅ Good - destructure props
const Component: FC<Props> = ({ title, description }) => {
  return <div>{title}</div>
}

// ❌ Bad - use props object
const Component: FC<Props> = (props) => {
  return <div>{props.title}</div>
}
```

### 3. Default Props

```typescript
interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

const Component: FC<Props> = ({
  variant = 'primary',  // Default value
  size = 'md'
}) => {
  return <div className={`variant-${variant} size-${size}`} />
}
```

### 4. Conditional Rendering

```typescript
// ✅ Good - use && for conditional render
{isLoading && <LoadingSpinner />}

// ✅ Good - use ternary for if/else
{error ? <ErrorMessage /> : <Content />}

// ❌ Bad - use if/else outside JSX
if (isLoading) {
  return <LoadingSpinner />
}
return <Content />
```

### 5. Event Handlers

```typescript
// ✅ Good - define handler outside JSX
const handleClick = () => {
  console.log('clicked')
}

return <button onClick={handleClick}>Click</button>

// ❌ Bad - inline function (creates new function on each render)
return <button onClick={() => console.log('clicked')}>Click</button>
```

### 6. Memoization

```typescript
import { memo } from 'react'

// Memoize expensive components
export const ExpensiveComponent = memo<Props>(({ data }) => {
  // Only re-renders if data changes
  return <div>{/* expensive rendering */}</div>
})

// Use useMemo for expensive computations
const sortedData = useMemo(
  () => data.sort((a, b) => a.value - b.value),
  [data]
)
```

---

## Styling Components

### Tailwind CSS Classes

```typescript
// Responsive classes
<div className="w-full md:w-1/2 lg:w-1/3" />

// Dark mode
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />

// Hover states
<button className="bg-blue-600 hover:bg-blue-700" />

// Conditional classes
<div className={`base-class ${isActive ? 'active-class' : 'inactive-class'}`} />
```

### Class Utilities

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage
<div className={cn(
  'base-class',
  isActive && 'active-class',
  variant === 'primary' && 'primary-class'
)} />
```

---

**Last Updated**: 2025-01-07
**Version**: 1.0.0
