import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarPlus, GraduationCap, Plus } from 'lucide-react';
import SubjectList from '../components/subjects/SubjectList';
import AssignmentList from '../components/subjects/AssignmentList';
import ExamList from '../components/subjects/ExamList';
import AvailabilityEditor from '../components/subjects/AvailabilityEditor';
import StudyTimeline from '../components/subjects/StudyTimeline';
import FloatingActionButton from '../components/common/FloatingActionButton';

const TABS = [
  { key: 'subjects', label: 'Subjects' },
  { key: 'assignments', label: 'Assignments' },
  { key: 'exams', label: 'Exams' },
  { key: 'availability', label: 'Availability' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const NEW_PARAM_TAB: Record<string, TabKey> = {
  subject: 'subjects',
  assignment: 'assignments',
  exam: 'exams',
};

export default function SubjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const newParam = searchParams.get('new');
  const [tab, setTab] = useState<TabKey>(newParam ? NEW_PARAM_TAB[newParam] ?? 'subjects' : 'subjects');
  const [autoOpen, setAutoOpen] = useState(Boolean(newParam));

  useEffect(() => {
    if (newParam) {
      setTab(NEW_PARAM_TAB[newParam] ?? 'subjects');
      setAutoOpen(true);
    }
  }, [newParam]);

  const clearAutoOpen = () => {
    setAutoOpen(false);
    if (newParam) setSearchParams({}, { replace: true });
  };

  return (
    <div className="animate-fade-in">
      <StudyTimeline />

      <div className="mb-5 flex gap-1 overflow-x-auto rounded-[var(--radius-md)] bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              tab === t.key
                ? 'bg-card text-accent shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'subjects' && (
        <SubjectList autoOpenAdd={autoOpen && tab === 'subjects'} onAutoOpenHandled={clearAutoOpen} />
      )}
      {tab === 'assignments' && (
        <AssignmentList autoOpenAdd={autoOpen && tab === 'assignments'} onAutoOpenHandled={clearAutoOpen} />
      )}
      {tab === 'exams' && <ExamList autoOpenAdd={autoOpen && tab === 'exams'} onAutoOpenHandled={clearAutoOpen} />}
      {tab === 'availability' && <AvailabilityEditor />}

      <FloatingActionButton
        actions={[
          { label: 'New Subject', icon: <Plus className="size-4" />, onClick: () => { setTab('subjects'); setAutoOpen(true); } },
          { label: 'New Assignment', icon: <CalendarPlus className="size-4" />, onClick: () => { setTab('assignments'); setAutoOpen(true); } },
          { label: 'New Exam', icon: <GraduationCap className="size-4" />, onClick: () => { setTab('exams'); setAutoOpen(true); } },
        ]}
      />
    </div>
  );
}
