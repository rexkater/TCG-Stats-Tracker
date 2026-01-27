import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { MatchResult, Initiative, Deck, Category, ContextOption } from '@prisma/client';

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

export default async function ImportPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tcg: {
        include: {
          contextOptions: {
            where: { active: true },
          },
        },
      },
      decks: {
        where: { active: true },
      },
      categories: {
        where: { active: true },
      },
    },
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

  async function importCsv(formData: FormData) {
    "use server";

    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error("CSV file is empty or has no data rows");
    }

    // Parse header
    const headerLine = lines[0];
    if (!headerLine) {
      throw new Error("CSV file has no header row");
    }
    const headers = parseCsvLine(headerLine);
    
    // Validate required headers
    const requiredHeaders = ['My Deck', 'Opponent Deck', 'Category', 'Initiative', 'Result'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    // Get column indices
    const getIndex = (header: string) => headers.indexOf(header);
    const myDeckIdx = getIndex('My Deck');
    const oppDeckIdx = getIndex('Opponent Deck');
    const myBattlefieldIdx = getIndex('My Battlefield');
    const oppBattlefieldIdx = getIndex('Opponent Battlefield');
    const categoryIdx = getIndex('Category');
    const initiativeIdx = getIndex('Initiative');
    const wonDiceRollIdx = getIndex('Won Dice Roll');
    const resultIdx = getIndex('Result');
    const gameNumberIdx = getIndex('Game Number');
    const seriesIdIdx = getIndex('Series ID');
    const notesIdx = getIndex('Notes');

    // Fetch project data for validation
    const projectData = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        categories: { where: { active: true } },
        tcg: {
          include: {
            contextOptions: { where: { active: true } }
          }
        }
      },
    });

    if (!projectData) {
      throw new Error("Project not found");
    }

    // Create lookup maps for categories and battlefields (decks are now free text)
    const categoryMap = new Map(projectData.categories.map((c: Category) => [c.name.toLowerCase(), c.id]));
    const battlefieldMap = new Map(projectData.tcg.contextOptions.map((b: ContextOption) => [b.name.toLowerCase(), b.id]));

    // Parse and validate data rows
    const entries = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line || !line.trim()) continue;

      try {
        const values = parseCsvLine(line);
        
        // Get values
        const myDeckName = values[myDeckIdx]?.trim();
        const oppDeckName = values[oppDeckIdx]?.trim();
        const myBattlefieldName = values[myBattlefieldIdx]?.trim();
        const oppBattlefieldName = values[oppBattlefieldIdx]?.trim();
        const categoryName = values[categoryIdx]?.trim();
        const initiative = values[initiativeIdx]?.trim() as Initiative;
        const wonDiceRollStr = values[wonDiceRollIdx]?.trim();
        const result = values[resultIdx]?.trim() as MatchResult;
        const gameNumberStr = values[gameNumberIdx]?.trim();
        const seriesId = values[seriesIdIdx]?.trim();
        const notes = values[notesIdx]?.trim();

        // Validate required fields
        if (!myDeckName || !oppDeckName || !categoryName || !initiative || !result) {
          errors.push(`Row ${i + 1}: Missing required fields`);
          continue;
        }

        // Validate initiative
        if (initiative !== 'FIRST' && initiative !== 'SECOND') {
          errors.push(`Row ${i + 1}: Invalid initiative "${initiative}". Must be FIRST or SECOND`);
          continue;
        }

        // Validate result
        if (result !== 'WIN' && result !== 'LOSS' && result !== 'DRAW') {
          errors.push(`Row ${i + 1}: Invalid result "${result}". Must be WIN, LOSS, or DRAW`);
          continue;
        }

        // Look up category ID
        const categoryId = categoryMap.get(categoryName.toLowerCase());
        if (!categoryId) {
          errors.push(`Row ${i + 1}: Category "${categoryName}" not found in project`);
          continue;
        }

        // Look up battlefield IDs (optional)
        const myBattlefieldId = myBattlefieldName ? battlefieldMap.get(myBattlefieldName.toLowerCase()) : null;
        const oppBattlefieldId = oppBattlefieldName ? battlefieldMap.get(oppBattlefieldName.toLowerCase()) : null;

        // Validate battlefields if provided
        if (myBattlefieldName && !myBattlefieldId) {
          errors.push(`Row ${i + 1}: Battlefield "${myBattlefieldName}" not found`);
          continue;
        }
        if (oppBattlefieldName && !oppBattlefieldId) {
          errors.push(`Row ${i + 1}: Battlefield "${oppBattlefieldName}" not found`);
          continue;
        }

        // Parse wonDiceRoll
        let wonDiceRoll: boolean | null = null;
        if (wonDiceRollStr) {
          const normalized = wonDiceRollStr.toLowerCase();
          if (normalized === 'yes' || normalized === 'true' || normalized === '1') {
            wonDiceRoll = true;
          } else if (normalized === 'no' || normalized === 'false' || normalized === '0') {
            wonDiceRoll = false;
          }
        }

        // Parse optional numeric fields
        const gameNumber = gameNumberStr ? parseInt(gameNumberStr) : null;

        entries.push({
          projectId,
          myDeckName,
          oppDeckName,
          myBattlefieldId,
          oppBattlefieldId,
          categoryId,
          initiative,
          wonDiceRoll,
          result,
          gameNumber,
          seriesId: seriesId || null,
          notesShort: notes || null,
        });
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Import failed with ${errors.length} error(s):\n${errors.slice(0, 10).join('\n')}${errors.length > 10 ? `\n... and ${errors.length - 10} more` : ''}`);
    }

    if (entries.length === 0) {
      throw new Error("No valid entries found in CSV");
    }

    // Import entries
    await prisma.entry.createMany({
      data: entries,
    });

    redirect(`/projects/${projectId}`);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/projects/${projectId}`}
          className="text-accent-500 hover:text-accent-600 mb-4 inline-block"
        >
          ← Back to project
        </Link>
        <h1 className="text-3xl font-bold text-primary-900">Import Entries from CSV</h1>
        <p className="text-primary-700 mt-2">
          Upload a CSV file to import multiple entries at once
        </p>
      </div>

      <div className="bg-background-200 rounded-lg border border-background-400 p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary-900 mb-4">CSV Format Requirements</h2>
        <div className="space-y-2 text-sm text-primary-700">
          <p><strong>Required columns:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>My Deck</li>
            <li>Opponent Deck</li>
            <li>Category</li>
            <li>Initiative (FIRST or SECOND)</li>
            <li>Result (WIN, LOSS, or DRAW)</li>
          </ul>
          <p className="mt-4"><strong>Optional columns:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>My Battlefield</li>
            <li>Opponent Battlefield</li>
            <li>Won Dice Roll (Yes/No)</li>
            <li>Game Number (1, 2, or 3)</li>
            <li>Series ID</li>
            <li>Notes</li>
          </ul>
          <p className="mt-4 text-yellow-700 bg-yellow-50 p-3 rounded">
            <strong>Note:</strong> Deck names, category names, and battlefield names must exactly match existing items in your project (case-insensitive).
          </p>
        </div>
      </div>

      <form action={importCsv} className="bg-background-200 rounded-lg border border-background-400 p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary-800 mb-2">
            CSV File <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="file"
            accept=".csv"
            required
            className="w-full px-3 py-2 border border-background-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-2 bg-secondary-300 text-white rounded-lg hover:bg-secondary-400 transition-colors font-medium"
          >
            Import Entries
          </button>
          <Link
            href={`/projects/${projectId}`}
            className="px-6 py-2 bg-background-200 text-primary-800 rounded-lg hover:bg-background-300 transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

// Helper function to parse CSV line handling quoted values
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current);
  
  return result;
}

