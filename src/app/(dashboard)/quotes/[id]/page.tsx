import { QuoteDetailPanel } from "@/components/quotes/QuoteDetailPanel";
import { EditQuoteForm } from "@/components/quotes/EditQuoteForm";
import { getQuoteById } from "@/lib/actions/quotes";

export default async function QuoteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const quote = await getQuoteById(params.id);
  if (!quote) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-slate-500">Quote not found</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <QuoteDetailPanel quote={quote} />
      <EditQuoteForm quote={quote} />
    </section>
  );
}
