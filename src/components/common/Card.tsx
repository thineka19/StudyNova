import type { ReactNode } from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  variant = 'solid',
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'solid' | 'glass';
}) {
  const variantClass =
    variant === 'glass'
      ? 'border border-glass-border bg-glass backdrop-blur-xl'
      : 'border border-border bg-card';
  return (
    <div
      className={`rounded-[var(--radius-lg)] ${variantClass} p-4 shadow-sm transition-[transform,box-shadow,border-color] duration-[250ms] ease-[var(--ease-premium)] ${
        hover
          ? 'hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08),0_16px_32px_-12px_color-mix(in_srgb,var(--color-accent)_45%,transparent)]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
