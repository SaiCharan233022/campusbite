'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Clock, 
  ArrowRight, 
  ShoppingBag 
} from 'lucide-react';
import { GlassButton } from './ui/GlassButton';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
    scheduledTime,
    setScheduledTime,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="glass-overlay" onClick={() => setIsCartOpen(false)}>
      <div
        className="cart-drawer open"
        style={{
          maxWidth: '520px',
          margin: '0 auto',
          padding: '24px',
          borderRadius: '24px 24px 0 0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-handle" />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={22} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Your Tray ({totalItems})
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="glass-btn glass-btn-ghost glass-btn-sm"
                style={{ color: 'var(--error)' }}
              >
                <Trash2 size={14} /> Clear
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="glass-btn glass-btn-ghost glass-btn-icon"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 0' }}>
            <span style={{ fontSize: '3rem', marginBottom: '12px' }}>🍱</span>
            <p className="empty-state-title">Your tray is empty</p>
            <p className="empty-state-desc">
              Explore today’s menu and pre-order to skip the lunch rush!
            </p>
            <Link
              href="/menu"
              onClick={() => setIsCartOpen(false)}
              className="glass-btn glass-btn-primary glass-btn-sm"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Items List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxHeight: '260px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {cart.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className={`veg-indicator ${!item.isVeg ? 'nonveg' : ''}`} />
                    <div>
                      <h5 style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {item.name}
                      </h5>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        {formatPrice(item.price)} × {quantity}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="menu-item-qty-controls">
                      <button
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                        className="qty-btn"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-value">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                        className="qty-btn"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span style={{ fontWeight: 700, minWidth: '50px', textAlign: 'right' }}>
                      {formatPrice(item.price * quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Schedule Option (Problem 1 Solution) */}
            <div
              style={{
                padding: '14px',
                background: 'rgba(255, 107, 53, 0.06)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 107, 53, 0.15)',
              }}
            >
              <label
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px',
                }}
              >
                <Clock size={16} style={{ color: 'var(--accent)' }} />
                Pickup Time Scheduling:
              </label>
              <select
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="glass-input"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              >
                <option value="now">⚡ ASAP (~15 mins prep)</option>
                <option value="19:15">7:15 PM (Dinner break)</option>
                <option value="19:30">7:30 PM (Peak slot pre-order)</option>
                <option value="19:45">7:45 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="20:30">8:30 PM (Late dinner)</option>
              </select>
            </div>

            {/* Price Summary */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '8px',
                borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                  Total Bill
                </span>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  {formatPrice(totalAmount)}
                </h4>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="glass-btn glass-btn-primary"
                style={{ padding: '12px 24px' }}
              >
                Proceed to Pay <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
