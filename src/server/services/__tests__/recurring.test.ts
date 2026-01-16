import { beforeEach, describe, expect, it } from "vitest";

import { createCategory } from "@/server/services/categories";
import { createRecurringRule, generateDueRecurring } from "@/server/services/recurring";
import { listTransactions } from "@/server/services/transactions";
import { resetDb, seedUser } from "@/test/db/helpers";

const categoryPayload = { name: "Streaming", color: "#f43f5e", icon: "sparkles" };

describe("recurring service", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("generates due transactions idempotently", async () => {
    const user = await seedUser();
    const category = await createCategory(user.id, categoryPayload);

    await createRecurringRule(user.id, {
      type: "EXPENSE",
      amountCents: 1599,
      categoryId: category.id,
      frequency: "MONTHLY",
      interval: 1,
      nextRunAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      merchant: "Streaming Co",
    });

    const first = await generateDueRecurring(user.id);
    const second = await generateDueRecurring(user.id);

    expect(first.created).toBe(1);
    expect(second.created).toBe(0);

    const transactions = await listTransactions(user.id, { page: "1", pageSize: "10" });
    expect(transactions.total).toBe(1);
  });
});
