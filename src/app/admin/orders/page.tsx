'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatTime, getStatusLabel } from '@/lib/utils';
import { 
  ArrowLeft, 
  ChefHat, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Filter, 
  RefreshCw,
  Phone,
  Flame
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?all=true');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'ACTIVE') {
      return o.status !== 'COLLECTED' && o.status !== 'CANCELLED';
    }
    if (statusFilter !== 'ALL') {
      return o.status === statusFilter;
    }
    return true;
  });

  return (
    <div className="container" style={{ maxWidth: '1100px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link
          href="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title">Live Kitchen Order Display (KDS)</h1>
            <p className="page-subtitle">
              Real-time incoming campus trays. Advance order status to update student screens.
            </p>
          </div>

          <GlassButton onClick={fetchOrders} variant="secondary" size="sm">
            <RefreshCw size={16} /> Auto-Sync Active
          </GlassButton>
        </div>
      </div>

      {/* Filter Chips */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => setStatusFilter('ACTIVE')}
          className={`category-chip ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
        >
          🔥 Active Kitchen Queue ({orders.filter((o) => o.status !== 'COLLECTED' && o.status !== 'CANCELLED').length})
        </button>
        <button
          onClick={() => setStatusFilter('PLACED')}
          className={`category-chip ${statusFilter === 'PLACED' ? 'active' : ''}`}
        >
          📋 New Placed ({orders.filter((o) => o.status === 'PLACED').length})
        </button>
        <button
          onClick={() => setStatusFilter('PREPARING')}
          className={`category-chip ${statusFilter === 'PREPARING' ? 'active' : ''}`}
        >
          👨‍🍳 In Cooking ({orders.filter((o) => o.status === 'PREPARING').length})
        </button>
        <button
          onClick={() => setStatusFilter('READY')}
          className={`category-chip ${statusFilter === 'READY' ? 'active' : ''}`}
        >
          🔔 Ready for Pickup ({orders.filter((o) => o.status === 'READY').length})
        </button>
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`category-chip ${statusFilter === 'ALL' ? 'active' : ''}`}
        >
          All Orders ({orders.length})
        </button>
      </div>

      {/* Orders Stream Grid */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '3rem', marginBottom: '12px' }}>✨</span>
          <p className="empty-state-title">No orders in this queue</p>
          <p className="empty-state-desc">
            Kitchen queue is clear! Incoming orders will appear here automatically in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-2" style={{ gap: '20px' }}>
          {filteredOrders.map((order) => (
            <GlassCard
              key={order.id}
              style={{
                padding: '20px',
                border: order.status === 'READY' 
                  ? '2px solid var(--success)' 
                  : order.status === 'PREPARING'
                  ? '2px solid var(--accent)'
                  : '1px solid var(--glass-border)',
                background: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              {/* Order Card Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--accent)',
                      background: 'rgba(255, 107, 53, 0.1)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    #{order.tokenNumber}
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                      {order.user?.name || 'Student'} ({order.user?.collegeId || 'Roll No'})
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      Placed at {formatTime(order.createdAt)}
                    </span>
                  </div>
                </div>

                <GlassBadge variant={order.status === 'READY' ? 'available' : 'status'}>
                  {getStatusLabel(order.status)}
                </GlassBadge>
              </div>

              {/* Scheduled Time Banner */}
              <div
                style={{
                  padding: '8px 12px',
                  background: order.scheduledFor !== 'now' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(0, 0, 0, 0.03)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: order.scheduledFor !== 'now' ? '#A855F7' : 'var(--text-secondary)',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Clock size={14} />
                {order.scheduledFor === 'now' ? '⚡ ASAP Preparation' : `⏰ Scheduled for: ${order.scheduledFor}`}
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {order.items.map((i) => (
                  <div
                    key={i.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                      padding: '4px 0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className={`veg-indicator ${!i.menuItem?.isVeg ? 'nonveg' : ''}`} />
                      <span style={{ fontWeight: 700 }}>{i.quantity} ×</span>
                      <span>{i.menuItem?.name}</span>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {formatPrice(i.price * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {order.notes && (
                <div
                  style={{
                    padding: '8px 10px',
                    background: 'rgba(255, 107, 53, 0.08)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    color: 'var(--accent)',
                    marginBottom: '14px',
                    fontWeight: 500,
                  }}
                >
                  Notes: {order.notes}
                </div>
              )}

              {/* Action Stage Buttons */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
                {order.status === 'PLACED' && (
                  <GlassButton
                    onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                    size="sm"
                    style={{ flex: 1 }}
                  >
                    <ChefHat size={16} /> Start Cooking
                  </GlassButton>
                )}

                {order.status === 'PREPARING' && (
                  <GlassButton
                    onClick={() => updateOrderStatus(order.id, 'READY')}
                    size="sm"
                    style={{ flex: 1, background: 'var(--success)', color: 'white' }}
                  >
                    <Bell size={16} /> Mark Ready & Notify
                  </GlassButton>
                )}

                {order.status === 'READY' && (
                  <GlassButton
                    onClick={() => updateOrderStatus(order.id, 'COLLECTED')}
                    size="sm"
                    style={{ flex: 1, background: 'var(--accent-gradient)' }}
                  >
                    <CheckCircle2 size={16} /> Handed Over / Collected
                  </GlassButton>
                )}

                {order.status !== 'COLLECTED' && order.status !== 'CANCELLED' && (
                  <button
                    onClick={() => {
                      if (confirm('Cancel this order?')) {
                        updateOrderStatus(order.id, 'CANCELLED');
                      }
                    }}
                    className="glass-btn glass-btn-ghost glass-btn-sm"
                    style={{ color: 'var(--error)' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
