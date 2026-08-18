'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { formatPrice } from '@/lib/utils';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Users, 
  Utensils, 
  AlertTriangle,
  ArrowRight,
  Flame,
  CheckCircle2,
  ChefHat
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container" style={{ maxWidth: '1100px' }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title">Canteen Manager Portal</h1>
            <p className="page-subtitle">
              Live campus kitchen order stream, queue analytics, and menu stock control
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/admin/orders">
              <GlassButton size="md">
                <ChefHat size={18} /> Live Kitchen Board
              </GlassButton>
            </Link>
            <Link href="/admin/menu">
              <GlassButton variant="secondary" size="md">
                <Utensils size={18} /> Manage Menu
              </GlassButton>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <GlassCard className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--accent)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Orders</span>
            <Flame size={20} />
          </div>
          <div className="stat-value" style={{ marginTop: '12px', color: 'var(--accent)' }}>
            {stats?.activeOrders ?? 4}
          </div>
          <span className="stat-label">In Kitchen Prep Queue</span>
        </GlassCard>

        <GlassCard className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--success)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Today's Revenue</span>
            <TrendingUp size={20} />
          </div>
          <div className="stat-value" style={{ marginTop: '12px' }}>
            {formatPrice(stats?.totalRevenue ?? 3420)}
          </div>
          <span className="stat-label">Cashless & UPI total</span>
        </GlassCard>

        <GlassCard className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#3B82F6' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Avg Kitchen Wait</span>
            <Clock size={20} />
          </div>
          <div className="stat-value" style={{ marginTop: '12px' }}>
            ~{stats?.estimatedAvgWaitMins ?? 12}m
          </div>
          <span className="stat-label">Smart Wait Estimation</span>
        </GlassCard>

        <GlassCard className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#A855F7' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Menu Dishes</span>
            <Utensils size={20} />
          </div>
          <div className="stat-value" style={{ marginTop: '12px' }}>
            {stats?.totalMenuItems ?? 23}
          </div>
          <span className="stat-label">Across 3 Canteens</span>
        </GlassCard>
      </div>

      {/* Rush Hour Distribution & Quick Actions */}
      <div className="grid grid-2" style={{ marginBottom: '32px' }}>
        {/* Peak Rush Hour Graph */}
        <GlassCard style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} style={{ color: 'var(--accent)' }} />
            Campus Rush Hour Analysis (7-8 PM Peak)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '20px' }}>
            Pre-orders level the 7-8 PM spike, distributing load into batchable windows.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { time: '12:30 PM - 1:30 PM (Lunch)', count: 48, percentage: 75, highlight: false },
              { time: '5:00 PM - 6:00 PM (Tea & Snacks)', count: 32, percentage: 50, highlight: false },
              { time: '7:00 PM - 8:00 PM (Dinner Peak Rush)', count: 64, percentage: 95, highlight: true },
              { time: '8:30 PM - 9:30 PM (Late Dinner)', count: 26, percentage: 40, highlight: false },
            ].map((slot) => (
              <div key={slot.time}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: slot.highlight ? 700 : 500, color: slot.highlight ? 'var(--accent)' : 'inherit' }}>
                    {slot.time}
                  </span>
                  <span style={{ fontWeight: 600 }}>{slot.count} orders</span>
                </div>
                <div
                  style={{
                    height: '10px',
                    borderRadius: '5px',
                    background: 'rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${slot.percentage}%`,
                      background: slot.highlight ? 'var(--accent-gradient)' : 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '5px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Management Shortcuts */}
        <GlassCard style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
            Manager Control Hub
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Link href="/admin/orders">
              <div
                style={{
                  padding: '14px',
                  background: 'rgba(255, 107, 53, 0.08)',
                  border: '1px solid rgba(255, 107, 53, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent)' }}>
                    Kitchen Order Screen (KDS)
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Advance orders through Placed → Prep → Ready for Pickup
                  </p>
                </div>
                <ArrowRight size={18} style={{ color: 'var(--accent)' }} />
              </div>
            </Link>

            <Link href="/admin/menu">
              <div
                style={{
                  padding: '14px',
                  background: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    Instant Stock & Menu Toggles
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Mark out-of-stock items in 1 click to avoid student disappointment
                  </p>
                </div>
                <ArrowRight size={18} />
              </div>
            </Link>

            <Link href="/admin/analytics">
              <div
                style={{
                  padding: '14px',
                  background: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    Detailed Sales & Demand Forecast
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Top ordered dishes, payment reconciliation & insights
                  </p>
                </div>
                <ArrowRight size={18} />
              </div>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
