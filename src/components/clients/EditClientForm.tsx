"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateClientAction, type ClientRow } from "@/lib/actions/clients";
import {
  clientSchema,
  clientStatusEnum,
  clientTypeEnum,
  type ClientInput,
} from "@/lib/validations/client";
import { FormError } from "@/components/ui/FormError";

type Props = {
  client: ClientRow;
};

export function EditClientForm({ client }: Props) {
  const router = useRouter();
  const form = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      client_id: client.client_id,
      type: client.type,
      first_name: client.first_name ?? "",
      last_name: client.last_name ?? "",
      business_name: client.business_name ?? "",
      email: client.email,
      phone: client.phone ?? "",
      address: client.address ?? "",
      city: client.city ?? "",
      state: client.state ?? "",
      zip: client.zip ?? "",
      date_of_birth: client.date_of_birth ?? "",
      status: client.status,
      notes: client.notes ?? "",
    },
  });

  async function onSubmit(values: ClientInput) {
    const result = await updateClientAction({ ...values, id: client.id });
    if (!result.success) {
      toast.error(result.error ?? "Unable to update client");
      form.setError("root", { message: result.error });
      return;
    }

    toast.success(result.message ?? "Client updated");
    router.refresh();
  }

  return (
    <form
      id="edit"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Client ID
          <input
            {...form.register("client_id")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Type
          <select
            {...form.register("type")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {clientTypeEnum.options.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

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

      <label className="block text-sm font-medium text-slate-700">
        Business name
        <input
          {...form.register("business_name")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
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
      </div>

      <div className="grid gap-3 md:grid-cols-3">
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
        <label className="block text-sm font-medium text-slate-700">
          ZIP
          <input
            {...form.register("zip")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Date of birth
          <input
            type="date"
            {...form.register("date_of_birth")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Status
          <select
            {...form.register("status")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {clientStatusEnum.options.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
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
        {form.formState.isSubmitting ? "Saving..." : "Update client"}
      </button>
    </form>
  );
}
