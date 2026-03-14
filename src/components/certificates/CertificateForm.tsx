"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { createCertificateAction } from "@/lib/actions/certificates";
import {
  certificateSchema,
  certificateStatusEnum,
  type CertificateInput,
} from "@/lib/validations/certificate";
import { FormError } from "@/components/ui/FormError";

const statusOptions = certificateStatusEnum.options;

export function CertificateForm() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  type CertificateFormValues = z.input<typeof certificateSchema>;
  const resolver = zodResolver(certificateSchema) as unknown as Resolver<CertificateFormValues>;
  const form = useForm<CertificateFormValues>({
    resolver,
    defaultValues: {
      certificate_number: "",
      policy_id: "",
      client_id: "",
      holder_name: "",
      holder_address: "",
      issued_date: today,
      expiry_date: today,
      file_url: "",
      status: "active",
      notes: "",
    },
  });

  async function onSubmit(values: CertificateFormValues) {
    const result = await createCertificateAction(values);
    if (!result.success) {
      toast.error(result.error ?? "Unable to issue certificate");
      form.setError("root", { message: result.error });
      return;
    }

    toast.success(result.message ?? "Certificate added");
    form.reset({
      ...form.getValues(),
      certificate_number: "",
      policy_id: "",
      client_id: "",
      holder_name: "",
      holder_address: "",
      file_url: "",
      status: "active",
      notes: "",
    });
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div>
        <label className="text-sm font-medium text-slate-700">Certificate number (optional)</label>
        <input
          {...form.register("certificate_number")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Policy ID
          <input
            {...form.register("policy_id")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Client ID
          <input
            {...form.register("client_id")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Holder name</label>
        <input
          {...form.register("holder_name")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <FormError message={form.formState.errors.holder_name?.message} />
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Holder address
        <textarea
          {...form.register("holder_address")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={2}
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Issued date
          <input type="date" {...form.register("issued_date")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Expiry date
          <input type="date" {...form.register("expiry_date")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </label>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">File URL</label>
        <input
          {...form.register("file_url")}
          placeholder="https://files.example.com/cert.pdf"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <FormError message={form.formState.errors.file_url?.message} />
      </div>

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
        {form.formState.isSubmitting ? "Issuing..." : "Issue certificate"}
      </button>
    </form>
  );
}
