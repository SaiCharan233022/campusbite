import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const canteenId = searchParams.get('canteenId');
    const category = searchParams.get('category');
    const isVeg = searchParams.get('isVeg');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    const where: any = {};

    if (canteenId) {
      where.canteenId = canteenId;
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (isVeg !== null && isVeg !== undefined && isVeg !== '') {
      where.isVeg = isVeg === 'true';
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const items = await prisma.menuItem.findMany({
      where,
      take: limit ? parseInt(limit, 10) : undefined,
      orderBy: [{ isAvailable: 'desc' }, { createdAt: 'desc' }],
      include: {
        canteen: {
          select: { id: true, name: true, location: true },
        },
      },
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Failed to fetch menu items:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      price,
      category,
      isVeg,
      isAvailable,
      prepTime,
      canteenId,
    } = body;

    if (!name || price === undefined || !category || !canteenId) {
      return NextResponse.json(
        { error: 'Missing required menu fields' },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        isVeg: Boolean(isVeg),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        prepTime: prepTime ? parseInt(prepTime, 10) : 10,
        canteenId,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error('Failed to create menu item:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        ...data,
        price: data.price !== undefined ? parseFloat(data.price) : undefined,
        prepTime: data.prepTime !== undefined ? parseInt(data.prepTime, 10) : undefined,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    console.error('Failed to update menu item:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete menu item:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
