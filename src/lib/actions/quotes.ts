"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import {
  quoteSchema,
  quoteUpdateSchema,
  type QuoteInput,
  type QuoteUpdateInput,
} from "@/lib/validations/quote";

type ActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

export type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"];

export async function fetchQuotes(limit = 20) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as QuoteRow[];
}

const quoteIdSchema = z.string().uuid("Invalid quote ID");

export async function createQuoteAction(input: unknown): Promise<ActionResult> {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { count } = await supabase.from("quotes").select("id", { head: true, count: "exact" });
  const generatedNumber = `QUO-${String((count ?? 0) + 1).padStart(3, "0")}`;

  const payload: QuoteInput = {
    ...parsed.data,
    quote_number: parsed.data.quote_number?.trim() || generatedNumber,
  };

  const { error } = await supabase.from("quotes").insert(payload);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/quotes");
  return { success: true, message: "Quote created" };
}

export async function deleteQuoteAction(id: string): Promise<ActionResult> {
  const parsed = quoteIdSchema.safeParse(id);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("quotes").delete().eq("id", parsed.data);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/quotes");
  return { success: true, message: "Quote deleted" };
}

export async function getQuoteById(id: string) {
  const parsed = quoteIdSchema.safeParse(id);
  if (!parsed.success) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", parsed.data)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateQuoteAction(input: unknown): Promise<ActionResult> {
  const parsed = quoteUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("quotes")
    .update(parsed.data)
    .eq("id", parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/quotes");
  return { success: true, message: "Quote updated" };
}
