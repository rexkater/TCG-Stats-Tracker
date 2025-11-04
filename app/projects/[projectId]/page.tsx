import { prisma } from '@/lib/prisma';
import type { Entry, Deck, Category, ContextOption } from '@prisma/client';
import Link from 'next/link';

type EntryWithRelations = Entry & {
  myDeck: Deck;
  oppDeck: Deck;
  category: Category;
  contextOption: ContextOption | null;
};

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tcg: true,
      decks: {
        where: { active: true },
        include: { images: true },
        orderBy: { name: 'asc' }
      },
      categories: {
        where: { active: true },
        orderBy: { name: 'asc' }
      },
      entries: {
        include: {
          myDeck: true,
          oppDeck: true,
          category: true,
          contextOption: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }
    }
  });

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h1>
        <Link href="/projects" className="text-blue-600 hover:text-blue-700">
          Back to projects
        </Link>
      </div>
    );
  }

  const tcgSettings = JSON.parse(project.tcg.settingsJson);

  // Calculate usage stats
  const totalDecks = project.decks.length;
  const totalCategories = project.categories.length;
  const totalEntries = project.entries.length;

  // Count unique decks used in entries (only myDeck)
  const usedDeckIds = new Set<string>();
  project.entries.forEach((entry: EntryWithRelations) => {
    usedDeckIds.add(entry.myDeckId);
  });
  const decksUsed = usedDeckIds.size;

  // Count unique categories used in entries
  const usedCategoryIds = new Set(project.entries.map((e: EntryWithRelations) => e.categoryId));
  const categoriesUsed = usedCategoryIds.size;

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
            ← Back to projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {project.tcg.name}
            </span>
          </p>
        </div>
        <Link
          href={`/projects/${project.id}/entries/new`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + New Entry
        </Link>
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

      {/* Recent Entries */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Entries</h2>
        </div>
        {project.entries.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 mb-4">No entries yet</p>
            <Link
              href={`/projects/${project.id}/entries/new`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first entry
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    My Deck
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opponent Deck
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Initiative
                  </th>
                  {tcgSettings.contextLabel && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tcgSettings.contextLabel}
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {project.entries.map((entry: EntryWithRelations) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
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
                      {entry.myDeck.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.oppDeck.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {entry.initiative === 'FIRST' ? '1st' : '2nd'}
                    </td>
                    {tcgSettings.contextLabel && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entry.contextOption?.name || '-'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {entry.category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {entry.myScore !== null && entry.oppScore !== null
                        ? `${entry.myScore} - ${entry.oppScore}`
                        : '-'
                      }
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
