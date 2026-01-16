import { describe, expect, it } from "vitest";

import { transactionSchema } from "@/server/validators/transaction";

describe("transaction validator", () => {
  it("accepts valid transaction", () => {
    const parsed = transactionSchema.parse({
      type: "EXPENSE",
      amountCents: 1234,
      date: new Date().toISOString(),
      categoryId: "ckx9qg1m00001i7s3ic5q5c8d",
    });
    expect(parsed.type).toBe("EXPENSE");
  });

  it("rejects invalid type", () => {
    expect(() => transactionSchema.parse({
      type: "OTHER",
      amountCents: 1234,
      date: new Date().toISOString(),
      categoryId: "ckx9qg1m00001i7s3ic5q5c8d",
    })).toThrow();
  });
});
