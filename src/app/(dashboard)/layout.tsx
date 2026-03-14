import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name,email")
    .eq("id", user.id)
    .maybeSingle();

  const fullName = profile?.full_name ?? user.user_metadata?.full_name ?? "User";
  const email = profile?.email ?? user.email ?? "unknown";

  return (
    <DashboardShell fullName={fullName} email={email}>
      {children}
    </DashboardShell>
  );
}
