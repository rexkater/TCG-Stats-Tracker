import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create TCGs - update existing records to ensure correct settings
  const riftboundTCG = await db.tCG.upsert({
    where: { name: "Riftbound" },
    update: {
      settingsJson: JSON.stringify({
        contextLabel: "Battlefield",
        contextRequired: true,
        allowDraws: false,
        bestOfFormat: 3, // Best of 3 series
      }),
    },
    create: {
      name: "Riftbound",
      settingsJson: JSON.stringify({
        contextLabel: "Battlefield",
        contextRequired: true,
        allowDraws: false,
        bestOfFormat: 3, // Best of 3 series
      }),
    },
  });

  const onePieceTCG = await db.tCG.upsert({
    where: { name: "One Piece" },
    update: {
      settingsJson: JSON.stringify({
        contextLabel: null,
        contextRequired: false,
        allowDraws: false,
        bestOfFormat: 1, // Best of 1 (single game)
      }),
    },
    create: {
      name: "One Piece",
      settingsJson: JSON.stringify({
        contextLabel: null,
        contextRequired: false,
        allowDraws: false,
        bestOfFormat: 1, // Best of 1 (single game)
      }),
    },
  });

  const otherTCG = await db.tCG.upsert({
    where: { name: "Other" },
    update: {
      settingsJson: JSON.stringify({
        contextLabel: null,
        contextRequired: false,
        allowDraws: true,
        bestOfFormat: 3, // Default to best of 3
      }),
    },
    create: {
      name: "Other",
      settingsJson: JSON.stringify({
        contextLabel: null,
        contextRequired: false,
        allowDraws: true,
        bestOfFormat: 3, // Default to best of 3
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
    "Emperor's Dais",
    "Forge of the Fluft",
    "Forgotten Monument",
    "Fortified Position",
    "Grove of the God-Willow",
    "Hall of Legends",
    "Hallowed Tomb",
    "Marai Spire",
    "Minefield",
    "Monastery of Hirana",
    "Navori Fighting Pit",
    "Obelisk of Power",
    "Ornn's Forge",
    "Power Nexus",
    "Ravenbloom Conservatory",
    "Reaver's Row",
    "Reckoner's Arena",
    "Rockfall Path",
    "Seat of Power",
    "Sigil of the Storm",
    "Startipped Peak",
    "Sunken Temple",
    "Targon's Peak",
    "The Arena's Greatest",
    "The Candlelit Sanctum",
    "The Dreaming Tree",
    "The Grand Plaza",
    "The Papertree",
    "Treasure Hoard",
    "Trifarian War Camp",
    "Veiled Temple",
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

  // Note: No test user created - users must sign up through the app
  console.log("🎉 Seeding complete! TCGs and battlefields are ready.");
  console.log("📝 Users can now sign up and create their own projects.");
}

main().finally(() => db.$disconnect());
