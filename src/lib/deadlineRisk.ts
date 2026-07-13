// Deadline Risk Predictor (Phase 2, item 8).
//
// Compares the pace at which a subject's topics are actually being covered
// against the pace required to finish by a target deadline, and — if the
// current pace is too slow — projects a realistic completion date.

import { addDaysISO, clamp, daysBetween, daysUntil, todayISO } from './dateUtils';

export interface DeadlineRisk {
  isAtRisk: boolean;
  actualPacePerDay: number; // topics/day actually being completed
  requiredPacePerDay: number; // topics/day needed to hit the deadline
  daysRemaining: number;
  topicsRemaining: number;
  estimatedCompletionDate: string | null; // null = pace is 0, can't project
}

export function calculateDeadlineRisk(
  subjectCreatedAt: string,
  topicsTotal: number,
  topicsCovered: number,
  targetDateISO: string,
): DeadlineRisk {
  const topicsRemaining = Math.max(0, topicsTotal - topicsCovered);
  const daysElapsed = Math.max(1, daysBetween(subjectCreatedAt, todayISO()));
  const daysRemaining = Math.max(0, daysUntil(targetDateISO));

  const actualPacePerDay = topicsCovered / daysElapsed;
  const requiredPacePerDay = topicsRemaining / Math.max(1, daysRemaining);

  const estimatedCompletionDate =
    actualPacePerDay > 0 ? addDaysISO(todayISO(), Math.ceil(topicsRemaining / actualPacePerDay)) : null;

  // At risk if there's still work to do and either we have no measurable
  // pace yet, or that pace is meaningfully slower than what's required.
  const isAtRisk =
    topicsRemaining > 0 && (actualPacePerDay <= 0 || actualPacePerDay < requiredPacePerDay * 0.8);

  return {
    isAtRisk,
    actualPacePerDay: clamp(actualPacePerDay, 0, 1),
    requiredPacePerDay: clamp(requiredPacePerDay, 0, 1),
    daysRemaining,
    topicsRemaining,
    estimatedCompletionDate,
  };
}
