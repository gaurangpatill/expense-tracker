import { test, expect } from "@playwright/test";

import { resetDatabase, createUser } from "../utils/db";
import { login } from "./utils";

test.beforeEach(async () => {
  await resetDatabase();
});


test("recurring generation is idempotent", async ({ page }) => {
  const email = `rec_${Date.now()}@example.com`;
  const password = "Password123!";
  await createUser(email, password);
  await login(page, email, password);

  await page.goto("/categories");
  await page.getByLabel("Name").fill("Streaming");
  await page.getByLabel("Color").fill("#f43f5e");
  await page.getByRole("button", { name: "Choose icon" }).click();
  await page.getByLabel("Search icons").fill("sparkles");
  await page.getByRole("button", { name: /select sparkles icon/i }).click();
  await page.getByRole("button", { name: "Create category" }).click();

  await page.goto("/recurring");
  await page.getByLabel("Amount").fill("19.99");
  await page.getByLabel("Category").selectOption({ label: "Streaming" });
  await page.getByLabel("Merchant").fill("Streaming Co");

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const inputValue = `${yesterday.toISOString().slice(0, 16)}`;
  await page.getByLabel("Next run").fill(inputValue);

  await page.getByRole("button", { name: "Create rule" }).click();
  await expect(page.getByText("Streaming Co")).toBeVisible();

  await page.getByRole("button", { name: "Generate due" }).click();
  await page.getByRole("button", { name: "Generate due" }).click();

  await page.goto("/transactions");
  const items = page.locator("text=Streaming Co");
  await expect(items).toHaveCount(1);
});
