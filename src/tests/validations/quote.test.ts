import { describe, expect, it } from "vitest";
import { quoteSchema } from "@/lib/validations/quote";

describe("quoteSchema", () => {
  it("accepts valid data", () => {
    const result = quoteSchema.safeParse({
      quote_number: "QUO-001",
      client_id: "11111111-1111-4111-8111-111111111111",
      carrier_id: "22222222-2222-4222-8222-222222222222",
      line_of_business: "auto",
      status: "draft",
      premium: 15000,
      valid_until: "2026-06-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing valid_until", () => {
    const result = quoteSchema.safeParse({
      client_id: "11111111-1111-4111-8111-111111111111",
      carrier_id: "22222222-2222-4222-8222-222222222222",
      line_of_business: "home",
      status: "draft",
      premium: 15000,
    });
    expect(result.success).toBe(false);
  });
});
