import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { MatchResult, Initiative } from '@prisma/client';
import type { Deck, Category, ContextOption } from '@prisma/client';
import Link from 'next/link';

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

export default async function NewEntry({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tcg: {
        include: {
          contextOptions: {
            where: { active: true },
            orderBy: { name: 'asc' }
          }
        }
      },
      decks: {
        where: { active: true },
        orderBy: { name: 'asc' }
      },
      categories: {
        where: { active: true },
        orderBy: { name: 'asc' }
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

  async function createEntry(formData: FormData) {
    "use server";

    const myDeckId = formData.get("myDeckId") as string;
    const oppDeckId = formData.get("oppDeckId") as string;
    const categoryId = formData.get("categoryId") as string;
    const myBattlefieldId = formData.get("myBattlefieldId") as string;
    const oppBattlefieldId = formData.get("oppBattlefieldId") as string;
    const result = formData.get("result") as MatchResult;
    const initiative = formData.get("initiative") as Initiative;
    const notesShort = formData.get("notesShort") as string;
    const myScoreStr = formData.get("myScore") as string;
    const oppScoreStr = formData.get("oppScore") as string;
    const gameNumberStr = formData.get("gameNumber") as string;
    const seriesId = formData.get("seriesId") as string;

    // Validation
    if (!myDeckId || !oppDeckId || !categoryId || !result || !initiative) {
      throw new Error("Missing required fields");
    }

    if (tcgSettings.contextRequired && (!myBattlefieldId || !oppBattlefieldId)) {
      throw new Error(`Both battlefields are required for ${project.tcg.name}`);
    }

    await prisma.entry.create({
      data: {
        projectId,
        myDeckId,
        oppDeckId,
        categoryId,
        myBattlefieldId: myBattlefieldId || null,
        oppBattlefieldId: oppBattlefieldId || null,
        result,
        initiative,
        notesShort: notesShort || null,
        myScore: myScoreStr ? Number(myScoreStr) : null,
        oppScore: oppScoreStr ? Number(oppScoreStr) : null,
        gameNumber: gameNumberStr ? Number(gameNumberStr) : null,
        seriesId: seriesId || null,
      }
    });

    redirect(`/projects/${projectId}`);
  }

  return (
    <main className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/projects/${projectId}`}
          className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block"
        >
          ← Back to project
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">New Entry</h1>
        <p className="text-gray-600 mt-1">
          Record a match for <span className="font-medium">{project.name}</span>
        </p>
      </div>

      {/* Form */}
      <form className="bg-white rounded-lg border border-gray-200 p-6 space-y-6" action={createEntry}>
        {/* Decks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              My Deck <span className="text-red-500">*</span>
            </label>
            <select
              name="myDeckId"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a deck...</option>
              {project.decks.map((deck: Deck) => (
                <option key={deck.id} value={deck.id}>{deck.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opponent Deck <span className="text-red-500">*</span>
            </label>
            <select
              name="oppDeckId"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a deck...</option>
              {project.decks.map((deck: Deck) => (
                <option key={deck.id} value={deck.id}>{deck.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category...</option>
            {project.categories.map((category: Category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        {/* Dual Battlefields */}
        {tcgSettings.contextLabel && project.tcg.contextOptions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                My {tcgSettings.contextLabel}
                {tcgSettings.contextRequired && <span className="text-red-500"> *</span>}
              </label>
              <select
                name="myBattlefieldId"
                required={tcgSettings.contextRequired}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">
                  {tcgSettings.contextRequired ? 'Select...' : '(none)'}
                </option>
                {project.tcg.contextOptions.map((option: ContextOption) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opponent {tcgSettings.contextLabel}
                {tcgSettings.contextRequired && <span className="text-red-500"> *</span>}
              </label>
              <select
                name="oppBattlefieldId"
                required={tcgSettings.contextRequired}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">
                  {tcgSettings.contextRequired ? 'Select...' : '(none)'}
                </option>
                {project.tcg.contextOptions.map((option: ContextOption) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Result and Initiative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Result <span className="text-red-500">*</span>
            </label>
            <select
              name="result"
              required
              defaultValue="WIN"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="WIN">Win</option>
              <option value="LOSS">Loss</option>
              {tcgSettings.allowDraws && <option value="DRAW">Draw</option>}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initiative <span className="text-red-500">*</span>
            </label>
            <select
              name="initiative"
              required
              defaultValue="FIRST"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="FIRST">First (went first)</option>
              <option value="SECOND">Second (went second)</option>
            </select>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              My Score
            </label>
            <input
              name="myScore"
              type="number"
              step="0.1"
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opponent Score
            </label>
            <input
              name="oppScore"
              type="number"
              step="0.1"
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Best-of-3 Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game Number
            </label>
            <select
              name="gameNumber"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Single game (not part of series)</option>
              <option value="1">Game 1</option>
              <option value="2">Game 2</option>
              <option value="3">Game 3</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              For best-of-3 matches, select which game this was
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Series ID
            </label>
            <input
              name="seriesId"
              type="text"
              placeholder="Optional (e.g., 'match-1')"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Group games from the same match together
            </p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Notes
          </label>
          <textarea
            name="notesShort"
            rows={3}
            placeholder="Optional quick notes about this match..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Entry
          </button>
          <Link
            href={`/projects/${projectId}`}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
