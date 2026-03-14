"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { PolicyRow, updatePolicyAction } from "@/lib/actions/policies";
import {
  lineOfBusinessEnum,
  policyStatusEnum,
  policyUpdateSchema,
  type PolicyUpdateInput,
} from "@/lib/validations/policy";
import { zodResolver } from "@hookform/resolvers/zod";

const lineOptions = lineOfBusinessEnum.options;
const statusOptions = policyStatusEnum.options;

type Props = {
  policy: PolicyRow;
};

function formatDateInput(value: string) {
  return new Date(value).toISOString().split("T")[0];
}

export function EditPolicyForm({ policy }: Props) {
  const router = useRouter();
  type PolicyUpdateFormValues = z.input<typeof policyUpdateSchema>;
  const defaultValues: PolicyUpdateFormValues = {
    id: policy.id,
    policy_number: policy.policy_number ?? "",
    client_id: policy.client_id,
    carrier_id: policy.carrier_id,
    line_of_business: lineOfBusinessEnum.parse(policy.line_of_business),
    status: policyStatusEnum.parse(policy.status),
    effective_date: formatDateInput(policy.effective_date),
    expiration_date: formatDateInput(policy.expiration_date),
    premium: policy.premium,
    coverage_limit: policy.coverage_limit ?? undefined,
    deductible: policy.deductible ?? undefined,
    description: policy.description ?? "",
  };
  const resolver = zodResolver(policyUpdateSchema) as unknown as Resolver<PolicyUpdateFormValues>;
  const form = useForm<PolicyUpdateFormValues>({
    resolver,
    defaultValues,
  });

  async function onSubmit(values: PolicyUpdateFormValues) {
    const payload = policyUpdateSchema.parse(values) satisfies PolicyUpdateInput;
    const result = await updatePolicyAction(payload);
    if (!result.success) {
      toast.error(result.error ?? "Unable to update policy");
      form.setError("root", { message: result.error });
      return;
    }

    toast.success(result.message ?? "Policy updated");
    router.refresh();
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Policy number
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
          Client ID
          <input
            {...form.register("client_id")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Carrier ID
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

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Saving..." : "Update policy"}
      </button>
    </form>
  );
}
