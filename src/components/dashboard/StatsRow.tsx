import { CheckCircle2, Clock, GraduationCap, ListTodo } from 'lucide-react';
import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { todayISO } from '../../lib/dateUtils';

export default function StatsRow() {
  const { data } = useApp();
  const today = todayISO();

  const totalTasks = data?.studySessions.length ?? 0;
  const completedTasks = data?.studySessions.filter((s) => s.completed).length ?? 0;
  const upcomingExams = data?.exams.filter((e) => e.date >= today).length ?? 0;

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const weekStartISO = startOfWeek.toISOString().slice(0, 10);
  const studyHoursThisWeek = (data?.studySessions ?? [])
    .filter((s) => s.completed && s.date >= weekStartISO)
    .reduce((sum, s) => sum + s.durationMins, 0) / 60;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: ListTodo,
      tone: 'text-accent bg-primary/10',
    },
    {
      label: 'Completed Tasks',
      value: completedTasks,
      icon: CheckCircle2,
      tone: 'text-success bg-success/10',
    },
    {
      label: 'Upcoming Exams',
      value: upcomingExams,
      icon: GraduationCap,
      tone: 'text-warning bg-warning/10',
    },
    {
      label: 'Study Hours This Week',
      value: `${Math.round(studyHoursThisWeek * 10) / 10}h`,
      icon: Clock,
      tone: 'text-secondary bg-secondary/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} variant="glass" className="flex items-center gap-2.5 !p-3">
          <div className={`flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] ${s.tone}`}>
            <s.icon className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-text-primary">{s.value}</p>
            <p className="truncate text-[11px] text-text-secondary">{s.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
