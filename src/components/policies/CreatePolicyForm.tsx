"use client";

import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { createPolicyAction } from "@/lib/actions/policies";
import { lineOfBusinessEnum, policySchema, policyStatusEnum, type PolicyInput } from "@/lib/validations/policy";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const lineOptions = lineOfBusinessEnum.options;
const statusOptions = policyStatusEnum.options;

export function CreatePolicyForm() {
  type PolicyFormValues = z.input<typeof policySchema>;
  const resolver = zodResolver(policySchema) as unknown as Resolver<PolicyFormValues>;
  const form = useForm<PolicyFormValues>({
    resolver,
    defaultValues: {
      policy_number: "",
      client_id: "",
      carrier_id: "",
      line_of_business: "auto",
      status: "active",
      effective_date: new Date().toISOString().split("T")[0],
      expiration_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      premium: 0,
      coverage_limit: undefined,
      deductible: undefined,
      description: "",
    },
  });

  async function onSubmit(values: PolicyFormValues) {
    const payload = policySchema.parse(values) satisfies PolicyInput;
    const result = await createPolicyAction(payload);
    if (!result.success) {
      toast.error(result.error ?? "Unable to create policy");
      form.setError("root", { message: result.error });
      return;
    }

    toast.success(result.message ?? "Policy created");
    form.reset({
      ...form.getValues(),
      premium: 0,
      coverage_limit: undefined,
      deductible: undefined,
      description: "",
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Policy number (optional)
          <input
            {...form.register("policy_number")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Line of business
          <select
            {...form.register("line_of_business")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {lineOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Client ID (UUID)
          <input
            {...form.register("client_id")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Carrier ID (UUID)
          <input
            {...form.register("carrier_id")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Status
          <select
            {...form.register("status")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Effective date
          <input
            type="date"
            {...form.register("effective_date")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Expiration date
          <input
            type="date"
            {...form.register("expiration_date")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Premium
          <input
            type="number"
            step="0.01"
            {...form.register("premium", { valueAsNumber: true })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Coverage limit
          <input
            type="number"
            step="0.01"
            {...form.register("coverage_limit", { valueAsNumber: true })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Deductible
          <input
            type="number"
            step="0.01"
            {...form.register("deductible", { valueAsNumber: true })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Description
        <textarea
          {...form.register("description")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={3}
        />
      </label>

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {form.formState.isSubmitting ? "Saving..." : "Create policy"}
        </button>
        <p className="text-xs text-slate-500">We’ll auto-generate policy numbers if you leave it blank.</p>
      </div>
    </form>
  );
}
