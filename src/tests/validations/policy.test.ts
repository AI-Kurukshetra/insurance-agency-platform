import { describe, expect, it } from "vitest";
import { policySchema } from "@/lib/validations/policy";

describe("policySchema", () => {
  it("accepts valid policy input", () => {
    const result = policySchema.safeParse({
      policy_number: "POL-001",
      client_id: "11111111-1111-4111-8111-111111111111",
      carrier_id: "22222222-2222-4222-8222-222222222222",
      line_of_business: "auto",
      status: "active",
      effective_date: "2026-01-01",
      expiration_date: "2027-01-01",
      premium: 12000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing premium", () => {
    const result = policySchema.safeParse({
      client_id: "00000000-0000-0000-0000-000000000001",
      carrier_id: "00000000-0000-0000-0000-000000000002",
      line_of_business: "auto",
      status: "active",
      effective_date: "2026-01-01",
      expiration_date: "2027-01-01",
    });
    expect(result.success).toBe(false);
  });
});
