import { prisma } from './prisma';
import type { Entry } from '@prisma/client';

const MIN_GAMES_THRESHOLD = 10;

export type GlobalDeckStats = {
  deckName: string;
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winRate: number;
};

export type GlobalMatchupStats = {
  myDeck: string;
  oppDeck: string;
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winRate: number;
};

export type GlobalBattlefieldStats = {
  battlefieldName: string;
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winRate: number;
};

export type GlobalCategoryStats = {
  categoryName: string;
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winRate: number;
};

export type GlobalTrendData = {
  date: string;
  deckName: string;
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winRate: number;
};

export type GlobalAnalytics = {
  totalGames: number;
  totalProjects: number;
  totalUsers: number;
  deckStats: GlobalDeckStats[];
  matchupStats: GlobalMatchupStats[];
  battlefieldStats: GlobalBattlefieldStats[];
  categoryStats: GlobalCategoryStats[];
  trendData: GlobalTrendData[];
  mostPlayedDecks: { deckName: string; count: number }[];
};

type EntryWithRelations = {
  id: string;
  myDeckName: string;
  oppDeckName: string;
  result: string;
  createdAt: Date;
  category: { name: string } | null;
  myBattlefield: { name: string } | null;
  oppBattlefield: { name: string } | null;
};

/**
 * Calculate global analytics for a specific TCG
 */
export async function calculateGlobalAnalytics(tcgId: string): Promise<GlobalAnalytics> {
  // Get all entries for this TCG
  const entries = await prisma.entry.findMany({
    where: {
      project: {
        tcgId,
      },
    },
    include: {
      project: {
        include: {
          tcg: true,
        },
      },
      category: true,
      myBattlefield: true,
      oppBattlefield: true,
    },
  }) as unknown as EntryWithRelations[];

  // Get total projects and users for this TCG
  const totalProjects = await prisma.project.count({
    where: { tcgId },
  });

  const uniqueUserIds = await prisma.project.findMany({
    where: { tcgId },
    select: {
      owners: {
        select: { id: true },
      },
    },
  });

  const totalUsers = new Set(
    uniqueUserIds.flatMap((p: { owners: { id: string }[] }) => p.owners.map((o) => o.id))
  ).size;

  const totalGames = entries.length;

  // Calculate deck stats
  const deckStatsMap = new Map<string, { wins: number; losses: number; draws: number }>();
  
  entries.forEach((entry) => {
    const deckName = entry.myDeckName;
    if (!deckStatsMap.has(deckName)) {
      deckStatsMap.set(deckName, { wins: 0, losses: 0, draws: 0 });
    }
    const stats = deckStatsMap.get(deckName)!;
    
    if (entry.result === 'win') stats.wins++;
    else if (entry.result === 'loss') stats.losses++;
    else if (entry.result === 'draw') stats.draws++;
  });

  const deckStats: GlobalDeckStats[] = Array.from(deckStatsMap.entries())
    .map(([deckName, stats]) => {
      const total = stats.wins + stats.losses + stats.draws;
      return {
        deckName,
        ...stats,
        total,
        winRate: total > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0,
      };
    })
    .filter((stat) => stat.total >= MIN_GAMES_THRESHOLD)
    .sort((a, b) => b.winRate - a.winRate);

  // Calculate matchup stats
  const matchupStatsMap = new Map<string, { wins: number; losses: number; draws: number }>();
  
  entries.forEach((entry) => {
    const key = `${entry.myDeckName}|${entry.oppDeckName}`;
    if (!matchupStatsMap.has(key)) {
      matchupStatsMap.set(key, { wins: 0, losses: 0, draws: 0 });
    }
    const stats = matchupStatsMap.get(key)!;
    
    if (entry.result === 'win') stats.wins++;
    else if (entry.result === 'loss') stats.losses++;
    else if (entry.result === 'draw') stats.draws++;
  });

  const matchupStats: GlobalMatchupStats[] = Array.from(matchupStatsMap.entries())
    .map(([key, stats]) => {
      const parts = key.split('|');
      const myDeck = parts[0] || '';
      const oppDeck = parts[1] || '';
      const total = stats.wins + stats.losses + stats.draws;
      return {
        myDeck,
        oppDeck,
        ...stats,
        total,
        winRate: total > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0,
      };
    })
    .filter((stat) => stat.total >= MIN_GAMES_THRESHOLD)
    .sort((a, b) => b.total - a.total);

  // Calculate battlefield stats
  const battlefieldStatsMap = new Map<string, { wins: number; losses: number; draws: number }>();

  entries.forEach((entry) => {
    if (entry.myBattlefield) {
      const battlefieldName = entry.myBattlefield.name;
      if (!battlefieldStatsMap.has(battlefieldName)) {
        battlefieldStatsMap.set(battlefieldName, { wins: 0, losses: 0, draws: 0 });
      }
      const stats = battlefieldStatsMap.get(battlefieldName)!;

      if (entry.result === 'win') stats.wins++;
      else if (entry.result === 'loss') stats.losses++;
      else if (entry.result === 'draw') stats.draws++;
    }
  });

  const battlefieldStats: GlobalBattlefieldStats[] = Array.from(battlefieldStatsMap.entries())
    .map(([battlefieldName, stats]) => {
      const total = stats.wins + stats.losses + stats.draws;
      return {
        battlefieldName,
        ...stats,
        total,
        winRate: total > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0,
      };
    })
    .filter((stat) => stat.total >= MIN_GAMES_THRESHOLD)
    .sort((a, b) => b.total - a.total);

  // Calculate category stats
  const categoryStatsMap = new Map<string, { wins: number; losses: number; draws: number }>();

  entries.forEach((entry) => {
    if (entry.category) {
      const categoryName = entry.category.name;
      if (!categoryStatsMap.has(categoryName)) {
        categoryStatsMap.set(categoryName, { wins: 0, losses: 0, draws: 0 });
      }
      const stats = categoryStatsMap.get(categoryName)!;

      if (entry.result === 'win') stats.wins++;
      else if (entry.result === 'loss') stats.losses++;
      else if (entry.result === 'draw') stats.draws++;
    }
  });

  const categoryStats: GlobalCategoryStats[] = Array.from(categoryStatsMap.entries())
    .map(([categoryName, stats]) => {
      const total = stats.wins + stats.losses + stats.draws;
      return {
        categoryName,
        ...stats,
        total,
        winRate: total > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0,
      };
    })
    .filter((stat) => stat.total >= MIN_GAMES_THRESHOLD)
    .sort((a, b) => b.total - a.total);

  // Calculate most played decks
  const deckPlayCount = new Map<string, number>();
  entries.forEach((entry) => {
    const count = deckPlayCount.get(entry.myDeckName) || 0;
    deckPlayCount.set(entry.myDeckName, count + 1);
  });

  const mostPlayedDecks = Array.from(deckPlayCount.entries())
    .map(([deckName, count]) => ({ deckName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculate trend data (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentEntries = entries.filter((entry) => entry.createdAt >= thirtyDaysAgo);

  const trendDataMap = new Map<string, Map<string, { wins: number; losses: number; draws: number }>>();

  recentEntries.forEach((entry) => {
    const dateParts = entry.createdAt.toISOString().split('T');
    const dateKey = dateParts[0] || '';
    const deckName = entry.myDeckName;

    if (!dateKey) return;

    if (!trendDataMap.has(dateKey)) {
      trendDataMap.set(dateKey, new Map());
    }

    const dayMap = trendDataMap.get(dateKey)!;
    if (!dayMap.has(deckName)) {
      dayMap.set(deckName, { wins: 0, losses: 0, draws: 0 });
    }

    const stats = dayMap.get(deckName)!;
    if (entry.result === 'win') stats.wins++;
    else if (entry.result === 'loss') stats.losses++;
    else if (entry.result === 'draw') stats.draws++;
  });

  const trendData: GlobalTrendData[] = [];
  trendDataMap.forEach((dayMap, date) => {
    dayMap.forEach((stats, deckName) => {
      const total = stats.wins + stats.losses + stats.draws;
      trendData.push({
        date,
        deckName,
        ...stats,
        total,
        winRate: total > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0,
      });
    });
  });

  return {
    totalGames,
    totalProjects,
    totalUsers,
    deckStats,
    matchupStats,
    battlefieldStats,
    categoryStats,
    trendData: trendData.sort((a, b) => a.date.localeCompare(b.date)),
    mostPlayedDecks,
  };
}

