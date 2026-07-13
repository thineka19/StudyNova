import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { formatShortDate } from '../../lib/dateUtils';

export default function RiskWarnings() {
  const { data, derived } = useApp();
  const subjectName = (id: string) => data?.subjects.find((s) => s.id === id)?.name ?? '';

  const examWarnings = (data?.exams ?? [])
    .map((e) => ({ e, risk: derived.examRisk[e.id] }))
    .filter((x) => x.risk?.isAtRisk);
  const assignmentWarnings = (data?.assignments ?? [])
    .filter((a) => a.status !== 'submitted')
    .map((a) => ({ a, risk: derived.assignmentRisk[a.id] }))
    .filter((x) => x.risk?.isAtRisk);

  if (examWarnings.length === 0 && assignmentWarnings.length === 0) return null;

  return (
    <Card className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
      <h3 className="mb-3 font-semibold text-amber-800 dark:text-amber-300">⚠️ Deadline Risk Warnings</h3>
      <div className="space-y-2 text-sm">
        {examWarnings.map(({ e, risk }) => (
          <p key={e.id} className="text-amber-700 dark:text-amber-300">
            <strong>{subjectName(e.subjectId)} exam</strong> ({formatShortDate(e.date)}): behind pace —
            {risk!.estimatedCompletionDate
              ? ` estimated topic completion by ${formatShortDate(risk!.estimatedCompletionDate)}, after the exam.`
              : ' no measurable study progress yet.'}
          </p>
        ))}
        {assignmentWarnings.map(({ a, risk }) => (
          <p key={a.id} className="text-amber-700 dark:text-amber-300">
            <strong>{a.title}</strong> ({formatShortDate(a.deadline)}): behind pace —
            {risk!.estimatedCompletionDate
              ? ` estimated topic completion by ${formatShortDate(risk!.estimatedCompletionDate)}, after the deadline.`
              : ' no measurable study progress yet.'}
          </p>
        ))}
      </div>
    </Card>
  );
}
