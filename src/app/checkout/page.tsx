'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCart } from '@/hooks/useCart';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { formatPrice } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Smartphone, 
  Banknote,
  Receipt,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { 
    cart, 
    canteenId, 
    totalAmount, 
    clearCart, 
    scheduledTime, 
    setScheduledTime, 
    orderNotes, 
    setOrderNotes 
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'UPI_DIRECT' | 'CAMPUS_CARD'>('RAZORPAY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="container" style={{ maxWidth: '500px', paddingTop: '40px' }}>
        <GlassCard style={{ padding: '36px', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>🛒</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '12px' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', margin: '12px 0 24px' }}>
            Please select items from the canteen menu before checking out.
          </p>
          <Link href="/menu" className="glass-btn glass-btn-primary">
            Browse Menu
          </Link>
        </GlassCard>
      </div>
    );
  }

  const handlePayment = async () => {
    setError('');
    setLoading(true);

    try {
      // 1. Create order in our database
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canteenId,
          items: cart.map((ci) => ({
            id: ci.item.id,
            quantity: ci.quantity,
          })),
          scheduledFor: scheduledTime,
          notes: orderNotes,
          userId: (session?.user as any)?.id,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to place order');
      }

      const createdOrder = orderData.order;

      // 2. Initiate Razorpay / Test Payment Verification
      const rzpOrderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          orderId: createdOrder.id,
        }),
      });

      const rzpData = await rzpOrderRes.json();

      // In Test/Mock Mode or Direct Gateway
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: rzpData.orderId,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: 'test_sig',
          app_order_id: createdOrder.id,
        }),
      });

      if (verifyRes.ok) {
        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        clearCart();
        router.push(`/orders/${createdOrder.id}?success=true`);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '10px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link
          href="/menu"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          <ArrowLeft size={16} /> Back to Menu
        </Link>
      </div>

      <h1 className="page-title" style={{ marginBottom: '24px' }}>
        Review & Pay
      </h1>

      {error && (
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--error-bg)',
            color: 'var(--error)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {/* Tray Summary */}
        <GlassCard style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={18} style={{ color: 'var(--accent)' }} />
            Order Tray Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {cart.map(({ item, quantity }) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className={`veg-indicator ${!item.isVeg ? 'nonveg' : ''}`} />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                    × {quantity}
                  </span>
                </div>
                <span style={{ fontWeight: 700 }}>
                  {formatPrice(item.price * quantity)}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '1.5px dashed rgba(0, 0, 0, 0.1)',
            }}
          >
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>Total Payable</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatPrice(totalAmount)}
            </span>
          </div>
        </GlassCard>

        {/* Schedule & Notes */}
        <GlassCard style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} style={{ color: 'var(--accent)' }} />
            Pickup Scheduling
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">When would you like to collect your food?</label>
              <select
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="glass-input"
              >
                <option value="now">⚡ ASAP (~12-15 mins prep)</option>
                <option value="19:15">7:15 PM (Dinner break slot 1)</option>
                <option value="19:30">7:30 PM (Dinner break slot 2)</option>
                <option value="19:45">7:45 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="20:30">8:30 PM (Late dinner)</option>
              </select>
            </div>

            <GlassInput
              label="Special Cooking Notes (Optional)"
              placeholder="e.g. Extra spicy, less oil, pack separately"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </div>
        </GlassCard>

        {/* Payment Gateways */}
        <GlassCard style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={18} style={{ color: 'var(--accent)' }} />
            Select Payment Method
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {/* Razorpay (UPI + Cards) */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: paymentMethod === 'RAZORPAY' 
                  ? '2px solid var(--accent)' 
                  : '1px solid rgba(0,0,0,0.06)',
                background: paymentMethod === 'RAZORPAY' 
                  ? 'rgba(255, 107, 53, 0.05)' 
                  : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'RAZORPAY'}
                  onChange={() => setPaymentMethod('RAZORPAY')}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Razorpay Digital Pay</span>
                    <span className="glass-badge badge-accent" style={{ fontSize: '0.7rem' }}>
                      Recommended
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    UPI (GPay / PhonePe / Paytm), Debit/Credit Cards & NetBanking
                  </span>
                </div>
              </div>
              <Smartphone size={22} style={{ color: 'var(--accent)' }} />
            </label>

            {/* Direct UPI Scan */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: paymentMethod === 'UPI_DIRECT' 
                  ? '2px solid var(--accent)' 
                  : '1px solid rgba(0,0,0,0.06)',
                background: paymentMethod === 'UPI_DIRECT' 
                  ? 'rgba(255, 107, 53, 0.05)' 
                  : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI_DIRECT'}
                  onChange={() => setPaymentMethod('UPI_DIRECT')}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    Direct UPI QR Pay
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    Instant QR generation for seamless campus scanning
                  </span>
                </div>
              </div>
              <CreditCard size={22} style={{ color: 'var(--text-tertiary)' }} />
            </label>

            {/* Canteen Counter Pay */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: paymentMethod === 'CAMPUS_CARD' 
                  ? '2px solid var(--accent)' 
                  : '1px solid rgba(0,0,0,0.06)',
                background: paymentMethod === 'CAMPUS_CARD' 
                  ? 'rgba(255, 107, 53, 0.05)' 
                  : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CAMPUS_CARD'}
                  onChange={() => setPaymentMethod('CAMPUS_CARD')}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    Pay at Counter / Mess Card
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    Show Token Number at counter and pay via cash or hostel card
                  </span>
                </div>
              </div>
              <Banknote size={22} style={{ color: 'var(--text-tertiary)' }} />
            </label>
          </div>

          <GlassButton
            onClick={handlePayment}
            size="lg"
            loading={loading}
            style={{ width: '100%', padding: '16px' }}
          >
            <ShieldCheck size={20} /> Pay {formatPrice(totalAmount)} & Confirm Order
          </GlassButton>
        </GlassCard>
      </div>
    </div>
  );
}
