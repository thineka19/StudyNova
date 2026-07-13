import { useState } from 'react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import { primaryButtonClass, dangerButtonClass, secondaryButtonClass } from '../common/formStyles';
import { useApp } from '../../context/AppContext';
import type { Subject } from '../../types';
import SubjectFormModal from './SubjectFormModal';

const DIFFICULTY_LABEL: Record<string, string> = { low: 'Low', med: 'Medium', high: 'High' };
const DIFFICULTY_COLOR: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  med: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

export default function SubjectList() {
  const { data, deleteSubject } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);

  const subjects = data?.subjects ?? [];

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (s: Subject) => {
    setEditing(s);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={openAdd} className={primaryButtonClass}>
          + Add Subject
        </button>
      </div>

      {subjects.length === 0 && (
        <Card className="text-center text-sm text-slate-400">No subjects yet. Add one to get started.</Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => {
          const covered = s.topics.filter((t) => t.covered).length;
          return (
            <Card key={s.id}>
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <h3 className="font-semibold">{s.name}</h3>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${DIFFICULTY_COLOR[s.difficulty]}`}>
                  {DIFFICULTY_LABEL[s.difficulty]}
                </span>
              </div>
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>{s.progress}% complete</span>
                <span>
                  {covered}/{s.topics.length} topics
                </span>
              </div>
              <ProgressBar value={s.progress} />
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" onClick={() => openEdit(s)} className={secondaryButtonClass}>
                  Edit
                </button>
                <button type="button" onClick={() => deleteSubject(s.id)} className={dangerButtonClass}>
                  Delete
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <SubjectFormModal open={modalOpen} onClose={() => setModalOpen(false)} subject={editing} />
    </div>
  );
}
