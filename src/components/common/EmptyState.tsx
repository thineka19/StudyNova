import type { ReactNode } from 'react';

export default function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-border px-6 py-10 text-center animate-fade-in">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-accent">
        {icon}
      </div>
      <p className="text-sm font-semibold text-text-primary">{title}</p>
      {subtitle && <p className="max-w-xs text-xs text-text-secondary">{subtitle}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
