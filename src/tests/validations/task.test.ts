import { describe, expect, it } from "vitest";
import { taskSchema } from "@/lib/validations/task";

const validTask = {
  title: "Follow up with client",
  description: "Call to confirm renewal documents",
  type: "follow_up",
  priority: "high",
  status: "open",
  due_date: "2026-04-01",
};

describe("taskSchema", () => {
  it("accepts valid data", () => {
    const result = taskSchema.safeParse(validTask);
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = taskSchema.safeParse({ ...validTask, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid due date", () => {
    const result = taskSchema.safeParse({ ...validTask, due_date: "" });
    expect(result.success).toBe(false);
  });
});
