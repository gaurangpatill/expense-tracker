import { describe, expect, it } from "vitest";
import { Tag } from "lucide-react";

import { getCategoryIcon } from "@/components/icons/categoryIcons";

describe("getCategoryIcon", () => {
  it("falls back to Tag for unknown keys", () => {
    expect(getCategoryIcon("not-real")).toBe(Tag);
  });
});
