import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create TCGs
  const riftboundTCG = await db.tCG.upsert({
    where: { name: "Riftbound" },
    update: {},
    create: {
      name: "Riftbound",
      settingsJson: JSON.stringify({
        contextLabel: "Battlefield",
        contextRequired: true,
        allowDraws: false,
      }),
    },
  });

  const otherTCG = await db.tCG.upsert({
    where: { name: "Other" },
    update: {},
    create: {
      name: "Other",
      settingsJson: JSON.stringify({
        contextLabel: "Context",
        contextRequired: false,
        allowDraws: true,
      }),
    },
  });

  console.log("✅ Created TCGs");

  // Create Riftbound battlefields (context options)
  const battlefields = [
    "Forest of Echoes",
    "Crimson Wastes",
    "Frozen Peaks",
    "Sunken Ruins",
    "Celestial Spire",
  ];

  for (const battlefield of battlefields) {
    await db.contextOption.upsert({
      where: {
        tcgId_name: {
          tcgId: riftboundTCG.id,
          name: battlefield,
        },
      },
      update: {},
      create: {
        tcgId: riftboundTCG.id,
        name: battlefield,
        active: true,
      },
    });
  }

  console.log("✅ Created Riftbound battlefields");

  // Create a test user
  const user = await db.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: { email: "test@example.com" },
  });

  console.log("✅ Created test user");

  // Create a Riftbound project
  const project = await db.project.create({
    data: {
      name: "My Riftbound Project",
      tcgId: riftboundTCG.id,
      owners: { connect: { id: user.id } },
      categories: {
        create: [
          { name: "Ladder", active: true },
          { name: "Tournament", active: true },
          { name: "Testing", active: true },
        ],
      },
    },
  });

  console.log("✅ Created project with categories");

  // Create decks
  const [myDeck, oppDeck1, oppDeck2] = await Promise.all([
    db.deck.create({
      data: { name: "Shadow Control", projectId: project.id, active: true },
    }),
    db.deck.create({
      data: { name: "Fire Aggro", projectId: project.id, active: true },
    }),
    db.deck.create({
      data: { name: "Nature Midrange", projectId: project.id, active: true },
    }),
  ]);

  console.log("✅ Created decks");

  // Get a category and battlefield
  const category = await db.category.findFirst({
    where: { projectId: project.id },
  });
  const battlefield = await db.contextOption.findFirst({
    where: { tcgId: riftboundTCG.id },
  });

  // Create sample entries
  await db.entry.createMany({
    data: [
      {
        projectId: project.id,
        myDeckId: myDeck.id,
        oppDeckId: oppDeck1.id,
        categoryId: category!.id,
        contextOptionId: battlefield!.id,
        result: "WIN",
        initiative: "FIRST",
        myScore: 2.0,
        oppScore: 1.0,
        notesShort: "Close game; mull to 5 G2.",
      },
      {
        projectId: project.id,
        myDeckId: myDeck.id,
        oppDeckId: oppDeck1.id,
        categoryId: category!.id,
        contextOptionId: battlefield!.id,
        result: "LOSS",
        initiative: "SECOND",
        myScore: 0.0,
        oppScore: 2.0,
        notesShort: "Flooded out, couldn't find answers.",
      },
      {
        projectId: project.id,
        myDeckId: myDeck.id,
        oppDeckId: oppDeck2.id,
        categoryId: category!.id,
        contextOptionId: battlefield!.id,
        result: "WIN",
        initiative: "FIRST",
        myScore: 2.0,
        oppScore: 0.0,
        notesShort: "Perfect curve, opponent mulled to 4.",
      },
    ],
  });

  console.log("✅ Created sample entries");

  // Create a matchup note
  await db.matchupNotesLog.create({
    data: {
      projectId: project.id,
      tcgId: riftboundTCG.id,
      deckAId: myDeck.id,
      deckBId: oppDeck1.id,
      authorUserId: user.id,
      contentMarkdown: `# Shadow Control vs Fire Aggro

## Key Points
- Mulligan aggressively for early removal
- Save counterspells for their finishers
- Don't tap out on turn 3-4

## Sideboard
- +2 Lifegain cards
- -2 Late game bombs`,
    },
  });

  console.log("✅ Created matchup note");
  console.log("🎉 Seeding complete!");
}

main().finally(() => db.$disconnect());
