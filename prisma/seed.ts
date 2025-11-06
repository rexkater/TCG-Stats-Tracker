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

  // Create Riftbound battlefields (context options) - Actual Riftbound battlefields
  const battlefields = [
    "Altar of Unity",
    "Aspirant's Climb",
    "Back-Alley Bar",
    "Bandle Tree",
    "Fortified Position",
    "Grove of the God-Willow",
    "Hallowed Tomb",
    "Monastery of Hirana",
    "Navori Fighting Pit",
    "Obelisk of Power",
    "Reaver's Row",
    "Reckoner's Arena",
    "Sigil of the Storm",
    "Startipped Peak",
    "Targon's Peak",
    "The Arena's Greatest",
    "The Candlelit Sanctum",
    "The Dreaming Tree",
    "The Grand Plaza",
    "Trifarian War Camp",
    "Vilemaw's Lair",
    "Void Gate",
    "Windswept Hillock",
    "Zaun Warrens",
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

  // Create decks - Actual Riftbound legends
  const legendNames = [
    "Ahri",
    "Annie",
    "Darius",
    "Garen",
    "Jinx",
    "Kai'Sa",
    "Lee Sin",
    "Leona",
    "Lux",
    "Master Yi",
    "Miss Fortune",
    "Sett",
    "Teemo",
    "Viktor",
    "Volibear",
    "Yasuo",
  ];

  const decks = await Promise.all(
    legendNames.map((name) =>
      db.deck.create({
        data: { name, projectId: project.id, active: true },
      })
    )
  );

  const myDeck = decks[0]!;
  const oppDeck1 = decks[1]!;
  const oppDeck2 = decks[2]!;

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
        myDeckName: myDeck.name,
        oppDeckName: oppDeck1.name,
        categoryId: category!.id,
        result: "WIN",
        initiative: "FIRST",
        wonDiceRoll: true,
        myScore: 2.0,
        oppScore: 1.0,
        notesShort: "Close game; mull to 5 G2.",
      },
      {
        projectId: project.id,
        myDeckName: myDeck.name,
        oppDeckName: oppDeck1.name,
        categoryId: category!.id,
        result: "LOSS",
        initiative: "SECOND",
        wonDiceRoll: false,
        myScore: 0.0,
        oppScore: 2.0,
        notesShort: "Flooded out, couldn't find answers.",
      },
      {
        projectId: project.id,
        myDeckName: myDeck.name,
        oppDeckName: oppDeck2.name,
        categoryId: category!.id,
        result: "WIN",
        initiative: "FIRST",
        wonDiceRoll: true,
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
      contentMarkdown: `# Ahri vs Annie

## Key Points
- Mulligan for early charm effects
- Watch for Annie's burst damage windows
- Position carefully to avoid AoE

## Strategy
- Play around Tibbers summon
- Use mobility to dodge skill shots
- Pressure early before she scales`,
    },
  });

  console.log("✅ Created matchup note");
  console.log("🎉 Seeding complete!");
}

main().finally(() => db.$disconnect());
