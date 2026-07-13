import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { formatShortDate } from '../../lib/dateUtils';

function scoreColor(score: number): string {
  if (score >= 75) return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
  if (score >= 45) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
}

export default function PriorityList() {
  const { derived } = useApp();
  const items = derived.priorities.slice(0, 8);

  return (
    <Card>
      <h3 className="mb-3 font-semibold">Smart Priority List</h3>
      {items.length === 0 && <p className="text-sm text-slate-400">No active assignments or exams.</p>}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-2.5 text-sm dark:border-slate-800">
            <div className="min-w-0">
              <p className="truncate font-medium">{item.title}</p>
              <p className="text-xs text-slate-400">
                {item.subjectName} · Due {formatShortDate(item.dueDate)} ({item.daysLeft >= 0 ? `${item.daysLeft}d` : 'overdue'})
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${scoreColor(item.priorityScore)}`}>
              {item.priorityScore}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
