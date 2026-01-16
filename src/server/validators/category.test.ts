import { describe, expect, it } from "vitest";

import { categorySchema } from "@/server/validators/category";

describe("category validator", () => {
  it("accepts valid category", () => {
    const parsed = categorySchema.parse({ name: "Groceries", color: "#ffffff", icon: "shopping-cart" });
    expect(parsed.name).toBe("Groceries");
  });

  it("rejects invalid color", () => {
    expect(() => categorySchema.parse({ name: "Groceries", color: "red", icon: "shopping-cart" })).toThrow();
  });
});
