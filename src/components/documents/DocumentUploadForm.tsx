"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { createDocumentAction } from "@/lib/actions/documents";
import {
  documentSchema,
  documentTypeEnum,
  type DocumentFormValues,
  type DocumentInput,
} from "@/lib/validations/document";
import { FormError } from "@/components/ui/FormError";

const docTypeOptions = documentTypeEnum.options;

export function DocumentUploadForm() {
  const router = useRouter();
  const resolver = zodResolver(documentSchema) as unknown as Resolver<DocumentFormValues>;
  const form = useForm<DocumentFormValues>({
    resolver,
    defaultValues: {
      name: "",
      type: "policy",
      file_url: "",
      file_size: undefined,
      mime_type: "",
      client_id: "",
      policy_id: "",
      claim_id: "",
      quote_id: "",
      version: 1,
      tags: "",
      description: "",
    },
  });

  async function onSubmit(values: DocumentFormValues) {
    const payload = documentSchema.parse(values) satisfies DocumentInput;
    const result = await createDocumentAction(payload);
    if (!result.success) {
      toast.error(result.error ?? "Unable to upload document");
      form.setError("root", { message: result.error });
      return;
    }

    toast.success(result.message ?? "Document uploaded");
    form.reset({
      ...form.getValues(),
      name: "",
      file_url: "",
      client_id: "",
      policy_id: "",
      claim_id: "",
      quote_id: "",
      description: "",
      tags: "",
    });
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div>
        <label className="text-sm font-medium text-slate-700">Document name</label>
        <input
          {...form.register("name")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="Hazard report"
        />
        <FormError message={form.formState.errors.name?.message} />
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Document type
        <select
          {...form.register("type")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {docTypeOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">File URL</label>
        <input
          {...form.register("file_url")}
          placeholder="https://.../document.pdf"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <FormError message={form.formState.errors.file_url?.message} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          File size (bytes)
          <input
            type="number"
            {...form.register("file_size", { valueAsNumber: true })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          MIME type
          <input
            {...form.register("mime_type")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="application/pdf"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Client ID (optional)
          <input
            {...form.register("client_id")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Policy ID (optional)
          <input
            {...form.register("policy_id")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Claim ID (optional)
          <input
            {...form.register("claim_id")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Quote ID (optional)
          <input
            {...form.register("quote_id")}
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

      <label className="block text-sm font-medium text-slate-700">
        Tags (comma separated)
        <input
          {...form.register("tags")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="renewal, certificate"
        />
      </label>

      <FormError message={form.formState.errors.root?.message} />

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Uploading..." : "Upload document"}
      </button>
    </form>
  );
}
