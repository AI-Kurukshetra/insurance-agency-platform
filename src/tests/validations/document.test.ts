import { describe, expect, it } from "vitest";
import { documentSchema } from "@/lib/validations/document";

const baseDocument = {
  name: "Renewal certificate",
  type: "certificate",
  file_url: "https://files.example.com/cert.pdf",
  tags: "renewal,certificate",
};

describe("documentSchema", () => {
  it("accepts a valid document", () => {
    const result = documentSchema.safeParse(baseDocument);
    expect(result.success).toBe(true);
  });

  it("infers tags array", () => {
    const result = documentSchema.safeParse(baseDocument);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(["renewal", "certificate"]);
    }
  });

  it("rejects bad URLs", () => {
    const result = documentSchema.safeParse({ ...baseDocument, file_url: "not-a-url" });
    expect(result.success).toBe(false);
  });
});
