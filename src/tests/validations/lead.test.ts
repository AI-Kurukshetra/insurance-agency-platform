import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/validations/lead";

const baseLead = {
  first_name: "Avery",
  last_name: "Desai",
  stage: "new",
};

describe("leadSchema", () => {
  it("accepts required fields", () => {
    const result = leadSchema.safeParse(baseLead);
    expect(result.success).toBe(true);
  });

  it("rejects missing names", () => {
    const result = leadSchema.safeParse({ ...baseLead, first_name: "" });
    expect(result.success).toBe(false);
  });

  it("accepts optional estimated premium", () => {
    const result = leadSchema.safeParse({ ...baseLead, estimated_premium: "1000" });
    expect(result.success).toBe(true);
  });
});
