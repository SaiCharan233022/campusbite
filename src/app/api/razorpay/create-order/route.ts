import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount, orderId } = await req.json();

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If real keys provided and not placeholder
    if (keyId && keySecret && !keyId.includes('XXXXX')) {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const options = {
        amount: Math.round(amount * 100), // amount in paise
        currency: 'INR',
        receipt: `receipt_${orderId || Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        mode: 'LIVE_OR_TEST',
      });
    }

    // Mock Test Mode for Seamless Evaluation / Faculty Demo
    return NextResponse.json({
      success: true,
      orderId: `order_mock_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency: 'INR',
      mode: 'MOCK_TEST_MODE',
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}
