import React from 'react';
import { getWaitLevel } from '@/lib/utils';
import { Clock, Users } from 'lucide-react';

interface WaitTimeIndicatorProps {
  estimatedMinutes?: number;
  activeOrders?: number;
  canteenName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function WaitTimeIndicator({
  estimatedMinutes = 12,
  activeOrders = 6,
  canteenName,
  size = 'md',
}: WaitTimeIndicatorProps) {
  const level = getWaitLevel(estimatedMinutes);

  return (
    <div className="wait-indicator">
      <div className={`wait-indicator-dot ${level}`} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="wait-indicator-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} style={{ color: 'var(--accent)' }} />
          ~{estimatedMinutes} min wait {canteenName ? `at ${canteenName}` : ''}
        </span>
        <span className="wait-indicator-subtext" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Users size={12} />
          {activeOrders} active orders in kitchen
        </span>
      </div>
    </div>
  );
}
