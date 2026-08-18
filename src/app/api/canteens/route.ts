import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const canteens = await prisma.canteen.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { menuItems: true },
        },
      },
    });

    return NextResponse.json({ canteens });
  } catch (error: any) {
    console.error('Failed to fetch canteens:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
