'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, TrendingUp, Users, Flame, Utensils, Award, PieChart, Sparkles } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const topDishes = [
    { name: 'Chicken Biryani', count: 142, revenue: '₹21,300', canteen: 'Main Mess' },
    { name: 'Paneer Butter Masala', count: 118, revenue: '₹14,160', canteen: 'Main Mess' },
    { name: 'Cold Coffee', count: 96, revenue: '₹5,280', canteen: 'Juice Corner' },
    { name: 'Cutting Chai', count: 210, revenue: '₹3,150', canteen: 'Chai & Snacks' },
    { name: 'Masala Dosa', count: 88, revenue: '₹5,280', canteen: 'Main Mess' },
  ];

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
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
        <h1 className="page-title">Campus Dining Analytics & Trends</h1>
        <p className="page-subtitle">
          Real-time metrics on demand patterns, peak times, and student dining habits
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-3" style={{ marginBottom: '28px' }}>
        <GlassCard style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Peak Queue Reduction</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginTop: '6px' }}>
            -68%
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Due to pre-order batching
          </span>
        </GlassCard>

        <GlassCard style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Cashless Adoption</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', marginTop: '6px' }}>
            94.2%
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            UPI & Digital Gateway
          </span>
        </GlassCard>

        <GlassCard style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Avg Pickup Punctuality</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B82F6', marginTop: '6px' }}>
            96%
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Students collect within 5 mins of Ready ping
          </span>
        </GlassCard>
      </div>

      {/* Top Dishes Leaderboard */}
      <GlassCard style={{ padding: '24px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} style={{ color: 'var(--accent)' }} />
          Campus Bestsellers Leaderboard
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {topDishes.map((dish, i) => (
            <div
              key={dish.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: i === 0 ? 'rgba(255, 107, 53, 0.08)' : 'rgba(255, 255, 255, 0.5)',
                borderRadius: 'var(--radius-md)',
                border: i === 0 ? '1px solid rgba(255, 107, 53, 0.2)' : '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: i === 0 ? 'var(--accent)' : 'var(--text-tertiary)',
                    width: '24px',
                  }}
                >
                  #{i + 1}
                </span>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{dish.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {dish.canteen}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{dish.revenue}</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  {dish.count} orders
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
