const ease = 'duration-[250ms] ease-[var(--ease-premium)]';

export const inputClass =
  `w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-colors ${ease} focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30`;

export const labelClass = 'mb-1.5 block text-xs font-medium text-text-secondary';

export const primaryButtonClass =
  `rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all ${ease} hover:bg-primary-hover hover:shadow-md hover:shadow-primary/40 disabled:opacity-50 active:scale-[0.98]`;

export const secondaryButtonClass =
  `rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition-all ${ease} hover:bg-card hover:border-accent/40 active:scale-[0.98]`;

export const dangerButtonClass = `rounded-lg px-3 py-1.5 text-xs font-semibold text-danger transition-colors ${ease} hover:bg-danger/10`;
