import { prisma } from '@/lib/prisma';
import type { Project, TCG } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { getDeckImagePath } from '@/lib/deck-images';
import { formatWinRate, formatRecord } from '@/lib/analytics';

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

type ProjectEntry = {
  id: string;
  myDeckName: string;
  oppDeckName: string;
  categoryId: string;
  result: string;
  createdAt: Date;
};

type ProjectWithData = Project & {
  tcg: TCG;
  decks: { id: string }[];
  categories: { id: string }[];
  entries: ProjectEntry[];
};

type ProjectWithStats = ProjectWithData & {
  stats: {
    totalEntries: number;
    decksUsed: number;
    totalDecks: number;
    categoriesUsed: number;
    totalCategories: number;
    lastUpdated: Date;
  };
};

export default async function Projects() {
  const projects = await prisma.project.findMany({
    include: {
      tcg: true,
      decks: {
        where: { active: true },
        select: { id: true }
      },
      categories: {
        where: { active: true },
        select: { id: true }
      },
      entries: {
        select: {
          id: true,
          myDeckName: true,
          oppDeckName: true,
          categoryId: true,
          result: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1 // Get most recent entry for last updated
      }
    },
    where: {
      archivedAt: null
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Get all entries for deck performance aggregation
  const allEntries = await prisma.entry.findMany({
    where: {
      project: {
        archivedAt: null
      }
    },
    select: {
      myDeckName: true,
      result: true
    }
  });

  // Calculate deck performance across all projects
  const deckPerformance = new Map<string, { wins: number; losses: number; draws: number; total: number }>();
  allEntries.forEach((entry: { myDeckName: string; result: string }) => {
    const stats = deckPerformance.get(entry.myDeckName) || { wins: 0, losses: 0, draws: 0, total: 0 };
    stats.total++;
    if (entry.result === 'WIN') stats.wins++;
    else if (entry.result === 'LOSS') stats.losses++;
    else if (entry.result === 'DRAW') stats.draws++;
    deckPerformance.set(entry.myDeckName, stats);
  });

  // Convert to array and calculate win rates
  const deckStats = Array.from(deckPerformance.entries())
    .map(([deckName, stats]) => ({
      deckName,
      ...stats,
      winRate: stats.total > 0 ? (stats.wins / stats.total) * 100 : 0
    }))
    .sort((a, b) => b.total - a.total);

  // Calculate usage stats for each project
  const projectsWithStats = projects.map((project: ProjectWithData) => {
    const totalDecks = project.decks.length;
    const totalCategories = project.categories.length;
    const totalEntries = project.entries.length;

    // Count unique decks used in entries (only myDeck)
    const usedDeckNames = new Set<string>();
    project.entries.forEach((entry: ProjectEntry) => {
      usedDeckNames.add(entry.myDeckName);
    });
    const decksUsed = usedDeckNames.size;

    // Count unique categories used in entries
    const usedCategoryIds = new Set(project.entries.map((e: ProjectEntry) => e.categoryId));
    const categoriesUsed = usedCategoryIds.size;

    // Get last updated date (most recent entry or creation date)
    const lastUpdated = project.entries.length > 0 && project.entries[0]
      ? project.entries[0].createdAt
      : project.createdAt;

    return {
      ...project,
      stats: {
        totalEntries,
        decksUsed,
        totalDecks,
        categoriesUsed,
        totalCategories,
        lastUpdated
      }
    };
  });

  // Sort by last updated (most recent first)
  projectsWithStats.sort((a: ProjectWithStats, b: ProjectWithStats) =>
    new Date(b.stats.lastUpdated).getTime() - new Date(a.stats.lastUpdated).getTime()
  );

  return (
    <main className="space-y-6">
      <div className="mb-4">
        <Link
          href="/"
          className="text-accent-600 hover:text-accent-700 font-medium inline-flex items-center gap-1 touch-manipulation"
        >
          ← Back to Home
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-700">Projects</h1>
        <Link
          href="/projects/new"
          className="w-full sm:w-auto px-4 py-2.5 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium text-center touch-manipulation min-h-[44px] flex items-center justify-center"
        >
          New Project
        </Link>
      </div>

      {/* Deck Performance Across All Projects */}
      {deckStats.length > 0 && (
        <div className="bg-white rounded-lg border border-primary-200">
          <div className="px-6 py-4 border-b border-primary-200">
            <h2 className="text-xl font-semibold text-primary-700">Deck Performance (All Projects)</h2>
          </div>
          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deck
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Win Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Games
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deckStats.map((deck) => (
                  <tr key={deck.deckName} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <Image
                          src={getDeckImagePath(deck.deckName)}
                          alt={deck.deckName}
                          width={40}
                          height={56}
                          className="rounded shadow-sm"
                        />
                        <span>{deck.deckName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deck.wins}-{deck.losses}-{deck.draws}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        deck.winRate >= 60 ? 'bg-green-100 text-green-800' :
                        deck.winRate >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {formatWinRate(deck.winRate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deck.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {projectsWithStats.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-primary-200">
          <p className="text-primary-500 mb-4">No projects yet</p>
          <Link
            href="/projects/new"
            className="text-accent-600 hover:text-accent-700 font-medium"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projectsWithStats.map((project: ProjectWithData & { stats: { totalEntries: number; decksUsed: number; totalDecks: number; categoriesUsed: number; totalCategories: number } }) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block bg-white rounded-lg border border-primary-200 p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-primary-700 mb-2">
                {project.name}
              </h2>
              <div className="text-sm text-primary-600 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background-200 text-primary-700">
                  {project.tcg.name}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-sm text-primary-500">
                <span>{project.stats.totalEntries} entries</span>
                <span>{project.stats.decksUsed}/{project.stats.totalDecks} decks used</span>
                <span>{project.stats.categoriesUsed}/{project.stats.totalCategories} categories used</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
