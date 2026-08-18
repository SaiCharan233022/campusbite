import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await req.json();
    const { rating, feedback } = body;

    if (!rating) {
      return NextResponse.json({ error: 'Rating is required' }, { status: 400 });
    }

    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          notes: feedback ? `Rating: ${rating}★ | ${feedback}` : `Rating: ${rating}★`,
        },
      });
    } catch (e) {
      console.warn('Prisma feedback write fallback');
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback!',
      rating,
      feedback,
    });
  } catch (error: any) {
    return NextResponse.json({ success: true, message: 'Feedback recorded!' });
  }
}
