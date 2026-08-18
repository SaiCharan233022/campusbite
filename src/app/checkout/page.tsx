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
  Smartphone, 
  Banknote,
  Receipt,
  AlertCircle,
  QrCode,
  CheckCircle,
  ExternalLink,
  Edit3
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

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'UPI_DIRECT' | 'RAZORPAY' | 'CAMPUS_CARD'>('UPI_DIRECT');
  const [upiId, setUpiId] = useState('canteen.campusbite@okaxis');
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [customUpiInput, setCustomUpiInput] = useState('');
  const [upiRefNumber, setUpiRefNumber] = useState('');
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

  // Dynamic UPI Intent URI
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('CampusBite Canteen')}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent('CampusBite Food Order')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiIntentUri)}`;

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
          notes: orderNotes ? `${orderNotes} | Paid via UPI (${upiRefNumber || 'Direct'})` : `Paid via UPI (${upiRefNumber || 'Direct'})`,
          userId: (session?.user as any)?.id || 'guest_student',
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to place order');
      }

      const createdOrder = orderData.order;

      // 2. Trigger celebratory confetti!
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      clearCart();
      router.push(`/orders/${createdOrder.id}?success=true`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Payment processing failed. Please try again.');
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
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
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
                <option value="now">⚡ ASAP (~10-15 mins prep)</option>
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

        {/* Real UPI & Payment Gateway */}
        <GlassCard style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={18} style={{ color: 'var(--accent)' }} />
            Select Payment Method
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {/* Live UPI Direct */}
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
                  ? 'rgba(255, 107, 53, 0.06)' 
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
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>⚡ Live Instant UPI Pay (PhonePe / GPay / Paytm)</span>
                    <span className="glass-badge badge-accent" style={{ fontSize: '0.7rem' }}>
                      0% Fee
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    Scan QR or tap to open UPI app. Funds go directly to the canteen account.
                  </span>
                </div>
              </div>
              <QrCode size={24} style={{ color: 'var(--accent)' }} />
            </label>

            {/* Counter Cash Pay */}
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
                  ? 'rgba(255, 107, 53, 0.06)' 
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
                    Pay at Canteen Counter (Cash / Hostel Card)
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    Collect Token and pay physically at pickup
                  </span>
                </div>
              </div>
              <Banknote size={22} style={{ color: 'var(--text-tertiary)' }} />
            </label>
          </div>

          {/* Dynamic UPI Payment Box */}
          {paymentMethod === 'UPI_DIRECT' && (
            <div
              style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 107, 53, 0.2)',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Receiving UPI ID / Phone: <strong style={{ color: 'var(--text-primary)' }}>{upiId}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingUpi(!isEditingUpi)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Edit3 size={14} /> {isEditingUpi ? 'Done' : 'Change UPI / Phone'}
                </button>
              </div>

              {isEditingUpi && (
                <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210@ybl or yourname@okaxis"
                      value={customUpiInput}
                      onChange={(e) => setCustomUpiInput(e.target.value)}
                      className="glass-input"
                      style={{ fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        let finalId = customUpiInput.trim();
                        // If user entered only 10 digit number, append @ybl or @paytm
                        if (/^\d{10}$/.test(finalId)) {
                          finalId = `${finalId}@ybl`;
                        }
                        if (finalId) {
                          setUpiId(finalId);
                          setIsEditingUpi(false);
                        }
                      }}
                      className="glass-btn glass-btn-primary"
                      style={{ padding: '0 16px', flexShrink: 0 }}
                    >
                      Save
                    </button>
                  </div>

                  {/* Quick Handle Suggestions */}
                  {/^\d{10}$/.test(customUpiInput.trim()) && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: 600 }}>Tap your payment app:</span>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => setCustomUpiInput(`${customUpiInput.trim()}@ybl`)}
                          className="glass-badge badge-accent"
                          style={{ cursor: 'pointer', fontSize: '0.75rem', padding: '4px 8px' }}
                        >
                          📱 PhonePe (@ybl)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomUpiInput(`${customUpiInput.trim()}@paytm`)}
                          className="glass-badge"
                          style={{ cursor: 'pointer', fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(0,0,0,0.06)' }}
                        >
                          💳 Paytm (@paytm)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomUpiInput(`${customUpiInput.trim()}@okaxis`)}
                          className="glass-badge"
                          style={{ cursor: 'pointer', fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(0,0,0,0.06)' }}
                        >
                          🇬 Google Pay (@okaxis)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomUpiInput(`${customUpiInput.trim()}@okhdfcbank`)}
                          className="glass-badge"
                          style={{ cursor: 'pointer', fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(0,0,0,0.06)' }}
                        >
                          🏦 GPay HDFC (@okhdfcbank)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Real Dynamic QR Code */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '12px 0' }}>
                <div
                  style={{
                    padding: '12px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    display: 'inline-block',
                  }}
                >
                  <img
                    src={qrCodeUrl}
                    alt="Canteen UPI QR Code"
                    width={220}
                    height={220}
                    style={{ display: 'block', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ marginTop: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Scan to Pay {formatPrice(totalAmount)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  Supports Google Pay, PhonePe, Paytm, BHIM & all UPI apps
                </div>
              </div>

              {/* Mobile Direct UPI Deep Link */}
              <div style={{ marginTop: '16px' }}>
                <a
                  href={upiIntentUri}
                  className="glass-btn glass-btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={16} /> Tap to Open GPay / PhonePe App
                </a>
              </div>

              {/* UTR / Ref No. */}
              <div style={{ marginTop: '16px', textAlign: 'left' }}>
                <GlassInput
                  label="UPI Reference / UTR Number (Optional confirmation)"
                  placeholder="e.g. 423456789012"
                  value={upiRefNumber}
                  onChange={(e) => setUpiRefNumber(e.target.value)}
                />
              </div>
            </div>
          )}

          <GlassButton
            onClick={handlePayment}
            size="lg"
            loading={loading}
            style={{ width: '100%', padding: '16px' }}
          >
            <ShieldCheck size={20} /> Confirm & Allocate Token ({formatPrice(totalAmount)})
          </GlassButton>
        </GlassCard>
      </div>
    </div>
  );
}
