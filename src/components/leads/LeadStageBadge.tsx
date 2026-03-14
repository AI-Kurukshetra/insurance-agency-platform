import type { z } from "zod";
import { leadStageEnum } from "@/lib/validations/lead";
import { cn } from "@/lib/utils";

const styles: Record<z.infer<typeof leadStageEnum>, string> = {
  new: "bg-slate-100 text-slate-700",
  contacted: "bg-amber-50 text-amber-700",
  qualified: "bg-blue-50 text-blue-700",
  proposal: "bg-indigo-50 text-indigo-700",
  negotiation: "bg-purple-50 text-purple-700",
  won: "bg-emerald-50 text-emerald-700",
  lost: "bg-rose-50 text-rose-700",
};

type Props = {
  stage: z.infer<typeof leadStageEnum>;
};

export function LeadStageBadge({ stage }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        styles[stage],
      )}
    >
      {stage.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
    </span>
  );
}
