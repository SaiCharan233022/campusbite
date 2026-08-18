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
  ChefHat
} from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params?.orderId as string;
  const isSuccess = searchParams?.get('success') === 'true';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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

      {isSuccess && (
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
      )}

      {/* Prominent Token Display (Problem 1 Solution) */}
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
            Cooking notes: <em>"{order.notes}"</em>
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
