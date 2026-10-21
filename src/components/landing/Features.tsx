import { Brain, FileText, Target, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Brain, color: "text-primary", bg: "bg-primary/10", title: "Explicação Multinível", desc: "Peça para a IA explicar física quântica para uma criança de 5 anos ou para um doutorando. Você escolhe o tom." },
  { icon: Target, color: "text-accent", bg: "bg-accent/10", title: "Gerador de Exercícios", desc: "Crie simulados personalizados baseados no que você acabou de ler em um PDF ou assistir em uma aula." },
  { icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10", title: "Planos Dinâmicos", desc: "A IA organiza sua semana baseado na sua data de prova e nível de dificuldade em cada matéria." },
  { icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10", title: "Resumo de PDFs", desc: "Suba seus materiais e receba resumos estruturados, tópicos principais e flashcards automáticos." },
  { icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", title: "Evolução Visível", desc: "Acompanhe seu progresso, veja seus pontos fortes e receba alertas das suas dificuldades." },
];

export function Features() {
  return (
    <section id="features" className="py-32 bg-surface-2 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <span className="font-mono text-primary text-xs tracking-widest uppercase mb-4 block">Funcionalidades</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Estude com superpoderes</h2>
          <p className="text-muted-foreground text-lg">Tudo o que você precisa para dominar qualquer assunto em tempo recorde.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-surface p-8 rounded-3xl border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-[border-color,box-shadow] group"
            >
              <div className={`size-12 ${f.bg} rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <f.icon className={`size-5 ${f.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}