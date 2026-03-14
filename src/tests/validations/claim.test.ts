import { describe, expect, it } from "vitest";
import { claimSchema } from "@/lib/validations/claim";

const validClaim = {
  policy_id: "11111111-1111-4111-8111-111111111111",
  client_id: "22222222-2222-4222-8222-222222222222",
  carrier_id: "33333333-3333-4333-8333-333333333333",
  status: "open",
  incident_date: "2026-03-10",
  reported_date: "2026-03-11",
  description: "Customer reported damage to vehicle and provided photos.",
  claim_amount: 4000,
  settled_amount: 1500,
  adjuster_name: "Asha Patel",
  adjuster_phone: "555-1234",
  notes: "Initial estimate completed.",
};

describe("claimSchema", () => {
  it("accepts valid input", () => {
    const result = claimSchema.safeParse(validClaim);
    expect(result.success).toBe(true);
  });

  it("rejects short description", () => {
    const result = claimSchema.safeParse({
      ...validClaim,
      description: "Too short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative claim amount", () => {
    const result = claimSchema.safeParse({
      ...validClaim,
      claim_amount: -100,
    });
    expect(result.success).toBe(false);
  });
});
