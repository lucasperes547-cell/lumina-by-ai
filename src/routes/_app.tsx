import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app/AppSidebar";
import { MobileNav } from "@/components/app/MobileNav";
import { NotificationsButton } from "@/components/app/NotificationsButton";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/_app")({
  ssr: false,
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login" });
    const { data: profile, error } = await supabase.from("profiles").select("onboarded").eq("id", user.id).maybeSingle();
    if (error) throw error;
    if (!profile?.onboarded) throw redirect({ to: "/onboarding" });
  },
  component: AppLayout,
});

function AppLayout() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <header className="h-14 px-5 lg:px-10 flex items-center justify-between border-b border-border sticky top-0 z-30 glass">
          <div className="lg:hidden"><Logo /></div>
          <div className="hidden lg:block text-xs font-mono text-muted-foreground">Lumina AI · Plataforma de Estudos</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Sair" onClick={async () => { await signOut(qc); navigate({ to: "/login", replace: true }); }}><LogOut /></Button>
            <NotificationsButton />
          </div>
        </header>
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}