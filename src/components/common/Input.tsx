import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-text-secondary">
      {children}
    </label>
  );
}

export default function Input({
  className = '',
  icon,
  ...props
}: { icon?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
          {icon}
        </span>
      )}
      <input
        className={`w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors duration-[250ms] ease-[var(--ease-premium)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 ${icon ? 'pl-9' : ''} ${className}`}
        {...props}
      />
    </div>
  );
}

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-colors duration-[250ms] ease-[var(--ease-premium)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Checkbox({
  label,
  className = '',
  ...props
}: { label?: ReactNode; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex cursor-pointer items-center gap-2 text-sm text-text-secondary ${className}`}>
      <input
        type="checkbox"
        className="size-4 rounded border-border bg-surface accent-primary"
        {...props}
      />
      {label}
    </label>
  );
}
