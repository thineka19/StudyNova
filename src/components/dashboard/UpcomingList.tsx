import { CalendarClock, GraduationCap } from 'lucide-react';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import { useApp } from '../../context/AppContext';
import { formatShortDate, daysUntil, todayISO } from '../../lib/dateUtils';

export default function UpcomingList() {
  const { data } = useApp();
  const today = todayISO();
  const exams = (data?.exams ?? [])
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);
  const deadlines = (data?.assignments ?? [])
    .filter((a) => a.status !== 'submitted' && a.deadline >= today)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 5);
  const subjectName = (id: string) => data?.subjects.find((s) => s.id === id)?.name ?? '';

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <h3 className="mb-3 font-semibold text-text-primary">Upcoming Exams</h3>
        {exams.length === 0 && <EmptyState icon={<GraduationCap className="size-5" />} title="No exams scheduled" />}
        <div className="space-y-2">
          {exams.map((e) => (
            <div key={e.id} className="flex justify-between rounded-lg border border-border p-2.5 text-sm">
              <span className="text-text-primary">{subjectName(e.subjectId)}</span>
              <span className="text-text-secondary">
                {formatShortDate(e.date)} · {daysUntil(e.date)}d
              </span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 font-semibold text-text-primary">Upcoming Deadlines</h3>
        {deadlines.length === 0 && (
          <EmptyState icon={<CalendarClock className="size-5" />} title="No deadlines coming up" />
        )}
        <div className="space-y-2">
          {deadlines.map((a) => (
            <div key={a.id} className="flex justify-between rounded-lg border border-border p-2.5 text-sm">
              <span className="truncate text-text-primary">{a.title}</span>
              <span className="shrink-0 text-text-secondary">
                {formatShortDate(a.deadline)} · {daysUntil(a.deadline)}d
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
