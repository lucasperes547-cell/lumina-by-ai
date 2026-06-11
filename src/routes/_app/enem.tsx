import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, BookOpen, PenLine, Layers, Trophy } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { vestibulares, vestibularInfo } from "@/lib/mock-data";
import { useDemoMode } from "@/lib/demo-mode";
import { EmptyState } from "@/components/app/EmptyState";
import { daysUntil, nextEnemDate } from "@/lib/dates";

export const Route = createFileRoute("/_app/enem")({
  component: EnemPage,
});

function EnemPage() {
  const { demo } = useDemoMode();
  const [active, setActive] = useState("enem");
  const daysToExam = daysUntil(nextEnemDate());
  const current = vestibulares.find((v) => v.id === active)!;
  const info = vestibularInfo[active];

  return (
    <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      <PageHeader
        title="Modo ENEM & Vestibular"
        subtitle="Conheça cada banca por dentro: formato, fases, foco de estudo e notas de corte."
      />

      {/* Banca selector */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-8 -mx-1 px-1">
        {vestibulares.map((v) => (
          <button
            key={v.id}
            onClick={() => setActive(v.id)}
            className={`shrink-0 px-5 py-3 rounded-2xl border-2 text-left transition-all ${
              active === v.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-surface hover:border-primary/30"
            }`}
          >
            <p className="font-bold text-sm" style={{ color: active === v.id ? v.color : undefined }}>{v.name}</p>
            <p className="text-[11px] text-muted-foreground">{v.desc}</p>
          </button>
        ))}
      </div>

      {!demo && (
        <EmptyState
          icon={GraduationCap}
          title="Ative a demonstração para ver detalhes"
          description={`Faltam ${daysToExam} dias para o ENEM. Ative o modo demonstração para explorar formato, fases e cortes de cada banca.`}
        />
      )}

      {demo && (
      <>
      {/* Banca header */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-foreground text-background rounded-3xl p-8 mb-6 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 size-64 rounded-full blur-3xl opacity-30" style={{ background: current.color }} />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="size-14 rounded-2xl grid place-items-center" style={{ background: current.color }}>
            <GraduationCap className="size-7 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-mono uppercase tracking-widest text-background/60">Banca selecionada</p>
            <h2 className="text-3xl font-extrabold">{current.name}</h2>
            <p className="text-background/70 text-sm mt-1">{current.desc}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3">
            <Calendar className="size-5 text-primary" />
            <div>
              <p className="text-xs text-background/60 font-mono uppercase">Faltam</p>
              <p className="text-xl font-extrabold">{daysToExam} dias</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div key={active + "-grid"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-3 gap-6">
        {/* Formato */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="size-4 text-primary" />
            <h3 className="font-bold">Formato da prova</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">{info.format}</p>

          <div className="space-y-3">
            {info.fases.map((f) => (
              <div key={f.name} className="p-4 rounded-2xl bg-surface-2 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-sm">{f.name}</p>
                  <span className="text-[10px] font-mono uppercase text-primary">{f.date}</span>
                </div>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Redação */}
        <div className="bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <PenLine className="size-4 text-accent" />
            <h3 className="font-bold">Redação</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{info.redacao}</p>
        </div>

        {/* Foco */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="size-4 text-primary" />
            <h3 className="font-bold">Foco de estudo recomendado</h3>
          </div>
          <ul className="grid sm:grid-cols-2 gap-2">
            {info.focus.map((t) => (
              <li key={t} className="flex items-start gap-2 p-3 rounded-xl bg-surface-2 border border-border">
                <span className="size-1.5 rounded-full mt-2 shrink-0" style={{ background: current.color }} />
                <span className="text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cortes */}
        <div className="bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="size-4 text-amber-500" />
            <h3 className="font-bold">Notas de corte de referência</h3>
          </div>
          <ul className="space-y-2">
            {info.cortes.map((c) => (
              <li key={c.course} className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border">
                <span className="text-sm font-medium">{c.course}</span>
                <span className="text-xs font-mono font-bold text-primary">{c.score}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted-foreground mt-3">* valores aproximados de edições recentes, apenas referência.</p>
        </div>
      </motion.div>
      </>
      )}
    </div>
  );
}
          <div className="size-9 rounded-xl bg-accent/10 grid place-items-center mb-3"><Calendar className="size-4 text-accent" /></div>
          <p className="text-2xl font-extrabold">{daysToExam}</p>
          <p className="text-xs text-muted-foreground">dias até a prova</p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="size-9 rounded-xl bg-amber-500/10 grid place-items-center mb-3"><Award className="size-4 text-amber-500" /></div>
          <p className="text-2xl font-extrabold">TRI 712</p>
          <p className="text-xs text-muted-foreground">média estimada</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Evolução */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Evolução por área</h3>
              <p className="text-xs text-muted-foreground">Últimos 7 simulados · escala TRI</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={enemAreaEvolution}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--accent)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" stroke="currentColor" className="text-muted-foreground" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[550, 750]} stroke="currentColor" className="text-muted-foreground" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" name="Linguagens" dataKey="linguagens" stroke="var(--primary)" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" name="Matemática" dataKey="matematica" stroke="var(--accent)" fill="url(#g2)" strokeWidth={2} />
              <Area type="monotone" name="Humanas" dataKey="humanas" stroke="#10b981" fill="transparent" strokeWidth={2} />
              <Area type="monotone" name="Naturezas" dataKey="naturezas" stroke="#f59e0b" fill="transparent" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cronograma highlights */}
        <div className="bg-foreground text-background rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-40 bg-brand-gradient opacity-20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="size-5 text-primary" />
              <h3 className="font-bold">Cronograma ENEM</h3>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Maio", focus: "Matemática + Redação", hrs: "60h" },
                { label: "Junho", focus: "Ciências da Natureza", hrs: "72h" },
                { label: "Julho", focus: "Revisões + Simulados", hrs: "80h" },
                { label: "Agosto", focus: "Treino TRI completo", hrs: "90h" },
              ].map((m) => (
                <li key={m.label} className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex justify-between">
                    <p className="font-bold">{m.label}</p>
                    <span className="text-xs font-mono text-primary">{m.hrs}</span>
                  </div>
                  <p className="text-xs text-background/70 mt-1">{m.focus}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Simulados */}
        <div className="lg:col-span-3 bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg">Simulados recentes</h3>
            <button className="text-xs font-semibold px-3 py-1.5 bg-primary text-primary-foreground rounded-lg flex items-center gap-1 hover:opacity-90">
              <Play className="size-3" /> Novo simulado
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
            {enemSimulados.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl border border-border bg-surface-2 hover:border-primary/30 transition-all cursor-pointer">
                <p className="text-[10px] font-mono uppercase text-muted-foreground">{s.date}</p>
                <p className="font-bold text-sm mt-1 mb-3 line-clamp-1">{s.name}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xl font-extrabold text-primary">{s.score}</p>
                    <p className="text-[10px] text-muted-foreground">{s.area}</p>
                  </div>
                  <div className="h-12 w-1 rounded-full bg-gradient-to-t from-primary to-accent opacity-60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}