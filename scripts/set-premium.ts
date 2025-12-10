import { prisma } from '../src/lib/prisma';

async function setPremium() {
  const username = process.argv[2] || 'rexkater';
  const isPremium = process.argv[3] === 'true';

  try {
    const user = await prisma.user.update({
      where: { username },
      data: { isPremium }
    });
    console.log('✅ User updated:', user.username, '- isPremium:', user.isPremium);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setPremium();

