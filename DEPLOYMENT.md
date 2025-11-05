# Deployment Guide - TCG Stats Tracker v1.0.0-beta

This guide covers deploying the TCG Stats Tracker application for beta testing and production use.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended for Beta)

Vercel is the easiest way to deploy Next.js applications and is perfect for beta testing.

**Steps:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for beta deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Environment Variables**
   Add these in Vercel dashboard (Settings → Environment Variables):
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   NODE_ENV=production
   ```

4. **Database Setup**
   - Use PostgreSQL (Railway, Neon, or Supabase)
   - See "Database Setup" section below for details

**Vercel Deployment URL**: Your app will be available at `https://your-project.vercel.app`

---

### Option 2: Self-Hosted (VPS/Cloud)

For more control, deploy to a VPS or cloud provider.

**Requirements:**
- Node.js 18+ installed
- PM2 or similar process manager
- Nginx or Apache for reverse proxy
- SSL certificate (Let's Encrypt recommended)

**Steps:**

1. **Clone Repository**
   ```bash
   git clone https://github.com/rexkater/TCG-Stats-Tracker.git
   cd TCG-Stats-Tracker
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.production.example .env.production
   # Edit .env.production with your values
   ```

4. **Set Up Database**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

5. **Build Application**
   ```bash
   npm run build
   ```

6. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "tcg-stats-tracker" -- start
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Set Up SSL**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

---

## 🗄️ Database Setup (PostgreSQL)

The application uses PostgreSQL for production. Choose one of these providers:

### Option 1: Railway (Recommended - IPv4 Compatible)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Wait for database to be created (~30 seconds)

3. **Get Connection String**
   - Click on PostgreSQL service
   - Go to "Connect" or "Variables" tab
   - Copy the public/external connection string (e.g., `postgresql://postgres:...@hopper.proxy.rlwy.net:xxxxx/railway`)

4. **Add to Vercel**
   - In Vercel: Settings → Environment Variables
   - Add `DATABASE_URL` with the Railway connection string
   - Select all environments (Production, Preview, Development)

### Option 2: Neon (Serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to Vercel environment variables

### Option 3: Supabase (Requires IPv6)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings → Database
4. Note: Requires IPv6 connectivity for migrations

### Using Other PostgreSQL Providers

- **Railway**: [railway.app](https://railway.app)
- **Render**: [render.com](https://render.com)
- **Neon**: [neon.tech](https://neon.tech)
- **DigitalOcean**: Managed PostgreSQL

---

## 🔐 Environment Variables

### Required Variables

```bash
# Database connection
DATABASE_URL="your-database-url"

# Node environment
NODE_ENV=production

# Application URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Optional Variables (for V2)

```bash
# Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Error Reporting
SENTRY_DSN=your-sentry-dsn
```

---

## 📊 Monitoring & Maintenance

### Health Checks

Monitor these endpoints:
- `GET /` - Home page should load
- `GET /projects` - Projects list should load
- `GET /api/health` - (TODO: Add health check endpoint)

### Logs

**Vercel**: View logs in Vercel dashboard  
**Self-hosted**: Use PM2 logs
```bash
pm2 logs tcg-stats-tracker
```

### Backups

**PostgreSQL**:
```bash
# Backup with pg_dump
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Updates

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart (PM2)
pm2 restart tcg-stats-tracker

# Or restart (Vercel)
# Automatic on git push
```

---

## 🧪 Beta Testing Checklist

Before sharing with beta testers:

- [ ] Application builds successfully (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] Database is seeded with sample data
- [ ] Environment variables are configured
- [ ] Application is accessible via URL
- [ ] Feedback page is working
- [ ] GitHub Issues are enabled
- [ ] BETA_GUIDE.md is accessible
- [ ] Error pages display correctly
- [ ] Loading states work properly
- [ ] CSV export/import functions correctly

---

## 🔒 Security Considerations

### Beta (Current)

- ⚠️ No authentication - single user mode
- ✅ PostgreSQL database (Railway/Neon/Supabase)
- ⚠️ No rate limiting
- ⚠️ No CSRF protection

### Production (V2)

- ✅ User authentication (planned)
- ✅ PostgreSQL with Row-Level Security (RLS)
- ✅ Rate limiting on API routes
- ✅ CSRF protection
- ✅ Input validation and sanitization
- ✅ HTTPS only
- ✅ Security headers

---

## 📱 Performance Optimization

### Current Optimizations

- ✅ Next.js automatic code splitting
- ✅ Static page generation where possible
- ✅ Tailwind CSS purging
- ✅ Image optimization (Next.js Image component)

### Future Optimizations (V2)

- Server-side analytics calculations
- Database query optimization
- Redis caching
- CDN for static assets
- Lazy loading for large datasets

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Database Issues

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Regenerate Prisma Client
npx prisma generate
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Environment Variables Not Loading

- Check `.env.production` exists
- Verify variable names match exactly
- Restart the application after changes
- On Vercel, check dashboard environment variables

---

## 📞 Support

For deployment issues:
- **GitHub Issues**: https://github.com/rexkater/TCG-Stats-Tracker/issues
- **Email**: rex.reyes@upr.edu

---

## 📝 Deployment Checklist

### Pre-Deployment

- [ ] All milestones completed (M0-M7)
- [ ] Tests passing
- [ ] Build successful
- [ ] Documentation updated
- [ ] Environment variables configured

### Post-Deployment

- [ ] Application accessible
- [ ] Database seeded
- [ ] Feedback mechanism working
- [ ] Error tracking configured
- [ ] Monitoring set up
- [ ] Backup strategy in place

### Beta Launch

- [ ] Share URL with beta testers
- [ ] Provide BETA_GUIDE.md
- [ ] Monitor for issues
- [ ] Collect feedback
- [ ] Plan V2 based on feedback

---

*Last Updated: 2025-11-05*  
*Version: 1.0.0-beta*

