"use client";

import { Bell, Menu } from "lucide-react";
import { getPageTitle } from "@/lib/navigation";

type HeaderProps = {
  pathname: string;
  fullName: string;
  onOpenMenu: () => void;
  onSignOut: () => void;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "U";
}

export function Header({
  pathname,
  fullName,
  onOpenMenu,
  onSignOut,
}: HeaderProps) {
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:border-slate-400 hover:text-slate-900 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm text-slate-500 lg:hidden">Insurance Agency System</p>
          <h1 className="font-[var(--font-display)] text-xl font-semibold text-slate-900">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-2 py-1 pr-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          aria-label="Open account menu"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
            {getInitials(fullName)}
          </span>
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
