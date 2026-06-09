import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app/AppSidebar";
import { MobileNav } from "@/components/app/MobileNav";
import { NotificationsButton } from "@/components/app/NotificationsButton";
import { DemoToggle } from "@/components/app/DemoToggle";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <header className="h-14 px-5 lg:px-10 flex items-center justify-between border-b border-border sticky top-0 z-30 glass">
          <div className="lg:hidden"><Logo /></div>
          <div className="hidden lg:block text-xs font-mono text-muted-foreground">Lumina AI · Plataforma de Estudos</div>
          <div className="flex items-center gap-2">
            <div className="lg:hidden"><DemoToggle variant="compact" /></div>
            <NotificationsButton />
          </div>
        </header>
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}