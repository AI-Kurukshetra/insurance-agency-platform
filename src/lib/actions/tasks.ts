"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import {
  taskSchema,
  taskUpdateSchema,
  type TaskInput,
  type TaskUpdateInput,
} from "@/lib/validations/task";

type TaskActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

const taskIdSchema = z.string().uuid("Invalid task ID");

export type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];

export async function fetchTasks(limit = 25) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, type, priority, status, due_date, assigned_to, client_id")
    .order("due_date", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as TaskRow[];
}

export async function createTaskAction(input: unknown): Promise<TaskActionResult> {
  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const payload: TaskInput & { created_by: string } = {
    ...parsed.data,
    assigned_to: parsed.data.assigned_to || user.id,
    client_id: parsed.data.client_id || null,
    policy_id: parsed.data.policy_id || null,
    notes: parsed.data.notes || null,
    created_by: user.id,
  };

  const { error } = await supabase.from("tasks").insert(payload);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/tasks");
  return { success: true, message: "Task scheduled" };
}

export async function updateTaskAction(input: unknown): Promise<TaskActionResult> {
  const parsed = taskUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update(rest).eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/tasks");
  return { success: true, message: "Task updated" };
}

export async function deleteTaskAction(id: string): Promise<TaskActionResult> {
  const validated = taskIdSchema.safeParse(id);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", validated.data);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/tasks");
  return { success: true, message: "Task completed" };
}
