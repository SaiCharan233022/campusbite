'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { Order } from '@/types';
import { formatPrice, formatDate, formatTime, getStatusLabel, getStatusEmoji } from '@/lib/utils';
import { Clock, ArrowRight, ShoppingBag, CheckCircle2, AlertCircle } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status !== 'COLLECTED' && o.status !== 'CANCELLED'
  );
  const pastOrders = orders.filter(
    (o) => o.status === 'COLLECTED' || o.status === 'CANCELLED'
  );

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">
          Track your active food preparation status and view order receipts
        </p>
      </div>

      {orders.length === 0 && !loading ? (
        <div className="empty-state">
          <span style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🥡</span>
          <p className="empty-state-title">No orders placed yet</p>
          <p className="empty-state-desc">
            Explore the campus menu to order ahead and beat the queue!
          </p>
          <Link href="/menu" className="glass-btn glass-btn-primary">
            Explore Menu
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Active Orders Section */}
          {activeOrders.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔥 Active Orders ({activeOrders.length})</span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {activeOrders.map((order) => (
                  <Link key={order.id} href={`/orders/${order.id}`}>
                    <GlassCard
                      style={{
                        padding: '20px',
                        border: '1.5px solid rgba(255, 107, 53, 0.3)',
                        background: 'rgba(255, 255, 255, 0.75)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              fontSize: '1.1rem',
                              fontWeight: 800,
                              color: 'var(--accent)',
                              background: 'rgba(255, 107, 53, 0.1)',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-md)',
                            }}
                          >
                            Token #{order.tokenNumber}
                          </span>
                          <span style={{ fontWeight: 700 }}>
                            {order.canteen?.name || 'Canteen'}
                          </span>
                        </div>

                        <GlassBadge variant="status">
                          {getStatusEmoji(order.status)} {getStatusLabel(order.status)}
                        </GlassBadge>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        {order.items.map((i) => `${i.menuItem?.name || 'Item'} (×${i.quantity})`).join(', ')}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '10px',
                          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                          fontSize: '0.85rem',
                        }}
                      >
                        <span style={{ color: 'var(--text-tertiary)' }}>
                          Scheduled: {order.scheduledFor === 'now' ? '⚡ ASAP' : order.scheduledFor}
                        </span>
                        <span style={{ fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          View Live Status <ArrowRight size={14} />
                        </span>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Past Orders */}
          {pastOrders.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-secondary)' }}>
                Order History
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pastOrders.map((order) => (
                  <Link key={order.id} href={`/orders/${order.id}`}>
                    <GlassCard style={{ padding: '16px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600 }}>Token #{order.tokenNumber}</span>
                          <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {order.canteen?.name}
                          </span>
                        </div>
                        <span style={{ fontWeight: 700 }}>
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.8rem',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        <span>{formatDate(order.createdAt)} at {formatTime(order.createdAt)}</span>
                        <span style={{ color: order.status === 'COLLECTED' ? 'var(--success)' : 'var(--error)' }}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
