"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import {
  certificateSchema,
  certificateUpdateSchema,
  type CertificateInput,
} from "@/lib/validations/certificate";

type CertificateActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

export type CertificateRow = Database["public"]["Tables"]["certificates"]["Row"];

const certificateIdSchema = certificateUpdateSchema.pick({ id: true });

export async function fetchCertificates(limit = 20) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("id, certificate_number, holder_name, issued_date, expiry_date, status, policy_id")
    .order("issued_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CertificateRow[];
}

export async function createCertificateAction(input: unknown): Promise<CertificateActionResult> {
  const parsed = certificateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { count } = await supabase.from("certificates").select("id", { head: true, count: "exact" });
  const generatedNumber = `CERT-${String((count ?? 0) + 1).padStart(3, "0")}`;

  const payload: CertificateInput = {
    ...parsed.data,
    certificate_number: parsed.data.certificate_number?.trim() || generatedNumber,
  };

  const { error } = await supabase.from("certificates").insert(payload);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/certificates");
  return { success: true, message: "Certificate issued" };
}

export async function deleteCertificateAction(id: string): Promise<CertificateActionResult> {
  const parsed = certificateIdSchema.safeParse({ id });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("certificates").delete().eq("id", parsed.data.id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/certificates");
  return { success: true, message: "Certificate revoked" };
}
