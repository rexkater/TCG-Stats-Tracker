import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import EntryForm from '@/components/EntryForm';

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

      <EntryForm
        projectId={projectId}
        decks={project.decks}
        categories={project.categories}
        contextOptions={project.tcg.contextOptions}
        contextLabel={tcgSettings.contextLabel}
        mode="create"
      />
    </main>
  );
}
