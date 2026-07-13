// Small date helpers shared across the scheduling engine. Dates are always
// stored/compared as ISO "YYYY-MM-DD" strings to avoid timezone drift.

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(fromISO: string, toISO: string): number {
  const from = new Date(fromISO + 'T00:00:00').getTime();
  const to = new Date(toISO + 'T00:00:00').getTime();
  return Math.round((to - from) / 86_400_000);
}

export function daysUntil(dateISO: string): number {
  return daysBetween(todayISO(), dateISO);
}

export function formatShortDate(dateISO: string): string {
  return new Date(dateISO + 'T00:00:00').toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function dayOfWeek(dateISO: string): number {
  return new Date(dateISO + 'T00:00:00').getDay();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
