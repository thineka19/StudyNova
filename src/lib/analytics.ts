// Pure data-shaping helpers for the Productivity Analytics charts (Phase 4,
// item 14) and the Weekly Study Report (item 15). Kept separate from the
// scheduling engine since they summarize history rather than plan ahead.

import type { FocusSession, StudySession, Subject } from '../types';
import { addDaysISO, daysBetween, todayISO } from './dateUtils';

export interface DayHours {
  date: string;
  label: string;
  hours: number;
}

// Combined study-session + focus-session hours for each of the last N days.
export function hoursPerDay(studySessions: StudySession[], focusSessions: FocusSession[], days = 14): DayHours[] {
  const start = addDaysISO(todayISO(), -(days - 1));
  const result: DayHours[] = [];
  for (let i = 0; i < days; i++) {
    const date = addDaysISO(start, i);
    const studyMins = studySessions.filter((s) => s.completed && s.date === date).reduce((sum, s) => sum + s.durationMins, 0);
    const focusMins = focusSessions.filter((s) => s.completed && s.date === date).reduce((sum, s) => sum + s.durationMins, 0);
    result.push({
      date,
      label: new Date(date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      hours: Math.round(((studyMins + focusMins) / 60) * 10) / 10,
    });
  }
  return result;
}

export interface SubjectHours {
  subjectId: string;
  name: string;
  color: string;
  hours: number;
}

export function hoursBySubject(studySessions: StudySession[], subjects: Subject[]): SubjectHours[] {
  return subjects
    .map((s) => ({
      subjectId: s.id,
      name: s.name,
      color: s.color ?? '#6366f1',
      hours:
        Math.round(
          (studySessions.filter((sess) => sess.completed && sess.subjectId === s.id).reduce((sum, sess) => sum + sess.durationMins, 0) /
            60) *
            10,
        ) / 10,
    }))
    .filter((s) => s.hours > 0);
}

export interface WeekPoint {
  weekLabel: string;
  hours: number;
  tasksCompleted: number;
}

export function weeklyTrend(studySessions: StudySession[], focusSessions: FocusSession[], weeks = 8): WeekPoint[] {
  const points: WeekPoint[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const weekEnd = addDaysISO(todayISO(), -w * 7);
    const weekStart = addDaysISO(weekEnd, -6);
    const inWeek = (date: string) => daysBetween(weekStart, date) >= 0 && daysBetween(date, weekEnd) >= 0;
    const studyMins = studySessions.filter((s) => s.completed && inWeek(s.date)).reduce((sum, s) => sum + s.durationMins, 0);
    const focusMins = focusSessions.filter((s) => s.completed && inWeek(s.date)).reduce((sum, s) => sum + s.durationMins, 0);
    const tasksCompleted = studySessions.filter((s) => s.completed && inWeek(s.date)).length;
    points.push({
      weekLabel: new Date(weekStart + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      hours: Math.round(((studyMins + focusMins) / 60) * 10) / 10,
      tasksCompleted,
    });
  }
  return points;
}
