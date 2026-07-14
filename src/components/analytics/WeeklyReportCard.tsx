import { Lightbulb, ScrollText } from 'lucide-react';
import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { generateWeeklyReport } from '../../lib/weeklyReport';

export default function WeeklyReportCard() {
  const { data } = useApp();
  if (!data) return null;
  const report = generateWeeklyReport(data);

  return (
    <Card className="animate-fade-in">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-text-primary">
        <ScrollText className="size-4 text-accent" /> Weekly Study Report
      </h3>
      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <p className="text-xl font-bold text-accent">{report.hoursStudied}h</p>
          <p className="text-xs text-text-secondary">Hours Studied</p>
        </div>
        <div>
          <p className="text-xl font-bold text-accent">{report.tasksCompleted}</p>
          <p className="text-xs text-text-secondary">Tasks Completed</p>
        </div>
        <div>
          <p className="truncate text-xl font-bold text-success">{report.strongestSubject ?? '—'}</p>
          <p className="text-xs text-text-secondary">Strongest Subject</p>
        </div>
        <div>
          <p className="truncate text-xl font-bold text-danger">{report.weakestSubject ?? '—'}</p>
          <p className="text-xs text-text-secondary">Weakest Subject</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {report.tips.map((tip, i) => (
          <p
            key={i}
            className="flex items-start gap-2 rounded-lg bg-surface px-3 py-2 text-sm text-text-secondary transition-colors duration-200 hover:bg-surface/70"
          >
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" /> {tip}
          </p>
        ))}
      </div>
    </Card>
  );
}
