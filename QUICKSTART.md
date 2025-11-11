# PolyRumble Frontend - Quick Start Guide

## Production Deployment

### Site Access
- **Production URL**: https://polyrumble.com
- **Status**: Live and accessible
- **SSL Certificate**: Auto-renewal configured with Let's Encrypt
- **HTTP → HTTPS**: Automatic redirect enabled

### Deployment Architecture
- **Repository**: Git-based deployment from master branch
- **Location**: `/root/prod/fe` on production server
- **Build**: Production bundle with Vite
- **Server**: nginx 1.24.0 with Let's Encrypt SSL
- **Backend API**: http://157.180.68.185:3333 (temporary)
- **Mode**: Mock mode enabled (VITE_MOCK_MODE=true)

### Server Access
Access the production server using the `rumble` alias:
```bash
rumble "command"
```

Server location: `/root/prod/fe`

### Quick Deployment
For quick updates to production, run:
```bash
rumble "/root/prod/deploy.sh"
```

This automated script will:
1. Pull latest changes from Git master branch
2. Install/update dependencies
3. Build production bundle
4. Validate nginx configuration
5. Reload nginx

### Manual Deployment Steps
If you need to deploy manually:

```bash
# 1. SSH into server
rumble "cd /root/prod/fe"

# 2. Pull latest code
rumble "cd /root/prod/fe && git pull origin master"

# 3. Install dependencies
rumble "cd /root/prod/fe && npm install"

# 4. Build production bundle
rumble "cd /root/prod/fe && npm run build"

# 5. Reload nginx
rumble "systemctl reload nginx"
```

### Configuration Files

#### Environment Configuration
- **File**: `.env.production` (committed to repository)
- **Location**: Project root
- **Purpose**: Production environment variables

Key variables:
```env
VITE_API_URL=http://157.180.68.185:3333
VITE_WS_URL=ws://157.180.68.185:3333
VITE_MOCK_MODE=true
VITE_SOLANA_NETWORK=devnet
```

#### Nginx Configuration
- **File**: `/etc/nginx/sites-available/polyrumble.com`
- **Symlink**: `/etc/nginx/sites-enabled/polyrumble.com`
- **Features**:
  - Client-side routing support (React Router)
  - Gzip compression
  - Static asset caching (1 year)
  - Security headers
  - SSL/TLS termination

#### SSL Certificate
- **Provider**: Let's Encrypt
- **Certificate Path**: `/etc/letsencrypt/live/polyrumble.com/fullchain.pem`
- **Private Key**: `/etc/letsencrypt/live/polyrumble.com/privkey.pem`
- **Auto-renewal**: Configured via certbot timer (runs twice daily)

Check certificate status:
```bash
rumble "certbot certificates"
```

### Local Development

#### Prerequisites
- Node.js v20.19.5 or higher
- npm v10.8.2 or higher

#### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production locally
npm run build

# Preview production build
npm run preview
```

#### Environment Variables
For local development, create `.env.local`:
```env
VITE_API_URL=http://localhost:3333
VITE_WS_URL=ws://localhost:3333
VITE_MOCK_MODE=true
VITE_ENABLE_DEBUG=true
```

### Verification & Testing

#### Check Deployment Status
```bash
# Test HTTPS access
curl -I https://polyrumble.com

# Test HTTP redirect
curl -I http://polyrumble.com

# Check nginx status
rumble "systemctl status nginx"

# View nginx logs
rumble "tail -f /var/log/nginx/polyrumble.error.log"
```

#### Browser Testing Checklist
- [ ] Site loads at https://polyrumble.com
- [ ] No console errors in browser DevTools
- [ ] All routes accessible (/, /arenas, /arena/:id)
- [ ] Static assets loading correctly
- [ ] Responsive design works on mobile
- [ ] API connection working (check Network tab)
- [ ] WebSocket connection established (in dev mode)

### Moving Off Mock Mode

When ready to connect to real Solana program:

1. Update `.env.production`:
```env
VITE_MOCK_MODE=false
VITE_BETTING_PROGRAM_ID=<your-program-id>
VITE_SOLANA_NETWORK=mainnet-beta
VITE_API_URL=https://api.polyrumble.com
```

2. Commit and push changes:
```bash
git add .env.production
git commit -m "feat: enable production mode with Solana program"
git push origin master
```

3. Deploy to production:
```bash
rumble "/root/prod/deploy.sh"
```

### Troubleshooting

#### 403 Forbidden Error
Check directory permissions:
```bash
rumble "ls -ld /root /root/prod /root/prod/fe /root/prod/fe/dist"
```

Permissions should be at least 755 for these directories.

#### 502 Bad Gateway
Check nginx error logs:
```bash
rumble "tail -100 /var/log/nginx/polyrumble.error.log"
```

#### Build Failures
Clear node_modules and rebuild:
```bash
rumble "cd /root/prod/fe && rm -rf node_modules package-lock.json && npm install && npm run build"
```

#### SSL Certificate Issues
Renew certificate manually:
```bash
rumble "certbot renew --force-renewal"
```

### Support & Documentation

- Frontend PRD: `docs/PRD/PRD_FRONTEND.md`
- Integration Plan: `INTEGRATION_PLAN.md`
- Full README: `README.md`
- Infrastructure Notes: `polyrumbleinfra.md`

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push to GitHub
git push origin feature/your-feature

# After PR approval, merge to master
# Then deploy:
rumble "/root/prod/deploy.sh"
```

### Performance Notes

**Production Build Stats:**
- Total build size: ~11MB
- Main bundle: ~1.3MB (369KB gzipped)
- Code splitting: Enabled
- Asset optimization: Enabled
- Build time: ~30 seconds

### Security Considerations

- SSL/TLS: A+ grade (Let's Encrypt)
- Security headers: Configured in nginx
- Environment variables: Not exposed to client
- API keys: Server-side only
- CORS: Configured for API endpoints
- Rate limiting: Consider implementing on nginx level

---

**Last Updated**: 2025-11-11
**Deployment Version**: Git-based with automated script
**Current Status**: Production ready with mock mode
