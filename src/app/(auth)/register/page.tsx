import { RegisterForm } from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="w-full">
      <h2 className="mb-4 font-[var(--font-display)] text-3xl font-semibold text-slate-900">
        Create your account
      </h2>
      <p className="mb-6 text-sm text-slate-600">
        Start using the platform for client and policy operations.
      </p>
      <RegisterForm />
    </section>
  );
}
