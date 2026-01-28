import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { MatchupNotesLog, Deck, User } from '@prisma/client';

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

type NoteWithRelations = MatchupNotesLog & {
  deckA: Deck;
  deckB: Deck;
  author: User;
};

type PageProps = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ search?: string }>;
};

export default async function MatchupNotesPage({ params, searchParams }: PageProps) {
  const { projectId } = await params;
  const { search } = await searchParams;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tcg: true
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

  // Fetch all matchup notes for this project
  let notes = await prisma.matchupNotesLog.findMany({
    where: {
      projectId
    },
    include: {
      deckA: true,
      deckB: true,
      author: true
    },
    orderBy: [
      { pinned: 'desc' },
      { updatedAt: 'desc' }
    ]
  });

  // Filter by search if provided
  if (search && search.trim()) {
    const searchLower = search.toLowerCase();
    notes = notes.filter((note: NoteWithRelations) => 
      note.contentMarkdown.toLowerCase().includes(searchLower) ||
      note.deckA.name.toLowerCase().includes(searchLower) ||
      note.deckB.name.toLowerCase().includes(searchLower)
    );
  }

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="mb-4">
        <Link
          href={`/projects/${projectId}`}
          className="text-accent-500 hover:text-accent-600 font-medium inline-flex items-center gap-1"
        >
          ← Back to {project.name}
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-900">Matchup Notes</h1>
        <Link
          href={`/projects/${projectId}/notes/new`}
          className="px-4 py-2 bg-secondary-300 text-white rounded-lg hover:bg-secondary-400 transition-colors font-medium"
        >
          New Note
        </Link>
      </div>

      {/* Search */}
      <form method="GET" className="bg-background-200 rounded-lg border border-background-400 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            name="search"
            defaultValue={search || ''}
            placeholder="Search notes by content or deck names..."
            className="flex-1 px-3 py-2 border border-background-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-background-200 text-primary-800 rounded-lg hover:bg-background-300 transition-colors font-medium"
          >
            Search
          </button>
          {search && (
            <Link
              href={`/projects/${projectId}/notes`}
              className="px-4 py-2 bg-background-200 text-primary-800 rounded-lg hover:bg-background-300 transition-colors font-medium"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="bg-background-200 rounded-lg border border-background-400 px-6 py-12 text-center">
          <p className="text-primary-600 mb-4">
            {search ? 'No notes found matching your search' : 'No matchup notes yet'}
          </p>
          {!search && (
            <Link
              href={`/projects/${projectId}/notes/new`}
              className="text-accent-500 hover:text-accent-600 font-medium"
            >
              Create your first note
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note: NoteWithRelations) => (
            <div
              key={note.id}
              className={`bg-background-200 rounded-lg border ${
                note.pinned ? 'border-yellow-400 shadow-md' : 'border-background-400'
              } p-6`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {note.pinned && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      📌 Pinned
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-primary-900">
                    {note.deckA.name} vs {note.deckB.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/projects/${projectId}/notes/${note.id}/edit`}
                    className="text-sm text-accent-500 hover:text-accent-600 font-medium"
                  >
                    Edit
                  </Link>
                  <form action={`/projects/${projectId}/notes/${note.id}/delete`} method="POST">
                    <button
                      type="submit"
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-sm max-w-none mb-4">
                <pre className="whitespace-pre-wrap font-sans text-primary-800">
                  {note.contentMarkdown}
                </pre>
              </div>

              {/* Footer */}
              <div className="text-xs text-primary-600">
                <span>
                  Updated {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

