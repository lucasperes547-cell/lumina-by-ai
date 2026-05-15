import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn("flex items-center gap-2", className)}>
      <div className="size-8 bg-brand-gradient rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
        <div className="size-3 bg-white rounded-full animate-pulse" />
      </div>
      <span className="font-extrabold text-xl tracking-tighter">Lumina AI</span>
    </Link>
  );
}