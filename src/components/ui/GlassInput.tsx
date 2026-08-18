import React from 'react';
import { cn } from '@/lib/utils';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export function GlassInput({
  label,
  error,
  icon,
  className,
  containerClassName,
  id,
  ...props
}: GlassInputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('form-group', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'glass-input',
            icon ? 'has-icon' : '',
            className
          )}
          style={icon ? { paddingLeft: '44px' } : undefined}
          {...props}
        />
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
