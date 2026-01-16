import { test, expect } from "@playwright/test";

function randomEmail() {
  return `user_${Date.now()}@example.com`;
}

test("create category and transaction", async ({ page }) => {
  const email = randomEmail();
  const password = "Password123!";

  await page.goto("/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/dashboard/);

  await page.goto("/categories");
  await page.getByLabel("Name").fill("Travel");
  await page.getByLabel("Icon key").fill("plane");
  await page.getByRole("button", { name: "Create category" }).click();
  await expect(page.getByText("Travel")).toBeVisible();

  await page.goto("/transactions/new");
  await page.getByLabel("Amount").fill("250.00");
  await page.getByLabel("Category").selectOption({ label: "Travel" });
  await page.getByLabel("Merchant").fill("Airline");
  await page.getByRole("button", { name: "Create transaction" }).click();

  await page.goto("/transactions");
  await expect(page.getByText("Airline")).toBeVisible();
});
