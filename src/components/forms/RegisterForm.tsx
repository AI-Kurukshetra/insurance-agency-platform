"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerAction } from "@/lib/actions/auth";
import { type RegisterInput, registerSchema } from "@/lib/validations/auth";
import { FormError } from "@/components/ui/FormError";

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    const result = await registerAction(values);
    if (!result.success) {
      form.setError("root", { message: result.error ?? "Registration failed" });
      return;
    }

    if (result.message) {
      form.setError("root", { message: result.message });
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel"
    >
      <div>
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="fullName"
        >
          Full name
        </label>
        <input
          id="fullName"
          autoComplete="name"
          {...form.register("fullName")}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <FormError message={form.formState.errors.fullName?.message} />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email
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

      <div>
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          {...form.register("password")}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <FormError message={form.formState.errors.password?.message} />
      </div>

      <div>
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="confirmPassword"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...form.register("confirmPassword")}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <FormError message={form.formState.errors.confirmPassword?.message} />
      </div>

      <FormError message={form.formState.errors.root?.message} />

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <div className="text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-medium hover:text-slate-900" href="/login">
          Sign in
        </Link>
      </div>
    </form>
  );
}
