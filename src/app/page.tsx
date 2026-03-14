const modules = [
  "Clients",
  "Policies",
  "Quotes",
  "Claims",
  "Commissions",
  "Documents",
  "Tasks",
  "Leads",
  "Certificates",
  "Reports",
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50">
      <section className="relative isolate border-b border-slate-200">
        <div className="absolute inset-0 -z-10 bg-hero-grid bg-grid [mask-image:linear-gradient(to_bottom,white_50%,transparent_100%)]" />
        <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-16 sm:px-8 lg:flex-row lg:items-center lg:py-24">
          <div className="max-w-3xl space-y-8">
            <span className="inline-flex items-center rounded-full border border-brand-100 bg-white px-3 py-1 text-sm font-medium text-brand-700 shadow-sm">
              Insurance operations, rebuilt for speed
            </span>
            <div className="space-y-4">
              <h1 className="font-[var(--font-display)] text-5xl font-semibold tracking-tight text-ink-950 sm:text-6xl">
                Manage the full agency lifecycle from one workspace.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                A modern internal platform for account teams to handle clients,
                policies, quotes, claims, commissions, tasks, certificates, and
                reporting without spreadsheet drift.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Sign in
              </a>
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Create account
              </a>
            </div>
          </div>
          <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
            <div className="grid gap-4 sm:grid-cols-2">
              {modules.map((module) => (
                <div
                  key={module}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5"
                >
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
                    Module
                  </p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">
                    {module}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
