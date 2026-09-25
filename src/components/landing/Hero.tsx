import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Target, FileText } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh -z-10 opacity-70" />
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-mono text-primary mb-8"
        >
          <Sparkles className="size-3" />
          <span>v2.0 DISPONÍVEL</span>
          <span className="size-1 bg-primary rounded-full" />
          <span>APRENDIZADO PERSONALIZADO</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-balance leading-[0.95] mb-8"
        >
          Aprenda do <span className="text-gradient">seu jeito</span> com IA.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty"
        >
          Personalização inteligente que entende seu ritmo. Do resumo automático à geração de exercícios complexos em segundos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
          >
            Começar Agora — É Grátis
          </Link>
          <a
            href="#how"
            className="w-full sm:w-auto px-8 py-4 bg-surface border border-border font-bold rounded-2xl hover:bg-surface-2 transition-all"
          >
            Ver Demonstração
          </a>
        </motion.div>
      </div>

      {/* Product Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="max-w-6xl mx-auto px-6 mt-20"
      >
        <div className="relative bg-surface rounded-3xl shadow-2xl shadow-primary/10 border border-border p-2">
          <div className="bg-surface-2 rounded-2xl aspect-video overflow-hidden border border-border flex">
            {/* Sidebar */}
            <div className="w-56 border-r border-border bg-surface hidden md:flex flex-col p-4 gap-4">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-muted" />
                <div className="size-3 rounded-full bg-muted" />
                <div className="size-3 rounded-full bg-muted" />
              </div>
              <div className="space-y-1.5 mt-2">
                {[
                  { icon: Target, label: "Dashboard", active: true },
                  { icon: FileText, label: "Materiais" },
                  { icon: BookOpen, label: "Exercícios" },
                ].map((it, i) => (
                  <div
                    key={i}
                    className={`h-9 rounded-lg flex items-center px-3 gap-2 ${
                      it.active ? "bg-primary/8 border border-primary/15 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <it.icon className="size-3.5" />
                    <span className="text-xs font-medium">{it.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Main */}
            <div className="flex-1 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm font-bold">Olá, Lucas 👋</p>
                  <p className="text-[10px] text-muted-foreground">+12% acima da meta semanal</p>
                </div>
                <div className="size-7 rounded-full bg-brand-gradient" />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { l: "Tempo", v: "14.2h", c: "text-primary" },
                  { l: "Acertos", v: "88%", c: "text-emerald-500" },
                  { l: "Sequência", v: "12d", c: "text-accent" },
                ].map((s) => (
                  <div key={s.l} className="bg-surface border border-border rounded-xl p-3">
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">{s.l}</p>
                    <p className={`text-lg font-bold ${s.c}`}>{s.v}</p>
                  </div>
                ))}
              </div>
              <div className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-5 rounded-md bg-brand-gradient flex items-center justify-center">
                    <Sparkles className="size-3 text-white" />
                  </div>
                  <p className="text-xs font-bold">Recomendação da IA</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Você teve dificuldade em <strong className="text-foreground">Trigonometria</strong>. Que tal revisarmos os fundamentos antes do simulado de sábado?
                </p>
                <div className="h-1.5 mt-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-brand-gradient rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}