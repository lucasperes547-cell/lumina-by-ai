import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, MessageSquare, FileUp, Target, CalendarDays, User, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chat", label: "Chat IA", icon: MessageSquare },
  { to: "/upload", label: "Materiais", icon: FileUp },
  { to: "/exercises", label: "Exercícios", icon: Target },
  { to: "/plan", label: "Plano de estudos", icon: CalendarDays },
  { to: "/profile", label: "Perfil", icon: User },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
      <div className="px-6 h-16 flex items-center border-b border-border">
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((it) => {
          const active = pathname === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-primary/10 text-primary border border-primary/15"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground border border-transparent"
              )}
            >
              <it.icon className="size-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
          <div className="size-9 rounded-full bg-brand-gradient grid place-items-center text-xs font-bold text-white">
            MS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">Matheus Silva</p>
            <p className="text-[10px] text-muted-foreground truncate">Vestibulando</p>
          </div>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Sair">
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}