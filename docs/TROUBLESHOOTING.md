# Troubleshooting Guide

## Common Issues

### Development Server Issues

#### Issue: Port Already in Use

```bash
Error: Port 5173 is already in use
```

**Solution**:
```bash
# Find process using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or use a different port
VITE_PORT=5174 npm run dev
```

#### Issue: HMR Not Working

**Symptoms**: Changes not reflected in browser

**Solution 1 - Clear cache**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

**Solution 2 - Browser hard refresh**:
- Chrome/Firefox: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Disable browser cache in DevTools

**Solution 3 - Check file watcher limits**:
```bash
# Linux - increase file watchers
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

### Build Issues

#### Issue: Build Fails with TypeScript Errors

```bash
error TS2339: Property 'x' does not exist on type 'Y'
```

**Solution**:
```bash
# Run type check separately
npm run typecheck

# Fix TypeScript errors before building
# Check tsconfig.json for strict settings
```

#### Issue: Out of Memory During Build

```bash
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Or add to package.json scripts:
"build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
```

#### Issue: Module Not Found

```bash
Error: Cannot find module '@/components/PoolCard'
```

**Solution**:
```bash
# Check path alias in vite.config.ts
# Ensure imports use correct alias

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### API Connection Issues

#### Issue: CORS Errors

```bash
Access to fetch at 'http://localhost:3333' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution**:
```env
# Check .env file has correct API URL
VITE_API_URL=http://localhost:3333

# Verify backend CORS configuration allows frontend origin
```

**Backend CORS** (in admin project):
```typescript
// config/cors.ts
{
  origin: ['http://localhost:5173'],
  credentials: true
}
```

#### Issue: API Requests Timing Out

```bash
Error: timeout of 30000ms exceeded
```

**Solution**:
```typescript
// Increase timeout in services/api.ts
const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 60000, // Increase to 60 seconds
})
```

#### Issue: 401 Unauthorized Errors

**Solution**:
```bash
# Check authentication token
localStorage.getItem('auth_token')

# Clear and re-authenticate
localStorage.removeItem('auth_token')
# Login again
```

---

### WebSocket Issues

#### Issue: WebSocket Connection Failed

```bash
WebSocket connection to 'ws://localhost:3333' failed
```

**Solution 1 - Check backend running**:
```bash
# Ensure backend WebSocket server is running
curl http://localhost:3333/health
```

**Solution 2 - Check URL**:
```env
# Verify WebSocket URL in .env
VITE_WS_URL=ws://localhost:3333

# For HTTPS, use WSS
VITE_WS_URL=wss://api.polymarket-rumble.com
```

**Solution 3 - Check firewall**:
```bash
# Allow WebSocket port in firewall
sudo ufw allow 3333/tcp
```

#### Issue: WebSocket Disconnecting Frequently

**Solution**:
```typescript
// Increase reconnection attempts in services/websocket.ts
class WebSocketService {
  private maxReconnectAttempts = 10  // Increase from 5
  private reconnectDelay = 2000      // Increase delay
}
```

---

### Wallet Connection Issues

#### Issue: Wallet Not Connecting

**Symptoms**: Phantom/Solflare wallet not detected

**Solution 1 - Install wallet extension**:
- Install [Phantom Wallet](https://phantom.app/)
- Install [Solflare Wallet](https://solflare.com/)
- Refresh page after installation

**Solution 2 - Check wallet network**:
- Open wallet settings
- Switch to correct network (devnet/mainnet)
- Match network in `.env`:
```env
VITE_SOLANA_NETWORK=devnet
```

**Solution 3 - Clear wallet cache**:
- Disconnect all sites from wallet
- Lock and unlock wallet
- Try connecting again

#### Issue: Transaction Signing Fails

```bash
Error: User rejected the request
```

**Solution**:
- User must approve transaction in wallet popup
- Check transaction amount is correct
- Ensure sufficient SOL balance for fees

#### Issue: Insufficient Funds

```bash
Error: insufficient funds for transfer
```

**Solution**:
```bash
# Check balance
solana balance <wallet-address>

# For devnet, airdrop SOL
solana airdrop 2 <wallet-address> --url devnet
```

---

### State Management Issues

#### Issue: React Query Not Refetching

**Symptoms**: Stale data displayed

**Solution**:
```typescript
// Manually invalidate queries
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()
queryClient.invalidateQueries({ queryKey: ['pools'] })

// Or force refetch
const { refetch } = useQuery({
  queryKey: ['pools'],
  queryFn: () => api.pools.list(),
})
refetch()
```

#### Issue: Zustand Store Not Updating

**Solution**:
```typescript
// Ensure using store correctly
const setPools = usePoolStore(state => state.setPools)

// Not
const { setPools } = usePoolStore()

// Check DevTools for state changes
// Open Redux DevTools to inspect Zustand store
```

---

### Styling Issues

#### Issue: Tailwind Classes Not Working

**Solution 1 - Check content paths**:
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure all files included
  ],
}
```

**Solution 2 - Rebuild Tailwind**:
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

**Solution 3 - Check class names**:
```typescript
// Ensure no typos
<div className="bg-blue-600" /> // ✅
<div className="bg-blue-6000" /> // ❌ Invalid
```

#### Issue: Dark Mode Not Working

**Solution**:
```typescript
// Ensure 'dark' class added to html element
document.documentElement.classList.add('dark')

// Check tailwind.config.js
module.exports = {
  darkMode: 'class', // Must be 'class'
}
```

---

### Performance Issues

#### Issue: Slow Page Load

**Solution 1 - Code splitting**:
```typescript
// Lazy load routes
import { lazy } from 'react'

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
```

**Solution 2 - Check bundle size**:
```bash
# Analyze bundle
npm run build
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

plugins: [
  visualizer({ open: true })
]
```

**Solution 3 - Optimize images**:
- Use WebP format
- Compress images
- Use lazy loading

#### Issue: High Memory Usage

**Solution**:
```typescript
// Check for memory leaks

// Cleanup useEffect hooks
useEffect(() => {
  const subscription = observable.subscribe()

  return () => {
    subscription.unsubscribe() // Cleanup
  }
}, [])

// Cleanup WebSocket connections
useEffect(() => {
  const cleanup = onPoolUpdated(() => {})

  return cleanup // Important!
}, [])
```

---

### Production Issues

#### Issue: Environment Variables Not Working

**Symptoms**: `undefined` values in production

**Solution**:
```bash
# Ensure variables prefixed with VITE_
VITE_API_URL=https://api.example.com  # ✅
API_URL=https://api.example.com       # ❌ Won't work

# Rebuild with production variables
npm run build
```

#### Issue: 404 on Refresh (Production)

**Symptoms**: App works on initial load, 404 on page refresh

**Solution - Configure server**:

**Nginx**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess)**:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Vercel (vercel.json)**:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Debugging Tools

### Browser DevTools

**React DevTools**:
- Install browser extension
- Inspect component tree
- View props and state
- Profile performance

**Redux DevTools** (for Zustand):
- View Zustand store state
- Track state changes
- Time-travel debugging

**Network Tab**:
- Monitor API requests
- Check request/response headers
- View timing information

### Vite DevTools

**Debug output**:
```bash
# Run with debug flag
DEBUG=vite:* npm run dev
```

**Check build output**:
```bash
npm run build -- --debug
```

### React Query DevTools

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<ReactQueryDevtools initialIsOpen={false} />
```

---

## Common Error Messages

### "Cannot read property 'map' of undefined"

```typescript
// ❌ Bad - data might be undefined
{data.map(item => <div key={item.id} />)}

// ✅ Good - handle undefined
{data?.map(item => <div key={item.id} />) || <div>Loading...</div>}
```

### "Maximum update depth exceeded"

```typescript
// ❌ Bad - causes infinite loop
useEffect(() => {
  setCount(count + 1)
}) // Missing dependency array

// ✅ Good - with dependency array
useEffect(() => {
  setCount(prevCount => prevCount + 1)
}, []) // Empty array = run once
```

### "React Hook useEffect has a missing dependency"

```typescript
// ❌ Warning
useEffect(() => {
  fetchData(userId)
}, []) // userId not in deps

// ✅ Fix - add dependency
useEffect(() => {
  fetchData(userId)
}, [userId])

// Or use useCallback
const fetchData = useCallback(() => {
  // fetch logic
}, [userId])
```

---

## Getting Help

### Check Logs

```bash
# Browser console
# Open DevTools (F12) → Console tab

# Vite output
# Check terminal running dev server

# Network errors
# DevTools → Network tab
```

### Enable Debug Mode

```env
VITE_ENABLE_DEBUG=true
```

### Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TanStack Query](https://tanstack.com/query)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)

### Community Support

- GitHub Issues: Report bugs
- Stack Overflow: `[reactjs]` `[vite]` `[solana]` tags
- Discord: Solana/React communities

---

**Last Updated**: 2025-01-07
**Version**: 1.0.0
