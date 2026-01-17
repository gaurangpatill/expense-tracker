import { test, expect } from "@playwright/test";

import { resetDatabase, createUser } from "../utils/db";
import { login } from "./utils";

test.beforeEach(async () => {
  await resetDatabase();
});


test("budget overspent state", async ({ page }) => {
  const email = `budget_${Date.now()}@example.com`;
  const password = "Password123!";
  await createUser(email, password);
  await login(page, email, password);

  await page.goto("/categories");
  await page.getByLabel("Name").fill("Food");
  await page.getByLabel("Color").fill("#22c55e");
  await page.getByRole("button", { name: "Choose icon" }).click();
  await page.getByLabel("Search icons").fill("utensils");
  await page.getByRole("button", { name: /select utensils icon/i }).click();
  await page.getByRole("button", { name: "Create category" }).click();

  await page.goto("/budgets");
  await page.getByLabel("Category").selectOption({ label: "Food" });
  await page.getByLabel("Limit").fill("50.00");
  await page.getByRole("button", { name: "Create budget" }).click();

  await page.goto("/transactions/new");
  await page.getByLabel("Amount").fill("75.00");
  await page.getByLabel("Category").selectOption({ label: "Food" });
  await page.getByRole("button", { name: "Create transaction" }).click();

  await page.goto("/budgets");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Over budget")).toBeVisible();
});
