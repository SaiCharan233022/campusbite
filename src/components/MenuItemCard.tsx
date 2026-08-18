'use client';

import React from 'react';
import { MenuItem } from '@/types';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { Plus, Minus, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { GlassBadge } from './ui/GlassBadge';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { cart, addToCart, updateQuantity } = useCart();

  const cartEntry = cart.find((ci) => ci.item.id === item.id);
  const quantity = cartEntry?.quantity || 0;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
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
          {item.isAvailable ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.7rem',
                color: '#16a34a',
                fontWeight: 600,
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              <CheckCircle2 size={11} /> Ready Now
            </span>
          ) : (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.7rem',
                color: '#dc2626',
                fontWeight: 600,
                background: 'rgba(220, 38, 38, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              <XCircle size={11} /> Completed / Sold Out
            </span>
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
                background: 'rgba(220, 38, 38, 0.08)',
                color: '#dc2626',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid rgba(220, 38, 38, 0.2)',
                cursor: 'not-allowed',
              }}
            >
              🔴 Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
