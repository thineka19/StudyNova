import MonthCalendar from '../components/calendar/MonthCalendar';
import Reveal from '../components/common/Reveal';

export default function CalendarPage() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-danger" /> Exam</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-warning" /> Deadline</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Study Session</span>
      </div>
      <Reveal><MonthCalendar /></Reveal>
    </div>
  );
}
