import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from '../common/formStyles';
import type { Difficulty, Exam } from '../../types';
import { useApp } from '../../context/AppContext';
import { todayISO } from '../../lib/dateUtils';

export default function ExamFormModal({
  open,
  onClose,
  exam,
}: {
  open: boolean;
  onClose: () => void;
  exam: Exam | null;
}) {
  const { data, addExam, updateExam } = useApp();
  const subjects = data?.subjects ?? [];
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState(todayISO());
  const [difficulty, setDifficulty] = useState<Difficulty>('med');
  const [preparedness, setPreparedness] = useState(0);
  const [practiceTestsDone, setPracticeTestsDone] = useState(0);

  useEffect(() => {
    if (open) {
      setSubjectId(exam?.subjectId ?? subjects[0]?.id ?? '');
      setDate(exam?.date ?? todayISO());
      setDifficulty(exam?.difficulty ?? 'med');
      setPreparedness(exam?.preparedness ?? 0);
      setPracticeTestsDone(exam?.practiceTestsDone ?? 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, exam]);

  const handleSubmit = async () => {
    if (!subjectId) return;
    const payload = { subjectId, date, difficulty, preparedness, practiceTestsDone };
    if (exam) {
      await updateExam(exam.id, payload);
    } else {
      await addExam(payload);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={exam ? 'Edit Exam' : 'Add Exam'}>
      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="exam-subject">Subject</label>
          <select id="exam-subject" className={inputClass} value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            {subjects.length === 0 && <option value="">Add a subject first</option>}
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="exam-date">Exam date</label>
          <input id="exam-date" type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="exam-difficulty">Difficulty</label>
          <select id="exam-difficulty" className={inputClass} value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
            <option value="low">Low</option>
            <option value="med">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="exam-prep">Preparedness: {preparedness}%</label>
          <input id="exam-prep" type="range" min={0} max={100} value={preparedness} onChange={(e) => setPreparedness(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label className={labelClass} htmlFor="exam-tests">Practice tests completed</label>
          <input
            id="exam-tests"
            type="number"
            min={0}
            className={inputClass}
            value={practiceTestsDone}
            onChange={(e) => setPracticeTestsDone(Math.max(0, Number(e.target.value)))}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={secondaryButtonClass}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={!subjectId} className={primaryButtonClass}>
            {exam ? 'Save Changes' : 'Add Exam'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
