import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'black' | 'outline' | 'neutral' | 'urgent' | 'warning';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md whitespace-nowrap tabular-nums',
        variant === 'green' && 'bg-emerald-50 text-emerald-800 border border-emerald-200',
        variant === 'black' && 'bg-neutral-900 text-neutral-100 border border-neutral-800',
        variant === 'neutral' && 'bg-neutral-100 text-neutral-700 border border-neutral-200',
        variant === 'outline' && 'border border-neutral-300 text-neutral-700 bg-white',
        variant === 'urgent' && 'bg-rose-50 text-rose-800 border border-rose-200 font-semibold',
        variant === 'warning' && 'bg-amber-50 text-amber-800 border border-amber-200',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
