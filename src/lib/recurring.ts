import type { RecurringFrequency } from "@prisma/client";

export function calculateNextRun(date: Date, frequency: RecurringFrequency, interval: number) {
  const next = new Date(date);
  if (frequency === "WEEKLY") {
    next.setDate(next.getDate() + interval * 7);
  } else {
    next.setMonth(next.getMonth() + interval);
  }
  return next;
}
