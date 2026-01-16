import { format } from "date-fns";

export function monthKey(date: Date): string {
  return format(date, "yyyy-MM");
}

export function parseMonthKey(month: string): { start: Date; end: Date } {
  const [yearStr, monthStr] = month.split("-");
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;
  const start = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, monthIndex + 1, 0, 0, 0, 0));
  return {
    start,
    end,
  };
}
