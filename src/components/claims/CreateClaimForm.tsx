"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createClaimAction } from "@/lib/actions/claims";
import { claimSchema, claimStatusEnum, type ClaimInput } from "@/lib/validations/claim";
import { FormError } from "@/components/ui/FormError";
import { zodResolver } from "@hookform/resolvers/zod";

const statusOptions = claimStatusEnum.options;

export function CreateClaimForm() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  type ClaimFormValues = z.input<typeof claimSchema>;
  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      claim_number: "",
      policy_id: "",
      client_id: "",
      carrier_id: "",
      status: "open",
      incident_date: today,
      reported_date: today,
      description: "",
      claim_amount: 0,
      settled_amount: undefined,
      adjuster_name: "",
      adjuster_phone: "",
      notes: "",
      assigned_agent_id: "",
    },
  });

  async function onSubmit(values: ClaimFormValues) {
    const payload = claimSchema.parse(values) satisfies ClaimInput;
    const result = await createClaimAction(payload);
    if (!result.success) {
      toast.error(result.error ?? "Unable to save claim");
      form.setError("root", { message: result.error });
      return;
    }

    toast.success(result.message ?? "Claim created");
    form.reset({
      ...form.getValues(),
      claim_number: "",
      policy_id: "",
      client_id: "",
      carrier_id: "",
      status: "open",
      description: "",
      claim_amount: 0,
      settled_amount: undefined,
      adjuster_name: "",
      adjuster_phone: "",
      notes: "",
      assigned_agent_id: "",
      incident_date: today,
      reported_date: today,
    });
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Claim number (optional)
          <input
            {...form.register("claim_number")}
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
                {option.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Policy ID
          <input
            {...form.register("policy_id")}
            placeholder="UUID"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Client ID
          <input
            {...form.register("client_id")}
            placeholder="UUID"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Carrier ID
          <input
            {...form.register("carrier_id")}
            placeholder="UUID"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Incident date
          <input
            type="date"
            {...form.register("incident_date")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Reported date
          <input
            type="date"
            {...form.register("reported_date")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Description
        <textarea
          {...form.register("description")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={4}
        />
        <FormError message={form.formState.errors.description?.message} />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Claim amount
          <input
            type="number"
            step="0.01"
            {...form.register("claim_amount", { valueAsNumber: true })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Settled amount (optional)
          <input
            type="number"
            step="0.01"
            {...form.register("settled_amount", { valueAsNumber: true })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Adjuster name
          <input
            {...form.register("adjuster_name")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Adjuster phone
          <input
            {...form.register("adjuster_phone")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Notes
        <textarea
          {...form.register("notes")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={3}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Assign agent (optional)
        <input
          {...form.register("assigned_agent_id")}
          placeholder="Agent UUID"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <FormError message={form.formState.errors.root?.message} />

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Submitting..." : "Create claim"}
      </button>
    </form>
  );
}
