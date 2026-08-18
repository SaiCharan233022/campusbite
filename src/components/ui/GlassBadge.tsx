import React from 'react';
import { cn } from '@/lib/utils';

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'veg' | 'nonveg' | 'available' | 'unavailable' | 'accent' | 'status';
  className?: string;
}

export function GlassBadge({
  children,
  variant = 'default',
  className,
}: GlassBadgeProps) {
  const variantClasses = {
    default: 'badge-status',
    veg: 'badge-veg',
    nonveg: 'badge-nonveg',
    available: 'badge-available',
    unavailable: 'badge-unavailable',
    accent: 'badge-accent',
    status: 'badge-status',
  };

  return (
    <span className={cn('glass-badge', variantClasses[variant], className)}>
      {children}
    </span>
  );
}
