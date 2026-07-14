import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import type { Exam } from '../../types';
import ExamFormModal from './ExamFormModal';
import { formatShortDate, daysUntil } from '../../lib/dateUtils';

export default function ExamList({ autoOpenAdd, onAutoOpenHandled }: { autoOpenAdd?: boolean; onAutoOpenHandled?: () => void }) {
  const { data, deleteExam, derived } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Exam | null>(null);

  const exams = data?.exams ?? [];
  const subjectName = (id: string) => data?.subjects.find((s) => s.id === id)?.name ?? 'Unknown';

  useEffect(() => {
    if (autoOpenAdd) {
      setEditing(null);
      setModalOpen(true);
      onAutoOpenHandled?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenAdd]);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          icon={<Plus className="size-4" />}
        >
          Add Exam
        </Button>
      </div>

      {exams.length === 0 && <EmptyState icon={<GraduationCap className="size-5" />} title="No exams yet" />}

      <div className="space-y-3">
        {exams.map((e) => {
          const daysLeft = daysUntil(e.date);
          const readiness = derived.examReadiness[e.id];
          return (
            <Card key={e.id} hover className="flex flex-col gap-2 animate-fade-in sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-text-primary">{subjectName(e.subjectId)} Exam</p>
                <p className="text-xs text-text-secondary">
                  {formatShortDate(e.date)} ({daysLeft >= 0 ? `${daysLeft}d left` : 'past'}) · Preparedness {e.preparedness}% · {e.practiceTestsDone} practice tests
                </p>
              </div>
              <div className="flex items-center gap-2">
                {readiness && <span className="text-sm text-text-secondary">{readiness.label}</span>}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditing(e);
                    setModalOpen(true);
                  }}
                  icon={<Pencil className="size-3.5" />}
                >
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => deleteExam(e.id)} icon={<Trash2 className="size-3.5" />}>
                  Delete
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <ExamFormModal open={modalOpen} onClose={() => setModalOpen(false)} exam={editing} />
    </div>
  );
}
