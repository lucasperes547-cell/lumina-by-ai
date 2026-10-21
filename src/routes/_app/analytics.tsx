import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { Target, BookOpen, Flame, LineChart as ChartIcon } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { useAttempts, attemptStats } from "@/lib/auth";
export const Route = createFileRoute("/_app/analytics")({
  head: () => pageHead('Seu desempenho', 'Resultados reais dos seus exercícios na Lumina AI.'),component: AnalyticsPage});
function AnalyticsPage() {
 const {data:attempts=[],isError}=useAttempts(); const stats=attemptStats(attempts);
 return <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto"><PageHeader title="Analytics" subtitle="Resultados dos exercícios que você concluiu."/>{isError && <p role="alert" className="text-destructive">Não foi possível carregar seus resultados.</p>}{!attempts.length ? <EmptyState icon={ChartIcon} title="Sem estatísticas ainda" description="Nenhum exercício concluído."/> : <><div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{[{icon:Target,label:"Questões respondidas",value:stats.total},{icon:Target,label:"Taxa de acerto",value:`${stats.accuracy}%`},{icon:BookOpen,label:"Sessões",value:stats.sessions},{icon:Flame,label:"Sequência",value:`${stats.streak} dias`}].map(s => <div key={s.label} className="bg-surface border border-border rounded-2xl p-5"><s.icon className="size-5 text-primary mb-3"/><p className="text-2xl font-extrabold">{s.value}</p><p className="text-xs text-muted-foreground mt-1">{s.label}</p></div>)}</div><div className="grid lg:grid-cols-2 gap-6"><section><h3 className="font-bold text-lg mb-4">Acertos por matéria</h3><ResponsiveContainer width="100%" height={260}><BarChart data={stats.subjects}><XAxis dataKey="name" fontSize={11}/><YAxis domain={[0,100]} fontSize={11}/><Tooltip/><Bar dataKey="pct" name="Acertos (%)" fill="var(--primary)" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></section><section><h3 className="font-bold text-lg mb-4">Histórico de exercícios</h3><div className="space-y-4">{attempts.map(a => <div key={a.id} className="border-b border-border pb-3"><p className="font-semibold text-sm">{a.subject} · {a.topic}</p><p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString("pt-BR")} · {a.correct}/{a.total} acertos</p></div>)}</div></section></div></>}</div>;
}
