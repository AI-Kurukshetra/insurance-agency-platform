"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotPasswordAction } from "@/lib/actions/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
import { FormError } from "@/components/ui/FormError";

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    const result = await forgotPasswordAction(values);
    if (!result.success) {
      form.setError("root", { message: result.error ?? "Request failed" });
      return;
    }

    form.setError("root", {
      message: result.message ?? "Password reset email sent",
    });
    form.reset();
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel"
    >
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Account email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...form.register("email")}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <FormError message={form.formState.errors.email?.message} />
      </div>

      <FormError message={form.formState.errors.root?.message} />

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
      </button>

      <div className="text-sm text-slate-600">
        Back to{" "}
        <Link className="font-medium hover:text-slate-900" href="/login">
          sign in
        </Link>
      </div>
    </form>
  );
}
