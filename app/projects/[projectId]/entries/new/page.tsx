import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import EntryForm from '@/components/EntryForm';

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

export default async function NewEntry({
  params,
  searchParams
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ copyLast?: string }>;
}) {
  const { projectId } = await params;
  const { copyLast } = await searchParams;

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
        <h1 className="text-2xl font-bold text-primary-900 mb-2">Project not found</h1>
        <Link href="/projects" className="text-accent-500 hover:text-accent-600">
          Back to projects
        </Link>
      </div>
    );
  }

  // Fetch the last entry if copyLast is true
  let defaultValues = undefined;
  if (copyLast === 'true') {
    const lastEntry = await prisma.entry.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      select: {
        myDeckName: true,
        oppDeckName: true,
        categoryId: true,
        seriesId: true,
      }
    });

    if (lastEntry) {
      defaultValues = {
        myDeckName: lastEntry.myDeckName,
        oppDeckName: lastEntry.oppDeckName,
        categoryId: lastEntry.categoryId,
        myBattlefieldId: null,
        oppBattlefieldId: null,
        result: '',
        initiative: '',
        wonDiceRoll: null,
        notesShort: null,
        gameNumber: null,
        seriesId: lastEntry.seriesId,
      };
    }
  }

  const tcgSettings = JSON.parse(project.tcg.settingsJson);

  return (
    <main className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/projects/${projectId}`}
          className="text-sm text-accent-500 hover:text-accent-600 mb-2 inline-block"
        >
          ← Back to project
        </Link>
        <h1 className="text-3xl font-bold text-primary-900">New Entry</h1>
        <p className="text-primary-700 mt-1">
          Record a match for <span className="font-medium">{project.name}</span>
          {copyLast === 'true' && defaultValues && (
            <span className="ml-2 text-sm text-accent-500">
              (Copied from last entry)
            </span>
          )}
        </p>
      </div>

      <EntryForm
        projectId={projectId}
        decks={project.decks}
        categories={project.categories}
        contextOptions={project.tcg.contextOptions}
        contextLabel={tcgSettings.contextLabel}
        tcgName={project.tcg.name}
        bestOfFormat={tcgSettings.bestOfFormat || 3}
        allowDraws={tcgSettings.allowDraws || false}
        mode="create"
        {...(defaultValues && { defaultValues })}
      />
    </main>
  );
}
