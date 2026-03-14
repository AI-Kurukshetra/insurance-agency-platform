"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import {
  documentSchema,
  documentUpdateSchema,
  type DocumentInput,
} from "@/lib/validations/document";

type DocumentActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];

const documentIdSchema = z.string().uuid("Invalid document ID");

export async function fetchDocuments(limit = 20) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("id, name, type, file_url, created_at, client_id, policy_id, claim_id, quote_id, version")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as DocumentRow[];
}

export async function getDocumentById(id: string) {
  const parsedId = documentIdSchema.safeParse(id);
  if (!parsedId.success) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", parsedId.data)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as DocumentRow | null;
}

export async function createDocumentAction(input: unknown): Promise<DocumentActionResult> {
  const parsed = documentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const payload: DocumentInput = {
    ...parsed.data,
    file_size: parsed.data.file_size ?? null,
    mime_type: parsed.data.mime_type ?? null,
  };

  const { error } = await supabase.from("documents").insert({
    ...payload,
    tags: parsed.data.tags,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/documents");
  return { success: true, message: "Document uploaded" };
}

export async function updateDocumentAction(input: unknown): Promise<DocumentActionResult> {
  const parsed = documentUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("documents").update(rest).eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/documents");
  return { success: true, message: "Document updated" };
}

export async function deleteDocumentAction(id: string): Promise<DocumentActionResult> {
  const parsedId = documentIdSchema.safeParse(id);
  if (!parsedId.success) {
    return { success: false, error: parsedId.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("documents").delete().eq("id", parsedId.data);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/documents");
  return { success: true, message: "Document deleted" };
}
