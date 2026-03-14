export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 sm:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-2">
          <section className="hidden rounded-3xl bg-ink-950 p-10 text-white lg:block">
            <h1 className="font-[var(--font-display)] text-4xl leading-tight">
              Insurance operations, centralized.
            </h1>
            <p className="mt-5 max-w-md text-sm text-slate-300">
              Secure access to clients, policies, claims, and reporting in a
              single workflow for your agency team.
            </p>
          </section>
          <section>{children}</section>
        </div>
      </div>
    </main>
  );
}
