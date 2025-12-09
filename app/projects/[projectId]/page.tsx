import { prisma } from '@/lib/prisma';
import type { Entry, Category, ContextOption } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { calculateProjectAnalytics, formatWinRate, formatRecord, type EntryWithRelations } from '@/lib/analytics';
import BattlefieldAnalytics from '@/components/BattlefieldAnalytics';
import DeckBattlefieldPairAnalytics from '@/components/DeckBattlefieldPairAnalytics';
import MatchupAnalysisTabs from '@/components/MatchupAnalysisTabs';
import DeleteButton from '@/components/DeleteButton';
import { getDeckImagePath } from '@/lib/deck-images';
import RenameProject from '@/components/RenameProject';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

type EntryWithRelationsLocal = Entry & {
  category: Category;
  myBattlefield: ContextOption | null;
  oppBattlefield: ContextOption | null;
};

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  // Check authentication
  const session = await auth();
  if (!session?.user?.username) {
    redirect('/auth/signin');
  }

  // Get the user
  const user = await prisma.user.findUnique({
    where: { username: session.user.username },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  // Optimized query: Only fetch fields we actually use and check ownership
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      owners: {
        some: {
          id: user.id
        }
      }
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      tcg: {
        select: {
          id: true,
          name: true,
          settingsJson: true
        }
      },
      decks: {
        where: { active: true },
        select: {
          id: true,
          name: true
        },
        orderBy: { name: 'asc' }
      },
      categories: {
        where: { active: true },
        select: {
          id: true,
          name: true
        },
        orderBy: { name: 'asc' }
      },
      entries: {
        select: {
          id: true,
          myDeckName: true,
          oppDeckName: true,
          result: true,
          initiative: true,
          wonDiceRoll: true,
          notesShort: true,
          gameNumber: true,
          seriesId: true,
          createdAt: true,
          categoryId: true,
          myBattlefieldId: true,
          oppBattlefieldId: true,
          category: {
            select: {
              id: true,
              name: true
            }
          },
          myBattlefield: {
            select: {
              id: true,
              name: true
            }
          },
          oppBattlefield: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 100 // Limit to most recent 100 entries for performance
      }
    }
  });

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-primary-700 mb-2">Project not found</h1>
        <Link href="/projects" className="text-accent-600 hover:text-accent-700">
          Back to projects
        </Link>
      </div>
    );
  }

  const tcgSettings = JSON.parse(project.tcg.settingsJson);

  // Get total entry count (for display purposes)
  const totalEntriesCount = await prisma.entry.count({
    where: { projectId }
  });

  // Calculate usage stats
  const totalDecks = project.decks.length;
  const totalCategories = project.categories.length;
  const totalEntries = project.entries.length;
  const showingLimitedEntries = totalEntriesCount > 100;

  // Count unique decks used in entries (only myDeck)
  const usedDeckNames = new Set<string>();
  project.entries.forEach((entry: EntryWithRelationsLocal) => {
    usedDeckNames.add(entry.myDeckName);
  });
  const decksUsed = usedDeckNames.size;

  // Count unique categories used in entries
  const usedCategoryIds = new Set(project.entries.map((e: EntryWithRelationsLocal) => e.categoryId));
  const categoriesUsed = usedCategoryIds.size;

  // Calculate analytics
  const analytics = project.entries.length > 0
    ? calculateProjectAnalytics(project.entries as EntryWithRelations[])
    : null;

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <Link href="/projects" className="text-sm text-accent-600 hover:text-accent-700 mb-2 inline-block touch-manipulation">
            ← Back to projects
          </Link>
          <RenameProject projectId={project.id} currentName={project.name} />
          <p className="text-gray-600 mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background-200 text-primary-700">
              {project.tcg.name}
            </span>
            <span className="text-sm text-gray-500">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>
        {/* Mobile: Stack buttons vertically, Desktop: Horizontal */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 lg:gap-3">
          <DeleteButton
            itemId={project.id}
            itemType="project"
            itemName={project.name}
            redirectTo="/projects"
            className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium touch-manipulation min-h-[44px] flex items-center justify-center"
          />
          <Link
            href={`/projects/${project.id}/notes`}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center touch-manipulation min-h-[44px] flex items-center justify-center"
          >
            📝 Notes
          </Link>
          <Link
            href={`/projects/${project.id}/export`}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center touch-manipulation min-h-[44px] flex items-center justify-center"
          >
            📥 Export CSV
          </Link>
          <Link
            href={`/projects/${project.id}/import`}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center touch-manipulation min-h-[44px] flex items-center justify-center"
          >
            📤 Import CSV
          </Link>
          <Link
            href={`/projects/${project.id}/entries/new`}
            className="px-4 py-2.5 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium text-center touch-manipulation min-h-[44px] flex items-center justify-center sm:col-span-2 lg:col-span-1"
          >
            + New Entry
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Total Entries</div>
          <div className="text-3xl font-bold text-gray-900">{totalEntries}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Decks Used</div>
          <div className="text-3xl font-bold text-gray-900">
            {decksUsed}<span className="text-lg text-gray-500">/{totalDecks}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Categories Used</div>
          <div className="text-3xl font-bold text-gray-900">
            {categoriesUsed}<span className="text-lg text-gray-500">/{totalCategories}</span>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      {analytics && (
        <>
          {/* Overall Win Rate */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Win Rate</div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatWinRate(analytics.overall.winRate)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatWinRate(analytics.overall.winRateExcludingDraws)} excl. draws
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Record</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatRecord(analytics.overall)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {analytics.overall.wins}W {analytics.overall.losses}L {analytics.overall.draws}D
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Going First</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatWinRate(analytics.byInitiative.first.winRate)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatRecord(analytics.byInitiative.first)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Going Second</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatWinRate(analytics.byInitiative.second.winRate)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatRecord(analytics.byInitiative.second)}
                </div>
              </div>
            </div>
          </div>

          {/* Deck Performance */}
          {analytics.byDeck.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Deck Performance</h2>
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
                    {analytics.byDeck.map((deck) => (
                      <tr key={deck.deckName} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            {/* Only show images for Riftbound TCG */}
                            {project.tcg.name === 'Riftbound' && (
                              <Image
                                src={getDeckImagePath(deck.deckName)}
                                alt={deck.deckName}
                                width={40}
                                height={56}
                                className="rounded shadow-sm"
                                unoptimized
                              />
                            )}
                            <span>{deck.deckName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatRecord(deck)}
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
                          {deck.totalGames}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Matchup Analysis - Tabbed by Initiative */}
          {analytics.byMatchup.length > 0 && (
            <MatchupAnalysisTabs matchups={analytics.byMatchup} />
          )}

          {/* Context Performance Analytics (Tabbed) - Shows categories for all TCGs, context for Riftbound */}
          {analytics.byCategory.length > 0 && (
            <BattlefieldAnalytics
              contextLabel={tcgSettings.contextLabel}
              byContext={analytics.byContext}
              byContextMatchup={analytics.byContextMatchup}
              byCategory={analytics.byCategory}
            />
          )}

          {/* Deck-Specific Battlefield Pair Matchups (Riftbound only) */}
          {tcgSettings.contextLabel && analytics.byDeckBattlefieldPair.length > 0 && (
            <DeckBattlefieldPairAnalytics
              contextLabel={tcgSettings.contextLabel}
              byDeckBattlefieldPair={analytics.byDeckBattlefieldPair}
            />
          )}
        </>
      )}

      {/* Recent Entries */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Entries</h2>
            {showingLimitedEntries && (
              <span className="text-sm text-gray-500">
                Showing 100 of {totalEntriesCount} entries
              </span>
            )}
          </div>
        </div>
        {project.entries.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 mb-4">No entries yet</p>
            <Link
              href={`/projects/${project.id}/entries/new`}
              className="text-accent-600 hover:text-accent-700 font-medium"
            >
              Add your first entry
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    My Deck
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opponent Deck
                  </th>
                  {tcgSettings.contextLabel && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        My {tcgSettings.contextLabel}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Opp {tcgSettings.contextLabel}
                      </th>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Initiative
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  {/* Only show Game column for best of 3 games */}
                  {tcgSettings.bestOfFormat !== 1 && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Game
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {project.entries.map((entry: EntryWithRelationsLocal) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        entry.result === 'WIN' ? 'bg-green-100 text-green-800' :
                        entry.result === 'LOSS' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.myDeckName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.oppDeckName}
                    </td>
                    {tcgSettings.contextLabel && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entry.myBattlefield?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entry.oppBattlefield?.name || '-'}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {entry.initiative === 'FIRST' ? '1st' : '2nd'}
                      {entry.wonDiceRoll !== null && (
                        <span className="ml-1 text-xs" title={entry.wonDiceRoll ? 'Won dice roll' : 'Lost dice roll'}>
                          {entry.wonDiceRoll ? '🎲✓' : '🎲✗'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {entry.category.name}
                    </td>
                    {/* Only show Game column for best of 3 games */}
                    {tcgSettings.bestOfFormat !== 1 && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entry.gameNumber ? `G${entry.gameNumber}` : '-'}
                        {entry.seriesId && (
                          <span className="text-xs text-gray-400 ml-1">({entry.seriesId})</span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {entry.notesShort || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/projects/${project.id}/entries/${entry.id}/edit`}
                          className="text-accent-600 hover:text-accent-700 font-medium"
                        >
                          ✏️ Edit
                        </Link>
                        <DeleteButton
                          itemId={entry.id}
                          itemType="entry"
                          itemName={`${entry.myDeckName} vs ${entry.oppDeckName}`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
