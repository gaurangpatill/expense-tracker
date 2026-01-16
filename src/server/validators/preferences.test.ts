import { describe, expect, it } from "vitest";

import { currencySchema, dashboardLayoutSchema } from "@/server/validators/preferences";
import { defaultDashboardLayout } from "@/lib/preferences";

describe("preferences validators", () => {
  it("accepts supported currencies", () => {
    expect(currencySchema.parse({ currency: "USD" }).currency).toBe("USD");
    expect(currencySchema.parse({ currency: "EUR" }).currency).toBe("EUR");
  });

  it("rejects unsupported currency", () => {
    expect(() => currencySchema.parse({ currency: "XYZ" })).toThrow();
  });

  it("validates dashboard layout shape", () => {
    expect(() => dashboardLayoutSchema.parse(defaultDashboardLayout)).not.toThrow();
    expect(() => dashboardLayoutSchema.parse({ cards: { showIncome: true } })).toThrow();
  });
});
