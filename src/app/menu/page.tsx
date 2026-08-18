'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { MenuItemCard } from '@/components/MenuItemCard';
import { WaitTimeIndicator } from '@/components/WaitTimeIndicator';
import { MenuItem, Canteen } from '@/types';
import { 
  Search, 
  Filter, 
  UtensilsCrossed, 
  Leaf, 
  Clock, 
  Flame, 
  Sparkles, 
  Building2 
} from 'lucide-react';

const CATEGORIES = [
  { key: 'ALL', label: 'All Items', emoji: '🍽️' },
  { key: 'BREAKFAST', label: 'Breakfast', emoji: '🥞' },
  { key: 'LUNCH', label: 'Lunch', emoji: '🍛' },
  { key: 'DINNER', label: 'Dinner', emoji: '🥘' },
  { key: 'SNACKS', label: 'Snacks & Quick', emoji: '🥟' },
  { key: 'BEVERAGES', label: 'Chai & Juices', emoji: '🥤' },
  { key: 'DESSERTS', label: 'Desserts', emoji: '🍨' },
];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteen, setSelectedCanteen] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [canteensRes, menuRes] = await Promise.all([
          fetch('/api/canteens'),
          fetch('/api/menu'),
        ]);

        if (canteensRes.ok) {
          const cData = await canteensRes.json();
          setCanteens(cData.canteens || []);
        }

        if (menuRes.ok) {
          const mData = await menuRes.json();
          setItems(mData.items || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCanteen !== 'ALL' && item.canteenId !== selectedCanteen) {
      return false;
    }
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
      return false;
    }
    if (vegOnly && !item.isVeg) {
      return false;
    }
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
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h1 className="page-title">Campus Menu & Dining</h1>
            <p className="page-subtitle">
              Check live kitchen availability, pre-order meals, and avoid queue bottlenecks.
            </p>
          </div>

          <WaitTimeIndicator
            estimatedMinutes={12}
            activeOrders={6}
            canteenName="Campus Kitchens"
          />
        </div>
      </div>

      {/* Canteen Selector Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => setSelectedCanteen('ALL')}
          className={`category-chip ${selectedCanteen === 'ALL' ? 'active' : ''}`}
        >
          🏛️ All Campus Outlets ({items.length})
        </button>
        {canteens.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCanteen(c.id)}
            className={`category-chip ${selectedCanteen === c.id ? 'active' : ''}`}
          >
            {c.id === 'canteen-main' ? '🍲' : c.id === 'canteen-juice' ? '🧃' : '☕'} {c.name}
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <GlassCard style={{ padding: '16px', marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {/* Search Input */}
            <div style={{ flex: '1', minWidth: '220px', position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                }}
              />
              <input
                type="text"
                placeholder="Search dishes (e.g. Biryani, Paratha, Chai)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: '42px', paddingRight: '14px' }}
              />
            </div>

            {/* Veg Only Toggle */}
            <div
              className="toggle-container"
              onClick={() => setVegOnly(!vegOnly)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div className={`toggle-switch ${vegOnly ? 'active' : ''}`}>
                <div className="toggle-knob" />
              </div>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: vegOnly ? 'var(--veg)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Leaf size={14} /> Pure Veg Only
              </span>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="category-filter">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`category-chip ${
                  selectedCategory === cat.key ? 'active' : ''
                }`}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</span>
          <p className="empty-state-title">No dishes found</p>
          <p className="empty-state-desc">
            Try adjusting your search query or filters to see available food items.
          </p>
          <button
            onClick={() => {
              setSelectedCanteen('ALL');
              setSelectedCategory('ALL');
              setSearchQuery('');
              setVegOnly(false);
            }}
            className="glass-btn glass-btn-secondary glass-btn-sm"
          >
            Reset Filters
          </button>
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
