import React from 'react';
import { OrderStatus } from '@/types';
import { getStatusEmoji, getStatusLabel } from '@/lib/utils';
import { Check, ChefHat, Bell, CheckCircle2, Clock } from 'lucide-react';

interface OrderStatusTrackerProps {
  status: OrderStatus;
}

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const steps: { key: OrderStatus; label: string; icon: any }[] = [
    { key: 'PLACED', label: 'Order Placed', icon: Clock },
    { key: 'ACCEPTED', label: 'Accepted', icon: Check },
    { key: 'PREPARING', label: 'In Kitchen', icon: ChefHat },
    { key: 'READY', label: 'Ready for Pickup', icon: Bell },
    { key: 'COLLECTED', label: 'Collected', icon: CheckCircle2 },
  ];

  const statusOrder: OrderStatus[] = [
    'PLACED',
    'ACCEPTED',
    'PREPARING',
    'READY',
    'COLLECTED',
  ];

  const currentIndex = statusOrder.indexOf(status);
  const progressPercent =
    status === 'CANCELLED'
      ? 0
      : (Math.max(0, currentIndex) / (steps.length - 1)) * 100;

  if (status === 'CANCELLED') {
    return (
      <div
        style={{
          padding: '16px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--error)',
          textAlign: 'center',
          fontWeight: 600,
        }}
      >
        ❌ This order was cancelled.
      </div>
    );
  }

  return (
    <div className="order-tracker">
      <div
        className="order-tracker-progress"
        style={{ width: `${progressPercent}%` }}
      />
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isActive = index === currentIndex;
        const Icon = step.icon;

        return (
          <div
            key={step.key}
            className={`tracker-step ${isCompleted ? 'completed' : ''} ${
              isActive ? 'active' : ''
            }`}
          >
            <div className="tracker-dot">
              <Icon size={16} />
            </div>
            <span className="tracker-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
