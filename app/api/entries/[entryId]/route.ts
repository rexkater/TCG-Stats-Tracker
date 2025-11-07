import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const body = await req.json();
    const { passcode } = body;

    // Validate passcode
    const adminPasscode = process.env.ADMIN_PASSCODE;
    if (!adminPasscode || passcode !== adminPasscode) {
      return NextResponse.json(
        { error: "Invalid passcode" },
        { status: 401 }
      );
    }

    // Check if entry exists
    const entry = await prisma.entry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Entry not found" },
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

