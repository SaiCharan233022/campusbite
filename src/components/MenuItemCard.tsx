'use client';

import React from 'react';
import { MenuItem } from '@/types';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { Plus, Minus, Clock } from 'lucide-react';
import { GlassBadge } from './ui/GlassBadge';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { cart, addToCart, updateQuantity } = useCart();

  const cartEntry = cart.find((ci) => ci.item.id === item.id);
  const quantity = cartEntry?.quantity || 0;

  // Placeholder imagery with nice category colors
  const defaultImages: Record<string, string> = {
    BREAKFAST: '🥞',
    LUNCH: '🍛',
    DINNER: '🥘',
    SNACKS: '🥟',
    BEVERAGES: '🥤',
    DESSERTS: '🍨',
  };

  return (
    <div className={`glass-card menu-item-card ${!item.isAvailable ? 'opacity-60' : ''}`}>
      {/* Food Visual Thumbnail */}
      <div
        className="menu-item-image"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          background: item.isVeg 
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.15))' 
            : 'linear-gradient(135deg, rgba(220, 38, 38, 0.08), rgba(220, 38, 38, 0.15))',
          position: 'relative',
        }}
      >
        <span>{defaultImages[item.category] || '🍽️'}</span>
        <div
          style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
          }}
        >
          <div className={`veg-indicator ${!item.isVeg ? 'nonveg' : ''}`} />
        </div>
      </div>

      {/* Info */}
      <div className="menu-item-info">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <h4 className="menu-item-name">{item.name}</h4>
            {item.description && (
              <p className="menu-item-desc">{item.description}</p>
            )}
          </div>
        </div>

        {/* Badges / Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)',
            }}
          >
            <Clock size={12} />
            {item.prepTime} mins
          </span>
          {!item.isAvailable && (
            <GlassBadge variant="unavailable">Sold Out</GlassBadge>
          )}
        </div>

        {/* Bottom Bar: Price & Add / Quantity */}
        <div className="menu-item-bottom">
          <span className="menu-item-price">{formatPrice(item.price)}</span>

          {item.isAvailable ? (
            quantity > 0 ? (
              <div className="menu-item-qty-controls">
                <button
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  className="qty-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  onClick={() => addToCart(item, 1)}
                  className="qty-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(item)}
                className="menu-item-add-btn"
              >
                + ADD
              </button>
            )
          ) : (
            <button
              disabled
              style={{
                padding: '6px 14px',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-tertiary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'not-allowed',
              }}
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
