import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import type { Subject } from '../../types';
import SubjectFormModal from './SubjectFormModal';

const DIFFICULTY_LABEL: Record<string, string> = { low: 'Low', med: 'Medium', high: 'High' };
const DIFFICULTY_TONE: Record<string, 'success' | 'warning' | 'danger'> = {
  low: 'success',
  med: 'warning',
  high: 'danger',
};

export default function SubjectList({ autoOpenAdd, onAutoOpenHandled }: { autoOpenAdd?: boolean; onAutoOpenHandled?: () => void }) {
  const { data, deleteSubject } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);

  const subjects = data?.subjects ?? [];

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  useEffect(() => {
    if (autoOpenAdd) {
      openAdd();
      onAutoOpenHandled?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenAdd]);
  const openEdit = (s: Subject) => {
    setEditing(s);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openAdd} icon={<Plus className="size-4" />}>
          Add Subject
        </Button>
      </div>

      {subjects.length === 0 && (
        <EmptyState
          icon={<BookOpen className="size-5" />}
          title="No subjects yet"
          subtitle="Add one to get started."
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => {
          const covered = s.topics.filter((t) => t.covered).length;
          return (
            <Card key={s.id} hover className="animate-fade-in">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <h3 className="font-semibold text-text-primary">{s.name}</h3>
                </div>
                <Badge tone={DIFFICULTY_TONE[s.difficulty]}>{DIFFICULTY_LABEL[s.difficulty]}</Badge>
              </div>
              <div className="mb-1 flex justify-between text-xs text-text-secondary">
                <span>{s.progress}% complete</span>
                <span>
                  {covered}/{s.topics.length} topics
                </span>
              </div>
              <ProgressBar value={s.progress} />
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => openEdit(s)} icon={<Pencil className="size-3.5" />}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => deleteSubject(s.id)} icon={<Trash2 className="size-3.5" />}>
                  Delete
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <SubjectFormModal open={modalOpen} onClose={() => setModalOpen(false)} subject={editing} />
    </div>
  );
}
