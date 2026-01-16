import { describe, expect, it } from "vitest";

import { calculateNextRun } from "@/lib/recurring";

describe("calculateNextRun", () => {
  it("adds weeks when weekly", () => {
    const start = new Date("2025-01-01T00:00:00Z");
    const next = calculateNextRun(start, "WEEKLY", 2);
    expect(next.toISOString().slice(0, 10)).toBe("2025-01-15");
  });

  it("adds months when monthly", () => {
    const start = new Date("2025-01-10T00:00:00Z");
    const next = calculateNextRun(start, "MONTHLY", 1);
    expect(next.toISOString().slice(0, 10)).toBe("2025-02-10");
  });
});
