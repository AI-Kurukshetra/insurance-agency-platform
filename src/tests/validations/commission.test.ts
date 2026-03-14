import { describe, expect, it } from "vitest";
import { commissionSchema } from "@/lib/validations/commission";

const validCommission = {
  policy_id: "33333333-3333-4333-8333-333333333333",
  carrier_id: "44444444-4444-4444-8444-444444444444",
  agent_id: "55555555-5555-4555-8555-555555555555",
  type: "new_business",
  status: "pending",
  commission_rate: 12.5,
  gross_premium: 50000,
  commission_amount: 6250,
  paid_date: "2026-03-01",
  payment_reference: "REF-001",
  notes: "Test commission",
};

describe("commissionSchema", () => {
  it("valid input passes", () => {
    const result = commissionSchema.safeParse(validCommission);
    expect(result.success).toBe(true);
  });

  it("rejects negative commission amount", () => {
    const result = commissionSchema.safeParse({
      ...validCommission,
      commission_amount: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = commissionSchema.safeParse({
      ...validCommission,
      status: "processing" as any,
    });
    expect(result.success).toBe(false);
  });
});
