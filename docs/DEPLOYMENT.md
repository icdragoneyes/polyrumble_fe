# Deployment Guide

## Production Build

### Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

Build output: `dist/` directory containing:
- Optimized JavaScript bundles
- CSS files
- Static assets
- index.html

### Build Configuration

**Location**: `vite.config.ts`

```typescript
export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'solana-vendor': [
            '@solana/web3.js',
            '@solana/wallet-adapter-base',
            '@solana/wallet-adapter-react',
            '@solana/wallet-adapter-wallets',
          ],
          'ui-vendor': [
            '@headlessui/react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
          ],
          'data-vendor': ['zustand', '@tanstack/react-query', 'axios'],
        },
      },
    },
  },
})
```

---

## Environment Configuration

### Production Environment Variables

```env
# API Configuration (Production)
VITE_API_URL=https://api.polymarket-rumble.com
VITE_WS_URL=wss://api.polymarket-rumble.com

# Solana Configuration (Mainnet)
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_SOLANA_NETWORK=mainnet-beta
VITE_BETTING_PROGRAM_ID=<mainnet-program-id>

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

### Setting Environment Variables

**Option 1: `.env.production` file**
```bash
# Create production env file
cp .env.example .env.production

# Edit with production values
nano .env.production

# Build with production env
npm run build
```

**Option 2: Build-time variables**
```bash
VITE_API_URL=https://api.polymarket-rumble.com npm run build
```

**Option 3: CI/CD environment**
```yaml
# GitHub Actions example
env:
  VITE_API_URL: ${{ secrets.API_URL }}
  VITE_SOLANA_RPC_URL: ${{ secrets.SOLANA_RPC_URL }}
```

---

## Deployment Platforms

### Vercel (Recommended)

**Quick Deploy**:
```bash
npm install -g vercel
vercel
```

**vercel.json**:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "@api-url",
    "VITE_WS_URL": "@ws-url",
    "VITE_SOLANA_RPC_URL": "@solana-rpc-url"
  }
}
```

**GitHub Integration**:
1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Auto-deploy on push to main branch

---

### Netlify

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://api.polymarket-rumble.com"
  VITE_WS_URL = "wss://api.polymarket-rumble.com"
```

**Deploy**:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

### AWS S3 + CloudFront

**1. Build application**:
```bash
npm run build
```

**2. Upload to S3**:
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

**3. CloudFront configuration**:
- **Origin**: S3 bucket
- **Default Root Object**: `index.html`
- **Error Pages**: 404 → `/index.html` (for client-side routing)

**4. Invalidate CloudFront cache**:
```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

### Docker Deployment

**Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Build and run**:
```bash
docker build -t polymarket-frontend .
docker run -p 80:80 polymarket-frontend
```

---

## CI/CD Pipeline

### GitHub Actions

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
          VITE_WS_URL: ${{ secrets.WS_URL }}
          VITE_SOLANA_RPC_URL: ${{ secrets.SOLANA_RPC_URL }}
          VITE_BETTING_PROGRAM_ID: ${{ secrets.BETTING_PROGRAM_ID }}
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Performance Optimization

### Build Optimization

**1. Code Splitting**:
- Already configured via `manualChunks` in vite.config.ts
- Splits vendor code into separate bundles
- Lazy load routes and heavy components

**2. Tree Shaking**:
- Automatically enabled in production build
- Removes unused code

**3. Minification**:
- JavaScript minification via Terser
- CSS minification via cssnano

**4. Asset Optimization**:
```bash
# Install image optimization plugin
npm install -D vite-plugin-imagemin

# Add to vite.config.ts
import imagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    imagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeEmptyAttrs', active: true },
        ],
      },
    }),
  ],
})
```

### Runtime Optimization

**1. Enable Compression**:
```nginx
# nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

**2. Browser Caching**:
```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**3. CDN Integration**:
- Upload static assets to CDN
- Configure base URL in vite.config.ts:

```typescript
export default defineConfig({
  base: 'https://cdn.polymarket-rumble.com/',
})
```

---

## Security

### Content Security Policy

Add CSP headers via nginx:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.polymarket-rumble.com wss://api.polymarket-rumble.com https://api.mainnet-beta.solana.com;" always;
```

### Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### Environment Variable Security

- Never commit `.env` files
- Use platform-specific secret management
- Rotate API keys regularly

---

## Monitoring

### Error Tracking

**Sentry Integration**:
```bash
npm install @sentry/react
```

```typescript
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
})
```

### Analytics

**Google Analytics**:
```typescript
import ReactGA from 'react-ga4'

if (env.enableAnalytics) {
  ReactGA.initialize('G-XXXXXXXXXX')
}
```

---

## Health Checks

### Deployment Verification

```bash
# Check build output
ls -lh dist/

# Test production build locally
npm run preview

# Verify environment variables
curl https://your-domain.com/config.js
```

### Post-Deployment Checklist

- [ ] Application loads without errors
- [ ] API connection working
- [ ] WebSocket connection established
- [ ] Wallet connection functional
- [ ] Transactions can be signed
- [ ] Dark mode working
- [ ] Responsive design on mobile
- [ ] All routes accessible
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Error tracking active
- [ ] Analytics working

---

## Rollback Procedure

### Vercel

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

### AWS S3

```bash
# Keep previous build
mv dist dist-backup

# Build previous version
git checkout previous-tag
npm install
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for deployment issues.

---

**Last Updated**: 2025-01-07
**Version**: 1.0.0
