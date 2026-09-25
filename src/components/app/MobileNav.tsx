import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FileUp, Target, CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Início" },
  { to: "/upload", icon: FileUp, label: "PDF" },
  { to: "/exercises", icon: Target, label: "Exerc." },
  { to: "/plan", icon: CalendarDays, label: "Plano" },
  { to: "/profile", icon: User, label: "Perfil" },
] as const;

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {items.map((it) => {
          const active = pathname === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-[10px] font-medium",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <it.icon className="size-4" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}