import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Clock, Target, Award, LineChart as LineChartIcon } from "lucide-react";
import { Line, LineChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { PageHeader } from "@/components/app/PageHeader";
import { monthlyProgress, accuracyTrend, weeklyStudy, subjects } from "@/lib/mock-data";
import { useDemoMode } from "@/lib/demo-mode";
import { EmptyState } from "@/components/app/EmptyState";

export const Route = createFileRoute("/_app/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { demo } = useDemoMode();
  return (
    <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      <PageHeader title="Analytics" subtitle="Métricas detalhadas e insights gerados pela IA sobre sua evolução." />

      {!demo && (
        <EmptyState
          icon={LineChartIcon}
          title="Sem estatísticas ainda"
          description="Conforme você estudar, gráficos e insights da IA aparecerão aqui automaticamente."
        />
      )}

      {demo && (
      <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Clock, label: "Tempo estudado", value: "88h", trend: "+18%", color: "text-primary", bg: "bg-primary/10" },
          { icon: Target, label: "Taxa de acerto", value: "78%", trend: "+6%", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { icon: Award, label: "Metas concluídas", value: "24/30", trend: "80%", color: "text-amber-500", bg: "bg-amber-500/10" },
          { icon: TrendingUp, label: "Crescimento", value: "+22%", trend: "vs mês ant.", color: "text-accent", bg: "bg-accent/10" },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className={`size-10 rounded-xl ${s.bg} grid place-items-center mb-3`}>
              <s.icon className={`size-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            <p className="text-[10px] text-emerald-500 font-mono mt-0.5">{s.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface border border-border rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-1">Evolução mensal</h3>
          <p className="text-xs text-muted-foreground mb-4">Horas estudadas vs taxa de acerto</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyProgress}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke="currentColor" className="text-muted-foreground" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="hours" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="accuracy" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-1">Acertos diários</h3>
          <p className="text-xs text-muted-foreground mb-4">Esta semana · em %</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={accuracyTrend}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="currentColor" className="text-muted-foreground" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="acc" radius={[8, 8, 0, 0]}>
                {accuracyTrend.map((_, i) => <Cell key={i} fill={i % 2 ? "var(--accent)" : "var(--primary)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-1">Tempo por dia</h3>
          <p className="text-xs text-muted-foreground mb-4">Minutos estudados · últimos 7 dias</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weeklyStudy}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="currentColor" className="text-muted-foreground" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="min" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-4">Domínio por matéria</h3>
          <div className="space-y-3">
            {subjects.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold">{s.name}</span>
                  <span className="font-mono text-muted-foreground">{s.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-foreground text-background rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-64 bg-brand-gradient opacity-25 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-5">
            <div className="size-8 rounded-xl bg-brand-gradient grid place-items-center"><Sparkles className="size-4 text-white" /></div>
            <h3 className="font-bold text-lg">Insights da IA</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Melhor horário", text: "Você acerta 23% mais entre 9h e 11h. Concentre tópicos difíceis nesse período." },
              { title: "Padrão de queda", text: "Aos domingos seu rendimento cai 18%. Considere uma sessão leve de revisão." },
              { title: "Foco recomendado", text: "Priorize Química e Eletromagnetismo nas próximas sessões — são suas maiores margens de ganho." },
            ].map((i) => (
              <div key={i.title} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">{i.title}</p>
                <p className="text-sm leading-relaxed">{i.text}</p>
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