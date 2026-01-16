import { describe, expect, it } from "vitest";

import { parseMonthKey } from "@/lib/dates";

describe("parseMonthKey", () => {
  it("returns start and end of month", () => {
    const { start, end } = parseMonthKey("2025-01");
    expect(start.toISOString().slice(0, 10)).toBe("2025-01-01");
    expect(end.toISOString().slice(0, 10)).toBe("2025-01-31");
  });
});
