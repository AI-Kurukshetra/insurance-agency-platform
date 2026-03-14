import { z } from "zod";

export const taskTypeEnum = z.enum([
  "follow_up",
  "renewal",
  "payment",
  "claim",
  "meeting",
  "call",
  "other",
]);

export const taskPriorityEnum = z.enum(["low", "medium", "high", "urgent"]);
export const taskStatusEnum = z.enum(["open", "in_progress", "completed", "cancelled"]);

const optionalText = (max: number) =>
  z.string().max(max, "Too long").optional().or(z.literal(""));

const preprocessDate = (message: string) =>
  z.preprocess((value) => {
    if (typeof value === "string" && value) {
      return new Date(value);
    }
    return value;
  }, z.date({ invalid_type_error: message }));

const preprocessUuidOptional = (message: string) =>
  z.string().uuid(message).optional().or(z.literal(""));

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: optionalText(1000),
  type: taskTypeEnum,
  priority: taskPriorityEnum,
  status: taskStatusEnum,
  due_date: preprocessDate("Due date is required"),
  client_id: preprocessUuidOptional("Client must be a UUID"),
  policy_id: preprocessUuidOptional("Policy must be a UUID"),
  assigned_to: preprocessUuidOptional("Assignee must be a UUID"),
  notes: optionalText(500),
});

export const taskUpdateSchema = taskSchema.extend({
  id: z.string().uuid(),
});

export type TaskInput = z.infer<typeof taskSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
