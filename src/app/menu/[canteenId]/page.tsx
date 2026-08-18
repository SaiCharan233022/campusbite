'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { MenuItemCard } from '@/components/MenuItemCard';
import { WaitTimeIndicator } from '@/components/WaitTimeIndicator';
import { MenuItem, Canteen } from '@/types';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Leaf, 
  Search,
  Sparkles
} from 'lucide-react';

export default function CanteenDetailPage() {
  const params = useParams();
  const canteenId = params?.canteenId as string;

  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [vegOnly, setVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCanteenData() {
      try {
        const [canteensRes, menuRes] = await Promise.all([
          fetch('/api/canteens'),
          fetch(`/api/menu?canteenId=${canteenId}`),
        ]);

        if (canteensRes.ok) {
          const cData = await canteensRes.json();
          const current = (cData.canteens || []).find((c: Canteen) => c.id === canteenId);
          setCanteen(current || null);
        }

        if (menuRes.ok) {
          const mData = await menuRes.json();
          setItems(mData.items || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (canteenId) loadCanteenData();
  }, [canteenId]);

  const categories = ['ALL', ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (vegOnly && !item.isVeg) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="container">
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
          <ArrowLeft size={16} /> Back to All Canteens
        </Link>
      </div>

      {/* Canteen Banner Card */}
      {canteen && (
        <GlassCard style={{ padding: '28px', marginBottom: '28px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '2rem' }}>
                  {canteen.id === 'canteen-main' ? '🍲' : canteen.id === 'canteen-juice' ? '🧃' : '☕'}
                </span>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                  {canteen.name}
                </h1>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '600px', marginBottom: '12px' }}>
                {canteen.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {canteen.location}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> Timings: {canteen.openTime} - {canteen.closeTime}
                </span>
              </div>
            </div>

            <WaitTimeIndicator
              estimatedMinutes={12}
              activeOrders={5}
              canteenName={canteen.name}
            />
          </div>
        </GlassCard>
      )}

      {/* Filter Bar */}
      <GlassCard style={{ padding: '14px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
              }}
            />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ paddingLeft: '38px', padding: '8px 12px 8px 38px', fontSize: '0.85rem' }}
            />
          </div>

          <div
            className="toggle-container"
            onClick={() => setVegOnly(!vegOnly)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <div className={`toggle-switch ${vegOnly ? 'active' : ''}`}>
              <div className="toggle-knob" />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: vegOnly ? 'var(--veg)' : 'var(--text-secondary)' }}>
              Pure Veg
            </span>
          </div>
        </div>

        <div className="category-filter" style={{ marginTop: '10px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Items */}
      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">No menu items match your criteria</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
