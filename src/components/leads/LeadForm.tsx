"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { createLeadAction } from "@/lib/actions/leads";
import {
  leadSchema,
  leadSourceEnum,
  leadStageEnum,
  type LeadInput,
} from "@/lib/validations/lead";
import { FormError } from "@/components/ui/FormError";

const stageOptions = leadStageEnum.options;
const sourceOptions = leadSourceEnum.options;

export function LeadForm() {
  const router = useRouter();
  type LeadFormValues = z.input<typeof leadSchema>;
  const resolver = zodResolver(leadSchema) as unknown as Resolver<LeadFormValues>;
  const form = useForm<LeadFormValues>({
    resolver,
    defaultValues: {
      lead_id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      source: "referral",
      stage: "new",
      interested_in: "",
      estimated_premium: undefined,
      notes: "",
    },
  });

  async function onSubmit(values: LeadFormValues) {
    const payload = leadSchema.parse(values) satisfies LeadInput;
    const result = await createLeadAction(payload);
    if (!result.success) {
      toast.error(result.error ?? "Unable to save lead");
      form.setError("root", { message: result.error });
      return;
    }

    toast.success(result.message ?? "Lead created");
    form.reset({
      ...form.getValues(),
      lead_id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      interested_in: "",
      estimated_premium: undefined,
      notes: "",
    });
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          First name
          <input
            {...form.register("first_name")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Last name
          <input
            {...form.register("last_name")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            {...form.register("email")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Phone
          <input
            {...form.register("phone")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Source
          <select
            {...form.register("source")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {sourceOptions.map((option) => (
              <option key={option} value={option}>
                {option.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Stage
          <select
            {...form.register("stage")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {stageOptions.map((option) => (
              <option key={option} value={option}>
                {option.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Interested in (comma separated)
        <input
          {...form.register("interested_in")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="auto, home"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Estimated premium
        <input
          type="number"
          step="0.01"
          {...form.register("estimated_premium", { valueAsNumber: true })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Notes
        <textarea
          {...form.register("notes")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={3}
        />
      </label>

      <FormError message={form.formState.errors.root?.message} />

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Creating..." : "Add lead"}
      </button>
    </form>
  );
}
