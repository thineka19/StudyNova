export default function ProgressBar({ value, colorClass = 'bg-primary' }: { value: number; colorClass?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-[var(--radius-full)] bg-orb-track">
      <div className={`h-full rounded-[var(--radius-full)] ${colorClass} transition-all duration-300`} style={{ width: `${pct}%` }} />
    </div>
  );
}
