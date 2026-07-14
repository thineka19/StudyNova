import { Flame } from 'lucide-react';

const sizeClass: Record<'sm' | 'md' | 'lg', { box: string; icon: string; text: string }> = {
  sm: { box: 'size-8', icon: 'size-4', text: 'text-xs' },
  md: { box: 'size-11', icon: 'size-5', text: 'text-sm' },
  lg: { box: 'size-16', icon: 'size-7', text: 'text-lg' },
};

export default function StreakFlame({ days, size = 'md' }: { days: number; size?: 'sm' | 'md' | 'lg' }) {
  const s = sizeClass[size];
  const active = days > 0;
  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`flex ${s.box} items-center justify-center rounded-[var(--radius-full)] ${
          active ? 'bg-flame/15 text-flame shadow-[0_0_20px_var(--color-flame-glow)]' : 'bg-surface text-text-secondary'
        }`}
      >
        <Flame className={`${s.icon} ${active ? 'animate-flame-flicker' : ''}`} />
      </div>
      <div className="leading-tight">
        <p className={`font-bold text-text-primary ${s.text}`}>{days}</p>
        <p className="text-[11px] text-text-secondary">day streak</p>
      </div>
    </div>
  );
}
