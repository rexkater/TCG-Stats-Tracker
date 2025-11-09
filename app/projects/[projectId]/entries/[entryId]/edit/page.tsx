import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import EntryForm from '@/components/EntryForm';

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

export default async function EditEntry({ params }: { params: Promise<{ projectId: string; entryId: string }> }) {
  const { projectId, entryId } = await params;

  // Optimized query: Only fetch fields needed for editing
  const entry = await prisma.entry.findUnique({
    where: { id: entryId },
    select: {
      id: true,
      projectId: true,
      myDeckName: true,
      oppDeckName: true,
      result: true,
      initiative: true,
      wonDiceRoll: true,
      notesShort: true,
      gameNumber: true,
      seriesId: true,
      categoryId: true,
      myBattlefieldId: true,
      oppBattlefieldId: true
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

  // Optimized query: Only fetch fields needed for the form
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      tcg: {
        select: {
          id: true,
          name: true,
          settingsJson: true,
          contextOptions: {
            where: { active: true },
            select: {
              id: true,
              name: true
            },
            orderBy: { name: 'asc' }
          }
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

      <EntryForm
        projectId={projectId}
        decks={project.decks}
        categories={project.categories}
        contextOptions={project.tcg.contextOptions}
        contextLabel={tcgSettings.contextLabel}
        mode="edit"
        entryId={entryId}
        defaultValues={{
          myDeckName: entry.myDeckName,
          oppDeckName: entry.oppDeckName,
          categoryId: entry.categoryId,
          myBattlefieldId: entry.myBattlefieldId,
          oppBattlefieldId: entry.oppBattlefieldId,
          result: entry.result,
          initiative: entry.initiative,
          wonDiceRoll: entry.wonDiceRoll,
          notesShort: entry.notesShort,
          gameNumber: entry.gameNumber,
          seriesId: entry.seriesId,
        }}
      />
    </main>
  );
}
