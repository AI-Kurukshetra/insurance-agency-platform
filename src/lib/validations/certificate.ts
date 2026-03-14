import { z } from "zod";

export const certificateStatusEnum = z.enum(["active", "expired", "revoked"]);

const optionalText = (max: number) =>
  z.string().max(max, "Too long").optional().or(z.literal(""));

const preprocessDate = (message: string) =>
  z.preprocess((value) => {
    if (typeof value === "string" && value) return new Date(value);
    return value;
  }, z.date({ invalid_type_error: message }));

export const certificateSchema = z.object({
  certificate_number: z
    .string()
    .max(32, "Certificate number is too long")
    .trim()
    .optional()
    .or(z.literal("")),
  policy_id: z.string().uuid("Select a policy"),
  client_id: z.string().uuid("Select a client"),
  holder_name: z.string().min(1, "Holder name is required").max(100, "Holder name is too long"),
  holder_address: optionalText(200),
  issued_date: preprocessDate("Issued date is required"),
  expiry_date: preprocessDate("Expiry date is required"),
  file_url: z.string().url("Provide a valid URL"),
  status: certificateStatusEnum,
  notes: optionalText(1000),
});

export const certificateUpdateSchema = certificateSchema.extend({
  id: z.string().uuid(),
});

export type CertificateInput = z.infer<typeof certificateSchema>;
export type CertificateUpdateInput = z.infer<typeof certificateUpdateSchema>;
