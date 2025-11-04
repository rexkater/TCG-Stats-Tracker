import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { entrySchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });
  const entries = await prisma.entry.findMany({
    where: { projectId },
    include: { myDeck: true, oppDeck: true, category: true, notes: true }
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = entrySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { projectId, battlefield, result } = parsed.data;
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  if (project.tcg === "RIFTBOUND" && (!battlefield || battlefield.trim() === "")) {
    return NextResponse.json({ error: "Battlefield is required for Riftbound" }, { status: 400 });
  }
  if (result === "DRAW" && !project.allowDraws) {
    return NextResponse.json({ error: "Draws are disabled for this project" }, { status: 400 });
  }

  const created = await prisma.entry.create({ data: parsed.data });
  return NextResponse.json(created, { status: 201 });
}
