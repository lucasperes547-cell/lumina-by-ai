import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">Funcionalidades</a>
          <a href="#how" className="hover:text-primary transition-colors">Como funciona</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium px-3 py-2 hover:text-primary transition-colors hidden sm:inline-block">
            Entrar
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
          >
            Começar Agora
          </Link>
        </div>
      </div>
    </nav>
  );
}