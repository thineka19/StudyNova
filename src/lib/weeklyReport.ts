// Weekly Study Report (Phase 4, item 15): turns the last 7 days of activity
// into a plain-language summary plus a couple of actionable tips.

import type { StudyNovaData } from '../types';
import { calculateReadiness } from './readiness';
import { addDaysISO, daysBetween, todayISO } from './dateUtils';

export interface WeeklyReport {
  hoursStudied: number;
  tasksCompleted: number;
  strongestSubject: string | null;
  weakestSubject: string | null;
  tips: string[];
}

export function generateWeeklyReport(data: StudyNovaData): WeeklyReport {
  const weekStart = addDaysISO(todayISO(), -6);
  const inWeek = (date: string) => daysBetween(weekStart, date) >= 0 && daysBetween(date, todayISO()) >= 0;

  const weekSessions = data.studySessions.filter((s) => s.completed && inWeek(s.date));
  const weekFocus = data.focusSessions.filter((s) => s.completed && inWeek(s.date));
  const hoursStudied =
    Math.round(
      ((weekSessions.reduce((sum, s) => sum + s.durationMins, 0) + weekFocus.reduce((sum, s) => sum + s.durationMins, 0)) / 60) * 10,
    ) / 10;
  const tasksCompleted = weekSessions.length;

  const subjectScores = data.subjects.map((s) => {
    const hours = data.studySessions
      .filter((sess) => sess.completed && sess.subjectId === s.id)
      .reduce((sum, sess) => sum + sess.durationMins, 0) / 60;
    const exam = data.exams.find((e) => e.subjectId === s.id);
    const topicsPct = s.topics.length > 0 ? (s.topics.filter((t) => t.covered).length / s.topics.length) * 100 : 0;
    const readiness = exam ? calculateReadiness(topicsPct, hours, exam.practiceTestsDone).score : Math.round(topicsPct);
    return { name: s.name, readiness, hours };
  });

  const sorted = [...subjectScores].sort((a, b) => b.readiness - a.readiness);
  const strongestSubject = sorted[0]?.name ?? null;
  const weakestSubject = sorted.length > 1 ? sorted[sorted.length - 1].name : null;

  const tips: string[] = [];
  if (hoursStudied < 5) tips.push("You've studied less than 5 hours this week — try blocking out a bit more time each evening.");
  if (weakestSubject && weakestSubject !== strongestSubject) {
    tips.push(`${weakestSubject} looks like your weakest subject right now — consider prioritizing it this week.`);
  }
  const atRiskCount =
    data.exams.filter((e) => {
      const s = data.subjects.find((sub) => sub.id === e.subjectId);
      const topicsPct = s && s.topics.length > 0 ? (s.topics.filter((t) => t.covered).length / s.topics.length) * 100 : 0;
      const hours = data.studySessions
        .filter((sess) => sess.completed && sess.subjectId === e.subjectId)
        .reduce((sum, sess) => sum + sess.durationMins, 0) / 60;
      return calculateReadiness(topicsPct, hours, e.practiceTestsDone).status === 'at-risk';
    }).length;
  if (atRiskCount > 0) tips.push(`${atRiskCount} exam${atRiskCount > 1 ? 's are' : ' is'} currently marked "At Risk" — schedule a review session soon.`);
  if (tips.length === 0) tips.push("Great pace this week — keep the consistent study habit going!");

  return { hoursStudied, tasksCompleted, strongestSubject, weakestSubject, tips };
}
