import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Network, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { knowledgeMap } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/knowledge")({
  component: KnowledgePage,
});

function masteryBand(m: number) {
  if (m >= 70) return { label: "Forte", cls: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
  if (m >= 45) return { label: "Médio", cls: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
  return { label: "Fraco", cls: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
}

function KnowledgePage() {
  const [selected, setSelected] = useState(knowledgeMap[0].subject);
  const current = knowledgeMap.find((k) => k.subject === selected)!;

  return (
    <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      <PageHeader
        title="Mapa de Conhecimento"
        subtitle="Visualize seu domínio em cada matéria. A IA identifica automaticamente onde focar."
      />

      {/* Overview grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {knowledgeMap.map((k) => {
          const band = masteryBand(k.mastery);
          const active = k.subject === selected;
          return (
            <motion.button
              key={k.subject}
              onClick={() => setSelected(k.subject)}
              whileHover={{ y: -2 }}
              className={`text-left p-5 rounded-2xl border-2 transition-all bg-surface ${active ? "border-primary shadow-md" : "border-border hover:border-primary/30"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full" style={{ background: k.color }} />
                  <span className="font-bold">{k.subject}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${band.cls}`}>{band.label}</span>
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-extrabold">{k.mastery}%</span>
                <span className="text-xs text-muted-foreground">{k.topics.length} tópicos</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${k.mastery}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: k.color }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Detail panel */}
      <motion.div key={selected} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-11 rounded-2xl grid place-items-center" style={{ background: current.color + "20" }}>
            <Network className="size-5" style={{ color: current.color }} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold">{current.subject}</h3>
            <p className="text-xs text-muted-foreground">Domínio geral: {current.mastery}% · clique em um tópico para detalhes</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {current.topics.map((t, i) => {
            const band = masteryBand(t.mastery);
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-2xl border border-border bg-surface-2 hover:border-primary/30 cursor-pointer group transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.mastery}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="h-full rounded-full"
                      style={{ background: current.color }}
                    />
                  </div>
                  <span className="text-xs font-mono w-10 text-right">{t.mastery}%</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${band.cls}`}>{band.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}