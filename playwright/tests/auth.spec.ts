import { test, expect } from "@playwright/test";

import { resetDatabase } from "../utils/db";
import { signup, login } from "./utils";

test.beforeEach(async () => {
  await resetDatabase();
});


test("signup, logout, login flow", async ({ page }) => {
  const email = `user_${Date.now()}@example.com`;
  const password = "Password123!";

  await signup(page, email, password);

  await page.goto("/settings");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/login/);

  await login(page, email, password);
});
