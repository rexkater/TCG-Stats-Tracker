# TCG Stats Tracker

> **Version 1.0.0-beta** - Currently in beta testing

A data-gathering application for tracking competitive Trading Card Game (TCG) results with real-time statistics and analytics.

## Overview

TCG Stats Tracker allows users to maintain multiple projects, each tracking competitive TCG results. The app computes statistics like overall win rate, matchup win rates, and first-vs-second (draw/play) win rates.

**🧪 Beta Status**: This is a beta release. We're actively collecting feedback to improve the application.
- **Beta Testing Guide**: See [BETA_GUIDE.md](./BETA_GUIDE.md) for detailed testing instructions
- **V2 Roadmap**: See [V2_BACKLOG.md](./V2_BACKLOG.md) for planned features and improvements

### Key Features

- **User Authentication**: Secure username/password authentication with session management
- **Multi-project workspace**: Create, rename, and manage multiple TCG projects with isolated data
- **Multi-TCG support**: Built-in support for Riftbound, One Piece, and custom TCGs
- **Comprehensive entry tracking**: Record matches with deck names, results (Win/Loss/Draw), initiative, battlefields, and categories
- **Real-time analytics**: Auto-calculated win rates, matchup analysis, deck performance, and battlefield-specific statistics
- **Premium features**: Global analytics dashboard showing community-wide statistics (premium subscription)
- **Matchup notes**: Track strategic notes for specific deck matchups
- **Best-of-3 series tracking**: Record individual games in match series with game numbers and series IDs
- **CSV Export/Import**: Full data portability with validation and error handling
- **Mobile-optimized**: Responsive design with touch-friendly controls for on-the-go tracking
- **Copy last entry**: Quick data entry by copying information from your previous match

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Database**: PostgreSQL (Railway) via Prisma ORM
- **Authentication**: NextAuth.js with credentials provider (username/password)
- **Styling**: Tailwind CSS v4
- **Testing**: Playwright (E2E & Accessibility)
- **Deployment**: Vercel
- **Email**: Resend (for password reset emails)

## Project Structure

```
tcg-stats-tracker/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (entries, projects, analytics, subscription)
│   ├── auth/              # Authentication pages (signin, signup, reset password)
│   ├── projects/          # Project management and entry tracking
│   ├── analytics/         # Global analytics dashboard (premium)
│   ├── subscription/      # Premium subscription management
│   ├── feedback/          # Beta feedback page
│   ├── layout.tsx         # Root layout with header and footer
│   └── globals.css        # Global styles with Tailwind CSS v4
├── components/            # React components
│   ├── EntryForm.tsx      # Match entry form
│   ├── Header.tsx         # Navigation header
│   ├── UserNav.tsx        # User navigation dropdown
│   └── *Analytics.tsx     # Analytics dashboard components
├── src/
│   └── lib/               # Shared utilities
│       ├── prisma.ts      # Prisma client singleton
│       ├── analytics.ts   # Analytics calculation functions
│       ├── global-analytics.ts  # Global analytics for premium users
│       └── validators.ts  # Zod validation schemas
├── prisma/
│   ├── schema.prisma      # Database schema (User, Project, Entry, TCG, etc.)
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Seed data (TCGs, battlefields)
├── scripts/               # Utility scripts
│   ├── set-premium.ts     # Set user premium status
│   └── generate-favicons.js  # Generate app icons from logo
├── public/                # Static assets (logo, favicons, deck images)
├── auth.ts                # NextAuth configuration
├── auth.config.ts         # NextAuth providers and callbacks
└── middleware.ts          # Auth middleware for protected routes
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
- `npm test` - Run E2E tests with Playwright
- `npm run test:ui` - Run E2E tests with Playwright UI
- `npm run test:headed` - Run E2E tests in headed mode
- `npm run test:report` - Show Playwright test report
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
- [x] **M4**: Matchup Notebook - Notes log UI with search and pin
- [x] **M5**: Exports & Imports - CSV export/import with validation
- [x] **M6**: Hardening & A11y - Error handling, accessibility, E2E tests
- [x] **M7**: Beta Cut & Feedback - User feedback and v2 backlog

## Database Schema

### Core Models

- **User**: User accounts with authentication and premium status
- **TCG**: Trading card game definitions with settings (Riftbound, One Piece, Other)
- **ContextOption**: Battlefield/context options per TCG (e.g., Riftbound battlefields)
- **Project**: TCG tracking projects owned by users
- **Category**: Match categories per project (Ranked, Casual, Tournament, etc.)
- **Entry**: Match results with comprehensive tracking:
  - Deck matchups (my deck vs opponent deck)
  - Result (WIN, LOSS, DRAW)
  - Initiative (FIRST, SECOND)
  - Battlefields (my battlefield, opponent battlefield)
  - Best-of-3 tracking (game number, series ID, dice roll winner)
  - Quick notes
- **MatchupNote**: Strategic notes for specific deck matchups

### Enums

- **MatchResult**: WIN, LOSS, DRAW
- **Initiative**: FIRST, SECOND

## Beta Testing & Feedback

We're actively seeking feedback from beta testers!

### How to Provide Feedback

- **Feedback Page**: Visit `/feedback` in the app or click "Provide Feedback" on the home page
- **GitHub Issues**: Report bugs or request features at [github.com/rexkater/TCG-Stats-Tracker/issues](https://github.com/rexkater/TCG-Stats-Tracker/issues)
- **Email**: Send detailed feedback to rex.reyes.rodriguez@gmail.com

### What We're Looking For

- 🐛 Bugs or unexpected behavior
- 🤔 Confusing UI or unclear workflows
- 💡 Feature requests
- 🐌 Performance issues
- ♿ Accessibility concerns
- 📊 Data accuracy issues in analytics

### Beta Documentation

- **[BETA_GUIDE.md](./BETA_GUIDE.md)**: Comprehensive guide for beta testers
- **[V2_BACKLOG.md](./V2_BACKLOG.md)**: Planned features for version 2

## Contributing

This project follows the specification in `Spec-1-Tcg Stats Tracker.pdf`. Please refer to that document for detailed requirements and architecture decisions.

## License

ISC

## Features Implemented ✅

### Authentication & User Management
- ✅ Username/password authentication
- ✅ Session management with NextAuth.js
- ✅ Password reset via email
- ✅ Premium subscription system

### Project & Entry Management
- ✅ Multi-project workspace
- ✅ Multi-TCG support (Riftbound, One Piece, Other)
- ✅ Comprehensive match entry tracking
- ✅ Best-of-3 series support
- ✅ Copy last entry for quick data input
- ✅ Edit and delete entries

### Analytics
- ✅ Overall win rate statistics
- ✅ Matchup analysis (deck vs deck)
- ✅ Initiative statistics (first vs second)
- ✅ Battlefield performance analysis
- ✅ Deck performance tracking
- ✅ Category-based statistics
- ✅ Global analytics dashboard (premium)

### Data Management
- ✅ CSV export with all match data
- ✅ CSV import with validation
- ✅ Matchup notes system

### UI/UX
- ✅ Mobile-responsive design
- ✅ Touch-friendly controls
- ✅ Accessible navigation
- ✅ App icon/favicon support

## Planned Features (V2)

See [V2_BACKLOG.md](./V2_BACKLOG.md) for the complete roadmap. Key planned features:

- 🔮 OAuth providers (Google, GitHub)
- 🔮 PWA with offline support
- 🔮 Advanced charting and visualizations
- 🔮 Project sharing and collaboration
- 🔮 Tagging system for entries
- 🔮 Saved filters and custom views
- 🔮 Tournament mode
- 🔮 Opponent directory
- 🔮 Deck builder integration
