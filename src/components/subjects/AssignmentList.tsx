import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ClipboardList } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import type { Assignment } from '../../types';
import AssignmentFormModal from './AssignmentFormModal';
import { formatShortDate, daysUntil } from '../../lib/dateUtils';

const STATUS_LABEL: Record<string, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  submitted: 'Submitted',
};

const STATUS_TONE: Record<string, 'neutral' | 'primary' | 'success'> = {
  'not-started': 'neutral',
  'in-progress': 'primary',
  submitted: 'success',
};

export default function AssignmentList({ autoOpenAdd, onAutoOpenHandled }: { autoOpenAdd?: boolean; onAutoOpenHandled?: () => void }) {
  const { data, deleteAssignment } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);

  const assignments = data?.assignments ?? [];
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
          Add Assignment
        </Button>
      </div>

      {assignments.length === 0 && (
        <EmptyState icon={<ClipboardList className="size-5" />} title="No assignments yet" />
      )}

      <div className="space-y-3">
        {assignments.map((a) => {
          const daysLeft = daysUntil(a.deadline);
          return (
            <Card key={a.id} hover className="flex flex-col gap-2 animate-fade-in sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-text-primary">{a.title}</p>
                <p className="text-xs text-text-secondary">
                  {subjectName(a.subjectId)} · Due {formatShortDate(a.deadline)} ({daysLeft >= 0 ? `${daysLeft}d left` : 'overdue'}) · Weight {a.weight}/10
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={STATUS_TONE[a.status]}>{STATUS_LABEL[a.status]}</Badge>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditing(a);
                    setModalOpen(true);
                  }}
                  icon={<Pencil className="size-3.5" />}
                >
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => deleteAssignment(a.id)} icon={<Trash2 className="size-3.5" />}>
                  Delete
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <AssignmentFormModal open={modalOpen} onClose={() => setModalOpen(false)} assignment={editing} />
    </div>
  );
}
