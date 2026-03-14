import type { z } from "zod";
import { certificateStatusEnum } from "@/lib/validations/certificate";
import { cn } from "@/lib/utils";

type Props = {
  status: z.infer<typeof certificateStatusEnum>;
};

const statusStyles: Record<Props["status"], string> = {
  active: "bg-emerald-50 text-emerald-700",
  expired: "bg-amber-50 text-amber-700",
  revoked: "bg-rose-50 text-rose-700",
};

export function CertificateStatusBadge({ status }: Props) {
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
