"use client";

import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { createQuoteAction } from "@/lib/actions/quotes";
import { lineOfBusinessEnum } from "@/lib/validations/policy";
import { quoteSchema, quoteStatusEnum, type QuoteInput } from "@/lib/validations/quote";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const lineOptions = lineOfBusinessEnum.options;
const statusOptions = quoteStatusEnum.options;

export function CreateQuoteForm() {
  const today = new Date().toISOString().split("T")[0];
  type QuoteFormValues = z.input<typeof quoteSchema>;
  const resolver = zodResolver(quoteSchema) as unknown as Resolver<QuoteFormValues>;
  const form = useForm<QuoteFormValues>({
    resolver,
    defaultValues: {
      quote_number: "",
      client_id: "",
      carrier_id: "",
      line_of_business: lineOptions[0],
      status: "draft",
      premium: 0,
      coverage_limit: undefined,
      deductible: undefined,
      valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      notes: "",
    },
  });

  async function onSubmit(values: QuoteFormValues) {
    const payload = quoteSchema.parse(values) satisfies QuoteInput;
    const result = await createQuoteAction(payload);
    if (!result.success) {
      toast.error(result.error ?? "Unable to create quote");
      form.setError("root", { message: result.error });
      return;
    }

    toast.success(result.message ?? "Quote created");
    form.reset({
      ...form.getValues(),
      premium: 0,
      coverage_limit: undefined,
      deductible: undefined,
      notes: "",
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Quote number (optional)
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
            defaultValue={today}
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
        {form.formState.isSubmitting ? "Saving..." : "Create quote"}
      </button>
    </form>
  );
}
