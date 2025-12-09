import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAllData() {
  console.log('🗑️  Clearing all data from database...');

  try {
    // Delete in order to respect foreign key constraints
    await prisma.matchupNotesLog.deleteMany({});
    console.log('✓ Deleted all matchup notes');

    await prisma.entry.deleteMany({});
    console.log('✓ Deleted all entries');

    await prisma.deckImage.deleteMany({});
    console.log('✓ Deleted all deck images');

    await prisma.deck.deleteMany({});
    console.log('✓ Deleted all decks');

    await prisma.category.deleteMany({});
    console.log('✓ Deleted all categories');

    await prisma.project.deleteMany({});
    console.log('✓ Deleted all projects');

    await prisma.contextOption.deleteMany({});
    console.log('✓ Deleted all context options');

    await prisma.tCG.deleteMany({});
    console.log('✓ Deleted all TCGs');

    await prisma.user.deleteMany({});
    console.log('✓ Deleted all users');

    console.log('\n✅ All data cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

clearAllData();

