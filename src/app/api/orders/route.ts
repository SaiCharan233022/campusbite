import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateToken } from '@/lib/utils';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const canteenId = searchParams.get('canteenId');
    const status = searchParams.get('status');
    const all = searchParams.get('all');

    const userRole = (session?.user as any)?.role;
    const userId = (session?.user as any)?.id;

    const where: any = {};

    // If student, only their orders unless admin requesting all
    if (userRole !== 'ADMIN' || !all) {
      if (userId) {
        where.userId = userId;
      }
    }

    if (canteenId) {
      where.canteenId = canteenId;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        canteen: {
          select: { id: true, name: true, location: true },
        },
        items: {
          include: {
            menuItem: true,
          },
        },
        user: {
          select: { id: true, name: true, collegeId: true, phone: true },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { canteenId, items, scheduledFor, notes, userId: overrideUserId } = body;

    const effectiveUserId =
      (session?.user as any)?.id ||
      overrideUserId ||
      (
        await prisma.user.findFirst({ where: { role: 'STUDENT' } })
      )?.id;

    if (!effectiveUserId) {
      return NextResponse.json(
        { error: 'User session or Student ID required to place an order' },
        { status: 401 }
      );
    }

    if (!canteenId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty or canteen not selected' },
        { status: 400 }
      );
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const dbItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId || item.id },
      });
      if (dbItem) {
        const itemTotal = dbItem.price * item.quantity;
        totalAmount += itemTotal;
        orderItemsData.push({
          menuItemId: dbItem.id,
          quantity: item.quantity,
          price: dbItem.price,
        });
      }
    }

    // Estimated ready time (15 mins from now or scheduled time)
    const estimatedReady = new Date(Date.now() + 15 * 60 * 1000);

    const tokenNumber = generateToken();

    const order = await prisma.order.create({
      data: {
        tokenNumber,
        status: 'PLACED',
        totalAmount,
        scheduledFor: scheduledFor || 'now',
        estimatedReady,
        notes,
        userId: effectiveUserId,
        canteenId,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        canteen: true,
        items: {
          include: { menuItem: true },
        },
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}
