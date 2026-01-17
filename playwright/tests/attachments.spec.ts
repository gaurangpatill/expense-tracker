import { test, expect } from "@playwright/test";
import path from "path";

import { resetDatabase, createUser } from "../utils/db";
import { login } from "./utils";

test.beforeEach(async () => {
  await resetDatabase();
});


test("upload receipt attachment", async ({ page }) => {
  const email = `attach_${Date.now()}@example.com`;
  const password = "Password123!";
  await createUser(email, password);
  await login(page, email, password);

  await page.goto("/categories");
  await page.getByLabel("Name").fill("Office");
  await page.getByLabel("Color").fill("#0ea5e9");
  await page.getByRole("button", { name: "Choose icon" }).click();
  await page.getByLabel("Search icons").fill("briefcase");
  await page.getByRole("button", { name: /select briefcase icon/i }).click();
  await page.getByRole("button", { name: "Create category" }).click();

  await page.goto("/transactions/new");
  await page.getByLabel("Amount").fill("45.00");
  await page.getByLabel("Category").selectOption({ label: "Office" });
  await page.getByLabel("Merchant").fill("Office Depot");

  const filePath = path.join(process.cwd(), "playwright/fixtures/receipt.png");
  await page.setInputFiles("input[type=file]", filePath);
  await expect(page.locator("label", { hasText: "Receipt attachment" }).getByText("Receipt attached")).toBeVisible();

  await page.getByRole("button", { name: "Create transaction" }).click();

  await page.goto("/transactions");
  await page.getByText("Office Depot").click();
  await expect(page.getByAltText("Receipt attachment")).toBeVisible();
});
