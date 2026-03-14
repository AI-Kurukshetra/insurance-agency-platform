"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import {
  claimSchema,
  claimUpdateSchema,
  type ClaimInput,
  type ClaimUpdateInput,
} from "@/lib/validations/claim";

type ClaimsActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

const claimIdSchema = z.string().uuid("Invalid claim ID");

export type ClaimRow = Database["public"]["Tables"]["claims"]["Row"];

export async function fetchClaims(limit = 30) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("claims")
    .select("id, claim_number, client_id, policy_id, status, incident_date, claim_amount")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ClaimRow[];
}

export async function getClaimById(id: string) {
  const validId = claimIdSchema.safeParse(id);
  if (!validId.success) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("claims")
    .select("*")
    .eq("id", validId.data)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as ClaimRow | null;
}

export async function createClaimAction(input: unknown): Promise<ClaimsActionResult> {
  const parsed = claimSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { count } = await supabase.from("claims").select("id", { head: true, count: "exact" });
  const generatedNumber = `CLM-${String((count ?? 0) + 1).padStart(3, "0")}`;

  const payload: ClaimInput & { created_by: string } = {
    ...parsed.data,
    claim_number: parsed.data.claim_number?.trim() || generatedNumber,
    assigned_agent_id: parsed.data.assigned_agent_id || user.id,
    created_by: user.id,
  };

  const { error } = await supabase.from("claims").insert(payload);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/claims");
  return { success: true, message: "Claim saved" };
}

export async function updateClaimAction(input: unknown): Promise<ClaimsActionResult> {
  const parsed = claimUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("claims").update(rest).eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/claims");
  return { success: true, message: "Claim updated" };
}

export async function deleteClaimAction(id: string): Promise<ClaimsActionResult> {
  const validId = claimIdSchema.safeParse(id);
  if (!validId.success) {
    return { success: false, error: validId.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("claims").delete().eq("id", validId.data);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/claims");
  return { success: true, message: "Claim archived" };
}
