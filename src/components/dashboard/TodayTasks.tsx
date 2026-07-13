import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { todayISO } from '../../lib/dateUtils';

export default function TodayTasks() {
  const { data, toggleStudySessionCompleted } = useApp();
  const today = todayISO();
  const sessions = (data?.studySessions ?? [])
    .filter((s) => s.date === today)
    .sort((a, b) => Number(a.completed) - Number(b.completed));
  const subjectName = (id: string) => data?.subjects.find((s) => s.id === id)?.name ?? '';

  return (
    <Card>
      <h3 className="mb-3 font-semibold">Today's Tasks</h3>
      {sessions.length === 0 && <p className="text-sm text-slate-400">Nothing scheduled for today. Enjoy the break!</p>}
      <div className="space-y-2">
        {sessions.map((s) => (
          <label
            key={s.id}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 p-2.5 text-sm dark:border-slate-800 ${
              s.completed ? 'opacity-50' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={s.completed}
              onChange={() => toggleStudySessionCompleted(s.id)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className={s.completed ? 'line-through' : ''}>{s.title}</p>
              <p className="text-xs text-slate-400">
                {subjectName(s.subjectId)} · {s.durationMins} min
              </p>
            </div>
          </label>
        ))}
      </div>
    </Card>
  );
}
