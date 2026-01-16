import { describe, expect, it } from "vitest";

import { formatCurrency, parseAmountToCents } from "@/lib/money";

describe("money utils", () => {
  it("formats currency with symbol", () => {
    expect(formatCurrency(1234, "USD")).toContain("$");
    expect(formatCurrency(1234, "EUR")).toContain("€");
  });

  it("parses decimals to cents", () => {
    expect(parseAmountToCents("12.34")).toBe(1234);
  });

  it("handles currency symbols and commas", () => {
    expect(parseAmountToCents("$1,200.50")).toBe(120050);
  });

  it("handles negative inputs by stripping sign", () => {
    expect(parseAmountToCents("-12.00")).toBe(1200);
  });

  it("returns zero on invalid input", () => {
    expect(parseAmountToCents("oops")).toBe(0);
  });
});
