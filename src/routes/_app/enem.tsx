import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Target, TrendingUp, Calendar, Award, Play } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { PageHeader } from "@/components/app/PageHeader";
import { vestibulares, enemSimulados, enemAreaEvolution } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/enem")({
  component: EnemPage,
});

function EnemPage() {
  const [active, setActive] = useState("enem");
  const predicted = 712;

  return (
    <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      <PageHeader
        title="Modo ENEM & Vestibular"
        subtitle="Simulados, evolução por área e previsão de nota personalizadas para sua banca."
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

      {/* Top stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-gradient text-white rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 size-32 bg-white/10 rounded-full blur-2xl" />
          <p className="text-xs font-mono uppercase tracking-widest text-white/80 mb-2">Previsão de nota</p>
          <p className="text-3xl font-extrabold">{predicted}</p>
          <p className="text-xs text-white/80 mt-1 flex items-center gap-1"><TrendingUp className="size-3" /> +28 vs último mês</p>
        </motion.div>
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="size-9 rounded-xl bg-primary/10 grid place-items-center mb-3"><Target className="size-4 text-primary" /></div>
          <p className="text-2xl font-extrabold">8</p>
          <p className="text-xs text-muted-foreground">simulados concluídos</p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="size-9 rounded-xl bg-accent/10 grid place-items-center mb-3"><Calendar className="size-4 text-accent" /></div>
          <p className="text-2xl font-extrabold">187</p>
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
    </div>
  );
}