type Level = 'low' | 'med' | 'high';

const LEVELS: { key: Level; label: string; colorVar: string }[] = [
  { key: 'low', label: 'Low', colorVar: 'var(--color-energy-low)' },
  { key: 'med', label: 'Medium', colorVar: 'var(--color-energy-med)' },
  { key: 'high', label: 'High', colorVar: 'var(--color-energy-high)' },
];

const activeIndex: Record<Level, number> = { low: 0, med: 1, high: 2 };

export default function EnergyLevelIndicator({ level }: { level: Level }) {
  const active = activeIndex[level];
  const current = LEVELS.find((l) => l.key === level)!;
  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex items-end gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 rounded-full transition-colors duration-200"
            style={{
              height: 8 + i * 5,
              backgroundColor: i <= active ? current.colorVar : 'var(--color-orb-track)',
            }}
          />
        ))}
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-text-primary">{current.label}</p>
        <p className="text-[11px] text-text-secondary">energy today</p>
      </div>
    </div>
  );
}
