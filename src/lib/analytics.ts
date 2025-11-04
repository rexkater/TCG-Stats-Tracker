import type { Entry, Deck, Category, ContextOption, MatchResult, Initiative } from '@prisma/client';

// ============================================================================
// Type Definitions
// ============================================================================

export interface EntryWithRelations extends Entry {
  myDeck: Deck;
  oppDeck: Deck;
  category: Category;
  contextOption: ContextOption | null;
}

export interface WinRateStats {
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winRate: number; // Percentage (0-100)
  winRateExcludingDraws: number; // Percentage (0-100)
}

export interface MatchupStats extends WinRateStats {
  myDeckId: string;
  myDeckName: string;
  oppDeckId: string;
  oppDeckName: string;
  entries: EntryWithRelations[];
}

export interface InitiativeStats {
  first: WinRateStats;
  second: WinRateStats;
}

export interface ContextStats extends WinRateStats {
  contextOptionId: string | null;
  contextOptionName: string | null;
}

export interface DeckStats extends WinRateStats {
  deckId: string;
  deckName: string;
  totalGames: number;
}

export interface CategoryStats extends WinRateStats {
  categoryId: string;
  categoryName: string;
}

export interface ProjectAnalytics {
  overall: WinRateStats;
  byMatchup: MatchupStats[];
  byInitiative: InitiativeStats;
  byContext: ContextStats[];
  byDeck: DeckStats[];
  byCategory: CategoryStats[];
}

// ============================================================================
// Calculation Utilities
// ============================================================================

/**
 * Calculate win rate statistics from a set of entries
 */
export function calculateWinRate(entries: EntryWithRelations[]): WinRateStats {
  const wins = entries.filter(e => e.result === 'WIN').length;
  const losses = entries.filter(e => e.result === 'LOSS').length;
  const draws = entries.filter(e => e.result === 'DRAW').length;
  const total = entries.length;

  const winRate = total > 0 ? (wins / total) * 100 : 0;
  const gamesExcludingDraws = wins + losses;
  const winRateExcludingDraws = gamesExcludingDraws > 0 ? (wins / gamesExcludingDraws) * 100 : 0;

  return {
    wins,
    losses,
    draws,
    total,
    winRate,
    winRateExcludingDraws,
  };
}

/**
 * Calculate matchup-specific statistics (myDeck vs oppDeck)
 */
export function calculateMatchupStats(entries: EntryWithRelations[]): MatchupStats[] {
  // Group entries by matchup (myDeckId + oppDeckId)
  const matchupMap = new Map<string, EntryWithRelations[]>();

  entries.forEach(entry => {
    const key = `${entry.myDeckId}:${entry.oppDeckId}`;
    if (!matchupMap.has(key)) {
      matchupMap.set(key, []);
    }
    matchupMap.get(key)!.push(entry);
  });

  // Calculate stats for each matchup
  const matchupStats: MatchupStats[] = [];

  matchupMap.forEach((matchupEntries, key) => {
    const parts = key.split(':');
    const myDeckId = parts[0] as string;
    const oppDeckId = parts[1] as string;
    const firstEntry = matchupEntries[0];

    if (!firstEntry) return; // Skip if no entries (shouldn't happen)

    const stats = calculateWinRate(matchupEntries);

    matchupStats.push({
      ...stats,
      myDeckId,
      myDeckName: firstEntry.myDeck.name,
      oppDeckId,
      oppDeckName: firstEntry.oppDeck.name,
      entries: matchupEntries,
    });
  });

  // Sort by total games (most played matchups first)
  return matchupStats.sort((a, b) => b.total - a.total);
}

/**
 * Calculate initiative-based statistics (First vs Second)
 */
export function calculateInitiativeStats(entries: EntryWithRelations[]): InitiativeStats {
  const firstEntries = entries.filter(e => e.initiative === 'FIRST');
  const secondEntries = entries.filter(e => e.initiative === 'SECOND');

  return {
    first: calculateWinRate(firstEntries),
    second: calculateWinRate(secondEntries),
  };
}

/**
 * Calculate context-based statistics (e.g., battlefield performance)
 */
export function calculateContextStats(entries: EntryWithRelations[]): ContextStats[] {
  // Group entries by context option
  const contextMap = new Map<string | null, EntryWithRelations[]>();

  entries.forEach(entry => {
    const key = entry.contextOptionId;
    if (!contextMap.has(key)) {
      contextMap.set(key, []);
    }
    contextMap.get(key)!.push(entry);
  });

  // Calculate stats for each context
  const contextStats: ContextStats[] = [];

  contextMap.forEach((contextEntries, contextOptionId) => {
    const firstEntry = contextEntries[0];
    if (!firstEntry) return; // Skip if no entries (shouldn't happen)

    const stats = calculateWinRate(contextEntries);

    contextStats.push({
      ...stats,
      contextOptionId,
      contextOptionName: firstEntry.contextOption?.name ?? null,
    });
  });

  // Sort by total games
  return contextStats.sort((a, b) => b.total - a.total);
}

/**
 * Calculate deck-based statistics (performance with each deck)
 */
export function calculateDeckStats(entries: EntryWithRelations[]): DeckStats[] {
  // Group entries by myDeck (only count games where we played this deck)
  const deckMap = new Map<string, EntryWithRelations[]>();

  entries.forEach(entry => {
    const key = entry.myDeckId;
    if (!deckMap.has(key)) {
      deckMap.set(key, []);
    }
    deckMap.get(key)!.push(entry);
  });

  // Calculate stats for each deck
  const deckStats: DeckStats[] = [];

  deckMap.forEach((deckEntries, deckId) => {
    const firstEntry = deckEntries[0];
    if (!firstEntry) return; // Skip if no entries (shouldn't happen)

    const stats = calculateWinRate(deckEntries);

    deckStats.push({
      ...stats,
      deckId,
      deckName: firstEntry.myDeck.name,
      totalGames: stats.total,
    });
  });

  // Sort by total games
  return deckStats.sort((a, b) => b.totalGames - a.totalGames);
}

/**
 * Calculate category-based statistics
 */
export function calculateCategoryStats(entries: EntryWithRelations[]): CategoryStats[] {
  // Group entries by category
  const categoryMap = new Map<string, EntryWithRelations[]>();

  entries.forEach(entry => {
    const key = entry.categoryId;
    if (!categoryMap.has(key)) {
      categoryMap.set(key, []);
    }
    categoryMap.get(key)!.push(entry);
  });

  // Calculate stats for each category
  const categoryStats: CategoryStats[] = [];

  categoryMap.forEach((categoryEntries, categoryId) => {
    const firstEntry = categoryEntries[0];
    if (!firstEntry) return; // Skip if no entries (shouldn't happen)

    const stats = calculateWinRate(categoryEntries);

    categoryStats.push({
      ...stats,
      categoryId,
      categoryName: firstEntry.category.name,
    });
  });

  // Sort by total games
  return categoryStats.sort((a, b) => b.total - a.total);
}

/**
 * Calculate all analytics for a project
 */
export function calculateProjectAnalytics(entries: EntryWithRelations[]): ProjectAnalytics {
  return {
    overall: calculateWinRate(entries),
    byMatchup: calculateMatchupStats(entries),
    byInitiative: calculateInitiativeStats(entries),
    byContext: calculateContextStats(entries),
    byDeck: calculateDeckStats(entries),
    byCategory: calculateCategoryStats(entries),
  };
}

/**
 * Format win rate as percentage string
 */
export function formatWinRate(winRate: number, decimals: number = 1): string {
  return `${winRate.toFixed(decimals)}%`;
}

/**
 * Format record as "W-L-D"
 */
export function formatRecord(stats: WinRateStats): string {
  return `${stats.wins}-${stats.losses}-${stats.draws}`;
}

