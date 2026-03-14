import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <section className="w-full">
      <h2 className="mb-4 font-[var(--font-display)] text-3xl font-semibold text-slate-900">
        Sign in
      </h2>
      <p className="mb-6 text-sm text-slate-600">
        Access the agency dashboard to manage daily operations.
      </p>
      <LoginForm />
    </section>
  );
}
