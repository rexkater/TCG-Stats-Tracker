# Release Notes - TCG Stats Tracker v1.0.0-beta

**Release Date**: November 5, 2025  
**Status**: Beta Release  
**Repository**: https://github.com/rexkater/TCG-Stats-Tracker

---

## 🎉 Welcome to TCG Stats Tracker Beta!

This is the first beta release of TCG Stats Tracker, a comprehensive application for tracking Trading Card Game statistics and improving gameplay. This release includes all core features needed for effective match tracking and analysis.

---

## ✨ Features

### 📊 Project Management
- Create and manage multiple TCG projects
- Each project has isolated decks, categories, and entries
- Support for Riftbound TCG with 16 legends and 24 battlefields
- Extensible to support other TCGs

### 📝 Match Entry Tracking
- **Comprehensive Match Data**:
  - My Deck vs Opponent Deck
  - Match Result (Win/Loss/Draw)
  - Initiative (First/Second)
  - Dual Battlefield tracking (yours and opponent's)
  - Match Category (Ranked, Casual, Tournament, etc.)
  - Match Scores
  - Quick Notes
  
- **Best-of-3 Series Tracking**:
  - Track individual games in a match series
  - Game Number (1, 2, or 3)
  - Series ID to group related games

### 📈 Analytics Dashboard
- **Overall Statistics**:
  - Total entries count
  - Overall win rate
  - Win rate excluding draws
  
- **Matchup Analysis**:
  - Win/Loss/Draw records for each deck matchup
  - Win rate percentages
  - Color-coded performance indicators
  
- **Deck Performance**:
  - Performance stats for each of your decks
  - Identify your strongest decks
  
- **Battlefield Performance**:
  - Win rates on different battlefields
  - Identify favorable battlefield choices
  
- **Initiative Analysis**:
  - Performance when going first vs second

### 📓 Matchup Notebook
- Create strategic notes for specific matchups
- Pin important notes to the top
- Search notes by deck names or content
- Full CRUD operations (Create, Read, Update, Delete)
- Timestamped note history

### 📥 Export & Import
- **CSV Export**:
  - Export all entries to CSV format
  - Includes all fields (decks, battlefields, scores, notes, etc.)
  - Use for backup or analysis in spreadsheet software
  
- **CSV Import**:
  - Bulk import entries from CSV
  - Comprehensive validation before import
  - Detailed error reporting
  - Supports all entry fields

### ♿ Accessibility
- Keyboard navigation support
- Skip to main content link
- Semantic HTML structure
- ARIA labels and roles
- Focus management
- WCAG 2.1 compliance

### 🔧 Error Handling
- Global error boundary
- Custom 404 page
- Loading states with skeleton UI
- User-friendly error messages
- Graceful error recovery

### 🧪 Testing
- Comprehensive E2E test suite with Playwright
- Automated accessibility testing with axe-core
- Tests for all critical user flows
- Cross-browser testing (Chromium, Firefox, WebKit)

---

## 🏗️ Technical Stack

- **Frontend**: Next.js 15 + React 18 + TypeScript
- **Database**: Prisma ORM with SQLite (beta) / PostgreSQL (production)
- **Styling**: Tailwind CSS v4
- **Testing**: Playwright + axe-core
- **Deployment**: Vercel-ready

---

## 📚 Documentation

- **[README.md](./README.md)**: Project overview and setup instructions
- **[BETA_GUIDE.md](./BETA_GUIDE.md)**: Comprehensive guide for beta testers
- **[V2_BACKLOG.md](./V2_BACKLOG.md)**: Planned features for version 2
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Deployment guide for production

---

## ⚠️ Known Limitations (Beta)

This is a beta release with some limitations:

- **Database**: Using SQLite (will migrate to PostgreSQL for production)
- **Authentication**: No user accounts yet (single-user mode)
- **Backup**: No automatic backup/restore functionality
- **Mobile**: Limited mobile optimization
- **Offline**: No offline support yet
- **Performance**: Analytics calculated client-side (may be slow with 1000+ entries)

These limitations will be addressed in Version 2.

---

## 🗺️ Completed Milestones

- ✅ **M0**: Project Setup - Repository, environments, Prisma/Supabase CLI
- ✅ **M1**: Core Schema & RLS - Database tables, enums, seed data
- ✅ **M2**: Add Entry Flow - Entry form with validations
- ✅ **M3**: Analytics v1 - Win rates, matchup analysis, battlefield splits
- ✅ **M4**: Matchup Notebook - Notes log UI with search and pin
- ✅ **M5**: Exports & Imports - CSV export/import with validation
- ✅ **M6**: Hardening & A11y - Error handling, accessibility, E2E tests
- ✅ **M7**: Beta Cut & Feedback - User feedback and v2 backlog

---

## 🚀 Getting Started

### For Beta Testers

1. **Access the Application**
   - Navigate to the deployed URL (or run locally)
   - No login required in beta

2. **Read the Beta Guide**
   - See [BETA_GUIDE.md](./BETA_GUIDE.md) for detailed instructions
   - Learn how to create projects, track matches, and use analytics

3. **Provide Feedback**
   - Visit `/feedback` in the app
   - Report issues on [GitHub](https://github.com/rexkater/TCG-Stats-Tracker/issues)
   - Email: rex.reyes@upr.edu

### For Developers

1. **Clone the Repository**
   ```bash
   git clone https://github.com/rexkater/TCG-Stats-Tracker.git
   cd TCG-Stats-Tracker
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

---

## 💬 Feedback & Support

We're actively seeking feedback from beta testers!

### How to Provide Feedback

- **Feedback Page**: Visit `/feedback` in the app
- **GitHub Issues**: https://github.com/rexkater/TCG-Stats-Tracker/issues
- **Email**: rex.reyes@upr.edu

### What We're Looking For

- 🐛 Bugs or unexpected behavior
- 🤔 Confusing UI or unclear workflows
- 💡 Feature requests
- 🐌 Performance issues
- ♿ Accessibility concerns
- 📊 Data accuracy issues

---

## 🔮 What's Next (Version 2)

Based on the initial specification and anticipated feedback, Version 2 will include:

### High Priority
- User authentication and multi-user support
- Cloud database migration (PostgreSQL/Supabase)
- Automatic backups and data export
- Mobile optimization and PWA
- Offline support

### Medium Priority
- Advanced analytics with trends and visualizations
- Deck builder integration
- Tournament mode
- Enhanced search and filtering
- Social features (friends, leaderboards)

### Low Priority
- Predictive analytics
- API and integrations
- Custom themes
- Community features

See [V2_BACKLOG.md](./V2_BACKLOG.md) for the complete roadmap.

---

## 🙏 Acknowledgments

Thank you to all beta testers for your time and feedback. Your input will directly shape the future of TCG Stats Tracker!

---

## 📄 License

ISC

---

## 📞 Contact

- **Developer**: Rex J. Reyes
- **Email**: rex.reyes@upr.edu
- **GitHub**: https://github.com/rexkater/TCG-Stats-Tracker

---

*Happy tracking! 🎮📊*

