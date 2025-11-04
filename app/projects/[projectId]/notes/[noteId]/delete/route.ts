import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; noteId: string }> }
) {
  const { projectId, noteId } = await params;

  await prisma.matchupNotesLog.delete({
    where: { id: noteId }
  });

  redirect(`/projects/${projectId}/notes`);
}

