import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  try {
    const { entryId } = await params;
    const body = await req.json();

    const {
      myDeckName,
      oppDeckName,
      categoryId,
      myBattlefieldId,
      oppBattlefieldId,
      result,
      initiative,
      wonDiceRoll,
      notesShort,
      gameNumber,
      seriesId,
    } = body;

    // Validation
    if (!myDeckName || !oppDeckName || !categoryId || !result || !initiative) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const entry = await prisma.entry.update({
      where: { id: entryId },
      data: {
        myDeckName: myDeckName.trim(),
        oppDeckName: oppDeckName.trim(),
        categoryId,
        myBattlefieldId: myBattlefieldId || null,
        oppBattlefieldId: oppBattlefieldId || null,
        result,
        initiative,
        wonDiceRoll: gameNumber === 1 ? wonDiceRoll : null,
        notesShort: notesShort || null,
        gameNumber: gameNumber || null,
        seriesId: seriesId || null,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error updating entry:", error);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  try {
    const { entryId } = await params;

    // Check authentication
    const session = await auth();
    if (!session?.user?.username) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { username: session.user.username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if entry exists and user owns the project
    const entry = await prisma.entry.findFirst({
      where: {
        id: entryId,
        project: {
          owners: {
            some: {
              id: user.id
            }
          }
        }
      },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Entry not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Delete the entry
    await prisma.entry.delete({
      where: { id: entryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting entry:", error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}

