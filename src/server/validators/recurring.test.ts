import { describe, expect, it } from "vitest";

import { recurringSchema } from "@/server/validators/recurring";

describe("recurring validator", () => {
  it("accepts valid recurring rule", () => {
    const parsed = recurringSchema.parse({
      type: "EXPENSE",
      amountCents: 2000,
      categoryId: "ckx9qg1m00001i7s3ic5q5c8d",
      frequency: "MONTHLY",
      interval: 1,
      nextRunAt: new Date().toISOString(),
    });
    expect(parsed.frequency).toBe("MONTHLY");
  });

  it("rejects invalid frequency", () => {
    expect(() => recurringSchema.parse({
      type: "EXPENSE",
      amountCents: 2000,
      categoryId: "ckx9qg1m00001i7s3ic5q5c8d",
      frequency: "DAILY",
      interval: 1,
      nextRunAt: new Date().toISOString(),
    })).toThrow();
  });
});
