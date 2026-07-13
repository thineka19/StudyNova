import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  Assignment,
  DailyAvailability,
  Exam,
  StudyNovaData,
  StudySession,
  Subject,
} from '../types';
import { repository } from '../data/repository';
import { calculatePriorities, type PriorityItem } from '../lib/priority';
import { calculateDeadlineRisk, type DeadlineRisk } from '../lib/deadlineRisk';
import { calculateReadiness, type ReadinessResult } from '../lib/readiness';
import { buildAutoSessions, mergeAutoSessions } from '../lib/autoSchedule';
import { computeDueNotifications } from '../lib/notifications';
import { checkNewlyUnlockedBadges, computeStreakDays, levelFromXP, XP_PER_FOCUS_SESSION, XP_PER_TASK } from '../lib/xp';
import { todayISO } from '../lib/dateUtils';

interface DerivedData {
  priorities: PriorityItem[];
  hoursStudiedBySubject: Record<string, number>;
  examReadiness: Record<string, ReadinessResult>;
  examRisk: Record<string, DeadlineRisk>;
  assignmentRisk: Record<string, DeadlineRisk>;
  currentStreakDays: number;
  totalHoursStudied: number;
}

interface AppContextValue {
  data: StudyNovaData | null;
  loading: boolean;
  derived: DerivedData;

  addSubject: (input: Omit<Subject, 'id' | 'createdAt'>) => Promise<void>;
  updateSubject: (id: string, patch: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

  addAssignment: (input: Omit<Assignment, 'id' | 'createdAt'>) => Promise<void>;
  updateAssignment: (id: string, patch: Partial<Assignment>) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;

  addExam: (input: Omit<Exam, 'id' | 'createdAt'>) => Promise<void>;
  updateExam: (id: string, patch: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;

  addStudySession: (input: Omit<StudySession, 'id'>) => Promise<void>;
  toggleStudySessionCompleted: (id: string) => Promise<void>;
  deleteStudySession: (id: string) => Promise<void>;

  addFocusSession: (type: '25' | '50', durationMins: number) => Promise<void>;
  setAvailability: (availability: DailyAvailability[]) => Promise<void>;

  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  regenerateSchedule: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

function computeDerived(data: StudyNovaData): DerivedData {
  const priorities = calculatePriorities(data.assignments, data.exams, data.subjects);

  const hoursStudiedBySubject: Record<string, number> = {};
  for (const session of data.studySessions) {
    if (!session.completed) continue;
    hoursStudiedBySubject[session.subjectId] = (hoursStudiedBySubject[session.subjectId] ?? 0) + session.durationMins / 60;
  }

  const examReadiness: Record<string, ReadinessResult> = {};
  const examRisk: Record<string, DeadlineRisk> = {};
  for (const exam of data.exams) {
    const subject = data.subjects.find((s) => s.id === exam.subjectId);
    const topicsTotal = subject?.topics.length ?? 0;
    const topicsCovered = subject?.topics.filter((t) => t.covered).length ?? 0;
    const topicsPct = topicsTotal > 0 ? (topicsCovered / topicsTotal) * 100 : 0;
    const hours = hoursStudiedBySubject[exam.subjectId] ?? 0;
    examReadiness[exam.id] = calculateReadiness(topicsPct, hours, exam.practiceTestsDone);
    if (subject) {
      examRisk[exam.id] = calculateDeadlineRisk(subject.createdAt, topicsTotal, topicsCovered, exam.date);
    }
  }

  const assignmentRisk: Record<string, DeadlineRisk> = {};
  for (const assignment of data.assignments) {
    const subject = data.subjects.find((s) => s.id === assignment.subjectId);
    if (!subject) continue;
    const topicsTotal = subject.topics.length;
    const topicsCovered = subject.topics.filter((t) => t.covered).length;
    assignmentRisk[assignment.id] = calculateDeadlineRisk(subject.createdAt, topicsTotal, topicsCovered, assignment.deadline);
  }

  const completedDates = [
    ...data.studySessions.filter((s) => s.completed).map((s) => s.date),
    ...data.focusSessions.filter((s) => s.completed).map((s) => s.date),
  ];
  const currentStreakDays = computeStreakDays(completedDates);
  const totalHoursStudied = Object.values(hoursStudiedBySubject).reduce((a, b) => a + b, 0);

  return { priorities, hoursStudiedBySubject, examReadiness, examRisk, assignmentRisk, currentStreakDays, totalHoursStudied };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StudyNovaData | null>(null);
  const [loading, setLoading] = useState(true);
  const lastScheduleKey = useRef<string>('');
  const notifiedKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    repository.load().then((loaded) => {
      setData({ ...loaded });
      setLoading(false);
    });
  }, []);

  // Ask for browser notification permission once, on first load.
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => undefined);
    }
  }, []);

  const regenerateSchedule = useCallback(async () => {
    const snapshot = repository.getSnapshot();
    const fresh = buildAutoSessions(snapshot.subjects, snapshot.assignments, snapshot.exams);
    const existingAuto = snapshot.studySessions.filter((s) => s.autoGenerated);
    const merged = mergeAutoSessions(existingAuto, fresh);
    const updated = await repository.replaceAutoGeneratedSessions(merged);
    setData({ ...updated });
  }, []);

  // Auto-recompute the schedule whenever the inputs that drive it change.
  useEffect(() => {
    if (!data) return;
    const key = JSON.stringify({
      subjects: data.subjects.map((s) => ({ id: s.id, difficulty: s.difficulty, topics: s.topics })),
      assignments: data.assignments.map((a) => ({ id: a.id, deadline: a.deadline, status: a.status })),
      exams: data.exams.map((e) => ({ id: e.id, date: e.date, difficulty: e.difficulty, preparedness: e.preparedness })),
    });
    if (key === lastScheduleKey.current) return;
    lastScheduleKey.current = key;
    regenerateSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Poll for due notifications (exam tomorrow, deadline in 2 days, session
  // starting soon) and surface both an in-app entry and a browser notification.
  useEffect(() => {
    if (loading) return;
    const tick = async () => {
      const snapshot = repository.getSnapshot();
      const due = computeDueNotifications(snapshot, new Date());
      for (const candidate of due) {
        if (notifiedKeys.current.has(candidate.dedupeKey)) continue;
        if (snapshot.notifications.some((n) => n.dedupeKey === candidate.dedupeKey)) {
          notifiedKeys.current.add(candidate.dedupeKey);
          continue;
        }
        notifiedKeys.current.add(candidate.dedupeKey);
        const updated = await repository.addNotification({
          title: candidate.title,
          body: candidate.body,
          kind: candidate.kind,
          dedupeKey: candidate.dedupeKey,
        });
        setData({ ...updated });
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification(candidate.title, { body: candidate.body });
        }
      }
    };
    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, [loading]);

  const awardXP = useCallback(async (amount: number) => {
    const snapshot = repository.getSnapshot();
    const totalXP = snapshot.xp.totalXP + amount;
    const level = levelFromXP(totalXP);
    const tasksCompleted = snapshot.studySessions.filter((s) => s.completed).length;
    const bestExamReadiness = Math.max(
      0,
      ...snapshot.exams.map((e) => {
        const subject = snapshot.subjects.find((s) => s.id === e.subjectId);
        const topicsTotal = subject?.topics.length ?? 0;
        const topicsCovered = subject?.topics.filter((t) => t.covered).length ?? 0;
        const pct = topicsTotal > 0 ? (topicsCovered / topicsTotal) * 100 : 0;
        const hours = snapshot.studySessions
          .filter((s) => s.completed && s.subjectId === e.subjectId)
          .reduce((sum, s) => sum + s.durationMins / 60, 0);
        return calculateReadiness(pct, hours, e.practiceTestsDone).score;
      }),
    );
    const completedDates = [
      ...snapshot.studySessions.filter((s) => s.completed).map((s) => s.date),
      ...snapshot.focusSessions.filter((s) => s.completed).map((s) => s.date),
    ];
    const totalHoursStudied = snapshot.studySessions
      .filter((s) => s.completed)
      .reduce((sum, s) => sum + s.durationMins / 60, 0);

    const newlyUnlocked = checkNewlyUnlockedBadges(snapshot.xp.badges, {
      tasksCompleted,
      currentStreakDays: computeStreakDays(completedDates),
      totalHoursStudied,
      bestExamReadiness,
    });

    const badges = snapshot.xp.badges.map((b) =>
      newlyUnlocked.includes(b.id) ? { ...b, unlockedAt: new Date().toISOString() } : b,
    );

    const updated = await repository.setXP({ totalXP, level, badges });
    setData({ ...updated });

    for (const badgeId of newlyUnlocked) {
      const badge = badges.find((b) => b.id === badgeId);
      if (!badge) continue;
      const afterNotif = await repository.addNotification({
        title: `Badge Unlocked: ${badge.name}`,
        body: badge.description,
        kind: 'achievement',
        dedupeKey: `badge:${badge.id}`,
      });
      setData({ ...afterNotif });
    }
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      loading,
      derived: data ? computeDerived(data) : {
        priorities: [], hoursStudiedBySubject: {}, examReadiness: {}, examRisk: {}, assignmentRisk: {}, currentStreakDays: 0, totalHoursStudied: 0,
      },

      addSubject: async (input) => setData({ ...(await repository.addSubject(input)) }),
      updateSubject: async (id, patch) => setData({ ...(await repository.updateSubject(id, patch)) }),
      deleteSubject: async (id) => setData({ ...(await repository.deleteSubject(id)) }),

      addAssignment: async (input) => setData({ ...(await repository.addAssignment(input)) }),
      updateAssignment: async (id, patch) => setData({ ...(await repository.updateAssignment(id, patch)) }),
      deleteAssignment: async (id) => setData({ ...(await repository.deleteAssignment(id)) }),

      addExam: async (input) => setData({ ...(await repository.addExam(input)) }),
      updateExam: async (id, patch) => setData({ ...(await repository.updateExam(id, patch)) }),
      deleteExam: async (id) => setData({ ...(await repository.deleteExam(id)) }),

      addStudySession: async (input) => setData({ ...(await repository.addStudySession(input)) }),
      toggleStudySessionCompleted: async (id) => {
        const snapshot = repository.getSnapshot();
        const session = snapshot.studySessions.find((s) => s.id === id);
        if (!session) return;
        const willBeCompleted = !session.completed;
        setData({ ...(await repository.updateStudySession(id, { completed: willBeCompleted })) });
        if (willBeCompleted) await awardXP(XP_PER_TASK);
      },
      deleteStudySession: async (id) => setData({ ...(await repository.deleteStudySession(id)) }),

      addFocusSession: async (type, durationMins) => {
        setData({
          ...(await repository.addFocusSession({ date: todayISO(), type, durationMins, completed: true })),
        });
        await awardXP(XP_PER_FOCUS_SESSION);
      },
      setAvailability: async (availability) => setData({ ...(await repository.setAvailability(availability)) }),

      markNotificationRead: async (id) => setData({ ...(await repository.markNotificationRead(id)) }),
      markAllNotificationsRead: async () => setData({ ...(await repository.markAllNotificationsRead()) }),

      regenerateSchedule,
    }),
    [data, loading, awardXP, regenerateSchedule],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
