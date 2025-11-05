# Supabase Migration Guide

This guide walks you through migrating TCG Stats Tracker from SQLite to Supabase PostgreSQL.

## Prerequisites

- Supabase account (free tier is fine)
- Access to your Vercel project
- Local development environment set up

---

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign up/sign in
2. **Click "New Project"**
3. **Fill in the details:**
   - **Name**: `tcg-stats-tracker`
   - **Database Password**: Choose a strong password (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., `East US (North Virginia)`)
   - **Pricing Plan**: Free tier
4. **Click "Create new project"** - wait ~2 minutes for setup

---

## Step 2: Get Database Connection String

1. **In your Supabase project dashboard**, click on the **Settings** icon (⚙️) in the left sidebar
2. **Click "Database"** in the settings menu
3. **Scroll down to "Connection string"**
4. **Select "URI"** tab
5. **Copy the connection string** - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
6. **Replace `[YOUR-PASSWORD]`** with the password you set in Step 1

**Example:**
```
postgresql://postgres:mySecurePassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

## Step 3: Update Local Environment

1. **Create a backup of your current database:**
   ```bash
   cp prisma/dev.db prisma/dev.db.backup
   ```

2. **Update `.env` file:**
   ```bash
   # Comment out SQLite
   # DATABASE_URL="file:./prisma/dev.db"
   
   # Add Supabase PostgreSQL
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

3. **Add connection pooling (optional but recommended):**
   
   Supabase provides a connection pooler for better performance:
   
   In Supabase Dashboard → Settings → Database → Connection Pooling:
   - Copy the "Connection string" under "Transaction" mode
   - It looks like: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
   
   Update `.env`:
   ```bash
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
   ```

---

## Step 4: Update Prisma Schema

The schema needs to be updated to use PostgreSQL instead of SQLite.

**File: `prisma/schema.prisma`**

Change the datasource from:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

To:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Step 5: Create PostgreSQL Migration

Since we're switching database providers, we need to create a fresh migration for PostgreSQL.

1. **Delete old SQLite migrations (optional - for clean slate):**
   ```bash
   # Backup first
   cp -r prisma/migrations prisma/migrations.backup
   
   # Remove old migrations
   rm -rf prisma/migrations
   ```

2. **Create new PostgreSQL migration:**
   ```bash
   npx prisma migrate dev --name init_postgresql
   ```

   This will:
   - Create a new migration for PostgreSQL
   - Apply it to your Supabase database
   - Generate the Prisma Client

3. **Seed the database:**
   ```bash
   npx prisma db seed
   ```

---

## Step 6: Test Locally

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the application:**
   - Navigate to http://localhost:3005
   - Check that projects load
   - Try creating a new entry
   - Verify analytics work
   - Test notes functionality
   - Try CSV export/import

3. **Verify data in Supabase:**
   - Go to Supabase Dashboard → Table Editor
   - You should see all your tables (Project, Deck, Entry, etc.)
   - Check that seed data is present

---

## Step 7: Update Vercel Environment Variables

1. **Go to your Vercel project dashboard**
2. **Click "Settings" → "Environment Variables"**
3. **Add new variable:**
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string (use connection pooler URL)
   - **Environment**: Production, Preview, Development (select all)
4. **Click "Save"**

---

## Step 8: Deploy to Vercel

1. **Commit and push changes:**
   ```bash
   git add prisma/schema.prisma prisma/migrations
   git commit -m "Migrate to Supabase PostgreSQL"
   git push origin main
   ```

2. **Vercel will automatically deploy**
   - Monitor the deployment in Vercel dashboard
   - Build should complete successfully now

3. **Run migrations in production:**
   
   Vercel doesn't automatically run migrations. You have two options:

   **Option A: Run migrations locally against production database**
   ```bash
   # Temporarily set DATABASE_URL to production
   DATABASE_URL="your-supabase-url" npx prisma migrate deploy
   ```

   **Option B: Add build command to package.json**
   
   Update `package.json`:
   ```json
   {
     "scripts": {
       "build": "prisma generate && prisma migrate deploy && next build"
     }
   }
   ```

---

## Step 9: Seed Production Database

After migrations are applied, seed the production database:

```bash
# Set DATABASE_URL to production
DATABASE_URL="your-supabase-url" npx prisma db seed
```

Or create a separate seed script for production that you can run once.

---

## Step 10: Verify Production Deployment

1. **Visit your Vercel deployment URL**
2. **Test all features:**
   - Create a project
   - Add decks and categories
   - Create entries
   - View analytics
   - Create notes
   - Export/import CSV

3. **Check Supabase Dashboard:**
   - Verify data is being created
   - Monitor database usage
   - Check for any errors in logs

---

## Troubleshooting

### Connection Errors

**Error: `Can't reach database server`**
- Check that your IP is allowed in Supabase (by default, all IPs are allowed)
- Verify the connection string is correct
- Check that you replaced `[YOUR-PASSWORD]` with actual password

**Error: `SSL connection required`**

Add `?sslmode=require` to your connection string:
```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require
```

### Migration Errors

**Error: `Migration failed`**
- Check Supabase logs in Dashboard → Database → Logs
- Ensure database is empty before first migration
- Try resetting: `npx prisma migrate reset` (WARNING: deletes all data)

### Build Errors in Vercel

**Error: `Prisma Client not generated`**

Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## Rollback Plan

If something goes wrong, you can rollback to SQLite:

1. **Restore `.env`:**
   ```bash
   DATABASE_URL="file:./prisma/dev.db"
   ```

2. **Restore `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Restore database:**
   ```bash
   cp prisma/dev.db.backup prisma/dev.db
   ```

4. **Regenerate Prisma Client:**
   ```bash
   npx prisma generate
   ```

---

## Benefits of Supabase

✅ **Persistent data** - Data survives deployments  
✅ **Scalable** - Handles more concurrent users  
✅ **Backups** - Automatic daily backups (paid plans)  
✅ **Real-time** - Can add real-time features later  
✅ **Auth ready** - Easy to add authentication in V2  
✅ **Storage** - Can add file storage for deck images  

---

## Next Steps After Migration

- [ ] Set up automatic backups (Supabase paid plan or manual pg_dump)
- [ ] Monitor database usage in Supabase dashboard
- [ ] Consider enabling Row Level Security (RLS) for V2 multi-user support
- [ ] Add database monitoring/alerting
- [ ] Plan for database scaling if needed

---

## Cost Considerations

**Supabase Free Tier includes:**
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth
- 50,000 monthly active users
- 500,000 Edge Function invocations

This is more than enough for beta testing and early production!

**Paid plans start at $25/month** if you need more resources.

---

## Support

If you encounter issues:
- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase Discord**: https://discord.supabase.com
- **GitHub Issues**: https://github.com/rexkater/TCG-Stats-Tracker/issues

---

*Good luck with your migration! 🚀*

