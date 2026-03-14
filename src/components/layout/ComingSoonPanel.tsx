type ComingSoonPanelProps = {
  title: string;
  description: string;
};

export function ComingSoonPanel({ title, description }: ComingSoonPanelProps) {
  return (
    <section className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
      <h2 className="font-[var(--font-display)] text-2xl font-semibold text-slate-900">
        {title}
      </h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </section>
  );
}
