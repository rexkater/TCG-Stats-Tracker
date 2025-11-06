import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import type { Entry, Deck, Category, ContextOption } from '@prisma/client';

type EntryWithRelations = Entry & {
  myDeck: Deck;
  oppDeck: Deck;
  category: Category;
  myBattlefield: ContextOption | null;
  oppBattlefield: ContextOption | null;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  // Fetch all entries for the project with relations
  const entries: EntryWithRelations[] = await prisma.entry.findMany({
    where: { projectId },
    include: {
      category: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // CSV headers
  const headers = [
    'My Deck',
    'Opponent Deck',
    'Category',
    'Initiative',
    'Won Dice Roll',
    'Result',
    'My Score',
    'Opponent Score',
    'Game Number',
    'Series ID',
    'Notes',
    'Created At',
  ];

  // Convert entries to CSV rows
  const rows = entries.map((entry) => [
    entry.myDeckName,
    entry.oppDeckName,
    entry.category.name,
    entry.initiative,
    entry.wonDiceRoll !== null ? (entry.wonDiceRoll ? 'Yes' : 'No') : '',
    entry.result,
    entry.myScore?.toString() || '',
    entry.oppScore?.toString() || '',
    entry.gameNumber?.toString() || '',
    entry.seriesId || '',
    entry.notesShort || '',
    entry.createdAt.toISOString(),
  ]);

  // Escape CSV values (handle commas, quotes, newlines)
  const escapeCsvValue = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Build CSV content
  const csvContent = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map((row) => row.map(escapeCsvValue).join(',')),
  ].join('\n');

  // Get project name for filename
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { name: true },
  });

  const filename = `${project?.name || 'project'}-entries-${new Date().toISOString().split('T')[0]}.csv`;

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

