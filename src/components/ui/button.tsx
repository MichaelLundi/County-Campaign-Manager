import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'black';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]',
          // Variants
          variant === 'default' && 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm',
          variant === 'black' && 'bg-neutral-950 text-white hover:bg-neutral-800 shadow-sm',
          variant === 'secondary' && 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
          variant === 'outline' && 'border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 shadow-xs',
          variant === 'ghost' && 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900',
          variant === 'destructive' && 'bg-rose-700 text-white hover:bg-rose-800 shadow-xs',
          // Sizes
          size === 'default' && 'h-10 px-4 py-2 rounded-lg',
          size === 'sm' && 'h-8 px-3 text-xs rounded-md',
          size === 'lg' && 'h-12 px-6 text-base rounded-lg',
          size === 'icon' && 'h-10 w-10 p-0 rounded-lg',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
