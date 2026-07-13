// XP & Achievement System scoring (Phase 4, item 16).
// Pure functions only — the context layer decides when to call these and
// persists the results.

import type { Badge } from '../types';

export const XP_PER_TASK = 15;
export const XP_PER_FOCUS_SESSION = 10;

// Simple increasing curve: level N requires N*100 total XP.
export function levelFromXP(totalXP: number): number {
  return Math.max(1, Math.floor(totalXP / 100) + 1);
}

export function xpToNextLevel(totalXP: number): { current: number; needed: number; level: number } {
  const level = levelFromXP(totalXP);
  const currentLevelFloor = (level - 1) * 100;
  return { current: totalXP - currentLevelFloor, needed: 100, level };
}

// Longest run of consecutive days (ending today or yesterday) that have at
// least one completed session in `dates` (ISO strings, duplicates fine).
export function computeStreakDays(dates: string[]): number {
  const uniqueDays = new Set(dates);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  const cursor = new Date(today);
  // Allow the streak to still count if today has no session yet but
  // yesterday does, so it doesn't reset to 0 at midnight before you've
  // had a chance to study.
  if (!uniqueDays.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (uniqueDays.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface BadgeCheckStats {
  tasksCompleted: number;
  currentStreakDays: number;
  totalHoursStudied: number;
  bestExamReadiness: number;
}

// Returns badge ids that should newly unlock given the latest stats. Does
// not mutate — caller merges the result into the badges array.
export function checkNewlyUnlockedBadges(badges: Badge[], stats: BadgeCheckStats): string[] {
  const unlocked: string[] = [];
  const isLocked = (id: string) => badges.find((b) => b.id === id)?.unlockedAt == null;

  if (isLocked('first-task') && stats.tasksCompleted >= 1) unlocked.push('first-task');
  if (isLocked('streak-7') && stats.currentStreakDays >= 7) unlocked.push('streak-7');
  if (isLocked('hours-20') && stats.totalHoursStudied >= 20) unlocked.push('hours-20');
  if (isLocked('exam-warrior') && stats.bestExamReadiness >= 90) unlocked.push('exam-warrior');

  return unlocked;
}
