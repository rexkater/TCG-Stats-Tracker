import type { Entry, Category, ContextOption, MatchResult, Initiative } from '@prisma/client';

// ============================================================================
// Type Definitions
// ============================================================================

export interface EntryWithRelations extends Entry {
  category: Category;
  myBattlefield: ContextOption | null;
  oppBattlefield: ContextOption | null;
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
  myDeckName: string;
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

export interface ContextMatchupStats extends WinRateStats {
  myContextId: string | null;
  myContextName: string | null;
  oppContextId: string | null;
  oppContextName: string | null;
}

export interface DeckStats extends WinRateStats {
  deckName: string;
  totalGames: number;
}

export interface CategoryStats extends WinRateStats {
  categoryId: string;
  categoryName: string;
}

export interface DeckBattlefieldPairStats extends WinRateStats {
  oppDeckName: string;
  myContextId: string | null;
  myContextName: string | null;
  oppContextId: string | null;
  oppContextName: string | null;
}

export interface ProjectAnalytics {
  overall: WinRateStats;
  byMatchup: MatchupStats[];
  byInitiative: InitiativeStats;
  byContext: ContextStats[];
  byContextMatchup: ContextMatchupStats[];
  byDeck: DeckStats[];
  byCategory: CategoryStats[];
  byDeckBattlefieldPair: DeckBattlefieldPairStats[];
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
  // Group entries by matchup (myDeckName + oppDeckName)
  const matchupMap = new Map<string, EntryWithRelations[]>();

  entries.forEach(entry => {
    const key = `${entry.myDeckName}:${entry.oppDeckName}`;
    if (!matchupMap.has(key)) {
      matchupMap.set(key, []);
    }
    matchupMap.get(key)!.push(entry);
  });

  // Calculate stats for each matchup
  const matchupStats: MatchupStats[] = [];

  matchupMap.forEach((matchupEntries, key) => {
    const parts = key.split(':');
    const myDeckName = parts[0] as string;
    const oppDeckName = parts[1] as string;

    const stats = calculateWinRate(matchupEntries);

    matchupStats.push({
      ...stats,
      myDeckName,
      oppDeckName,
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
 * Counts both when you use a battlefield AND when opponent uses it
 */
export function calculateContextStats(entries: EntryWithRelations[]): ContextStats[] {
  // Map to track all entries where a battlefield appears (either side)
  const contextMap = new Map<string | null, EntryWithRelations[]>();

  entries.forEach(entry => {
    // Add entry for my battlefield
    const myKey = entry.myBattlefieldId;
    if (!contextMap.has(myKey)) {
      contextMap.set(myKey, []);
    }
    contextMap.get(myKey)!.push(entry);

    // Add entry for opponent's battlefield (if different from mine)
    const oppKey = entry.oppBattlefieldId;
    if (oppKey !== myKey) {
      if (!contextMap.has(oppKey)) {
        contextMap.set(oppKey, []);
      }
      contextMap.get(oppKey)!.push(entry);
    }
  });

  // Calculate stats for each context
  const contextStats: ContextStats[] = [];

  contextMap.forEach((contextEntries, contextOptionId) => {
    const stats = calculateWinRate(contextEntries);

    // Find the battlefield name from any entry that has this battlefield
    let contextOptionName: string | null = null;
    for (const entry of contextEntries) {
      if (entry.myBattlefieldId === contextOptionId && entry.myBattlefield) {
        contextOptionName = entry.myBattlefield.name;
        break;
      }
      if (entry.oppBattlefieldId === contextOptionId && entry.oppBattlefield) {
        contextOptionName = entry.oppBattlefield.name;
        break;
      }
    }

    contextStats.push({
      ...stats,
      contextOptionId,
      contextOptionName,
    });
  });

  // Sort by total games
  return contextStats.sort((a, b) => b.total - a.total);
}

/**
 * Calculate battlefield matchup statistics (combinations of my battlefield vs opponent's battlefield)
 */
export function calculateContextMatchupStats(entries: EntryWithRelations[]): ContextMatchupStats[] {
  // Group entries by battlefield matchup (my battlefield + opponent's battlefield)
  const matchupMap = new Map<string, EntryWithRelations[]>();

  entries.forEach(entry => {
    const myId = entry.myBattlefieldId ?? 'null';
    const oppId = entry.oppBattlefieldId ?? 'null';
    const key = `${myId}|${oppId}`;

    if (!matchupMap.has(key)) {
      matchupMap.set(key, []);
    }
    matchupMap.get(key)!.push(entry);
  });

  // Calculate stats for each matchup
  const matchupStats: ContextMatchupStats[] = [];

  matchupMap.forEach((matchupEntries, key) => {
    const firstEntry = matchupEntries[0];
    if (!firstEntry) return;

    const stats = calculateWinRate(matchupEntries);

    matchupStats.push({
      ...stats,
      myContextId: firstEntry.myBattlefieldId,
      myContextName: firstEntry.myBattlefield?.name ?? null,
      oppContextId: firstEntry.oppBattlefieldId,
      oppContextName: firstEntry.oppBattlefield?.name ?? null,
    });
  });

  // Sort by total games
  return matchupStats.sort((a, b) => b.total - a.total);
}

/**
 * Calculate deck-based statistics (performance with each deck)
 */
export function calculateDeckStats(entries: EntryWithRelations[]): DeckStats[] {
  // Group entries by myDeckName (only count games where we played this deck)
  const deckMap = new Map<string, EntryWithRelations[]>();

  entries.forEach(entry => {
    const key = entry.myDeckName;
    if (!deckMap.has(key)) {
      deckMap.set(key, []);
    }
    deckMap.get(key)!.push(entry);
  });

  // Calculate stats for each deck
  const deckStats: DeckStats[] = [];

  deckMap.forEach((deckEntries, deckName) => {
    const stats = calculateWinRate(deckEntries);

    deckStats.push({
      ...stats,
      deckName,
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
 * Calculate deck-specific battlefield pair matchup statistics
 * Shows win rate against opponent decks with specific battlefield pairs
 */
export function calculateDeckBattlefieldPairStats(entries: EntryWithRelations[]): DeckBattlefieldPairStats[] {
  // Group entries by opponent deck + battlefield pair combination
  const matchupMap = new Map<string, EntryWithRelations[]>();

  entries.forEach(entry => {
    const myBfId = entry.myBattlefieldId ?? 'null';
    const oppBfId = entry.oppBattlefieldId ?? 'null';
    const key = `${entry.oppDeckName}|${myBfId}|${oppBfId}`;

    if (!matchupMap.has(key)) {
      matchupMap.set(key, []);
    }
    matchupMap.get(key)!.push(entry);
  });

  // Calculate stats for each matchup
  const matchupStats: DeckBattlefieldPairStats[] = [];

  matchupMap.forEach((matchupEntries, key) => {
    const firstEntry = matchupEntries[0];
    if (!firstEntry) return;

    const stats = calculateWinRate(matchupEntries);

    matchupStats.push({
      ...stats,
      oppDeckName: firstEntry.oppDeckName,
      myContextId: firstEntry.myBattlefieldId,
      myContextName: firstEntry.myBattlefield?.name ?? null,
      oppContextId: firstEntry.oppBattlefieldId,
      oppContextName: firstEntry.oppBattlefield?.name ?? null,
    });
  });

  // Sort by total games
  return matchupStats.sort((a, b) => b.total - a.total);
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
    byContextMatchup: calculateContextMatchupStats(entries),
    byDeck: calculateDeckStats(entries),
    byCategory: calculateCategoryStats(entries),
    byDeckBattlefieldPair: calculateDeckBattlefieldPairStats(entries),
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

