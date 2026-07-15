import { useState } from 'react';
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/30 hover:shadow-md hover:shadow-primary/40 disabled:hover:bg-primary',
  secondary:
    'border border-border bg-surface text-text-primary hover:bg-card hover:border-accent/40 disabled:hover:bg-surface',
  ghost:
    'text-text-secondary hover:bg-card hover:text-text-primary disabled:hover:bg-transparent',
  danger:
    'bg-danger/10 text-danger hover:bg-danger/20 disabled:hover:bg-danger/10',
};

const rippleTone: Record<Variant, string> = {
  primary: '',
  secondary: 'tone-dark',
  ghost: 'tone-dark',
  danger: 'tone-dark',
};

const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

let rippleId = 0;

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  children,
  disabled,
  onMouseDown,
  ...props
}: {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const id = rippleId++;
    setRipples((r) => [
      ...r,
      { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size },
    ]);
    onMouseDown?.(e);
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      className={`btn-glow-ring relative inline-flex items-center justify-center overflow-hidden rounded-[var(--radius-sm)] font-semibold transition-[background-color,box-shadow,transform,border-color] duration-[250ms] ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className={`btn-ripple ${rippleTone[variant]}`}
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          onAnimationEnd={() => setRipples((cur) => cur.filter((x) => x.id !== r.id))}
        />
      ))}
    </button>
  );
}
