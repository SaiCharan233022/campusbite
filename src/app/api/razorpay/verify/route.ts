import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      app_order_id,
    } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let isVerified = false;

    if (keySecret && !keySecret.includes('XXXXX') && razorpay_signature) {
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isVerified = expectedSignature === razorpay_signature;
    } else {
      // Mock verification in demo mode
      isVerified = true;
    }

    if (!isVerified) {
      return NextResponse.json(
        { error: 'Payment signature verification failed' },
        { status: 400 }
      );
    }

    // Update order status in DB
    if (app_order_id) {
      await prisma.order.update({
        where: { id: app_order_id },
        data: {
          paymentId: razorpay_payment_id || `pay_mock_${Date.now()}`,
          paymentStatus: 'COMPLETED',
          status: 'ACCEPTED',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order confirmed!',
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
