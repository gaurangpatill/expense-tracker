import { test, expect } from "@playwright/test";

import { resetDatabase, createUser } from "../utils/db";
import { login } from "./utils";

test.beforeEach(async () => {
  await resetDatabase();
});


test("add transactions, filter, dashboard updates", async ({ page }) => {
  const email = `txn_${Date.now()}@example.com`;
  const password = "Password123!";
  await createUser(email, password);
  await login(page, email, password);

  await page.goto("/categories");
  await page.getByLabel("Name").fill("Travel");
  await page.getByLabel("Color").fill("#f97316");
  await page.getByRole("button", { name: "Choose icon" }).click();
  await page.getByLabel("Search icons").fill("plane");
  await page.getByRole("button", { name: /select plane icon/i }).click();
  await page.getByRole("button", { name: "Create category" }).click();

  await page.goto("/transactions/new");
  await page.getByLabel("Amount").fill("120.00");
  await page.getByLabel("Category").selectOption({ label: "Travel" });
  await page.getByLabel("Merchant").fill("Airline");
  await page.getByRole("button", { name: "Create transaction" }).click();

  await page.goto("/transactions/new");
  await page.getByLabel("Type").selectOption("INCOME");
  await page.getByLabel("Amount").fill("500.00");
  await page.getByLabel("Category").selectOption({ label: "Travel" });
  await page.getByRole("button", { name: "Create transaction" }).click();

  await page.goto("/transactions");
  await page.getByLabel("Type").selectOption("EXPENSE");
  await page.getByLabel("Category").selectOption({ label: "Travel" });
  await expect(page.getByText("Airline")).toBeVisible();

  await page.goto("/dashboard");
  await expect(page.getByTestId("card-income")).toContainText("$");
  await expect(page.getByTestId("card-expenses")).toContainText("$");
});
