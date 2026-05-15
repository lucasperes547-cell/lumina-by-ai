const items = [
  { quote: "O gerador de flashcards economiza horas de estudo. É mágico.", name: "Lucas Almeida", role: "Estudante de Medicina" },
  { quote: "As explicações são muito melhores que as de muitos professores que já tive.", name: "Beatriz Souza", role: "Vestibulanda" },
  { quote: "Não uso mais outra coisa para fazer resumos de livros extensos.", name: "Rafael Costa", role: "Estudante de Direito" },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-32 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-16 italic tracking-tight max-w-3xl mx-auto">
          "A Lumina mudou como eu me preparo para o ENEM. Sinto que tenho um tutor particular 24h."
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.name} className="p-8 border border-white/10 rounded-2xl hover:border-white/20 transition-colors">
              <p className="text-white/70 mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-brand-gradient" />
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-white/50">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}