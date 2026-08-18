'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { User, Mail, Key, GraduationCap, Phone, UserPlus, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    collegeId: '',
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        router.push('/login?registered=true');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '480px', paddingTop: '30px' }}>
      <GlassCard style={{ padding: '36px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '2.5rem' }}>📝</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '8px' }}>
            Student Registration
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
            Set up your campus account for quick dining
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <GlassInput
            label="College Roll / ID Number"
            placeholder="e.g. 2024CS102"
            value={formData.collegeId}
            onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
            icon={<GraduationCap size={18} />}
            required
          />

          <GlassInput
            label="Full Name"
            placeholder="Rahul Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            icon={<User size={18} />}
            required
          />

          <GlassInput
            label="College Email ID"
            type="email"
            placeholder="rahul@college.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            icon={<Mail size={18} />}
            required
          />

          <GlassInput
            label="Phone Number (for SMS & UPI)"
            placeholder="9876543210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            icon={<Phone size={18} />}
          />

          <GlassInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            icon={<Key size={18} />}
            required
          />

          <GlassButton
            type="submit"
            size="lg"
            loading={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            <UserPlus size={18} /> Complete Registration
          </GlassButton>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Sign In here
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
