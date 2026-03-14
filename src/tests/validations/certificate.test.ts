import { describe, expect, it } from "vitest";
import { certificateSchema } from "@/lib/validations/certificate";

const validCert = {
  policy_id: "11111111-1111-4111-8111-111111111111",
  client_id: "22222222-2222-4222-8222-222222222222",
  holder_name: "Ashwin Patel",
  issued_date: "2026-03-01",
  expiry_date: "2027-03-01",
  file_url: "https://docs.example.com/cert.pdf",
  status: "active",
};

describe("certificateSchema", () => {
  it("accepts valid data", () => {
    const result = certificateSchema.safeParse(validCert);
    expect(result.success).toBe(true);
  });

  it("rejects invalid policy id", () => {
    const result = certificateSchema.safeParse({ ...validCert, policy_id: "not-uuid" });
    expect(result.success).toBe(false);
  });
});
