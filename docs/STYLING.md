# Styling Guide

## Tailwind CSS 4

The application uses Tailwind CSS 4.1.17 for styling with Vite integration.

### Configuration

**Location**: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Vite Integration

**Location**: `vite.config.ts`

```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

---

## Global Styles

**Location**: `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  html {
    @apply scroll-smooth;
  }

  body {
    @apply bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100;
  }
}

/* Custom component styles */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors;
  }

  .btn-danger {
    @apply px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors;
  }

  .card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6;
  }

  .input {
    @apply px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}

/* Custom utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

## Dark Mode

### Implementation

Dark mode is implemented using Tailwind's `class` strategy:

```typescript
// Toggle dark mode
function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check saved preference
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
    
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <button onClick={toggleDarkMode}>
      {darkMode ? '🌙' : '☀️'}
    </button>
  )
}
```

### Dark Mode Classes

```typescript
// Light and dark variants
<div className="bg-white dark:bg-gray-800">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>

// Borders
<div className="border-gray-200 dark:border-gray-700" />

// Hover states
<button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" />
```

---

## Responsive Design

### Breakpoints

Tailwind's default breakpoints:

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Responsive Examples

```typescript
// Mobile-first approach
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Full width on mobile, half on tablet, third on desktop */}
</div>

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {pools.map(pool => (
    <PoolCard key={pool.id} pool={pool} />
  ))}
</div>

// Text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>

// Padding and spacing
<div className="p-4 md:p-6 lg:p-8">
  {/* Responsive padding */}
</div>

// Hide/show elements
<div className="hidden md:block">
  {/* Only visible on tablets and larger */}
</div>

<div className="md:hidden">
  {/* Only visible on mobile */}
</div>
```

---

## Component Styling Patterns

### Card Components

```typescript
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Card Title
  </h3>
  <p className="text-gray-600 dark:text-gray-400">
    Card content
  </p>
</div>
```

### Button Variants

```typescript
// Primary button
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
  Primary
</button>

// Secondary button
<button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg">
  Secondary
</button>

// Danger button
<button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg">
  Danger
</button>

// Disabled state
<button disabled className="px-4 py-2 bg-gray-300 text-gray-500 cursor-not-allowed rounded-lg">
  Disabled
</button>
```

### Input Fields

```typescript
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Enter text..."
/>

// With error state
<input
  className="w-full px-4 py-2 border-2 border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
  aria-invalid="true"
/>
```

### Badges

```typescript
// Status badges
<span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
  Active
</span>

<span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
  Locked
</span>

<span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
  Settled
</span>
```

---

## Utility Patterns

### Flexbox Layouts

```typescript
// Center content
<div className="flex items-center justify-center min-h-screen">
  <Content />
</div>

// Horizontal layout
<div className="flex items-center space-x-4">
  <Avatar />
  <Name />
  <Badge />
</div>

// Space between
<div className="flex justify-between items-center">
  <Title />
  <Actions />
</div>
```

### Grid Layouts

```typescript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Auto-fit grid
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Transitions

```typescript
// Opacity transition
<div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
  Hover me
</div>

// Transform transition
<button className="transform hover:scale-105 transition-transform duration-200">
  Hover to scale
</button>

// Color transition
<div className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300">
  Hover color change
</div>

// Multiple properties
<div className="transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
  Smooth transitions
</div>
```

---

## Custom Utilities

### Conditional Classes

```typescript
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage
<div className={cn(
  'base-class p-4 rounded-lg',
  isActive && 'bg-blue-600 text-white',
  !isActive && 'bg-gray-200 text-gray-900',
  isDisabled && 'opacity-50 cursor-not-allowed'
)} />
```

---

## Animation

### Built-in Animations

```typescript
// Spin
<div className="animate-spin">↻</div>

// Pulse
<div className="animate-pulse bg-gray-200 h-4 w-full rounded" />

// Bounce
<div className="animate-bounce">↓</div>

// Ping
<span className="relative">
  <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
</span>
```

### Custom Animations

```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in',
        slideIn: 'slideIn 0.3s ease-out',
      },
    },
  },
}
```

```typescript
// Usage
<div className="animate-fadeIn">Fade in content</div>
<div className="animate-slideIn">Slide in content</div>
```

---

## Best Practices

### 1. Use Semantic Color Names

```typescript
// ✅ Good
<button className="bg-primary-600 hover:bg-primary-700" />

// ❌ Bad
<button className="bg-blue-600 hover:bg-blue-700" />
```

### 2. Consistent Spacing

```typescript
// Use consistent spacing scale
<div className="space-y-4">  // 1rem (16px)
  <div />
  <div />
</div>

<div className="space-x-2">  // 0.5rem (8px)
  <span />
  <span />
</div>
```

### 3. Mobile-First Approach

```typescript
// ✅ Good - mobile first
<div className="text-sm md:text-base lg:text-lg" />

// ❌ Bad - desktop first
<div className="text-lg md:text-base sm:text-sm" />
```

### 4. Extract Repeated Classes

```typescript
// Create reusable component classes
@layer components {
  .pool-card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow;
  }
}

// Usage
<div className="pool-card">
  {/* Content */}
</div>
```

### 5. Use @apply Sparingly

```typescript
// ✅ Good - complex, reusable components
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg;
  }
}

// ❌ Bad - simple utilities
.margin-top {
  @apply mt-4;
}
```

---

## Performance

### Purge Unused CSS

Tailwind automatically purges unused CSS in production based on `content` configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
}
```

### Keep Bundle Small

- Use `@layer` directives
- Avoid custom CSS when possible
- Use Tailwind's built-in utilities

---

**Last Updated**: 2025-01-07
**Version**: 1.0.0
