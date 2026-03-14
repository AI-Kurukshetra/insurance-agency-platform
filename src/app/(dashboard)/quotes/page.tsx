import { fetchQuotes } from "@/lib/actions/quotes";
import { CreateQuoteForm } from "@/components/quotes/CreateQuoteForm";
import { QuoteTable } from "@/components/quotes/QuoteTable";

export default async function QuotesPage() {
  const quotes = await fetchQuotes(10);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Quotes</p>
          <h1 className="text-3xl font-semibold text-slate-900">Quote board</h1>
        </div>
      </header>
      <div className="grid gap-6 xl:grid-cols-[1fr,360px]">
        <div className="space-y-4">
          <QuoteTable quotes={quotes} />
        </div>
        <CreateQuoteForm />
      </div>
    </section>
  );
}
