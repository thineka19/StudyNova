import { ClipboardCheck } from 'lucide-react';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import SwipeableRow from '../common/SwipeableRow';
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
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Today&apos;s Tasks</h3>
        {sessions.length > 0 && (
          <span className="text-[11px] text-text-secondary">Swipe right to complete</span>
        )}
      </div>
      {sessions.length === 0 && (
        <EmptyState
          icon={<ClipboardCheck className="size-5" />}
          title="Nothing scheduled for today"
          subtitle="Enjoy the break, or check your upcoming plan."
        />
      )}
      <div className="space-y-2">
        {sessions.map((s) => (
          <SwipeableRow key={s.id} completed={s.completed} onComplete={() => toggleStudySessionCompleted(s.id)}>
            <div
              className={`flex items-start gap-3 border border-border bg-card p-2.5 text-sm transition-opacity duration-200 ${
                s.completed ? 'opacity-50' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => toggleStudySessionCompleted(s.id)}
                aria-label={s.completed ? 'Mark incomplete' : 'Mark complete'}
                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                  s.completed ? 'border-success bg-success' : 'border-border'
                }`}
              />
              <div className="flex-1">
                <p className={`text-text-primary ${s.completed ? 'line-through' : ''}`}>{s.title}</p>
                <p className="text-xs text-text-secondary">
                  {subjectName(s.subjectId)} · {s.durationMins} min
                </p>
              </div>
            </div>
          </SwipeableRow>
        ))}
      </div>
    </Card>
  );
}
