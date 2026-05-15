import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { studyPlanWeek } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/plan")({
  component: PlanPage,
});

function PlanPage() {
  const [generated, setGenerated] = useState(true);
  const [loading, setLoading] = useState(false);

  const regenerate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setGenerated(true); toast.success("Plano de estudos atualizado pela IA"); }, 1100);
  };

  return (
    <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      <PageHeader
        title="Plano de Estudos"
        subtitle="Cronograma adaptativo gerado pela IA com base na sua prova e disponibilidade."
        action={
          <button onClick={regenerate} disabled={loading} className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60">
            <Sparkles className="size-4" /> {loading ? "Gerando..." : "Regenerar"}
          </button>
        }
      />

      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface border border-border rounded-2xl p-5">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Prova alvo</p>
          <p className="font-bold">ENEM 2026</p>
          <p className="text-xs text-muted-foreground mt-1">em 187 dias</p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Horas/dia</p>
          <p className="font-bold">3.5h</p>
          <p className="text-xs text-muted-foreground mt-1">média planejada</p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Matérias</p>
          <p className="font-bold">6 áreas</p>
          <p className="text-xs text-muted-foreground mt-1">com revisões</p>
        </div>
        <div className="bg-brand-gradient text-white rounded-2xl p-5">
          <p className="text-xs font-mono uppercase tracking-widest text-white/70 mb-2">Meta da semana</p>
          <p className="font-bold">21h estudadas</p>
          <p className="text-xs text-white/80 mt-1">14.2h concluídas</p>
        </div>
      </div>

      {generated && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 lg:grid-cols-7 gap-3">
          {studyPlanWeek.map((d) => (
            <div key={d.day} className="bg-surface border border-border rounded-2xl p-4 min-h-[200px]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold">{d.day}</h4>
                <CalendarDays className="size-3.5 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {d.blocks.length === 0 && (
                  <div className="text-xs text-muted-foreground italic mt-6 text-center">Descanso 🌿</div>
                )}
                {d.blocks.map((b, i) => (
                  <div key={i} className="p-2.5 rounded-lg border-l-2" style={{ borderColor: b.color, background: b.color + "0d" }}>
                    <p className="text-[10px] font-mono text-muted-foreground">{b.time}</p>
                    <p className="text-xs font-bold mt-0.5">{b.subject}</p>
                    <p className="text-[11px] text-muted-foreground">{b.topic}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}