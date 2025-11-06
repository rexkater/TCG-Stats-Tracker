import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { MatchResult, Initiative } from '@prisma/client';
import type { Deck, Category, ContextOption } from '@prisma/client';
import Link from 'next/link';

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

export default async function EditEntry({ params }: { params: Promise<{ projectId: string; entryId: string }> }) {
  const { projectId, entryId } = await params;
  
  // Fetch the entry to edit
  const entry = await prisma.entry.findUnique({
    where: { id: entryId },
    include: {
      category: true,
      myBattlefield: true,
      oppBattlefield: true,
    }
  });

  if (!entry || entry.projectId !== projectId) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Entry not found</h1>
        <Link href={`/projects/${projectId}`} className="text-blue-600 hover:text-blue-700">
          Back to project
        </Link>
      </div>
    );
  }

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

  async function updateEntry(formData: FormData) {
    "use server";

    const myDeckName = formData.get("myDeckName") as string;
    const oppDeckName = formData.get("oppDeckName") as string;
    const categoryId = formData.get("categoryId") as string;
    const myBattlefieldId = formData.get("myBattlefieldId") as string;
    const oppBattlefieldId = formData.get("oppBattlefieldId") as string;
    const result = formData.get("result") as MatchResult;
    const initiative = formData.get("initiative") as Initiative;
    const wonDiceRoll = formData.get("wonDiceRoll") === "on";
    const notesShort = formData.get("notesShort") as string;
    const myScoreStr = formData.get("myScore") as string;
    const oppScoreStr = formData.get("oppScore") as string;
    const gameNumberStr = formData.get("gameNumber") as string;
    const seriesId = formData.get("seriesId") as string;

    // Validation
    if (!myDeckName || !oppDeckName || !categoryId || !result || !initiative) {
      throw new Error("Missing required fields");
    }

    await prisma.entry.update({
      where: { id: entryId },
      data: {
        myDeckName: myDeckName.trim(),
        oppDeckName: oppDeckName.trim(),
        categoryId,
        myBattlefieldId: myBattlefieldId || null,
        oppBattlefieldId: oppBattlefieldId || null,
        result,
        initiative,
        wonDiceRoll,
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Entry</h1>
        <p className="text-gray-600 mt-1">
          Update match details for <span className="font-medium">{project.name}</span>
        </p>
      </div>

      {/* Form */}
      <form className="bg-white rounded-lg border border-gray-200 p-6 space-y-6" action={updateEntry}>
        {/* Decks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              My Deck <span className="text-red-500">*</span>
            </label>
            {project.decks.length > 0 ? (
              <select
                name="myDeckName"
                required
                defaultValue={entry.myDeckName}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a deck...</option>
                {project.decks.map((deck: Deck) => (
                  <option key={deck.id} value={deck.name}>
                    {deck.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="myDeckName"
                required
                defaultValue={entry.myDeckName}
                placeholder="e.g., Control Deck, Aggro Build"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opponent Deck <span className="text-red-500">*</span>
            </label>
            {project.decks.length > 0 ? (
              <select
                name="oppDeckName"
                required
                defaultValue={entry.oppDeckName}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a deck...</option>
                {project.decks.map((deck: Deck) => (
                  <option key={deck.id} value={deck.name}>
                    {deck.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="oppDeckName"
                required
                defaultValue={entry.oppDeckName}
                placeholder="e.g., Midrange Deck, Combo Build"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        </div>

        {/* Battlefields (Context Options) */}
        {tcgSettings.contextLabel && project.tcg.contextOptions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                My {tcgSettings.contextLabel}
              </label>
              <select
                name="myBattlefieldId"
                defaultValue={entry.myBattlefieldId || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">None</option>
                {project.tcg.contextOptions.map((option: ContextOption) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opponent {tcgSettings.contextLabel}
              </label>
              <select
                name="oppBattlefieldId"
                defaultValue={entry.oppBattlefieldId || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">None</option>
                {project.tcg.contextOptions.map((option: ContextOption) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            required
            defaultValue={entry.categoryId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category...</option>
            {project.categories.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Result and Initiative */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Result <span className="text-red-500">*</span>
            </label>
            <select
              name="result"
              required
              defaultValue={entry.result}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              <option value="WIN">Win</option>
              <option value="LOSS">Loss</option>
              <option value="DRAW">Draw</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initiative <span className="text-red-500">*</span>
            </label>
            <select
              name="initiative"
              required
              defaultValue={entry.initiative}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              <option value="FIRST">First</option>
              <option value="SECOND">Second</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dice Roll
            </label>
            <div className="flex items-center h-10">
              <input
                type="checkbox"
                name="wonDiceRoll"
                defaultChecked={entry.wonDiceRoll || false}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Won pre-game dice roll
              </label>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              My Score
            </label>
            <input
              type="number"
              name="myScore"
              step="0.5"
              min="0"
              defaultValue={entry.myScore || ""}
              placeholder="e.g., 2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opponent Score
            </label>
            <input
              type="number"
              name="oppScore"
              step="0.5"
              min="0"
              defaultValue={entry.oppScore || ""}
              placeholder="e.g., 1"
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
            <input
              type="number"
              name="gameNumber"
              min="1"
              max="3"
              defaultValue={entry.gameNumber || ""}
              placeholder="1, 2, or 3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">For best-of-3 matches</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Series ID
            </label>
            <input
              type="text"
              name="seriesId"
              defaultValue={entry.seriesId || ""}
              placeholder="e.g., match-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Groups games in the same match</p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notesShort"
            rows={3}
            defaultValue={entry.notesShort || ""}
            placeholder="Quick notes about the match..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Link
            href={`/projects/${projectId}`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Entry
          </button>
        </div>
      </form>
    </main>
  );
}

