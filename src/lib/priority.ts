// Smart Priority Calculator (Phase 2, item 5).
//
// score = f(days left, difficulty, assignment weight, preparedness%)
// Produces a single 0-100 number so assignments and exams can be ranked
// side by side in one list. Tune the WEIGHTS below to change behaviour.

import type { Assignment, Exam, Subject, Difficulty } from '../types';
import { clamp, daysUntil } from './dateUtils';

export interface PriorityItem {
  id: string;
  type: 'assignment' | 'exam';
  subjectId: string;
  subjectName: string;
  title: string;
  dueDate: string;
  daysLeft: number;
  difficulty: Difficulty;
  preparedness: number;
  priorityScore: number;
}

const WEIGHTS = {
  urgency: 0.35,
  difficulty: 0.2,
  importance: 0.25,
  preparednessGap: 0.2,
};

const DIFFICULTY_SCORE: Record<Difficulty, number> = { low: 33, med: 66, high: 100 };

// Urgency ramps up sharply as the deadline approaches and saturates once a
// task is overdue, so overdue items always float to the top.
function urgencyScore(daysLeft: number): number {
  if (daysLeft <= 0) return 100;
  return clamp(100 - daysLeft * 4, 5, 100);
}

function scoreItem(daysLeft: number, difficulty: Difficulty, importance0to100: number, preparedness: number): number {
  const urgency = urgencyScore(daysLeft);
  const diff = DIFFICULTY_SCORE[difficulty];
  const prepGap = clamp(100 - preparedness, 0, 100);
  const raw =
    urgency * WEIGHTS.urgency +
    diff * WEIGHTS.difficulty +
    importance0to100 * WEIGHTS.importance +
    prepGap * WEIGHTS.preparednessGap;
  return Math.round(clamp(raw, 0, 100));
}

export function calculatePriorities(
  assignments: Assignment[],
  exams: Exam[],
  subjects: Subject[],
): PriorityItem[] {
  const subjectMap = new Map(subjects.map((s) => [s.id, s]));
  const items: PriorityItem[] = [];

  for (const a of assignments) {
    if (a.status === 'submitted') continue;
    const subject = subjectMap.get(a.subjectId);
    const daysLeft = daysUntil(a.deadline);
    // An assignment's "preparedness" proxy is how far along its subject's
    // overall progress is combined with its own status.
    const statusBoost = a.status === 'in-progress' ? 25 : 0;
    const preparedness = clamp((subject?.progress ?? 0) * 0.5 + statusBoost, 0, 100);
    items.push({
      id: a.id,
      type: 'assignment',
      subjectId: a.subjectId,
      subjectName: subject?.name ?? 'Unknown',
      title: a.title,
      dueDate: a.deadline,
      daysLeft,
      difficulty: subject?.difficulty ?? 'med',
      preparedness,
      priorityScore: scoreItem(daysLeft, subject?.difficulty ?? 'med', a.weight * 10, preparedness),
    });
  }

  for (const e of exams) {
    const subject = subjectMap.get(e.subjectId);
    const daysLeft = daysUntil(e.date);
    // Exams are inherently high-importance; scale slightly by difficulty.
    const importance = DIFFICULTY_SCORE[e.difficulty];
    items.push({
      id: e.id,
      type: 'exam',
      subjectId: e.subjectId,
      subjectName: subject?.name ?? 'Unknown',
      title: `${subject?.name ?? 'Exam'} Exam`,
      dueDate: e.date,
      daysLeft,
      difficulty: e.difficulty,
      preparedness: e.preparedness,
      priorityScore: scoreItem(daysLeft, e.difficulty, importance, e.preparedness),
    });
  }

  return items.sort((a, b) => b.priorityScore - a.priorityScore);
}
