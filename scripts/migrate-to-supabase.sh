#!/bin/bash

# TCG Stats Tracker - Supabase Migration Script
# This script helps migrate from SQLite to Supabase PostgreSQL

set -e  # Exit on error

echo "🚀 TCG Stats Tracker - Supabase Migration"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERROR: DATABASE_URL environment variable is not set${NC}"
    echo ""
    echo "Please set your Supabase connection string:"
    echo "  export DATABASE_URL='postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres'"
    echo ""
    echo "Or update your .env file with the Supabase URL"
    exit 1
fi

# Check if it's a PostgreSQL URL
if [[ ! $DATABASE_URL == postgresql://* ]]; then
    echo -e "${YELLOW}⚠️  WARNING: DATABASE_URL doesn't look like a PostgreSQL connection string${NC}"
    echo "Current DATABASE_URL: $DATABASE_URL"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ DATABASE_URL is set${NC}"
echo ""

# Step 1: Backup SQLite database
echo "📦 Step 1: Backing up SQLite database..."
if [ -f "prisma/dev.db" ]; then
    cp prisma/dev.db "prisma/dev.db.backup-$(date +%Y%m%d-%H%M%S)"
    echo -e "${GREEN}✓ SQLite database backed up${NC}"
else
    echo -e "${YELLOW}⚠️  No SQLite database found to backup${NC}"
fi
echo ""

# Step 2: Backup migrations
echo "📦 Step 2: Backing up existing migrations..."
if [ -d "prisma/migrations" ]; then
    cp -r prisma/migrations "prisma/migrations.backup-$(date +%Y%m%d-%H%M%S)"
    echo -e "${GREEN}✓ Migrations backed up${NC}"
else
    echo -e "${YELLOW}⚠️  No migrations directory found${NC}"
fi
echo ""

# Step 3: Update Prisma schema
echo "🔧 Step 3: Updating Prisma schema to use PostgreSQL..."
if grep -q 'provider = "sqlite"' prisma/schema.prisma; then
    sed -i.bak 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
    echo -e "${GREEN}✓ Prisma schema updated to PostgreSQL${NC}"
else
    echo -e "${YELLOW}⚠️  Schema already using PostgreSQL or different provider${NC}"
fi
echo ""

# Step 4: Ask about migrations
echo "🗄️  Step 4: Database migration strategy"
echo ""
echo "Choose migration strategy:"
echo "  1) Fresh start - Delete old migrations and create new ones (recommended)"
echo "  2) Keep existing migrations - Try to apply existing migrations to PostgreSQL"
echo ""
read -p "Enter choice (1 or 2): " -n 1 -r
echo ""

if [[ $REPLY == "1" ]]; then
    echo "Removing old migrations..."
    rm -rf prisma/migrations
    echo -e "${GREEN}✓ Old migrations removed${NC}"
    echo ""
    
    echo "Creating new PostgreSQL migration..."
    npx prisma migrate dev --name init_postgresql
    echo -e "${GREEN}✓ PostgreSQL migration created and applied${NC}"
else
    echo "Attempting to apply existing migrations..."
    npx prisma migrate deploy
    echo -e "${GREEN}✓ Migrations applied${NC}"
fi
echo ""

# Step 5: Generate Prisma Client
echo "🔨 Step 5: Generating Prisma Client..."
npx prisma generate
echo -e "${GREEN}✓ Prisma Client generated${NC}"
echo ""

# Step 6: Seed database
echo "🌱 Step 6: Seeding database..."
read -p "Do you want to seed the database with sample data? (Y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
    npx prisma db seed
    echo -e "${GREEN}✓ Database seeded${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping database seeding${NC}"
fi
echo ""

# Step 7: Verify connection
echo "🔍 Step 7: Verifying database connection..."
npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    echo "Please check your DATABASE_URL and try again"
    exit 1
fi
echo ""

# Success!
echo "=========================================="
echo -e "${GREEN}✅ Migration to Supabase completed successfully!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Test your application locally: npm run dev"
echo "  2. Verify data in Supabase Dashboard → Table Editor"
echo "  3. Update Vercel environment variables with Supabase URL"
echo "  4. Deploy to Vercel: git push origin main"
echo ""
echo "See SUPABASE_MIGRATION.md for detailed instructions"
echo ""

