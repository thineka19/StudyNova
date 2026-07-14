type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

const toneClass: Record<Tone, string> = {
  primary: 'bg-primary/15 text-accent',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  neutral: 'bg-text-secondary/15 text-text-secondary',
};

export default function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center rounded-[var(--radius-full)] px-2 py-0.5 text-[11px] font-semibold tracking-wide ${toneClass[tone]}`}>
      {children}
    </span>
  );
}
