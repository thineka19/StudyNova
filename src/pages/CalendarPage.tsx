import MonthCalendar from '../components/calendar/MonthCalendar';

export default function CalendarPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Exam</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Deadline</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Study Session</span>
      </div>
      <MonthCalendar />
    </div>
  );
}
