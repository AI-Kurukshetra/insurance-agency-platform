import { z } from "zod";

export const clientStatusEnum = z.enum(["active", "inactive", "prospect"]);
export const clientTypeEnum = z.enum(["individual", "business"]);

const optionalText = (max: number) =>
  z.string().max(max, "Too long").optional().or(z.literal(""));

export const clientSchema = z.object({
  client_id: z
    .string()
    .min(1, "Client ID is required")
    .max(30, "Client ID is too long")
    .trim()
    .optional()
    .or(z.literal("")),
  type: clientTypeEnum,
  first_name: z.string().max(50, "First name is too long").optional().or(z.literal("")),
  last_name: z.string().max(50, "Last name is too long").optional().or(z.literal("")),
  business_name: z
    .string()
    .max(100, "Business name is too long")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Enter a valid email").trim(),
  phone: z.string().max(15, "Phone is too long").optional().or(z.literal("")),
  address: optionalText(150),
  city: optionalText(50),
  state: optionalText(50),
  zip: optionalText(20),
  date_of_birth: z.string().optional().or(z.literal("")),
  status: clientStatusEnum,
  notes: z.string().max(1000, "Notes are too long").optional().or(z.literal("")),
});

export type ClientInput = z.infer<typeof clientSchema>;

export const clientUpdateSchema = clientSchema.extend({
  id: z.string().uuid(),
});

export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;
