import type { z } from "zod";
import { policyStatusEnum } from "@/lib/validations/policy";
import { cn } from "@/lib/utils";

type Props = {
  status: z.infer<typeof policyStatusEnum>;
};

const statusStyles: Record<Props["status"], string> = {
  active: "bg-emerald-50 text-emerald-700",
  expired: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-700",
  pending: "bg-amber-50 text-amber-700",
  renewed: "bg-blue-50 text-blue-700",
};

export function PolicyStatusBadge({ status }: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        statusStyles[status],
      )}
    >
      {status}
    </span>
  );
}
