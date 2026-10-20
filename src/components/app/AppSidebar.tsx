import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, FileUp, Target, CalendarDays, User, LogOut, GraduationCap, Network, LineChart, Brain } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import { useProfile, useUser, initialsOf, signOut } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tutor", label: "Tutor IA", icon: Brain },
  { to: "/upload", label: "Materiais", icon: FileUp },
  { to: "/exercises", label: "Exercícios", icon: Target },
  { to: "/enem", label: "Modo ENEM", icon: GraduationCap },
  { to: "/knowledge", label: "Mapa de conhecimento", icon: Network },
  { to: "/analytics", label: "Analytics", icon: LineChart, Brain },
  { to: "/plan", label: "Plano de estudos", icon: CalendarDays },
  { to: "/profile", label: "Perfil", icon: User },
] as const;

export function AppSidebar() {
  const { data: profile } = useProfile();
  const { data: user } = useUser();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
      <div className="px-6 h-16 flex items-center border-b border-border">
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((it) => {
          const active = pathname === it.to || pathname.startsWith(it.to + "/");
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
        <div className="px-2 mb-2"><ThemeToggle /></div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
          <div className="size-9 rounded-full bg-brand-gradient grid place-items-center text-xs font-bold text-primary-foreground">
            {initialsOf(profile?.full_name, user?.email)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">{profile?.full_name || "Estudante"}</p>
            <p className="text-[10px] text-muted-foreground truncate">{profile?.goal || "Seu aprendizado"}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={async () => { await signOut(qc); navigate({ to: "/login", replace: true }); }} aria-label="Sair">
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}