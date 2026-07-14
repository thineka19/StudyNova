import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Input, { Label, Select } from '../common/Input';
import Button from '../common/Button';
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
          <Label htmlFor="asg-subject">Subject</Label>
          <Select id="asg-subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            {subjects.length === 0 && <option value="">Add a subject first</option>}
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="asg-title">Title</Label>
          <Input id="asg-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Problem Set 3" />
        </div>
        <div>
          <Label htmlFor="asg-deadline">Deadline</Label>
          <Input id="asg-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="asg-weight">Weight / Importance (1-10): {weight}</Label>
          <input
            id="asg-weight"
            type="range"
            min={1}
            max={10}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <Label htmlFor="asg-status">Status</Label>
          <Select id="asg-status" value={status} onChange={(e) => setStatus(e.target.value as AssignmentStatus)}>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="submitted">Submitted</option>
          </Select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!subjectId}>
            {assignment ? 'Save Changes' : 'Add Assignment'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
