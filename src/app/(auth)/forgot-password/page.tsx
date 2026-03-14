import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <section className="w-full">
      <h2 className="mb-4 font-[var(--font-display)] text-3xl font-semibold text-slate-900">
        Reset password
      </h2>
      <p className="mb-6 text-sm text-slate-600">
        We will send a secure reset link to your inbox.
      </p>
      <ForgotPasswordForm />
    </section>
  );
}
