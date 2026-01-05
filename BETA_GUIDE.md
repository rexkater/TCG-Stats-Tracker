# TCG Stats Tracker - Beta Testing Guide

Welcome to the TCG Stats Tracker beta! This guide will help you get started and make the most of the application.

## 🎯 What is TCG Stats Tracker?

TCG Stats Tracker is a web application designed to help Trading Card Game players track their match statistics, analyze performance, and improve their gameplay. Currently optimized for **Riftbound**, but designed to support any TCG.

## 🚀 Getting Started

### 1. Access the Application
- Navigate to the application URL (local: http://localhost:3005)
- No login required in beta (single-user mode)

### 2. Create Your First Project
1. Click "Projects" from the home page
2. Click "New Project" button
3. Fill in project details:
   - **Name**: e.g., "Ranked Season 1"
   - **TCG**: Select "Riftbound" (or your TCG)
   - **Description**: Optional notes about the project
4. Click "Create Project"

### 3. Set Up Decks and Categories
Before tracking matches, you'll need to add decks and categories:

**Add Decks:**
1. On your project page, scroll to "Decks"
2. Click "Add Deck"
3. Select a legend (e.g., "Ahri", "Yasuo")
4. Decks are automatically marked as active

**Add Categories:**
1. Scroll to "Categories" section
2. Click "Add Category"
3. Enter a category name (e.g., "Ranked", "Casual", "Tournament")
4. Categories help you organize different types of matches

### 4. Record Your First Match
1. Click "➕ New Entry" button
2. Fill in match details:
   - **My Deck**: Your deck/legend
   - **Opponent Deck**: Opponent's deck/legend
   - **Category**: Match type (Ranked, Casual, etc.)
   - **Initiative**: Who went first (FIRST or SECOND)
   - **My Battlefield**: Your battlefield choice
   - **Opponent Battlefield**: Opponent's battlefield choice
   - **Result**: WIN, LOSS, or DRAW
   - **Scores**: Optional match scores
   - **Game Number**: For best-of-3 series (1, 2, or 3)
   - **Series ID**: Group games from the same match (e.g., "match-1")
   - **Notes**: Quick observations about the match
3. Click "Save Entry"

## 📊 Understanding Analytics

The project page displays comprehensive analytics:

### Overall Statistics
- **Total Entries**: Number of matches recorded
- **Overall Win Rate**: Your win percentage across all matches
- **Win Rate (Excl. Draws)**: Win rate excluding draws

### Matchup Analysis
- Shows performance against each opponent deck
- Win/Loss/Draw counts
- Win rate percentages
- Color-coded: Green (≥60%), Yellow (40-60%), Red (<40%)

### Deck Performance
- Performance statistics for each of your decks
- Helps identify your strongest decks

### Battlefield Performance
- Win rates on different battlefields
- Helps identify favorable battlefield choices

## 📝 Matchup Notes

Track strategic notes for specific matchups:

1. Click "📝 Notes" button on project page
2. Click "New Note" to create a note
3. Select Deck A and Deck B (the matchup)
4. Write your notes (supports markdown-style formatting)
5. Optionally pin important notes
6. Use search to find specific notes

**Tips:**
- Pin your most important matchup notes
- Use notes to track mulligan strategies, key plays, and win conditions
- Search by deck names or note content

## 📥 Export & Import

### Export Data
1. Click "📥 Export CSV" on project page
2. Downloads a CSV file with all your entries
3. Use for backup or analysis in spreadsheet software

### Import Data
1. Click "📤 Import CSV" on project page
2. Upload a CSV file (must match the required format)
3. The system validates all data before importing
4. Review any errors and fix them in your CSV

**CSV Format Requirements:**
- Required columns: My Deck, Opponent Deck, Category, Initiative, Result
- Optional columns: My Battlefield, Opponent Battlefield, My Score, Opponent Score, Game Number, Series ID, Notes
- Deck names, categories, and battlefields must exist in your project
- Initiative must be "FIRST" or "SECOND"
- Result must be "WIN", "LOSS", or "DRAW"

## 🧪 Beta Features & Limitations

### What's Working
✅ Project and entry management  
✅ Comprehensive analytics  
✅ Matchup notes with search and pinning  
✅ CSV export and import  
✅ Dual battlefield tracking  
✅ Best-of-3 series tracking  
✅ Error handling and loading states  
✅ Accessibility features (keyboard navigation, skip links)  

### Known Limitations
⚠️ **Database**: Using SQLite (will migrate to PostgreSQL for production)  
⚠️ **Authentication**: No user accounts yet (single-user mode)  
⚠️ **Backup**: No automatic backup/restore functionality  
⚠️ **Mobile**: Limited mobile optimization  
⚠️ **Offline**: No offline support  
⚠️ **Performance**: Analytics calculated client-side (may be slow with 1000+ entries)  

### Planned for V2
🔮 User authentication and multi-user support  
🔮 Cloud database (PostgreSQL/Supabase)  
🔮 Automatic backups  
🔮 Mobile app or PWA  
🔮 Offline support  
🔮 Advanced analytics (trends over time, meta analysis)  
🔮 Deck builder integration  
🔮 Tournament mode  
🔮 Social features (share stats, compare with friends)  

## 💬 Providing Feedback

Your feedback is crucial! Please report:
- 🐛 Bugs or unexpected behavior
- 🤔 Confusing UI or workflows
- 💡 Feature requests
- 🐌 Performance issues
- ♿ Accessibility concerns
- 📊 Data accuracy issues

**How to Report:**
- **GitHub Issues**: https://github.com/rexkater/TCG-Stats-Tracker/issues
- **Email**: rex.reyes.rodriguez@gmail.com
- **Feedback Page**: Click "Provide Feedback" on the home page

**Include in Your Report:**
- What you were trying to do
- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser and OS
- Screenshots (if applicable)

## 🔧 Troubleshooting

### Issue: Page won't load or shows error
- **Solution**: Refresh the page, or click "Try again" on error page

### Issue: Can't create entry - "Deck not found"
- **Solution**: Make sure you've added the deck to your project first

### Issue: Analytics seem wrong
- **Solution**: Check that all entries have correct data. Export to CSV to review.

### Issue: Import fails with validation errors
- **Solution**: Review the error messages and ensure your CSV matches the required format

### Issue: Can't find a note
- **Solution**: Use the search box on the notes page to filter by deck names or content

## 📚 Tips for Best Results

1. **Consistent Data Entry**: Record matches immediately after playing for accuracy
2. **Use Categories**: Organize matches by type (Ranked, Casual, Tournament)
3. **Track Series**: Use Game Number and Series ID for best-of-3 matches
4. **Take Notes**: Document key strategies and observations in matchup notes
5. **Regular Exports**: Export your data regularly as a backup
6. **Review Analytics**: Check your stats regularly to identify patterns and improve

## 🙏 Thank You!

Thank you for participating in the beta! Your feedback will directly shape the future of TCG Stats Tracker.

Happy tracking! 🎮📊

