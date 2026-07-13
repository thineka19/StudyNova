import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { daysBetween, todayISO } from '../../lib/dateUtils';

function minutesInRange(dates: { date: string; durationMins: number }[], daysBack: number): number {
  const today = todayISO();
  return dates
    .filter((d) => daysBetween(d.date, today) <= daysBack && daysBetween(d.date, today) >= 0)
    .reduce((sum, d) => sum + d.durationMins, 0);
}

export default function FocusStats() {
  const { data } = useApp();
  const sessions = data?.focusSessions.filter((s) => s.completed) ?? [];

  const daily = minutesInRange(sessions, 0);
  const weekly = minutesInRange(sessions, 6);
  const monthly = minutesInRange(sessions, 29);

  const stats = [
    { label: 'Sessions Completed', value: sessions.length },
    { label: 'Today', value: `${(daily / 60).toFixed(1)}h` },
    { label: 'This Week', value: `${(weekly / 60).toFixed(1)}h` },
    { label: 'This Month', value: `${(monthly / 60).toFixed(1)}h` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} className="text-center">
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{s.value}</p>
          <p className="mt-1 text-xs text-slate-500">{s.label}</p>
        </Card>
      ))}
    </div>
  );
}
