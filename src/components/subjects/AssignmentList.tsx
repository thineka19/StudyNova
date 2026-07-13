import { useState } from 'react';
import Card from '../common/Card';
import { primaryButtonClass, dangerButtonClass, secondaryButtonClass } from '../common/formStyles';
import { useApp } from '../../context/AppContext';
import type { Assignment } from '../../types';
import AssignmentFormModal from './AssignmentFormModal';
import { formatShortDate, daysUntil } from '../../lib/dateUtils';

const STATUS_LABEL: Record<string, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  submitted: 'Submitted',
};

export default function AssignmentList() {
  const { data, deleteAssignment } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);

  const assignments = data?.assignments ?? [];
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
          + Add Assignment
        </button>
      </div>

      {assignments.length === 0 && (
        <Card className="text-center text-sm text-slate-400">No assignments yet.</Card>
      )}

      <div className="space-y-3">
        {assignments.map((a) => {
          const daysLeft = daysUntil(a.deadline);
          return (
            <Card key={a.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-slate-500">
                  {subjectName(a.subjectId)} · Due {formatShortDate(a.deadline)} ({daysLeft >= 0 ? `${daysLeft}d left` : 'overdue'}) · Weight {a.weight}/10
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {STATUS_LABEL[a.status]}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(a);
                    setModalOpen(true);
                  }}
                  className={secondaryButtonClass}
                >
                  Edit
                </button>
                <button type="button" onClick={() => deleteAssignment(a.id)} className={dangerButtonClass}>
                  Delete
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <AssignmentFormModal open={modalOpen} onClose={() => setModalOpen(false)} assignment={editing} />
    </div>
  );
}
