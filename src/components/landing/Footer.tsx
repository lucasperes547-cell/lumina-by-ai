import { Logo } from "@/components/Logo";

export function LandingFooter() {
  return (
    <footer className="py-16 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <Logo />
          <p className="text-sm text-muted-foreground leading-relaxed mt-6">
            Iluminando o caminho do conhecimento através da inteligência artificial personalizada para estudantes brasileiros.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">Produto</h4>
            <ul className="text-sm space-y-4 font-medium">
              <li><a href="#features" className="hover:text-primary transition-colors">Recursos</a></li>
              <li><a href="#how" className="hover:text-primary transition-colors">Como funciona</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Preços</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">Suporte</h4>
            <ul className="text-sm space-y-4 font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Comunidade</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>
          <div className="hidden md:block">
            <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">Legal</h4>
            <ul className="text-sm space-y-4 font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Termos</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">© 2026 Lumina AI Technologies. Feito com foco para estudantes brasileiros.</p>
        <div className="flex gap-3 text-xs font-mono text-muted-foreground">
          <span>Learning Your Way</span>
        </div>
      </div>
    </footer>
  );
}