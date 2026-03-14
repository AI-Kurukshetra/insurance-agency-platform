"use client";

import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { createTaskAction } from "@/lib/actions/tasks";
import {
  taskPriorityEnum,
  taskSchema,
  taskStatusEnum,
  taskTypeEnum,
  type TaskInput,
} from "@/lib/validations/task";
import { FormError } from "@/components/ui/FormError";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const typeOptions = taskTypeEnum.options;
const priorityOptions = taskPriorityEnum.options;
const statusOptions = taskStatusEnum.options;

export function TaskForm() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  type TaskFormValues = z.input<typeof taskSchema>;
  const resolver = zodResolver(taskSchema) as unknown as Resolver<TaskFormValues>;
  const form = useForm<TaskFormValues>({
    resolver,
    defaultValues: {
      title: "",
      description: "",
      type: "follow_up",
      priority: "medium",
      status: "open",
      due_date: today,
      client_id: "",
      policy_id: "",
      assigned_to: "",
      notes: "",
    },
  });

  async function onSubmit(values: TaskFormValues) {
    const payload = taskSchema.parse(values) satisfies TaskInput;
    const result = await createTaskAction(payload);
    if (!result.success) {
      toast.error(result.error ?? "Unable to create task");
      form.setError("root", { message: result.error });
      return;
    }

    toast.success(result.message ?? "Task scheduled");
    form.reset({
      ...form.getValues(),
      title: "",
      description: "",
      due_date: today,
      client_id: "",
      policy_id: "",
      assigned_to: "",
      notes: "",
    });
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div>
        <label className="text-sm font-medium text-slate-700">Title</label>
        <input
          {...form.register("title")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <FormError message={form.formState.errors.title?.message} />
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Description
        <textarea
          {...form.register("description")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={3}
        />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Type
          <select
            {...form.register("type")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Priority
          <select
            {...form.register("priority")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Status
          <select
            {...form.register("status")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Due date
        <input
          type="date"
          {...form.register("due_date")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Client ID
          <input
            {...form.register("client_id")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Policy ID
          <input
            {...form.register("policy_id")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Assign to (agent UUID)
        <input
          {...form.register("assigned_to")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Notes
        <textarea
          {...form.register("notes")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={2}
        />
      </label>

      <FormError message={form.formState.errors.root?.message} />

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Scheduling..." : "Create task"}
      </button>
    </form>
  );
}
