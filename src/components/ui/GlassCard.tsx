import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'flat' | 'interactive';
  className?: string;
}

export function GlassCard({
  children,
  variant = 'default',
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        variant === 'flat' ? 'glass-card-flat' : 'glass-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
