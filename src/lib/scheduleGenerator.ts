// Study Schedule Generator (Phase 2, item 6).
//
// Given a target date (exam/assignment deadline), the subject's difficulty,
// preparedness, and remaining topics, breaks the work into a day-by-day plan
// with time estimates. Topics are distributed evenly across the days left;
// any leftover days beyond topic count become light review days.

import type { Difficulty } from '../types';
import { addDaysISO, clamp, daysUntil, todayISO } from './dateUtils';
import { estimateTotalHoursNeeded } from './studyHours';

export interface DayPlan {
  date: string;
  label: string; // "Today" | "Tomorrow" | formatted date
  topics: string[];
  estimatedHours: number;
  isReviewDay: boolean;
}

const REVIEW_DAY_HOURS = 0.5;

function labelForOffset(offset: number, date: string): string {
  if (offset === 0) return 'Today';
  if (offset === 1) return 'Tomorrow';
  return new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function generateSchedule(
  remainingTopics: string[],
  targetDateISO: string,
  difficulty: Difficulty,
  preparedness: number,
): DayPlan[] {
  const daysLeft = clamp(daysUntil(targetDateISO), 1, 90);
  if (remainingTopics.length === 0) {
    return [
      {
        date: todayISO(),
        label: 'Today',
        topics: [],
        estimatedHours: REVIEW_DAY_HOURS,
        isReviewDay: true,
      },
    ];
  }

  const totalHours = estimateTotalHoursNeeded(remainingTopics.length, difficulty, preparedness);
  const hoursPerTopic = totalHours / remainingTopics.length;
  const chunkSize = Math.max(1, Math.ceil(remainingTopics.length / daysLeft));

  const plan: DayPlan[] = [];
  let topicIndex = 0;

  for (let offset = 0; offset < daysLeft && topicIndex < remainingTopics.length; offset++) {
    const date = addDaysISO(todayISO(), offset);
    const chunk = remainingTopics.slice(topicIndex, topicIndex + chunkSize);
    topicIndex += chunk.length;
    plan.push({
      date,
      label: labelForOffset(offset, date),
      topics: chunk,
      estimatedHours: Math.round(chunk.length * hoursPerTopic * 10) / 10,
      isReviewDay: false,
    });
  }

  // If days remain after all topics are scheduled, add a couple of review
  // days leading up to the deadline so the plan doesn't just stop early.
  const lastScheduledOffset = plan.length;
  const reviewDaysToAdd = Math.min(2, daysLeft - lastScheduledOffset);
  for (let i = 0; i < reviewDaysToAdd; i++) {
    const offset = lastScheduledOffset + i;
    const date = addDaysISO(todayISO(), offset);
    plan.push({
      date,
      label: labelForOffset(offset, date),
      topics: [],
      estimatedHours: REVIEW_DAY_HOURS,
      isReviewDay: true,
    });
  }

  return plan;
}
