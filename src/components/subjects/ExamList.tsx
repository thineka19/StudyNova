import { useState } from 'react';
import Card from '../common/Card';
import { primaryButtonClass, dangerButtonClass, secondaryButtonClass } from '../common/formStyles';
import { useApp } from '../../context/AppContext';
import type { Exam } from '../../types';
import ExamFormModal from './ExamFormModal';
import { formatShortDate, daysUntil } from '../../lib/dateUtils';

export default function ExamList() {
  const { data, deleteExam, derived } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Exam | null>(null);

  const exams = data?.exams ?? [];
  const subjectName = (id: string) => data?.subjects.find((s) => s.id === id)?.name ?? 'Unknown';

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className={primaryButtonClass}
        >
          + Add Exam
        </button>
      </div>

      {exams.length === 0 && <Card className="text-center text-sm text-slate-400">No exams yet.</Card>}

      <div className="space-y-3">
        {exams.map((e) => {
          const daysLeft = daysUntil(e.date);
          const readiness = derived.examReadiness[e.id];
          return (
            <Card key={e.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{subjectName(e.subjectId)} Exam</p>
                <p className="text-xs text-slate-500">
                  {formatShortDate(e.date)} ({daysLeft >= 0 ? `${daysLeft}d left` : 'past'}) · Preparedness {e.preparedness}% · {e.practiceTestsDone} practice tests
                </p>
              </div>
              <div className="flex items-center gap-2">
                {readiness && <span className="text-sm">{readiness.label}</span>}
                <button
                  type="button"
                  onClick={() => {
                    setEditing(e);
                    setModalOpen(true);
                  }}
                  className={secondaryButtonClass}
                >
                  Edit
                </button>
                <button type="button" onClick={() => deleteExam(e.id)} className={dangerButtonClass}>
                  Delete
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <ExamFormModal open={modalOpen} onClose={() => setModalOpen(false)} exam={editing} />
    </div>
  );
}
