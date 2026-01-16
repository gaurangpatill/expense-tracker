import { test, expect } from "@playwright/test";

function randomEmail() {
  return `user_${Date.now()}@example.com`;
}

test("generate recurring transactions", async ({ page }) => {
  const email = randomEmail();
  const password = "Password123!";

  await page.goto("/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/dashboard/);

  await page.goto("/recurring");
  await page.getByLabel("Amount").fill("19.99");
  await page.getByLabel("Category").selectOption({ index: 1 });
  await page.getByLabel("Merchant").fill("Streaming Co");

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const inputValue = `${yesterday.toISOString().slice(0, 16)}`;
  await page.getByLabel("Next run").fill(inputValue);

  await page.getByRole("button", { name: "Create rule" }).click();
  await expect(page.getByText("Streaming Co")).toBeVisible();

  await page.getByRole("button", { name: "Generate due" }).click();

  await page.goto("/transactions");
  await expect(page.getByText("Streaming Co")).toBeVisible();
});
