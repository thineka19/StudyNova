import { useMemo } from 'react';
import { GripVertical, GraduationCap, ClipboardList } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { useApp } from '../../context/AppContext';
import { useDragReorder } from '../../hooks/useDragReorder';
import { todayISO, formatShortDate } from '../../lib/dateUtils';

const DAYS_AHEAD = 7;

function scoreTone(score: number): 'danger' | 'warning' | 'success' {
  if (score >= 75) return 'danger';
  if (score >= 45) return 'warning';
  return 'success';
}

export default function StudyTimeline() {
  const { data, derived, updateAssignment, updateExam } = useApp();

  const days = useMemo(() => {
    const start = new Date(todayISO());
    return Array.from({ length: DAYS_AHEAD }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
  }, []);

  const priorityById = useMemo(() => {
    const map = new Map(derived.priorities.map((p) => [p.id, p]));
    return map;
  }, [derived.priorities]);

  const { dragProps, dropZoneProps, overDate } = useDragReorder((itemId, dateISO) => {
    const assignment = data?.assignments.find((a) => a.id === itemId);
    if (assignment) {
      updateAssignment(itemId, { deadline: dateISO });
      return;
    }
    const exam = data?.exams.find((e) => e.id === itemId);
    if (exam) updateExam(itemId, { date: dateISO });
  });

  const subjectColor = (id: string) => data?.subjects.find((s) => s.id === id)?.color ?? '#5B8DEF';
  const subjectName = (id: string) => data?.subjects.find((s) => s.id === id)?.name ?? 'Unknown';

  const hasAnything =
    (data?.assignments.some((a) => a.status !== 'submitted') ?? false) || (data?.exams.length ?? 0) > 0;

  return (
    <Card variant="glass" className="mb-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Study Journey Timeline</h3>
        <span className="text-[11px] text-text-secondary">Drag a card to reschedule</span>
      </div>

      {!hasAnything && (
        <EmptyState icon={<ClipboardList className="size-5" />} title="Nothing on the timeline yet" subtitle="Add a subject, assignment, or exam to get started." />
      )}

      {hasAnything && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {days.map((dateISO, i) => {
            const assignments = (data?.assignments ?? []).filter(
              (a) => a.status !== 'submitted' && a.deadline === dateISO,
            );
            const exams = (data?.exams ?? []).filter((e) => e.date === dateISO);
            const sessions = (data?.studySessions ?? []).filter((s) => s.date === dateISO);
            const isDropTarget = overDate === dateISO;

            return (
              <div
                key={dateISO}
                {...dropZoneProps(dateISO)}
                className={`flex w-56 shrink-0 flex-col gap-2 rounded-[var(--radius-md)] border border-border/60 p-2.5 transition-all duration-200 ${
                  isDropTarget ? 'animate-drop-pulse border-accent/50 bg-accent/5' : ''
                }`}
              >
                <p className="text-xs font-semibold text-text-secondary">
                  {i === 0 ? 'Today' : formatShortDate(dateISO)}
                </p>

                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className={`rounded-[var(--radius-sm)] border border-border bg-card p-2 text-xs ${
                      s.completed ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: subjectColor(s.subjectId) }} />
                      <p className={`truncate text-text-primary ${s.completed ? 'line-through' : ''}`}>{s.title}</p>
                    </div>
                    <p className="mt-0.5 text-[10px] text-text-secondary">{s.durationMins} min · generated</p>
                  </div>
                ))}

                {assignments.map((a) => {
                  const p = priorityById.get(a.id);
                  return (
                    <div
                      key={a.id}
                      className="flex items-start gap-1.5 rounded-[var(--radius-sm)] border border-border bg-card p-2 text-xs"
                      style={{ borderLeftWidth: 3, borderLeftColor: subjectColor(a.subjectId) }}
                    >
                      <span {...dragProps(a.id)} className="mt-0.5 cursor-grab text-text-secondary active:cursor-grabbing">
                        <GripVertical className="size-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-text-primary">{a.title}</p>
                        <p className="text-[10px] text-text-secondary">{subjectName(a.subjectId)} · assignment</p>
                      </div>
                      {p && <Badge tone={scoreTone(p.priorityScore)}>{p.priorityScore}</Badge>}
                    </div>
                  );
                })}

                {exams.map((e) => {
                  const p = priorityById.get(e.id);
                  return (
                    <div
                      key={e.id}
                      className="flex items-start gap-1.5 rounded-[var(--radius-sm)] border border-border bg-card p-2 text-xs"
                      style={{ borderLeftWidth: 3, borderLeftColor: subjectColor(e.subjectId) }}
                    >
                      <span {...dragProps(e.id)} className="mt-0.5 cursor-grab text-text-secondary active:cursor-grabbing">
                        <GripVertical className="size-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-text-primary">{subjectName(e.subjectId)} Exam</p>
                        <p className="flex items-center gap-1 text-[10px] text-text-secondary">
                          <GraduationCap className="size-3" /> exam
                        </p>
                      </div>
                      {p && <Badge tone={scoreTone(p.priorityScore)}>{p.priorityScore}</Badge>}
                    </div>
                  );
                })}

                {assignments.length === 0 && exams.length === 0 && sessions.length === 0 && (
                  <p className="py-3 text-center text-[11px] text-text-secondary/60">Nothing planned</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
