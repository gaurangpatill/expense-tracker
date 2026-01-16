import { test, expect } from "@playwright/test";

function randomEmail() {
  return `user_${Date.now()}@example.com`;
}

test("signup and login flow", async ({ page }) => {
  const email = randomEmail();
  const password = "Password123!";

  await page.goto("/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/dashboard/);

  await page.goto("/settings");
  await page.getByRole("button", { name: "Sign out" }).click();

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/dashboard/);
});
