'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/hooks/useCart';
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  Clock, 
  User as UserIcon, 
  LogIn, 
  LayoutDashboard,
  LogOut
} from 'lucide-react';

export function GlassNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { totalItems, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <nav className={`glass-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          <span className="nav-logo-icon">🍽️</span>
          <span className="text-gradient">CampusBite</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/menu"
            className={`nav-link ${pathname.startsWith('/menu') ? 'active' : ''}`}
          >
            Menu & Canteens
          </Link>
          {session && (
            <Link
              href="/orders"
              className={`nav-link ${pathname.startsWith('/orders') ? 'active' : ''}`}
            >
              My Orders
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className={`nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`}
              style={{ color: 'var(--accent)', fontWeight: 600 }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <LayoutDashboard size={16} /> Admin Portal
              </span>
            </Link>
          )}
        </div>

        {/* Action Controls (Cart + Auth) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="nav-cart-btn"
            aria-label="Open Cart"
          >
            <ShoppingBag size={18} />
            <span style={{ display: 'inline-block' }}>Cart</span>
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </button>

          {/* User Profile / Auth */}
          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                href="/profile"
                className="glass-btn glass-btn-ghost glass-btn-icon"
                title={session.user?.name || 'Profile'}
              >
                <UserIcon size={18} />
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="glass-btn glass-btn-ghost glass-btn-icon"
                title="Sign Out"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="glass-btn glass-btn-primary glass-btn-sm">
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
