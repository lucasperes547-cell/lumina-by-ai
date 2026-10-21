import { motion } from "framer-motion";
import { Upload, Layers, TrendingUp } from "lucide-react";

const steps = [
  {
    n: "01",
    color: "text-primary",
    icon: Upload,
    title: "Conecte seus materiais",
    desc: "Faça upload de PDFs, anotações ou apenas digite o tema que deseja dominar. Nossa IA processa tudo em segundos.",
  },
  {
    n: "02",
    color: "text-accent",
    icon: Layers,
    title: "Aprofunde o estudo",
    desc: "Gere resumos, flashcards automáticos e explicações mais simples para os conceitos mais difíceis.",
  },
  {
    n: "03",
    color: "text-blue-500",
    icon: TrendingUp,
    title: "Evolua continuamente",
    desc: "Acompanhe seu progresso, receba recomendações personalizadas e mantenha sua sequência de estudos.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="font-mono text-primary text-xs tracking-widest uppercase mb-4 block">Como funciona</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Sua jornada de clareza</h2>
        </div>
        <div className="space-y-20">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12`}
            >
              <div className="flex-1">
                <span className={`font-mono ${s.color} text-sm tracking-widest uppercase mb-4 block`}>Passo {s.n}</span>
                <h3 className="text-3xl font-bold mb-4">{s.title}</h3>
                <p className="text-muted-foreground text-lg">{s.desc}</p>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-[4/3] rounded-3xl border border-border bg-surface relative overflow-hidden grid place-items-center">
                  <div className="absolute inset-0 gradient-mesh opacity-50" />
                  <s.icon className={`size-24 ${s.color} relative z-10`} strokeWidth={1.2} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}