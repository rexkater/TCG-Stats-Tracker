'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createNote(projectId: string, tcgId: string, authorUserId: string, formData: FormData) {
  const deckAId = formData.get('deckAId') as string;
  const deckBId = formData.get('deckBId') as string;
  const contentMarkdown = formData.get('contentMarkdown') as string;
  const pinned = formData.get('pinned') === 'on';

  if (!deckAId || !deckBId || !contentMarkdown) {
    throw new Error('Missing required fields');
  }

  await prisma.matchupNotesLog.create({
    data: {
      projectId,
      tcgId,
      deckAId,
      deckBId,
      authorUserId,
      contentMarkdown,
      pinned
    }
  });

  redirect(`/projects/${projectId}/notes`);
}

export async function updateNote(projectId: string, noteId: string, formData: FormData) {
  const deckAId = formData.get('deckAId') as string;
  const deckBId = formData.get('deckBId') as string;
  const contentMarkdown = formData.get('contentMarkdown') as string;
  const pinned = formData.get('pinned') === 'on';

  if (!deckAId || !deckBId || !contentMarkdown) {
    throw new Error('Missing required fields');
  }

  await prisma.matchupNotesLog.update({
    where: { id: noteId },
    data: {
      deckAId,
      deckBId,
      contentMarkdown,
      pinned
    }
  });

  redirect(`/projects/${projectId}/notes`);
}

export async function toggleNotePin(projectId: string, noteId: string, currentPinned: boolean) {
  await prisma.matchupNotesLog.update({
    where: { id: noteId },
    data: {
      pinned: !currentPinned
    }
  });

  redirect(`/projects/${projectId}/notes`);
}

export async function deleteNote(projectId: string, noteId: string) {
  await prisma.matchupNotesLog.delete({
    where: { id: noteId }
  });

  redirect(`/projects/${projectId}/notes`);
}

