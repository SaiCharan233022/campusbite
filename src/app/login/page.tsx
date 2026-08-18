'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { LogIn, Key, GraduationCap, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [collegeId, setCollegeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        collegeId,
        password,
      });

      if (res?.error) {
        setError('Invalid College ID or Password');
      } else {
        router.push('/menu');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (id: string, pass: string) => {
    setCollegeId(id);
    setPassword(pass);
  };

  return (
    <div className="container" style={{ maxWidth: '460px', paddingTop: '40px' }}>
      <GlassCard style={{ padding: '36px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '2.5rem' }}>🎓</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '8px' }}>
            Welcome Back!
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
            Sign in with your College Roll Number to order
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--error-bg)',
              color: 'var(--error)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <GlassInput
            label="College Roll / ID Number"
            placeholder="e.g. 2024CS101"
            value={collegeId}
            onChange={(e) => setCollegeId(e.target.value)}
            icon={<GraduationCap size={18} />}
            required
          />

          <GlassInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Key size={18} />}
            required
          />

          <GlassButton
            type="submit"
            size="lg"
            loading={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            <LogIn size={18} /> Sign In
          </GlassButton>
        </form>

        {/* Demo One-Click Login Assist */}
        <div
          style={{
            marginTop: '24px',
            padding: '14px',
            background: 'rgba(255, 107, 53, 0.05)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed rgba(255, 107, 53, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px' }}>
            <Sparkles size={14} /> Demo Credentials (Click to fill):
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => fillDemo('2024CS101', 'student123')}
              className="glass-badge badge-accent"
              style={{ cursor: 'pointer', padding: '6px 10px' }}
            >
              👤 Student (Rahul)
            </button>
            <button
              type="button"
              onClick={() => fillDemo('ADMIN001', 'admin123')}
              className="glass-badge"
              style={{ cursor: 'pointer', padding: '6px 10px', background: 'rgba(0,0,0,0.06)' }}
            >
              🛡️ Canteen Staff (Admin)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          New student?{' '}
          <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Create student account
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
