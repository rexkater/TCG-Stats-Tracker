import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { TCG } from '@prisma/client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function NewProjectPage() {
  // Fetch available TCGs
  const tcgs = await prisma.tCG.findMany({
    orderBy: { name: 'asc' },
  });

  async function createProject(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const tcgId = formData.get('tcgId') as string;

    if (!name || !tcgId) {
      throw new Error('Name and TCG are required');
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        name,
        tcgId,
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
          className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block"
        >
          ← Back to projects
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-1">
          Start tracking your TCG statistics by creating a new project
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form action={createProject} className="space-y-6">
          {/* Project Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., My Riftbound Journey, Competitive Season 2024"
            />
            <p className="text-sm text-gray-500 mt-1">
              Choose a descriptive name for your project
            </p>
          </div>

          {/* TCG Selection */}
          <div>
            <label
              htmlFor="tcgId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Trading Card Game <span className="text-red-500">*</span>
            </label>
            <select
              id="tcgId"
              name="tcgId"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a TCG...</option>
              {tcgs.map((tcg: TCG) => {
                const settings = JSON.parse(tcg.settingsJson);
                return (
                  <option key={tcg.id} value={tcg.id}>
                    {tcg.name}
                    {settings.contextLabel && ` (with ${settings.contextLabel}s)`}
                  </option>
                );
              })}
            </select>
            <p className="text-sm text-gray-500 mt-1">
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
                return (
                  <li key={tcg.id} className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <div>
                      <strong>{tcg.name}</strong>
                      {settings.contextLabel && (
                        <span className="text-blue-700">
                          {' '}
                          - Tracks {settings.contextLabel}s
                          {settings.contextRequired && ' (required)'}
                        </span>
                      )}
                      {settings.allowDraws && (
                        <span className="text-blue-700"> - Allows draws</span>
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          What happens next?
        </h3>
        <ul className="space-y-1 text-sm text-gray-700">
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

