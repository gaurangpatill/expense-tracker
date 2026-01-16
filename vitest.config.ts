import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

dotenv.config({ path: ".env.test" });
const testDb = process.env.DATABASE_URL_TEST;
if (!testDb) {
  throw new Error("DATABASE_URL_TEST is not set");
}

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["./test/setup.ts"],
    env: {
      NODE_ENV: "test",
      VITEST: "true",
      DATABASE_URL_TEST: testDb,
      DATABASE_URL: testDb,
    },
    pool: "threads",
    minThreads: 1,
    maxThreads: 1,
    fileParallelism: false,
    maxConcurrency: 1,
    sequence: {
      concurrent: false,
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
  },
});
