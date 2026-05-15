import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app/AppSidebar";
import { MobileNav } from "@/components/app/MobileNav";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}