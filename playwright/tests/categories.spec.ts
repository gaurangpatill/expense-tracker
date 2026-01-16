import { test, expect } from "@playwright/test";

import { resetDatabase, createUser } from "../utils/db";
import { login } from "./utils";

test.beforeEach(async () => {
  await resetDatabase();
});


test("create and edit category with icon", async ({ page }) => {
  const email = `cat_${Date.now()}@example.com`;
  const password = "Password123!";
  await createUser(email, password);

  await login(page, email, password);

  await page.goto("/categories");
  await page.getByLabel("Name").fill("Coffee");
  await page.getByLabel("Color").fill("#0ea5e9");
  await page.getByRole("button", { name: "Choose icon" }).click();
  await page.getByLabel("Search icons").fill("coffee");
  await page.getByRole("button", { name: /select coffee icon/i }).click();
  await page.getByRole("button", { name: "Create category" }).click();

  const row = page.getByText("Coffee");
  await expect(row).toBeVisible();
  await expect(row.locator("xpath=ancestor::div[contains(@class,'border-neutral-200')]//svg")).toBeVisible();

  await page.getByRole("button", { name: "Edit" }).first().click();
  await page.getByLabel("Name").fill("Cafe");
  await page.getByRole("button", { name: "Choose icon" }).click();
  await page.getByLabel("Search icons").fill("coffee");
  await page.getByRole("button", { name: /select coffee icon/i }).click();
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Cafe")).toBeVisible();
});
