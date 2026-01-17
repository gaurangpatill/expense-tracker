import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export default defineConfig({
  testDir: "playwright/tests",
  workers: 1,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --hostname localhost --port 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NODE_ENV: "test",
      DATABASE_URL_TEST: process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL ?? "",
      DATABASE_URL: process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL ?? "",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "test-secret",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
