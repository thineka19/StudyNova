import Card from '../common/Card';
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
        <h3 className="mb-3 font-semibold">Upcoming Exams</h3>
        {exams.length === 0 && <p className="text-sm text-slate-400">No exams scheduled.</p>}
        <div className="space-y-2">
          {exams.map((e) => (
            <div key={e.id} className="flex justify-between text-sm">
              <span>{subjectName(e.subjectId)}</span>
              <span className="text-slate-400">
                {formatShortDate(e.date)} · {daysUntil(e.date)}d
              </span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 font-semibold">Upcoming Deadlines</h3>
        {deadlines.length === 0 && <p className="text-sm text-slate-400">No deadlines coming up.</p>}
        <div className="space-y-2">
          {deadlines.map((a) => (
            <div key={a.id} className="flex justify-between text-sm">
              <span className="truncate">{a.title}</span>
              <span className="shrink-0 text-slate-400">
                {formatShortDate(a.deadline)} · {daysUntil(a.deadline)}d
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
