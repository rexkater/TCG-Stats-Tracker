import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { Deck } from '@prisma/client';
import { createNote } from '../actions';

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function NewNotePage({ params }: PageProps) {
  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tcg: true,
      decks: {
        where: { active: true },
        orderBy: { name: 'asc' }
      }
    }
  });

  if (!project) {
    return (
      <main className="space-y-6">
        <div className="text-center py-12">
          <p className="text-primary-600">Project not found</p>
        </div>
      </main>
    );
  }

  // Get the first user (for MVP, we'll use the first user as the author)
  const user = await prisma.user.findFirst();

  if (!user) {
    return (
      <main className="space-y-6">
        <div className="text-center py-12">
          <p className="text-primary-600">No user found. Please run seed script.</p>
        </div>
      </main>
    );
  }

  const createNoteWithData = createNote.bind(null, projectId, project.tcg.id, user.id);

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="mb-4">
        <Link
          href={`/projects/${projectId}/notes`}
          className="text-accent-500 hover:text-accent-600 font-medium inline-flex items-center gap-1"
        >
          ← Back to Notes
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-primary-900">New Matchup Note</h1>

      {/* Form */}
      <form action={createNoteWithData} className="bg-background-200 rounded-lg border border-background-400 p-6 space-y-6">
        {/* Deck A */}
        <div>
          <label className="block text-sm font-medium text-primary-800 mb-2">
            Deck A <span className="text-red-500">*</span>
          </label>
          <select
            name="deckAId"
            required
            className="w-full px-3 py-2 border border-background-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Deck A...</option>
            {project.decks.map((deck: Deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>
        </div>

        {/* Deck B */}
        <div>
          <label className="block text-sm font-medium text-primary-800 mb-2">
            Deck B <span className="text-red-500">*</span>
          </label>
          <select
            name="deckBId"
            required
            className="w-full px-3 py-2 border border-background-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Deck B...</option>
            {project.decks.map((deck: Deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-primary-800 mb-2">
            Notes <span className="text-red-500">*</span>
          </label>
          <textarea
            name="contentMarkdown"
            required
            rows={10}
            placeholder="Enter your matchup notes here...

You can include:
- Key strategies
- Mulligan guides
- Important cards to watch for
- Win conditions
- Common mistakes to avoid"
            className="w-full px-3 py-2 border border-background-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          />
        </div>

        {/* Pinned */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="pinned"
            id="pinned"
            className="w-4 h-4 text-accent-500 border-background-400 rounded focus:ring-blue-500"
          />
          <label htmlFor="pinned" className="text-sm font-medium text-primary-800">
            📌 Pin this note to the top
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-secondary-300 text-white rounded-lg hover:bg-secondary-400 transition-colors font-medium"
          >
            Save Note
          </button>
          <Link
            href={`/projects/${projectId}/notes`}
            className="px-6 py-2 bg-background-200 text-primary-800 rounded-lg hover:bg-background-300 transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

