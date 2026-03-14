import { describe, expect, it } from "vitest";
import { clientSchema } from "@/lib/validations/client";

describe("clientSchema", () => {
  it("accepts a full individual record", () => {
    const result = clientSchema.safeParse({
      client_id: "CLT-100",
      type: "individual",
      first_name: "Aarav",
      last_name: "Shah",
      email: "aarav@agency.com",
      city: "Ahmedabad",
      state: "Gujarat",
      zip: "380015",
      date_of_birth: "1985-04-12",
      status: "active",
    });
    expect(result.success).toBe(true);
  });

  it("accepts business record without personal name", () => {
    const result = clientSchema.safeParse({
      client_id: "CLT-200",
      type: "business",
      business_name: "Apex Insurance",
      email: "contact@apex.com",
      status: "prospect",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = clientSchema.safeParse({
      client_id: "CLT-300",
      type: "individual",
      first_name: "Priya",
      last_name: "Joshi",
      email: "not-an-email",
      status: "active",
    });
    expect(result.success).toBe(false);
  });
});
