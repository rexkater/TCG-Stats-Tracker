# TCG Stats Tracker - Version 2 Backlog

This document outlines planned features and improvements for Version 2 of TCG Stats Tracker, based on the initial specification and anticipated user feedback from the beta.

## 🎯 High Priority Features

### 1. User Authentication & Multi-User Support
**Status**: Planned  
**Priority**: High  
**Description**: Implement user authentication system to support multiple users

**Features:**
- User registration and login
- Secure password handling
- User profile management
- Per-user data isolation
- Session management

**Technical Approach:**
- NextAuth.js for authentication
- Supabase Auth integration
- Row-level security (RLS) policies in PostgreSQL

---

### 2. Cloud Database Migration
**Status**: Planned  
**Priority**: High  
**Description**: Migrate from SQLite to PostgreSQL/Supabase for production

**Benefits:**
- Better scalability
- Multi-user support
- Cloud backups
- Better performance with large datasets
- Real-time features

**Migration Plan:**
1. Set up Supabase project
2. Migrate schema to PostgreSQL
3. Implement RLS policies
4. Update Prisma configuration
5. Data migration tool for existing users

---

### 3. Automatic Backups & Data Export
**Status**: Planned  
**Priority**: High  
**Description**: Automated backup system and enhanced export options

**Features:**
- Automatic daily backups to cloud storage
- Manual backup/restore functionality
- Export to multiple formats (CSV, JSON, Excel)
- Import from other stat tracking tools
- Data migration between accounts

---

### 4. Mobile Optimization & PWA
**Status**: Planned  
**Priority**: High  
**Description**: Optimize for mobile devices and create Progressive Web App

**Features:**
- Responsive design improvements
- Touch-friendly UI
- Mobile-optimized forms
- PWA installation support
- Offline functionality
- Push notifications for reminders

---

## 📊 Analytics & Insights

### 5. Advanced Analytics Dashboard
**Status**: Planned  
**Priority**: Medium  
**Description**: Enhanced analytics with trends and visualizations

**Features:**
- Win rate trends over time (line charts)
- Performance by time period (daily, weekly, monthly)
- Meta analysis (most played decks, popular battlefields)
- Streak tracking (win/loss streaks)
- Performance by time of day
- Matchup difficulty ratings
- Statistical significance indicators

**Visualizations:**
- Interactive charts (Chart.js or Recharts)
- Heat maps for matchup matrices
- Trend lines and moving averages
- Comparative analysis (deck A vs deck B over time)

---

### 6. Predictive Analytics
**Status**: Planned  
**Priority**: Low  
**Description**: AI-powered predictions and recommendations

**Features:**
- Matchup win probability predictions
- Deck recommendation based on meta
- Optimal battlefield selection suggestions
- Mulligan strategy recommendations
- Performance forecasting

---

## 🎮 Gameplay Features

### 7. Deck Builder Integration
**Status**: Planned  
**Priority**: Medium  
**Description**: Integrated deck building and management

**Features:**
- Full deck list management (not just legend selection)
- Card database integration
- Deck archetype tagging
- Deck versioning (track changes over time)
- Import from popular deck sites
- Share decks with community

---

### 8. Tournament Mode
**Status**: Planned  
**Priority**: Medium  
**Description**: Dedicated tournament tracking and management

**Features:**
- Tournament bracket creation
- Swiss pairing support
- Round tracking
- Tournament standings
- Prize tracking
- Tournament reports and summaries
- Export tournament results

---

### 9. Match Timer & Live Tracking
**Status**: Planned  
**Priority**: Low  
**Description**: Real-time match tracking during gameplay

**Features:**
- Match timer
- Turn counter
- Live score tracking
- Quick entry mode (minimal taps during match)
- Post-match review and editing
- Voice input for hands-free tracking

---

## 👥 Social Features

### 10. Friend System & Leaderboards
**Status**: Planned  
**Priority**: Medium  
**Description**: Social features to connect with other players

**Features:**
- Add friends
- Compare stats with friends
- Private leaderboards
- Challenge friends
- Share match results
- Activity feed

---

### 11. Community Features
**Status**: Planned  
**Priority**: Low  
**Description**: Community-driven content and sharing

**Features:**
- Public deck sharing
- Matchup guide sharing
- Community meta reports
- Strategy discussions
- Upvote/downvote system
- User profiles and achievements

---

## 🔧 Technical Improvements

### 12. Performance Optimization
**Status**: Planned  
**Priority**: High  
**Description**: Optimize for large datasets and better performance

**Improvements:**
- Server-side analytics calculations
- Database query optimization
- Pagination for large entry lists
- Lazy loading and code splitting
- Caching strategies
- Background job processing

---

### 13. Offline Support
**Status**: Planned  
**Priority**: Medium  
**Description**: Full offline functionality with sync

**Features:**
- Offline data storage (IndexedDB)
- Queue entries when offline
- Automatic sync when online
- Conflict resolution
- Offline analytics (cached data)

---

### 14. API & Integrations
**Status**: Planned  
**Priority**: Low  
**Description**: Public API and third-party integrations

**Features:**
- REST API for external tools
- Webhook support
- Discord bot integration
- Twitch integration for streamers
- Import from tournament platforms
- Export to streaming overlays

---

## 🎨 UX/UI Improvements

### 15. Customization & Themes
**Status**: Planned  
**Priority**: Low  
**Description**: User customization options

**Features:**
- Dark mode
- Custom color themes
- Customizable dashboard layout
- Widget system
- Font size adjustments
- Accessibility preferences

---

### 16. Enhanced Search & Filtering
**Status**: Planned  
**Priority**: Medium  
**Description**: Advanced search and filtering capabilities

**Features:**
- Advanced filters (date range, multiple decks, etc.)
- Saved filter presets
- Full-text search across all data
- Tag system for entries
- Smart search suggestions
- Filter by multiple criteria simultaneously

---

### 17. Bulk Operations
**Status**: Planned  
**Priority**: Low  
**Description**: Bulk editing and management tools

**Features:**
- Bulk edit entries
- Bulk delete with filters
- Bulk tag application
- Batch import improvements
- Undo/redo functionality

---

## 📱 Multi-TCG Support

### 18. Enhanced TCG Support
**Status**: Planned  
**Priority**: Medium  
**Description**: Better support for multiple TCGs

**Features:**
- TCG-specific templates
- Custom field definitions per TCG
- TCG card database integrations
- Format support (Standard, Modern, etc.)
- Rotation tracking
- Ban list integration

**Supported TCGs (Planned):**
- Riftbound (current)
- Magic: The Gathering
- Pokémon TCG
- Yu-Gi-Oh!
- Flesh and Blood
- Custom TCG support

---

## 🔐 Security & Privacy

### 19. Enhanced Security
**Status**: Planned  
**Priority**: High  
**Description**: Security improvements and privacy features

**Features:**
- Two-factor authentication (2FA)
- Email verification
- Password reset flow
- Account recovery
- Privacy settings (public/private profiles)
- Data encryption at rest
- GDPR compliance tools
- Data deletion requests

---

## 📚 Documentation & Help

### 20. In-App Help & Tutorials
**Status**: Planned  
**Priority**: Medium  
**Description**: Comprehensive help system

**Features:**
- Interactive tutorials
- Tooltips and contextual help
- Video guides
- FAQ section
- Keyboard shortcuts guide
- Changelog and release notes
- Feature announcements

---

## 🧪 Beta Feedback Integration

**Note**: This backlog will be updated based on beta user feedback. Priority and features may change based on:
- Most requested features
- Critical bugs or usability issues
- Technical feasibility
- Development time estimates
- User engagement metrics

---

## 📅 Tentative Roadmap

### Phase 1 (Q1 2026)
- User authentication
- Cloud database migration
- Mobile optimization
- Performance improvements

### Phase 2 (Q2 2026)
- Advanced analytics
- Deck builder integration
- Enhanced search & filtering
- Automatic backups

### Phase 3 (Q3 2026)
- Tournament mode
- Social features
- Offline support
- API development

### Phase 4 (Q4 2026)
- Multi-TCG enhancements
- Community features
- Predictive analytics
- Custom themes

---

## 💡 How to Contribute Ideas

Have an idea for V2? We'd love to hear it!

- **GitHub Discussions**: https://github.com/rexkater/TCG-Stats-Tracker/discussions
- **Feature Requests**: https://github.com/rexkater/TCG-Stats-Tracker/issues
- **Email**: rex.reyes@upr.edu

---

*Last Updated: 2025-11-05*  
*This is a living document and will be updated based on user feedback and development progress.*

