import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
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

    // Create the project
    const project = await prisma.project.create({
      data: {
        name,
        tcgId,
        // Note: userId would be added here when authentication is implemented
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

