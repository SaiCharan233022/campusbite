import React from 'react';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
  loading?: boolean;
}

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading = false,
  disabled,
  ...props
}: GlassButtonProps) {
  const sizeClasses = {
    sm: 'glass-btn-sm',
    md: '',
    lg: 'glass-btn-lg',
    icon: 'glass-btn-icon',
  };

  const variantClasses = {
    primary: 'glass-btn-primary',
    secondary: 'glass-btn-secondary',
    ghost: 'glass-btn-ghost',
  };

  return (
    <button
      className={cn(
        'glass-btn',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(255,255,255,0.4)',
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
