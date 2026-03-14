"use client";

import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { QuoteRow, updateQuoteAction } from "@/lib/actions/quotes";
import { lineOfBusinessEnum } from "@/lib/validations/policy";
import {
  quoteSchema,
  quoteStatusEnum,
  quoteUpdateSchema,
  type QuoteUpdateInput,
} from "@/lib/validations/quote";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const lineOptions = lineOfBusinessEnum.options;
const statusOptions = quoteStatusEnum.options;

type Props = {
  quote: QuoteRow;
};

const formatDateInput = (value?: string | null) =>
  value ? new Date(value).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

export function EditQuoteForm({ quote }: Props) {
  const router = useRouter();
  type QuoteUpdateFormValues = z.input<typeof quoteUpdateSchema>;
  const defaultValues: QuoteUpdateFormValues = {
    id: quote.id,
    quote_number: quote.quote_number ?? "",
    client_id: quote.client_id,
    carrier_id: quote.carrier_id,
    line_of_business: lineOfBusinessEnum.parse(quote.line_of_business),
    status: quoteStatusEnum.parse(quote.status),
    premium: quote.premium ?? 0,
    coverage_limit: quote.coverage_limit ?? undefined,
    deductible: quote.deductible ?? undefined,
    valid_until: formatDateInput(quote.valid_until),
    notes: quote.notes ?? "",
  };
  const resolver = zodResolver(quoteUpdateSchema) as unknown as Resolver<QuoteUpdateFormValues>;
  const form = useForm<QuoteUpdateFormValues>({
    resolver,
    defaultValues,
  });

  async function onSubmit(values: QuoteUpdateFormValues) {
    const payload = quoteUpdateSchema.parse(values) satisfies QuoteUpdateInput;
    const result = await updateQuoteAction(payload);
    if (!result.success) {
      toast.error(result.error ?? "Unable to update quote");
      form.setError("root", { message: result.error });
      return;
    }

    toast.success(result.message ?? "Quote updated");
    router.refresh();
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
    >
      <input type="hidden" {...form.register("id")} />
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Quote number
          <input
            {...form.register("quote_number")}
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

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Premium
          <input
            type="number"
            step="0.01"
            {...form.register("premium", { valueAsNumber: true })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Valid until
          <input
            type="date"
            {...form.register("valid_until")}
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
        Notes
        <textarea
          {...form.register("notes")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={3}
        />
      </label>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Saving..." : "Update quote"}
      </button>
    </form>
  );
}
