'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { MenuItemCard } from '@/components/MenuItemCard';
import { WaitTimeIndicator } from '@/components/WaitTimeIndicator';
import { MenuItem, Canteen } from '@/types';
import { 
  Search, 
  Leaf, 
  Clock, 
  Sparkles, 
  CheckCircle2,
  CalendarCheck,
  Coffee,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';

const CATEGORIES = [
  { key: 'ALL', label: 'All Items', emoji: '🍽️' },
  { key: 'BREAKFAST', label: 'Breakfast', emoji: '🥞', time: '7:00 – 11:30 AM' },
  { key: 'LUNCH', label: 'Lunch', emoji: '🍛', time: '12:00 – 3:30 PM' },
  { key: 'SNACKS', label: 'Snacks & Chai', emoji: '🥟', time: '4:00 – 6:30 PM' },
  { key: 'DINNER', label: 'Dinner Break', emoji: '🥘', time: '7:00 – 10:30 PM' },
  { key: 'BEVERAGES', label: 'Juices & Shakes', emoji: '🥤', time: 'All Day' },
];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteen, setSelectedCanteen] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentMealPeriod, setCurrentMealPeriod] = useState<string>('DINNER');

  // Detect time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      setCurrentMealPeriod('BREAKFAST');
    } else if (hour >= 12 && hour < 16) {
      setCurrentMealPeriod('LUNCH');
    } else if (hour >= 16 && hour < 19) {
      setCurrentMealPeriod('SNACKS');
    } else {
      setCurrentMealPeriod('DINNER');
    }
  }, []);

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
    if (inStockOnly && !item.isAvailable) {
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

  const getMealIcon = () => {
    if (currentMealPeriod === 'BREAKFAST') return <Sun size={16} style={{ color: '#EAB308' }} />;
    if (currentMealPeriod === 'LUNCH') return <Sun size={16} style={{ color: '#F97316' }} />;
    if (currentMealPeriod === 'SNACKS') return <Sunset size={16} style={{ color: '#EC4899' }} />;
    return <Moon size={16} style={{ color: '#6366F1' }} />;
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '20px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'rgba(255, 107, 53, 0.1)',
                  color: 'var(--accent)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {getMealIcon()} Active Meal Time: {currentMealPeriod}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  color: '#16a34a',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={14} /> Live Kitchen Online
              </span>
            </div>
            <h1 className="page-title">Today's Daily Canteen Menu</h1>
            <p className="page-subtitle">
              Live stock visibility: See what is ready right now, pre-schedule during peak rush hours, and pay directly via UPI.
            </p>
          </div>

          <WaitTimeIndicator
            estimatedMinutes={10}
            activeOrders={5}
            canteenName="Campus Dining"
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
          🏛️ All Canteens ({items.length})
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
                placeholder="Search food (e.g. Biryani, Dosa, Chai, Maggi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: '42px', paddingRight: '14px' }}
              />
            </div>

            {/* Quick Filter Toggles */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
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

              {/* Ready Now / In Stock Toggle */}
              <div
                className="toggle-container"
                onClick={() => setInStockOnly(!inStockOnly)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div className={`toggle-switch ${inStockOnly ? 'active' : ''}`}>
                  <div className="toggle-knob" />
                </div>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: inStockOnly ? '#16a34a' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={14} /> Ready Right Now
                </span>
              </div>
            </div>
          </div>

          {/* Meal Timing Category Filter Chips */}
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
          <p className="empty-state-title">No dishes match your filters</p>
          <p className="empty-state-desc">
            Try turning off filters or searching for another dish.
          </p>
          <button
            onClick={() => {
              setSelectedCanteen('ALL');
              setSelectedCategory('ALL');
              setSearchQuery('');
              setVegOnly(false);
              setInStockOnly(false);
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
