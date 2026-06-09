import { Logo } from "@/components/Logo";

export function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-12 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Logo />
          <p className="text-xs text-muted-foreground hidden md:inline">·</p>
          <p className="text-xs text-muted-foreground">Learning Your Way</p>
        </div>
        <p className="text-xs text-muted-foreground">© {year} Lumina AI Technologies.</p>
      </div>
    </footer>
  );
}