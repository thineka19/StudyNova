import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { todayISO } from '../../lib/dateUtils';

export default function StatsRow() {
  const { data, derived } = useApp();
  const today = todayISO();
  const todaysSessions = data?.studySessions.filter((s) => s.date === today) ?? [];
  const todaysMinutesDone = todaysSessions.filter((s) => s.completed).reduce((sum, s) => sum + s.durationMins, 0);
  const upcomingExams = data?.exams.filter((e) => new Date(e.date) >= new Date(today)).length ?? 0;
  const upcomingDeadlines = data?.assignments.filter((a) => a.status !== 'submitted').length ?? 0;
  const avgProgress = data?.subjects.length
    ? Math.round(data.subjects.reduce((sum, s) => sum + s.progress, 0) / data.subjects.length)
    : 0;

  const stats = [
    { label: "Today's Study Time", value: `${Math.round((todaysMinutesDone / 60) * 10) / 10}h` },
    { label: 'Upcoming Exams', value: upcomingExams },
    { label: 'Open Assignments', value: upcomingDeadlines },
    { label: 'Avg. Subject Progress', value: `${avgProgress}%` },
    { label: 'Current Streak', value: `${derived.currentStreakDays} 🔥` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((s) => (
        <Card key={s.label} className="text-center">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{s.value}</p>
          <p className="mt-1 text-xs text-slate-500">{s.label}</p>
        </Card>
      ))}
    </div>
  );
}
