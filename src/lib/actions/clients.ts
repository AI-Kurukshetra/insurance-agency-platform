"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import {
  clientSchema,
  clientStatusEnum,
  clientTypeEnum,
  clientUpdateSchema,
  type ClientInput,
  type ClientUpdateInput,
} from "@/lib/validations/client";

type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export type ClientFilter = {
  search?: string;
  type?: z.infer<typeof clientTypeEnum>;
  status?: z.infer<typeof clientStatusEnum>;
};

export async function fetchClients(options?: ClientFilter): Promise<ClientRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (options?.search) {
    const term = `%${options.search.toLowerCase()}%`;
    query = query.ilike("client_id", term).or(
      `first_name.ilike.${term},last_name.ilike.${term},business_name.ilike.${term},email.ilike.${term}`,
    );
  }

  if (options?.type) {
    query = query.eq("type", options.type);
  }

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ClientRow[];
}

const uuidSchema = z.string().uuid("Invalid client ID");

export type ClientRow = Database["public"]["Tables"]["clients"]["Row"];

export async function getClientById(id: string) {
  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", parsedId.data)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createClientAction(input: unknown): Promise<ActionResponse> {
  const parsed = clientSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { count } = await supabase.from("clients").select("id", { head: true, count: "exact" });
  const generatedId = `CLT-${String((count ?? 0) + 1).padStart(3, "0")}`;
  const clientId = parsed.data.client_id?.trim() ? parsed.data.client_id.trim() : generatedId;

  const payload = {
    ...parsed.data,
    client_id: clientId,
    phone: parsed.data.phone ?? undefined,
    address: parsed.data.address ?? undefined,
    city: parsed.data.city ?? undefined,
    state: parsed.data.state ?? undefined,
    zip: parsed.data.zip ?? undefined,
    date_of_birth: parsed.data.date_of_birth ?? undefined,
    notes: parsed.data.notes ?? undefined,
  } satisfies Omit<ClientInput, "id">;
  const { error } = await supabase.from("clients").insert(payload);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/clients");

  return { success: true, message: "Client successfully created." };
}

export async function updateClientAction(input: unknown): Promise<ActionResponse> {
  const parsed = clientUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { id, ...rest } = parsed.data;
  const payload = {
    ...rest,
    first_name: rest.first_name ?? undefined,
    last_name: rest.last_name ?? undefined,
    business_name: rest.business_name ?? undefined,
    phone: rest.phone ?? undefined,
    address: rest.address ?? undefined,
    city: rest.city ?? undefined,
    state: rest.state ?? undefined,
    zip: rest.zip ?? undefined,
    date_of_birth: rest.date_of_birth ?? undefined,
    notes: rest.notes ?? undefined,
  } satisfies Omit<ClientInput, "id">;

  const supabase = await createClient();
  const { error } = await supabase.from("clients").update(payload).eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/clients");

  return { success: true, message: "Client profile updated." };
}

export async function deleteClientAction(id: string): Promise<ActionResponse> {
  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success) {
    return { success: false, error: parsedId.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("clients").delete().eq("id", parsedId.data);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/clients");

  return { success: true, message: "Client removed." };
}
