import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { calculateGlobalAnalytics } from '@/lib/global-analytics';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has premium access
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPremium: true }
    });

    if (!user?.isPremium) {
      return NextResponse.json(
        { error: 'Premium subscription required' },
        { status: 403 }
      );
    }

    // Get TCG ID from query params
    const { searchParams } = new URL(request.url);
    const tcgId = searchParams.get('tcgId');

    if (!tcgId) {
      return NextResponse.json(
        { error: 'TCG ID is required' },
        { status: 400 }
      );
    }

    // Verify TCG exists
    const tcg = await prisma.tCG.findUnique({
      where: { id: tcgId },
    });

    if (!tcg) {
      return NextResponse.json(
        { error: 'TCG not found' },
        { status: 404 }
      );
    }

    // Calculate global analytics
    const analytics = await calculateGlobalAnalytics(tcgId);

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Global analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

