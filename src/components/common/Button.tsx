import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/30 disabled:hover:bg-primary',
  secondary:
    'border border-border bg-surface text-text-primary hover:bg-card disabled:hover:bg-surface',
  ghost:
    'text-text-secondary hover:bg-card hover:text-text-primary disabled:hover:bg-transparent',
  danger:
    'bg-danger/10 text-danger hover:bg-danger/20 disabled:hover:bg-danger/10',
};

const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  children,
  disabled,
  ...props
}: {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-[var(--radius-sm)] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}
