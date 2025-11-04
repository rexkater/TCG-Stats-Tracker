# TCG Stats Tracker

A data-gathering application for tracking competitive Trading Card Game (TCG) results with real-time statistics and analytics.

## Overview

TCG Stats Tracker allows users to maintain multiple projects, each tracking competitive TCG results. The app computes statistics like overall win rate, matchup win rates, and first-vs-second (draw/play) win rates.

### Key Features

- **Multi-project workspace**: Create, rename, and archive projects with isolated data and settings
- **Game support**: Initial support for Riftbound TCG, extensible to other TCGs
- **Entry tracking**: Record matchup statistics with deck names, results, initiative, battlefield, and categories
- **Real-time analytics**: Auto-calculated win rates, matchup analysis, and battlefield-specific splits
- **Offline-first PWA**: Capture data offline with automatic sync when online
- **Export/Import**: CSV export and import with validation

## Tech Stack

- **Frontend**: Next.js 15 + React 18 + TypeScript
- **Database**: Prisma ORM with SQLite (MVP) / PostgreSQL (Production via Supabase)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth (planned)
- **Storage**: Supabase Storage for deck images (planned)

## Project Structure

```
tcg-stats-tracker/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── projects/          # Project-related pages
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles with Tailwind
├── src/
│   └── lib/               # Shared utilities
│       ├── prisma.ts      # Prisma client singleton
│       └── validators.ts  # Zod validation schemas
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Seed data script
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tcg-stats-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (defaults work for local development)

4. **Set up the database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Development Milestones

Following the specification milestones:

- [x] **M0**: Project Setup - Repository, CI, environments, Prisma/Supabase CLI
- [x] **M1**: Core Schema & RLS - Database tables, enums, RLS policies, seed data
- [x] **M2**: Add Entry Flow - Entry form with validations, offline queue
- [x] **M3**: Analytics v1 - Win rates, matchup analysis, battlefield splits
- [ ] **M4**: Matchup Notebook - Notes log UI with search and pin
- [ ] **M5**: Exports & Imports - CSV export/import with validation
- [ ] **M6**: Hardening & A11y - Error handling, accessibility, E2E tests
- [ ] **M7**: Beta Cut & Feedback - User feedback and v2 backlog

## Database Schema (Current)

### Core Models

- **User**: User accounts
- **Project**: TCG tracking projects (per user)
- **Deck**: Deck definitions (per project)
- **Category**: Custom categories (per project)
- **Entry**: Match results with deck matchups
- **Note**: Notes attached to entries

### Planned Schema Updates (M1)

- Add `initiative` enum (FIRST/SECOND)
- Add `tcg_context_options` table (battlefields)
- Restructure notes to `matchup_notes_log` (timestamped, per matchup)
- Add TCG configuration with `settings_json`

## Contributing

This project follows the specification in `Spec-1-Tcg Stats Tracker.pdf`. Please refer to that document for detailed requirements and architecture decisions.

## License

ISC

## Roadmap

### MVP (Must Have)
- Multi-project workspace
- Entry model with all required fields
- Auto-calculated statistics with filters
- Simple, fast data entry UX
- PWA with offline support
- Email/password and social auth
- CSV export/import

### Future (Should Have)
- Tagging system
- Saved filters and views
- Charting dashboards
- Per-TCG configuration
- Project sharing and collaboration

### Later (Could Have)
- Opponent directory
- Event mode
- Google Sheets import
- API access tokens
