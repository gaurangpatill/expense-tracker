import { beforeEach, describe, expect, it } from "vitest";

import { createBudget, getBudgetProgress } from "@/server/services/budgets";
import { createCategory } from "@/server/services/categories";
import { createTransaction } from "@/server/services/transactions";
import { resetDb, seedUser } from "@/test/db/helpers";

const categoryPayload = { name: "Transport", color: "#0ea5e9", icon: "car" };

describe("budgets service", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("calculates budget progress", async () => {
    const user = await seedUser();
    const category = await createCategory(user.id, categoryPayload);
    const month = "2025-01";

    await createBudget(user.id, { month, categoryId: category.id, limitCents: 10000 });
    await createTransaction(user.id, {
      type: "EXPENSE",
      amountCents: 2500,
      date: new Date("2025-01-05").toISOString(),
      categoryId: category.id,
    });

    const progress = await getBudgetProgress(user.id, month);
    expect(progress[0].spent).toBe(2500);
    expect(progress[0].percent).toBe(25);
  });
});
