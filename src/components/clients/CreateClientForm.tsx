"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createClientAction } from "@/lib/actions/clients";
import { clientSchema, type ClientInput } from "@/lib/validations/client";
import { FormError } from "@/components/ui/FormError";

export function CreateClientForm() {
  const router = useRouter();
  const form = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      client_id: "",
      type: "individual",
      first_name: "",
      last_name: "",
      business_name: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      status: "active",
      notes: "",
    },
  });

  async function onSubmit(values: ClientInput) {
    const result = await createClientAction(values);
    if (!result.success) {
      form.setError("root", { message: result.error ?? "Unable to save client" });
      toast.error(result.error ?? "Unable to save client");
      return;
    }

    toast.success(result.message ?? "Client created");
    form.reset();
    router.refresh();
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Client ID
          <input
            {...form.register("client_id")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <FormError message={form.formState.errors.client_id?.message} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Client Type
          <select
            {...form.register("type")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
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

      <label className="block text-sm font-medium text-slate-700">
        Business name
        <input
          {...form.register("business_name")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
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
        <label className="block text-sm font-medium text-slate-700">
          Status
          <select
            {...form.register("status")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="prospect">Prospect</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          City
          <input
            {...form.register("city")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          State
          <input
            {...form.register("state")}
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

      <FormError message={form.formState.errors.root?.message} />

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Saving client..." : "Save client"}
      </button>
    </form>
  );
}
