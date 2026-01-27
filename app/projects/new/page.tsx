import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { TCG } from '@prisma/client';
import { auth } from '@/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function NewProjectPage() {
  // Check authentication
  const session = await auth();
  if (!session?.user?.username) {
    redirect('/auth/signin');
  }

  // Fetch available TCGs and sort by preferred order: Riftbound, One Piece, Other
  const tcgs = await prisma.tCG.findMany();

  // Custom sort order
  const tcgOrder = ['Riftbound', 'One Piece', 'Other'];
  tcgs.sort((a: TCG, b: TCG) => {
    const indexA = tcgOrder.indexOf(a.name);
    const indexB = tcgOrder.indexOf(b.name);
    // If both are in the order list, sort by their position
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    // If only A is in the list, it comes first
    if (indexA !== -1) return -1;
    // If only B is in the list, it comes first
    if (indexB !== -1) return 1;
    // Otherwise, sort alphabetically
    return a.name.localeCompare(b.name);
  });

  async function createProject(formData: FormData) {
    'use server';

    // Check authentication in server action
    const session = await auth();
    if (!session?.user?.username) {
      redirect('/auth/signin');
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { username: session.user.username },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const name = formData.get('name') as string;
    const tcgId = formData.get('tcgId') as string;

    if (!name || !tcgId) {
      throw new Error('Name and TCG are required');
    }

    // Get the TCG to check if it's Riftbound
    const tcg = await prisma.tCG.findUnique({
      where: { id: tcgId },
    });

    // Riftbound legends (decks)
    const riftboundLegends = [
      "Ahri",
      "Annie",
      "Azir",
      "Darius",
      "Draven",
      "Ezreal",
      "Fiora",
      "Garen",
      "Irelia",
      "Jax",
      "Jinx",
      "Kai'Sa",
      "Lee Sin",
      "Leona",
      "Lucian",
      "Lux",
      "Master Yi",
      "Miss Fortune",
      "Ornn",
      "Rek'sai",
      "Renata",
      "Rumble",
      "Sett",
      "Sivir",
      "Teemo",
      "Viktor",
      "Volibear",
      "Yasuo",
    ];

    // Default categories
    const defaultCategories = [
      { name: "Ladder", active: true },
      { name: "Tournament", active: true },
      { name: "Testing", active: true },
    ];

    // Create the project with categories, decks if Riftbound, and associate with user
    const project = await prisma.project.create({
      data: {
        name,
        tcgId,
        owners: {
          connect: { id: user.id },
        },
        categories: {
          create: defaultCategories,
        },
        ...(tcg?.name === 'Riftbound' && {
          decks: {
            create: riftboundLegends.map((legend) => ({
              name: legend,
              active: true,
            })),
          },
        }),
      },
    });

    // Redirect to the new project
    redirect(`/projects/${project.id}`);
  }

  return (
    <main className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/projects"
          className="text-sm text-accent-500 hover:text-accent-600 mb-2 inline-block"
        >
          ← Back to projects
        </Link>
        <h1 className="text-3xl font-bold text-primary-900">Create New Project</h1>
        <p className="text-primary-700 mt-1">
          Start tracking your TCG statistics by creating a new project
        </p>
      </div>

      {/* Form */}
      <div className="bg-background-200 rounded-lg border border-background-400 p-6">
        <form action={createProject} className="space-y-6">
          {/* Project Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-primary-800 mb-2"
            >
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-background-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., My Riftbound Journey, Competitive Season 2024"
            />
            <p className="text-sm text-primary-600 mt-1">
              Choose a descriptive name for your project
            </p>
          </div>

          {/* TCG Selection */}
          <div>
            <label
              htmlFor="tcgId"
              className="block text-sm font-medium text-primary-800 mb-2"
            >
              Trading Card Game <span className="text-red-500">*</span>
            </label>
            <select
              id="tcgId"
              name="tcgId"
              required
              className="w-full px-3 py-2 border border-background-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a TCG...</option>
              {tcgs.map((tcg: TCG) => (
                <option key={tcg.id} value={tcg.id}>
                  {tcg.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-primary-600 mt-1">
              Select the card game you want to track
            </p>
          </div>

          {/* TCG Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Available TCGs
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              {tcgs.map((tcg: TCG) => {
                const settings = JSON.parse(tcg.settingsJson);
                const features = [];

                if (settings.bestOfFormat === 1) {
                  features.push('Best of 1');
                } else if (settings.bestOfFormat === 3) {
                  features.push('Best of 3');
                }

                if (settings.contextLabel) {
                  features.push(`Tracks ${settings.contextLabel}s`);
                }

                if (settings.allowDraws) {
                  features.push('Allows draws');
                }

                return (
                  <li key={tcg.id} className="flex items-start gap-2">
                    <span className="text-accent-500">•</span>
                    <div>
                      <strong>{tcg.name}</strong>
                      {features.length > 0 && (
                        <span className="text-blue-700"> - {features.join(', ')}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Link
              href="/projects"
              className="flex-1 px-4 py-2 border border-background-400 rounded-lg hover:bg-background-100 transition-colors text-center font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-secondary-300 text-white rounded-lg hover:bg-secondary-400 transition-colors font-medium"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <div className="bg-background-100 border border-background-400 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-primary-900 mb-2">
          What happens next?
        </h3>
        <ul className="space-y-1 text-sm text-primary-800">
          <li className="flex items-start gap-2">
            <span className="text-green-600">1.</span>
            <span>Your project will be created with the selected TCG settings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">2.</span>
            <span>You can add decks/legends to track</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">3.</span>
            <span>Create categories (e.g., Ladder, Tournament, Testing)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">4.</span>
            <span>Start recording match entries and analyzing your stats!</span>
          </li>
        </ul>
      </div>
    </main>
  );
}

