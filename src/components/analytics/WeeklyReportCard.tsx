import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { generateWeeklyReport } from '../../lib/weeklyReport';

export default function WeeklyReportCard() {
  const { data } = useApp();
  if (!data) return null;
  const report = generateWeeklyReport(data);

  return (
    <Card>
      <h3 className="mb-3 font-semibold">Weekly Study Report</h3>
      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{report.hoursStudied}h</p>
          <p className="text-xs text-slate-500">Hours Studied</p>
        </div>
        <div>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{report.tasksCompleted}</p>
          <p className="text-xs text-slate-500">Tasks Completed</p>
        </div>
        <div>
          <p className="truncate text-xl font-bold text-emerald-600 dark:text-emerald-400">{report.strongestSubject ?? '—'}</p>
          <p className="text-xs text-slate-500">Strongest Subject</p>
        </div>
        <div>
          <p className="truncate text-xl font-bold text-rose-600 dark:text-rose-400">{report.weakestSubject ?? '—'}</p>
          <p className="text-xs text-slate-500">Weakest Subject</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {report.tips.map((tip, i) => (
          <p key={i} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            💡 {tip}
          </p>
        ))}
      </div>
    </Card>
  );
}
