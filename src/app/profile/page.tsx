'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { User, Mail, GraduationCap, Phone, ShieldCheck, LogOut, Clock, ShoppingBag } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();

  const user = session?.user as any;

  if (!session) {
    return (
      <div className="container" style={{ maxWidth: '500px', paddingTop: '40px' }}>
        <GlassCard style={{ padding: '36px', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>🔐</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '12px 0 8px' }}>
            Please Log In
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Sign in with your College Roll Number to view your profile and order history.
          </p>
          <Link href="/login" className="glass-btn glass-btn-primary">
            Sign In
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px', paddingTop: '10px' }}>
      <h1 className="page-title" style={{ marginBottom: '24px' }}>
        Student Profile
      </h1>

      <GlassCard style={{ padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--accent-gradient)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800,
            }}
          >
            {user?.name ? user.name[0] : 'S'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{user?.name}</h2>
            <span className="glass-badge badge-accent" style={{ marginTop: '4px' }}>
              Roll: {user?.collegeId}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <GraduationCap size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>College ID</span>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.collegeId}</p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Mail size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Email Address</span>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.email}</p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <ShieldCheck size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Account Role</span>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.role || 'STUDENT'}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <Link href="/orders" style={{ flex: 1 }}>
            <GlassButton variant="secondary" style={{ width: '100%' }}>
              <Clock size={16} /> My Orders
            </GlassButton>
          </Link>
          <GlassButton
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="ghost"
            style={{ color: 'var(--error)' }}
          >
            <LogOut size={16} /> Sign Out
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
}
