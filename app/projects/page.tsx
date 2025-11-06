import { prisma } from '@/lib/prisma';
import type { Project, TCG } from '@prisma/client';
import Link from 'next/link';

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

type ProjectEntry = {
  id: string;
  myDeckName: string;
  oppDeckName: string;
  categoryId: string;
};

type ProjectWithData = Project & {
  tcg: TCG;
  decks: { id: string }[];
  categories: { id: string }[];
  entries: ProjectEntry[];
};

export default async function Projects() {
  const projects = await prisma.project.findMany({
    include: {
      tcg: true,
      decks: {
        where: { active: true },
        select: { id: true }
      },
      categories: {
        where: { active: true },
        select: { id: true }
      },
      entries: {
        select: {
          id: true,
          myDeckName: true,
          oppDeckName: true,
          categoryId: true
        }
      }
    },
    where: {
      archivedAt: null
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Calculate usage stats for each project
  const projectsWithStats = projects.map((project: ProjectWithData) => {
    const totalDecks = project.decks.length;
    const totalCategories = project.categories.length;
    const totalEntries = project.entries.length;

    // Count unique decks used in entries (only myDeck)
    const usedDeckNames = new Set<string>();
    project.entries.forEach((entry: ProjectEntry) => {
      usedDeckNames.add(entry.myDeckName);
    });
    const decksUsed = usedDeckNames.size;

    // Count unique categories used in entries
    const usedCategoryIds = new Set(project.entries.map((e: ProjectEntry) => e.categoryId));
    const categoriesUsed = usedCategoryIds.size;

    return {
      ...project,
      stats: {
        totalEntries,
        decksUsed,
        totalDecks,
        categoriesUsed,
        totalCategories
      }
    };
  });

  return (
    <main className="space-y-6">
      <div className="mb-4">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
        >
          ← Back to Home
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <Link
          href="/projects/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          New Project
        </Link>
      </div>

      {projectsWithStats.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">No projects yet</p>
          <Link
            href="/projects/new"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projectsWithStats.map((project: ProjectWithData & { stats: { totalEntries: number; decksUsed: number; totalDecks: number; categoriesUsed: number; totalCategories: number } }) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {project.name}
              </h2>
              <div className="text-sm text-gray-600 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {project.tcg.name}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-sm text-gray-500">
                <span>{project.stats.totalEntries} entries</span>
                <span>{project.stats.decksUsed}/{project.stats.totalDecks} decks used</span>
                <span>{project.stats.categoriesUsed}/{project.stats.totalCategories} categories used</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
