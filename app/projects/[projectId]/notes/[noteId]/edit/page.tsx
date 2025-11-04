import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Deck } from '@prisma/client';

type PageProps = {
  params: Promise<{ projectId: string; noteId: string }>;
};

export default async function EditNotePage({ params }: PageProps) {
  const { projectId, noteId } = await params;

  const [project, note] = await Promise.all([
    prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tcg: true,
        decks: {
          where: { active: true },
          orderBy: { name: 'asc' }
        }
      }
    }),
    prisma.matchupNotesLog.findUnique({
      where: { id: noteId },
      include: {
        deckA: true,
        deckB: true
      }
    })
  ]);

  if (!project || !note) {
    return (
      <main className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Project or note not found</p>
        </div>
      </main>
    );
  }

  async function updateNote(formData: FormData) {
    'use server';

    const deckAId = formData.get('deckAId') as string;
    const deckBId = formData.get('deckBId') as string;
    const contentMarkdown = formData.get('contentMarkdown') as string;
    const pinned = formData.get('pinned') === 'on';

    if (!deckAId || !deckBId || !contentMarkdown) {
      throw new Error('Missing required fields');
    }

    if (deckAId === deckBId) {
      throw new Error('Deck A and Deck B must be different');
    }

    await prisma.matchupNotesLog.update({
      where: { id: noteId },
      data: {
        deckAId,
        deckBId,
        contentMarkdown,
        pinned
      }
    });

    redirect(`/projects/${projectId}/notes`);
  }

  async function togglePin() {
    'use server';

    await prisma.matchupNotesLog.update({
      where: { id: noteId },
      data: {
        pinned: !note.pinned
      }
    });

    redirect(`/projects/${projectId}/notes`);
  }

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="mb-4">
        <Link
          href={`/projects/${projectId}/notes`}
          className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
        >
          ← Back to Notes
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Edit Matchup Note</h1>
        <form action={togglePin}>
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors font-medium"
          >
            {note.pinned ? '📌 Unpin' : '📌 Pin'}
          </button>
        </form>
      </div>

      {/* Form */}
      <form action={updateNote} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Deck A */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deck A <span className="text-red-500">*</span>
          </label>
          <select
            name="deckAId"
            required
            defaultValue={note.deckAId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deck B <span className="text-red-500">*</span>
          </label>
          <select
            name="deckBId"
            required
            defaultValue={note.deckBId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes <span className="text-red-500">*</span>
          </label>
          <textarea
            name="contentMarkdown"
            required
            rows={10}
            defaultValue={note.contentMarkdown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          />
        </div>

        {/* Pinned */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="pinned"
            id="pinned"
            defaultChecked={note.pinned}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="pinned" className="text-sm font-medium text-gray-700">
            📌 Pin this note to the top
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Update Note
          </button>
          <Link
            href={`/projects/${projectId}/notes`}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

