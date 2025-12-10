import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Activation code is required' },
        { status: 400 }
      );
    }

    // Check if code matches the environment variable
    const validCode = process.env.PREMIUM_CODE;

    if (!validCode) {
      return NextResponse.json(
        { error: 'Premium activation is not configured' },
        { status: 500 }
      );
    }

    if (code !== validCode) {
      return NextResponse.json(
        { error: 'Invalid activation code' },
        { status: 400 }
      );
    }

    // Activate premium for the user
    await prisma.user.update({
      where: { id: session.user.id },
      data: { isPremium: true }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Premium activated successfully!' 
    });

  } catch (error) {
    console.error('Subscription activation error:', error);
    return NextResponse.json(
      { error: 'Failed to activate premium' },
      { status: 500 }
    );
  }
}

