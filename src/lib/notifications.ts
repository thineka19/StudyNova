// Smart Notifications (Phase 3, item 12) — pure computation of which
// reminders are due right now. The context layer dedupes against
// already-fired notifications (by `dedupeKey`) and fires the browser
// Notifications API alongside the in-app entry.

import type { StudyNovaData } from '../types';
import { daysUntil, dayOfWeek, todayISO } from './dateUtils';

export interface NotificationCandidate {
  dedupeKey: string;
  title: string;
  body: string;
  kind: 'exam' | 'deadline' | 'session';
}

export function computeDueNotifications(data: StudyNovaData, now: Date): NotificationCandidate[] {
  const candidates: NotificationCandidate[] = [];
  const today = todayISO();
  const subjectName = (id: string) => data.subjects.find((s) => s.id === id)?.name ?? 'a subject';

  for (const exam of data.exams) {
    if (daysUntil(exam.date) === 1) {
      candidates.push({
        dedupeKey: `exam-tomorrow:${exam.id}:${today}`,
        kind: 'exam',
        title: 'Exam Tomorrow',
        body: `${subjectName(exam.subjectId)} exam is tomorrow. Preparedness: ${exam.preparedness}%.`,
      });
    }
  }

  for (const assignment of data.assignments) {
    if (assignment.status === 'submitted') continue;
    if (daysUntil(assignment.deadline) === 2) {
      candidates.push({
        dedupeKey: `deadline-2d:${assignment.id}:${today}`,
        kind: 'deadline',
        title: 'Deadline in 2 Days',
        body: `"${assignment.title}" (${subjectName(assignment.subjectId)}) is due in 2 days.`,
      });
    }
  }

  const todayDow = dayOfWeek(today);
  const todaysBlocks = data.availability.find((a) => a.dayOfWeek === todayDow)?.freeTimeBlocks ?? [];
  const hasScheduledWorkToday = data.studySessions.some((s) => s.date === today && !s.completed);
  if (hasScheduledWorkToday) {
    for (const block of todaysBlocks) {
      const [h, m] = block.start.split(':').map(Number);
      const blockStart = new Date(now);
      blockStart.setHours(h, m, 0, 0);
      const minsUntilStart = (blockStart.getTime() - now.getTime()) / 60_000;
      if (minsUntilStart > 0 && minsUntilStart <= 30) {
        candidates.push({
          dedupeKey: `session-soon:${block.start}:${today}`,
          kind: 'session',
          title: 'Study Session Starting Soon',
          body: `Your ${block.start} study block starts in about ${Math.round(minsUntilStart)} minutes.`,
        });
      }
    }
  }

  return candidates;
}
