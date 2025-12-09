import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.username) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, tcgId } = body;

    // Validation
    if (!name || !tcgId) {
      return NextResponse.json(
        { error: "Name and TCG are required" },
        { status: 400 }
      );
    }

    // Check if TCG exists
    const tcg = await prisma.tCG.findUnique({
      where: { id: tcgId },
    });

    if (!tcg) {
      return NextResponse.json(
        { error: "TCG not found" },
        { status: 404 }
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

    // Create the project and associate with user
    const project = await prisma.project.create({
      data: {
        name,
        tcgId,
        owners: {
          connect: { id: user.id },
        },
      },
      include: {
        tcg: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

