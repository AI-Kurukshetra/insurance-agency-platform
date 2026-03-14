"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginAction } from "@/lib/actions/auth";
import { type LoginInput, loginSchema } from "@/lib/validations/auth";
import { FormError } from "@/components/ui/FormError";

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    const result = await loginAction(values);
    if (!result.success) {
      form.setError("root", { message: result.error ?? "Login failed" });
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
          autoComplete="current-password"
          {...form.register("password")}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <FormError message={form.formState.errors.password?.message} />
      </div>

      <FormError message={form.formState.errors.root?.message} />

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <Link className="hover:text-slate-900" href="/forgot-password">
          Forgot password?
        </Link>
        <Link className="hover:text-slate-900" href="/register">
          Create account
        </Link>
      </div>
    </form>
  );
}
