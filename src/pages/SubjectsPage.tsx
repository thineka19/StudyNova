import { useState } from 'react';
import SubjectList from '../components/subjects/SubjectList';
import AssignmentList from '../components/subjects/AssignmentList';
import ExamList from '../components/subjects/ExamList';
import AvailabilityEditor from '../components/subjects/AvailabilityEditor';

const TABS = [
  { key: 'subjects', label: 'Subjects' },
  { key: 'assignments', label: 'Assignments' },
  { key: 'exams', label: 'Exams' },
  { key: 'availability', label: 'Availability' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function SubjectsPage() {
  const [tab, setTab] = useState<TabKey>('subjects');

  return (
    <div>
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'subjects' && <SubjectList />}
      {tab === 'assignments' && <AssignmentList />}
      {tab === 'exams' && <ExamList />}
      {tab === 'availability' && <AvailabilityEditor />}
    </div>
  );
}
