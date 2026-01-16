import { beforeEach, describe, expect, it } from "vitest";

import { createCategory, deleteCategory, listCategories, updateCategory } from "@/server/services/categories";
import { createTransaction } from "@/server/services/transactions";
import { resetDb, seedUser } from "@/test/db/helpers";

const baseCategory = {
  name: "Groceries",
  color: "#22c55e",
  icon: "shopping-cart",
};

describe("categories service", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("creates and lists categories", async () => {
    const user = await seedUser();
    await createCategory(user.id, baseCategory);
    const items = await listCategories(user.id);
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe("Groceries");
  });

  it("updates category", async () => {
    const user = await seedUser();
    const category = await createCategory(user.id, baseCategory);
    const updated = await updateCategory(user.id, { id: category.id, name: "Food" });
    expect(updated.name).toBe("Food");
  });

  it("prevents deletion when referenced", async () => {
    const user = await seedUser();
    const category = await createCategory(user.id, baseCategory);
    await createTransaction(user.id, {
      type: "EXPENSE",
      amountCents: 1200,
      date: new Date().toISOString(),
      categoryId: category.id,
    });

    const result = await deleteCategory(user.id, category.id);
    expect(result.ok).toBe(false);
  });
});
