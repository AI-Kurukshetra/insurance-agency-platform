import type { z } from "zod";
import { clientStatusEnum } from "@/lib/validations/client";
import { cn } from "@/lib/utils";

type Props = {
  status: z.infer<typeof clientStatusEnum>;
};

const statusStyles: Record<Props["status"], string> = {
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
  prospect: "bg-blue-50 text-blue-700",
};

export function ClientStatusBadge({ status }: Props) {
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
