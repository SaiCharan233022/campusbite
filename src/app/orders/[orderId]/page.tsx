'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { OrderStatusTracker } from '@/components/OrderStatusTracker';
import { Order } from '@/types';
import { formatPrice, formatTime, formatDate, getStatusLabel } from '@/lib/utils';
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  Clock, 
  Receipt, 
  CheckCircle2,
  Phone,
  ChefHat,
  Star,
  MessageSquare,
  PartyPopper
} from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params?.orderId as string;
  const isSuccess = searchParams?.get('success') === 'true';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Feedback State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Poll for live status updates every 4 seconds
  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
      const interval = setInterval(loadOrder, 4000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const submitFeedback = async () => {
    setSubmittingFeedback(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, feedback: feedbackText }),
      });
      if (res.ok) {
        setFeedbackSubmitted(true);
      }
    } catch (e) {
      setFeedbackSubmitted(true);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (!order && !loading) {
    return (
      <div className="container" style={{ maxWidth: '500px', paddingTop: '40px' }}>
        <GlassCard style={{ padding: '32px', textAlign: 'center' }}>
          <p className="empty-state-title">Order Not Found</p>
          <Link href="/orders" className="glass-btn glass-btn-primary" style={{ marginTop: '16px' }}>
            Back to Orders
          </Link>
        </GlassCard>
      </div>
    );
  }

  if (!order) return null;

  const isFoodCompleted = order.status === 'READY' || order.status === 'COLLECTED';

  return (
    <div className="container" style={{ maxWidth: '680px', paddingTop: '10px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link
          href="/orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
      </div>

      {/* When Food is Completed & Ready */}
      {isFoodCompleted ? (
        <div
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.25))',
            border: '2px solid rgba(34, 197, 94, 0.4)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <PartyPopper size={32} style={{ color: '#15803d', flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d', margin: 0 }}>
              ✅ Food Completed & Ready for Pickup!
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#166534', margin: '4px 0 0' }}>
              Your food is freshly packed and waiting at the counter. Please show Token #{order.tokenNumber} to collect!
            </p>
          </div>
        </div>
      ) : isSuccess ? (
        <div
          style={{
            padding: '16px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <CheckCircle2 size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>
              Order Confirmed & Sent to Kitchen!
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Your token has been allocated. Please show this screen at the counter.
            </p>
          </div>
        </div>
      ) : null}

      {/* Prominent Token Display */}
      <div className="token-display" style={{ marginBottom: '24px' }}>
        <span className="token-label">Your Pickup Token</span>
        <div className="token-number">#{order.tokenNumber}</div>
        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '8px' }}>
          Show this Token # at <strong>{order.canteen?.name}</strong>
        </p>
      </div>

      {/* Live Kitchen Progress Status */}
      <GlassCard style={{ padding: '24px', marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChefHat size={18} style={{ color: 'var(--accent)' }} />
            Live Kitchen Status
          </h3>
          <span className="glass-badge badge-accent">
            {getStatusLabel(order.status)}
          </span>
        </div>

        <OrderStatusTracker status={order.status} />

        <div
          style={{
            padding: '12px',
            background: 'rgba(0, 0, 0, 0.02)',
            borderRadius: 'var(--radius-md)',
            marginTop: '16px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>
            Scheduled Pickup: <strong>{order.scheduledFor === 'now' ? '⚡ ASAP' : order.scheduledFor}</strong>
          </span>
          <span>
            Est. Ready: <strong>{order.estimatedReady ? formatTime(order.estimatedReady) : '15 mins'}</strong>
          </span>
        </div>
      </GlassCard>

      {/* Student Feedback & Rating Card */}
      <GlassCard style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Star size={18} style={{ color: '#EAB308' }} />
          Rate Food & Canteen Service
        </h3>

        {feedbackSubmitted ? (
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--success)' }}>
            <CheckCircle2 size={36} style={{ margin: '0 auto 8px' }} />
            <h4 style={{ fontWeight: 700 }}>Thank you for your review!</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Your feedback has been sent directly to the canteen management.
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              How was your food taste, packaging, and pickup speed?
            </p>

            {/* Interactive 5 Stars */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    transition: 'transform 0.2s',
                    transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  <Star
                    size={28}
                    fill={(hoverRating || rating) >= star ? '#EAB308' : 'none'}
                    color={(hoverRating || rating) >= star ? '#EAB308' : '#D1D5DB'}
                  />
                </button>
              ))}
              <span style={{ fontSize: '0.9rem', fontWeight: 700, alignSelf: 'center', marginLeft: '8px' }}>
                {rating === 5 ? '⭐⭐⭐⭐⭐ Delicious!' : rating === 4 ? '⭐⭐⭐⭐ Very Good' : rating === 3 ? '⭐⭐⭐ Average' : 'Needs Improvement'}
              </span>
            </div>

            <textarea
              placeholder="Write your feedback (e.g. Biryani was fresh and flavorful, great quick service!)"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="glass-input"
              rows={3}
              style={{ width: '100%', resize: 'none', marginBottom: '14px', fontSize: '0.85rem' }}
            />

            <GlassButton
              onClick={submitFeedback}
              loading={submittingFeedback}
              style={{ width: '100%' }}
            >
              <MessageSquare size={16} /> Submit Student Review
            </GlassButton>
          </div>
        )}
      </GlassCard>

      {/* Order Item Details */}
      <GlassCard style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Receipt size={18} style={{ color: 'var(--accent)' }} />
          Receipt & Tray Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          {order.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.9rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={`veg-indicator ${!item.menuItem?.isVeg ? 'nonveg' : ''}`} />
                <span style={{ fontWeight: 600 }}>{item.menuItem?.name}</span>
                <span style={{ color: 'var(--text-tertiary)' }}>× {item.quantity}</span>
              </div>
              <span style={{ fontWeight: 700 }}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {order.notes && (
          <div
            style={{
              padding: '10px',
              background: 'rgba(255, 107, 53, 0.06)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
            }}
          >
            Payment / notes: <em>"{order.notes}"</em>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '12px',
            borderTop: '1.5px dashed rgba(0, 0, 0, 0.1)',
          }}
        >
          <span style={{ fontWeight: 700 }}>Total Paid</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(0, 0, 0, 0.04)',
            fontSize: '0.8rem',
            color: 'var(--text-tertiary)',
          }}
        >
          <span>Order ID: {order.id.slice(0, 10)}...</span>
          <span>{formatDate(order.createdAt)}</span>
        </div>
      </GlassCard>
    </div>
  );
}
