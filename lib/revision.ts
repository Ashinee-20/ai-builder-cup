export interface TimedActivity { minutes: number; mandatory?: boolean }

export function validateDuration(activities: TimedActivity[], availableMinutes: number) {
  const total = activities.reduce((sum, item) => sum + item.minutes, 0);
  return { total, availableMinutes, valid: total === availableMinutes, overBy: Math.max(0, total - availableMinutes) };
}

export function canApplyRevision(expectedVersion: number, activeVersion: number, state: string) {
  return expectedVersion === activeVersion && state === "proposed";
}
