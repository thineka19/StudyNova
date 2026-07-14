import { ListChecks } from 'lucide-react';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import Badge from '../common/Badge';
import { useApp } from '../../context/AppContext';
import { formatShortDate } from '../../lib/dateUtils';

function scoreTone(score: number): 'danger' | 'warning' | 'success' {
  if (score >= 75) return 'danger';
  if (score >= 45) return 'warning';
  return 'success';
}

export default function PriorityList() {
  const { derived } = useApp();
  const items = derived.priorities.slice(0, 8);

  return (
    <Card>
      <h3 className="mb-3 font-semibold text-text-primary">Smart Priority List</h3>
      {items.length === 0 && (
        <EmptyState icon={<ListChecks className="size-5" />} title="No active assignments or exams" />
      )}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border p-2.5 text-sm transition-colors duration-200 hover:bg-surface"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-text-primary">{item.title}</p>
              <p className="text-xs text-text-secondary">
                {item.subjectName} · Due {formatShortDate(item.dueDate)} ({item.daysLeft >= 0 ? `${item.daysLeft}d` : 'overdue'})
              </p>
            </div>
            <Badge tone={scoreTone(item.priorityScore)}>{item.priorityScore}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
