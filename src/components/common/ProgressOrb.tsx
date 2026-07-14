type Tone = 'primary' | 'success' | 'warning' | 'danger';

const toneStroke: Record<Tone, string> = {
  primary: 'var(--color-accent)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
};

export default function ProgressOrb({
  value,
  size = 120,
  strokeWidth = 10,
  tone = 'primary',
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  tone?: Tone;
  label?: string;
  sublabel?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-orb-track)"
          strokeWidth={strokeWidth}
        />
        <circle
          key={pct}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={toneStroke[tone]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          className="animate-orb-fill"
          style={
            {
              '--orb-offset-start': circumference,
              '--orb-offset-end': offset,
            } as React.CSSProperties
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold text-text-primary">{Math.round(pct)}%</span>
        {label && <span className="text-[11px] font-medium text-text-secondary">{label}</span>}
        {sublabel && <span className="text-[10px] text-text-secondary/70">{sublabel}</span>}
      </div>
    </div>
  );
}
