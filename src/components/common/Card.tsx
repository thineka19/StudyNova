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
      className={`rounded-[var(--radius-lg)] ${variantClass} p-4 shadow-sm transition-all duration-200 ${
        hover ? 'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
