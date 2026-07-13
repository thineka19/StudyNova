// Study Hour Recommendation (Phase 2, item 7) + shared time-estimation
// helpers reused by the Schedule Generator (item 6).

import type { Difficulty } from '../types';
import { clamp } from './dateUtils';

// Base hours needed to comfortably learn one topic, by difficulty.
const BASE_HOURS_PER_TOPIC: Record<Difficulty, number> = { low: 1, med: 1.5, high: 2.5 };

const MIN_DAILY_HOURS = 0.5;
const MAX_DAILY_HOURS = 6;

// Preparedness reduces required hours: someone at 80% prepared needs far
// less new study time per topic than someone at 10%.
export function estimateTotalHoursNeeded(
  topicsRemaining: number,
  difficulty: Difficulty,
  preparedness: number,
): number {
  if (topicsRemaining <= 0) return 0;
  const base = topicsRemaining * BASE_HOURS_PER_TOPIC[difficulty];
  const preparednessMultiplier = 1 - clamp(preparedness, 0, 100) / 200; // 0% -> 1x, 100% -> 0.5x
  return Math.round(base * preparednessMultiplier * 10) / 10;
}

export interface HourRecommendation {
  recommendedDailyHours: number;
  totalHoursNeeded: number;
}

export function recommendDailyHours(
  daysRemaining: number,
  topicsRemaining: number,
  difficulty: Difficulty,
  preparedness: number,
): HourRecommendation {
  const totalHoursNeeded = estimateTotalHoursNeeded(topicsRemaining, difficulty, preparedness);
  if (daysRemaining <= 0) {
    return { recommendedDailyHours: totalHoursNeeded, totalHoursNeeded };
  }
  const perDay = totalHoursNeeded / daysRemaining;
  return {
    recommendedDailyHours: Math.round(clamp(perDay, MIN_DAILY_HOURS, MAX_DAILY_HOURS) * 10) / 10,
    totalHoursNeeded,
  };
}
