// AI Exam Readiness Score (Phase 2, item 9).
//
// A weighted blend of hours studied, topics completed %, and practice tests
// done, collapsed into a 0-100 score with a plain-language status label.

import { clamp } from './dateUtils';

export type ReadinessStatus = 'ready' | 'needs-work' | 'at-risk';

export interface ReadinessResult {
  score: number;
  status: ReadinessStatus;
  label: string;
}

const WEIGHTS = { topics: 0.4, hours: 0.3, practiceTests: 0.3 };
const HOURS_TARGET = 20; // hours studied at which the "hours" component maxes out
const PRACTICE_TESTS_TARGET = 5; // practice tests at which that component maxes out

export function calculateReadiness(
  topicsCompletedPct: number,
  hoursStudied: number,
  practiceTestsDone: number,
): ReadinessResult {
  const topicsComponent = clamp(topicsCompletedPct, 0, 100);
  const hoursComponent = clamp((hoursStudied / HOURS_TARGET) * 100, 0, 100);
  const practiceComponent = clamp((practiceTestsDone / PRACTICE_TESTS_TARGET) * 100, 0, 100);

  const score = Math.round(
    topicsComponent * WEIGHTS.topics + hoursComponent * WEIGHTS.hours + practiceComponent * WEIGHTS.practiceTests,
  );

  if (score >= 75) return { score, status: 'ready', label: '🟢 Ready' };
  if (score >= 45) return { score, status: 'needs-work', label: '🟡 Needs Work' };
  return { score, status: 'at-risk', label: '🔴 At Risk' };
}
