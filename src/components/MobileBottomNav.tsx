'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/hooks/useCart';
import { 
  Home, 
  UtensilsCrossed, 
  ShoppingBag, 
  Clock, 
  User, 
  LayoutDashboard 
} from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { totalItems, setIsCartOpen } = useCart();

  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <div className="mobile-nav">
      <div className="mobile-nav-links">
        <Link
          href="/"
          className={`mobile-nav-link ${pathname === '/' ? 'active' : ''}`}
        >
          <Home className="nav-icon" size={20} />
          <span>Home</span>
        </Link>

        <Link
          href="/menu"
          className={`mobile-nav-link ${pathname.startsWith('/menu') ? 'active' : ''}`}
        >
          <UtensilsCrossed className="nav-icon" size={20} />
          <span>Menu</span>
        </Link>

        <button
          onClick={() => setIsCartOpen(true)}
          className="mobile-nav-link"
          style={{ position: 'relative' }}
        >
          <div style={{ position: 'relative' }}>
            <ShoppingBag className="nav-icon" size={20} />
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  width: '18px',
                  height: '18px',
                  background: 'var(--accent-gradient)',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalItems}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <Link
          href="/orders"
          className={`mobile-nav-link ${pathname.startsWith('/orders') ? 'active' : ''}`}
        >
          <Clock className="nav-icon" size={20} />
          <span>Orders</span>
        </Link>

        {isAdmin ? (
          <Link
            href="/admin"
            className={`mobile-nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`}
          >
            <LayoutDashboard className="nav-icon" size={20} />
            <span>Admin</span>
          </Link>
        ) : (
          <Link
            href={session ? '/profile' : '/login'}
            className={`mobile-nav-link ${
              pathname === '/profile' || pathname === '/login' ? 'active' : ''
            }`}
          >
            <User className="nav-icon" size={20} />
            <span>{session ? 'Profile' : 'Login'}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
