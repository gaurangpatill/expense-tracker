import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });
process.env.VITEST = "true";

const testDb = process.env.DATABASE_URL_TEST;
if (testDb) {
  process.env.DATABASE_URL = testDb;
}

await import("@testing-library/jest-dom/vitest");
const React = await import("react");
const { beforeAll, afterAll, afterEach } = await import("vitest");
const { server } = await import("./msw/server");
const { cleanup } = await import("@testing-library/react");

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", { style: { width: 800, height: 400 } }, children),
  };
});
