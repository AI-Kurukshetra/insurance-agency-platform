import { describe, expect, it } from "vitest";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from "@/lib/validations/auth";

describe("auth schemas", () => {
  it("accepts valid login input", () => {
    const parsed = loginSchema.safeParse({
      email: "agent@insure.test",
      password: "password123",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid login input", () => {
    const parsed = loginSchema.safeParse({
      email: "bad",
      password: "123",
    });
    expect(parsed.success).toBe(false);
  });

  it("requires matching passwords on register", () => {
    const parsed = registerSchema.safeParse({
      fullName: "Agent One",
      email: "agent@insure.test",
      password: "password123",
      confirmPassword: "password999",
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts valid forgot-password input", () => {
    const parsed = forgotPasswordSchema.safeParse({
      email: "agent@insure.test",
    });
    expect(parsed.success).toBe(true);
  });
});
