import { beforeEach, describe, expect, it } from "vitest";

import { createCategory } from "@/server/services/categories";
import { createTransaction, listTransactions } from "@/server/services/transactions";
import { resetDb, seedUser } from "@/test/db/helpers";

const categoryPayload = { name: "Food", color: "#22c55e", icon: "utensils" };

describe("transactions service", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("filters by type and date range", async () => {
    const user = await seedUser();
    const category = await createCategory(user.id, categoryPayload);

    await createTransaction(user.id, {
      type: "EXPENSE",
      amountCents: 5000,
      date: new Date("2025-01-02").toISOString(),
      categoryId: category.id,
      merchant: "Cafe",
    });

    await createTransaction(user.id, {
      type: "INCOME",
      amountCents: 120000,
      date: new Date("2025-01-10").toISOString(),
      categoryId: category.id,
      merchant: "Salary",
    });

    const result = await listTransactions(user.id, {
      type: "EXPENSE",
      startDate: new Date("2025-01-01").toISOString(),
      endDate: new Date("2025-01-05").toISOString(),
      page: "1",
      pageSize: "10",
      sort: "date_desc",
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].merchant).toBe("Cafe");
  });

  it("paginates and orders by date", async () => {
    const user = await seedUser();
    const category = await createCategory(user.id, categoryPayload);

    await createTransaction(user.id, {
      type: "EXPENSE",
      amountCents: 1000,
      date: new Date("2025-01-01").toISOString(),
      categoryId: category.id,
    });
    await createTransaction(user.id, {
      type: "EXPENSE",
      amountCents: 2000,
      date: new Date("2025-01-03").toISOString(),
      categoryId: category.id,
    });

    const result = await listTransactions(user.id, {
      page: "1",
      pageSize: "1",
      sort: "date_desc",
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].amountCents).toBe(2000);
  });

  it("filters by min and max amount", async () => {
    const user = await seedUser();
    const category = await createCategory(user.id, categoryPayload);

    await createTransaction(user.id, {
      type: "EXPENSE",
      amountCents: 1500,
      date: new Date("2025-01-01").toISOString(),
      categoryId: category.id,
    });
    await createTransaction(user.id, {
      type: "EXPENSE",
      amountCents: 9000,
      date: new Date("2025-01-02").toISOString(),
      categoryId: category.id,
    });

    const result = await listTransactions(user.id, {
      page: "1",
      pageSize: "10",
      minAmount: "2000",
      maxAmount: "8000",
    });

    expect(result.items).toHaveLength(0);
  });
});
