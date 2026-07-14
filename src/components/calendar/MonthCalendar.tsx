import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import { todayISO } from '../../lib/dateUtils';

interface DayEvent {
  label: string;
  kind: 'exam' | 'deadline' | 'session';
}

const KIND_STYLE: Record<DayEvent['kind'], string> = {
  exam: 'bg-danger/15 text-danger',
  deadline: 'bg-warning/15 text-warning',
  session: 'bg-primary/15 text-accent',
};

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export default function MonthCalendar() {
  const { data } = useApp();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const eventsByDay = useMemo(() => {
    const map = new Map<string, DayEvent[]>();
    const push = (date: string, ev: DayEvent) => {
      if (!map.has(date)) map.set(date, []);
      map.get(date)!.push(ev);
    };
    const subjectName = (id: string) => data?.subjects.find((s) => s.id === id)?.name ?? '';

    data?.exams.forEach((e) => push(e.date, { label: `${subjectName(e.subjectId)} Exam`, kind: 'exam' }));
    data?.assignments
      .filter((a) => a.status !== 'submitted')
      .forEach((a) => push(a.deadline, { label: a.title, kind: 'deadline' }));
    data?.studySessions.forEach((s) => push(s.date, { label: s.title, kind: 'session' }));

    return map;
  }, [data]);

  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const monthLabel = firstOfMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const goPrev = () => {
    const d = new Date(year, month - 1, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };
  const goNext = () => {
    const d = new Date(year, month + 1, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  return (
    <Card variant="glass">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="secondary" size="sm" onClick={goPrev} icon={<ChevronLeft className="size-4" />}>
          Prev
        </Button>
        <h3 className="font-semibold text-text-primary">{monthLabel}</h3>
        <Button variant="secondary" size="sm" onClick={goNext} icon={<ChevronRight className="size-4" />}>
          Next
        </Button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-medium text-text-secondary">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} />;
          const iso = toISO(year, month, day);
          const events = eventsByDay.get(iso) ?? [];
          const isToday = iso === todayISO();
          return (
            <div
              key={idx}
              className={`min-h-20 rounded-[var(--radius-sm)] border p-1 text-left align-top transition-colors duration-200 ${
                isToday ? 'border-primary/40 bg-primary/5' : 'border-border hover:bg-surface'
              }`}
            >
              <p className={`mb-0.5 text-xs ${isToday ? 'font-bold text-accent' : 'text-text-secondary'}`}>
                {day}
              </p>
              <div className="space-y-0.5">
                {events.slice(0, 3).map((ev, i) => (
                  <p key={i} className={`truncate rounded px-1 text-[10px] ${KIND_STYLE[ev.kind]}`} title={ev.label}>
                    {ev.label}
                  </p>
                ))}
                {events.length > 3 && <p className="text-[10px] text-text-secondary">+{events.length - 3} more</p>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
