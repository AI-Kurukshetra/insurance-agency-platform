"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { logoutAction } from "@/lib/actions/auth";

type DashboardShellProps = {
  children: React.ReactNode;
  fullName: string;
  email: string;
};

export function DashboardShell({
  children,
  fullName,
  email,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await logoutAction();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <div className="hidden w-[260px] shrink-0 lg:block">
          <Sidebar fullName={fullName} email={email} onSignOut={handleSignOut} />
        </div>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-slate-950/30"
              aria-label="Close navigation menu"
            />
            <div className="relative h-full w-[260px] bg-white shadow-xl">
              <Sidebar
                fullName={fullName}
                email={email}
                onNavigate={() => setMobileOpen(false)}
                onSignOut={handleSignOut}
              />
            </div>
          </div>
        ) : null}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Header
            pathname={pathname}
            fullName={fullName}
            onOpenMenu={() => setMobileOpen(true)}
            onSignOut={handleSignOut}
          />
          <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
