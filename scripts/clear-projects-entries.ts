import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Deleting all entries...');
  const deletedEntries = await prisma.entry.deleteMany({});
  console.log(`✅ Deleted ${deletedEntries.count} entries`);

  console.log('🗑️  Deleting all matchup notes...');
  const deletedNotes = await prisma.matchupNotesLog.deleteMany({});
  console.log(`✅ Deleted ${deletedNotes.count} matchup notes`);

  console.log('🗑️  Deleting all projects (cascade will delete decks, categories, etc.)...');
  const deletedProjects = await prisma.project.deleteMany({});
  console.log(`✅ Deleted ${deletedProjects.count} projects`);

  console.log('✨ All projects and entries have been deleted!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

