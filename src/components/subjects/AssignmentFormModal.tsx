import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from '../common/formStyles';
import type { Assignment, AssignmentStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { todayISO } from '../../lib/dateUtils';

export default function AssignmentFormModal({
  open,
  onClose,
  assignment,
}: {
  open: boolean;
  onClose: () => void;
  assignment: Assignment | null;
}) {
  const { data, addAssignment, updateAssignment } = useApp();
  const subjects = data?.subjects ?? [];
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState(todayISO());
  const [weight, setWeight] = useState(5);
  const [status, setStatus] = useState<AssignmentStatus>('not-started');

  useEffect(() => {
    if (open) {
      setSubjectId(assignment?.subjectId ?? subjects[0]?.id ?? '');
      setTitle(assignment?.title ?? '');
      setDeadline(assignment?.deadline ?? todayISO());
      setWeight(assignment?.weight ?? 5);
      setStatus(assignment?.status ?? 'not-started');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, assignment]);

  const handleSubmit = async () => {
    if (!title.trim() || !subjectId) return;
    const payload = { subjectId, title: title.trim(), deadline, weight, status };
    if (assignment) {
      await updateAssignment(assignment.id, payload);
    } else {
      await addAssignment(payload);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={assignment ? 'Edit Assignment' : 'Add Assignment'}>
      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="asg-subject">Subject</label>
          <select id="asg-subject" className={inputClass} value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            {subjects.length === 0 && <option value="">Add a subject first</option>}
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="asg-title">Title</label>
          <input id="asg-title" className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Problem Set 3" />
        </div>
        <div>
          <label className={labelClass} htmlFor="asg-deadline">Deadline</label>
          <input id="asg-deadline" type="date" className={inputClass} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="asg-weight">Weight / Importance (1-10): {weight}</label>
          <input
            id="asg-weight"
            type="range"
            min={1}
            max={10}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="asg-status">Status</label>
          <select id="asg-status" className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as AssignmentStatus)}>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="submitted">Submitted</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={secondaryButtonClass}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={!subjectId} className={primaryButtonClass}>
            {assignment ? 'Save Changes' : 'Add Assignment'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
