import { describe, expect, it } from "vitest";

import { loginSchema, signupSchema } from "@/server/validators/auth";

describe("auth validators", () => {
  it("accepts valid login", () => {
    const parsed = loginSchema.parse({ email: "test@example.com", password: "Password123" });
    expect(parsed.email).toBe("test@example.com");
  });

  it("rejects invalid email", () => {
    expect(() => loginSchema.parse({ email: "bad", password: "Password123" })).toThrow();
  });

  it("accepts valid signup", () => {
    const parsed = signupSchema.parse({
      email: "test@example.com",
      password: "Password123",
      confirmPassword: "Password123",
    });
    expect(parsed.email).toBe("test@example.com");
  });
});
