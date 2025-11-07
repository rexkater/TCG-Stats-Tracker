import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
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

    const entry = await prisma.entry.create({
      data: {
        projectId,
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

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Error creating entry:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}

