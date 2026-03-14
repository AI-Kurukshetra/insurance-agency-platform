import type { LucideIcon } from "lucide-react";
import {
  BellDot,
  BriefcaseBusiness,
  ClipboardList,
  FileBadge,
  FileText,
  Gauge,
  HandCoins,
  ShieldAlert,
  Target,
  Users,
  WalletCards,
} from "lucide-react";

export type AppNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Gauge },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Policies", href: "/policies", icon: ClipboardList },
  { label: "Quotes", href: "/quotes", icon: WalletCards },
  { label: "Claims", href: "/claims", icon: ShieldAlert },
  { label: "Commissions", href: "/commissions", icon: HandCoins },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Tasks", href: "/tasks", icon: BellDot },
  { label: "Leads", href: "/leads", icon: Target },
  { label: "Certificates", href: "/certificates", icon: FileBadge },
  { label: "Reports", href: "/reports", icon: BriefcaseBusiness },
];

export function getPageTitle(pathname: string): string {
  const exact = APP_NAV_ITEMS.find((item) => item.href === pathname);
  if (exact) return exact.label;

  const partial = APP_NAV_ITEMS.find(
    (item) => item.href !== "/" && pathname.startsWith(`${item.href}/`),
  );
  if (partial) return partial.label;

  return "Insurance Agency System";
}
