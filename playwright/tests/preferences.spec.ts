import { test, expect } from "@playwright/test";

import { resetDatabase, createUser } from "../utils/db";
import { login } from "./utils";

test.beforeEach(async () => {
  await resetDatabase();
});


test("change currency and toggle widgets", async ({ page }) => {
  const email = `pref_${Date.now()}@example.com`;
  const password = "Password123!";
  await createUser(email, password);
  await login(page, email, password);

  await page.goto("/categories");
  await page.getByLabel("Name").fill("Misc");
  await page.getByLabel("Color").fill("#0ea5e9");
  await page.getByRole("button", { name: "Choose icon" }).click();
  await page.getByLabel("Search icons").fill("receipt");
  await page.getByRole("button", { name: /select receipt icon/i }).click();
  await page.getByRole("button", { name: "Create category" }).click();

  await page.goto("/transactions/new");
  await page.getByLabel("Amount").fill("10.00");
  await page.getByLabel("Category").selectOption({ label: "Misc" });
  await page.getByRole("button", { name: "Create transaction" }).click();

  await page.goto("/settings");
  await page.getByLabel("Currency").selectOption("EUR");

  await page.getByTestId("toggle-widget-showTopMerchants").click();

  await page.goto("/dashboard");
  await expect(page.getByTestId("card-income")).toContainText("€");
  await expect(page.locator("[data-testid='widget-top-merchants']")).toHaveCount(0);

  await page.goto("/transactions");
  await expect(page.getByText("€")).toBeVisible();
});
