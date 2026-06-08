import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Flame, Clock, Target, TrendingUp, ArrowRight, BookOpen, MessageSquare, FileText, CalendarDays, AlertCircle } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, Cell } from "recharts";
import { subjects, weeklyStudy, recentActivity, recommendations } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

const activityIcon = { exercise: Target, chat: MessageSquare, pdf: FileText, plan: CalendarDays } as const;

function Dashboard() {
  return (
    <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="font-mono text-xs tracking-widest uppercase text-primary mb-2">Sexta-feira, 15 de maio</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Olá, Matheus 👋
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Você está <span className="text-emerald-500 font-semibold">12% acima</span> da sua meta semanal. Continue assim.</p>
      </motion.div>

      {/* O que estudar agora */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-surface border border-border rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-primary" />
            <h3 className="font-bold">O que estudar agora</h3>
          </div>
          <Link to="/knowledge" className="text-xs font-semibold text-primary hover:underline">Ver mapa completo</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { topic: "Trigonometria", subject: "Matemática", level: "Crítico", color: "rose" },
            { topic: "Eletromagnetismo", subject: "Física", level: "Atenção", color: "amber" },
            { topic: "Química Orgânica", subject: "Química", level: "Atenção", color: "amber" },
          ].map((r) => (
            <Link key={r.topic} to="/chat" className={`p-4 rounded-2xl border bg-surface-2 hover:border-primary/30 transition-all block`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full ${r.color === "rose" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"}`}>{r.level}</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </div>
              <p className="font-bold text-sm">{r.topic}</p>
              <p className="text-xs text-muted-foreground">{r.subject} · revisão recomendada</p>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Clock, label: "Tempo estudado", value: "14.2h", hint: "esta semana", color: "text-primary", bg: "bg-primary/10" },
          { icon: Target, label: "Acertos", value: "88%", hint: "últimos 7 dias", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { icon: Flame, label: "Sequência", value: "12 dias", hint: "🔥 em chamas", color: "text-orange-500", bg: "bg-orange-500/10" },
          { icon: TrendingUp, label: "Ranking", value: "Top 8%", hint: "entre vestibulandos", color: "text-accent", bg: "bg-accent/10" },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className={`size-10 rounded-xl ${s.bg} grid place-items-center mb-3`}>
              <s.icon className={`size-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            <p className="text-[10px] text-muted-foreground/70 font-mono mt-0.5">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Tempo de estudo</h3>
              <p className="text-xs text-muted-foreground">Últimos 7 dias · em minutos</p>
            </div>
            <span className="text-xs font-mono text-primary px-2 py-1 bg-primary/10 rounded-full">+18% vs semana anterior</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyStudy}>
              <XAxis dataKey="day" stroke="currentColor" className="text-muted-foreground" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(99,102,241,0.06)" }}
                contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="min" radius={[8, 8, 0, 0]}>
                {weeklyStudy.map((_, i) => (
                  <Cell key={i} fill={i % 2 ? "var(--accent)" : "var(--primary)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Recommendation */}
        <div className="bg-foreground text-background rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-40 bg-brand-gradient opacity-20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-7 rounded-lg bg-brand-gradient grid place-items-center">
                <Sparkles className="size-4 text-white" />
              </div>
              <h3 className="font-bold">IA recomenda</h3>
            </div>
            <div className="space-y-3">
              {recommendations.map((r) => (
                <div key={r.title} className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm font-bold mb-1">{r.title}</p>
                  <p className="text-xs text-background/60 mb-3">{r.reason}</p>
                  <Link to="/chat" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                    {r.action} <ArrowRight className="size-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subjects progress */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Matérias em andamento</h3>
            <BookOpen className="size-4 text-muted-foreground" />
          </div>
          <div className="space-y-5">
            {subjects.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold">{s.name}</span>
                  <span className="font-mono text-muted-foreground">{s.progress}% · {s.hours}h</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.progress}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-surface border border-border rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-6">Atividade recente</h3>
          <ul className="space-y-4">
            {recentActivity.map((a) => {
              const Icon = activityIcon[a.type as keyof typeof activityIcon];
              return (
                <li key={a.id} className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.subject} · {a.when}</p>
                  </div>
                  {"score" in a && a.score && (
                    <span className="text-xs font-mono text-emerald-500">{a.score}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}