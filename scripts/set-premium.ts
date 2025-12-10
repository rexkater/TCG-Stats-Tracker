import { prisma } from '../src/lib/prisma';

async function setPremium() {
  try {
    const user = await prisma.user.update({
      where: { username: 'rexkater' },
      data: { isPremium: true }
    });
    console.log('✅ User updated:', user.username, '- isPremium:', user.isPremium);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setPremium();

