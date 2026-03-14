import { z } from "zod";

export const documentTypeEnum = z.enum([
  "policy",
  "certificate",
  "claim",
  "quote",
  "application",
  "correspondence",
  "other",
]);

const optionalText = (max: number) =>
  z.string().max(max, "Too long").optional().or(z.literal(""));

export const documentSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  type: documentTypeEnum,
  file_url: z.string().url("Provide a valid URL"),
  file_size: z
    .preprocess((value) => {
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? value : parsed;
      }
      return value;
    }, z.number().nonnegative("File size must be zero or more").optional())
    .optional(),
  mime_type: optionalText(64),
  client_id: z.string().uuid("Client ID must be a UUID").optional(),
  policy_id: z.string().uuid("Policy ID must be a UUID").optional(),
  claim_id: z.string().uuid("Claim ID must be a UUID").optional(),
  quote_id: z.string().uuid("Quote ID must be a UUID").optional(),
  version: z.number().int().positive().default(1),
  tags: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) =>
      typeof value === "string"
        ? value
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : []
    ),
  description: optionalText(1000),
});

export const documentUpdateSchema = documentSchema.extend({
  id: z.string().uuid(),
});

export type DocumentFormValues = z.input<typeof documentSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type DocumentUpdateInput = z.infer<typeof documentUpdateSchema>;
