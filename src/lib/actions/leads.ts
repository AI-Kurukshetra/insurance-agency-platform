"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import { leadSchema, leadUpdateSchema, type LeadInput, type LeadUpdateInput } from "@/lib/validations/lead";

type LeadActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

export type LeadRow = Database["public"]["Tables"]["leads"]["Row"];

export async function fetchLeads(limit = 30) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, lead_id, first_name, last_name, stage, source, estimated_premium, updated_at, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as LeadRow[];
}

export async function fetchLeadPipeline() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("stage, count(id)")
    .group("stage");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as { stage: string; count: number }[];
}

export async function createLeadAction(input: unknown): Promise<LeadActionResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { count } = await supabase.from("leads").select("id", { head: true, count: "exact" });
  const generatedId = `LED-${String((count ?? 0) + 1).padStart(3, "0")}`;

  const payload: LeadInput & { created_by: string } = {
    ...parsed.data,
    lead_id: parsed.data.lead_id?.trim() || generatedId,
    estimated_premium: parsed.data.estimated_premium ?? null,
    notes: parsed.data.notes ?? null,
    created_by: (await supabase.auth.getUser()).data.user?.id ?? "",
  };

  const { error } = await supabase.from("leads").insert(payload);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/leads");
  return { success: true, message: "Lead added" };
}

export async function updateLeadStage(id: string, stage: string): Promise<LeadActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ stage }).eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/leads");
  return { success: true, message: "Stage updated" };
}

export async function deleteLeadAction(id: string): Promise<LeadActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/leads");
  return { success: true, message: "Lead removed" };
}
