'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export function GlassModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '500px',
}: GlassModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="glass-overlay" onClick={onClose}>
      <div
        className="glass-modal"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h3>
          <button
            onClick={onClose}
            className="glass-btn glass-btn-ghost glass-btn-icon"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="glass-modal-body">{children}</div>
        {footer && <div className="glass-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
