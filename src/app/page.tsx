'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { WaitTimeIndicator } from '@/components/WaitTimeIndicator';
import { MenuItemCard } from '@/components/MenuItemCard';
import { MenuItem, Canteen } from '@/types';
import { 
  Sparkles, 
  Clock, 
  Utensils, 
  CreditCard, 
  CalendarClock, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [menuRes, canteensRes] = await Promise.all([
          fetch('/api/menu?limit=6'),
          fetch('/api/canteens'),
        ]);

        if (menuRes.ok) {
          const data = await menuRes.json();
          setFeaturedItems(data.items || []);
        }
        if (canteensRes.ok) {
          const data = await canteensRes.json();
          setCanteens(data.canteens || []);
        }
      } catch (err) {
        console.error('Failed to load initial data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          {/* Rush Alert & Live Indicator Badge */}
          <div
            style={{
              display: 'inline-flex',
              marginBottom: '20px',
            }}
          >
            <WaitTimeIndicator
              estimatedMinutes={14}
              activeOrders={8}
              canteenName="Main Mess"
            />
          </div>

          <h1
            style={{
              fontSize: 'var(--font-size-hero)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            Smart dining for <br />
            <span className="text-gradient">campus life without queues.</span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto 28px',
              lineHeight: 1.6,
            }}
          >
            Pre-order during class, track live kitchen prep, and grab your tray
            right at the counter. Zero cash hassle, zero 7–8 PM dinner chaos.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/menu">
              <GlassButton size="lg">
                Explore Today's Menu <ArrowRight size={18} />
              </GlassButton>
            </Link>
            <Link href="/orders">
              <GlassButton variant="secondary" size="lg">
                <Clock size={18} /> Track Active Order
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Problem-Solution Pillars (Faculty Demo Highlights) ─── */}
      <section style={{ marginBottom: '60px' }}>
        <div className="grid grid-4 stagger-children">
          <GlassCard style={{ padding: '20px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(255, 107, 53, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                marginBottom: '14px',
              }}
            >
              <Clock size={24} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
              1. Peak Rush Solved
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Avoid the 7–8 PM crowd by slot pre-ordering. Food is ready right when you arrive.
            </p>
          </GlassCard>

          <GlassCard style={{ padding: '20px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(34, 197, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--veg)',
                marginBottom: '14px',
              }}
            >
              <Utensils size={24} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
              2. Clear Daily Menus
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Know exactly what's cooking today with clear veg/non-veg tags and live stock status.
            </p>
          </GlassCard>

          <GlassCard style={{ padding: '20px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3B82F6',
                marginBottom: '14px',
              }}
            >
              <CreditCard size={24} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
              3. Seamless Payments
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Razorpay integration with instant UPI, cards & digital tokens. Zero change friction.
            </p>
          </GlassCard>

          <GlassCard style={{ padding: '20px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(168, 85, 247, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A855F7',
                marginBottom: '14px',
              }}
            >
              <CalendarClock size={24} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
              4. Scheduled Orders
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Place orders during lectures or breaks and schedule exact collection times.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* ── Campus Canteens Directory ───────────────────────────── */}
      <section style={{ marginBottom: '60px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              Campus Food Outlets
            </h2>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              Choose your favorite campus spot to order from
            </p>
          </div>
          <Link
            href="/menu"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-3">
          {canteens.map((canteen) => (
            <Link key={canteen.id} href={`/menu/${canteen.id}`}>
              <GlassCard
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>
                    {canteen.id === 'canteen-main' ? '🍲' : canteen.id === 'canteen-juice' ? '🧃' : '☕'}
                  </span>
                  <span
                    className="glass-badge badge-available"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Open • {canteen.openTime} - {canteen.closeTime}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
                  {canteen.name}
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '16px',
                    flex: 1,
                  }}
                >
                  {canteen.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <MapPin size={14} /> {canteen.location}
                  </span>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--accent)',
                    }}
                  >
                    Order Now →
                  </span>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Today's Specials Grid ───────────────────────────────── */}
      <section style={{ marginBottom: '80px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Today's Campus Specials</span>
              <Sparkles size={20} style={{ color: 'var(--accent)' }} />
            </h2>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              Freshly cooked student favorites ready for quick collection
            </p>
          </div>
          <Link
            href="/menu"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Full Menu <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-2">
          {featuredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
