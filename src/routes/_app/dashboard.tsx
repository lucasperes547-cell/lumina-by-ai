import { pageHead } from "@/lib/page-head";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Target, Flame, BookOpen, Rocket, ArrowRight } from "lucide-react";
import { useProfile, useAttempts, attemptStats } from "@/lib/auth";
import { todayLongLabel } from "@/lib/dates";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/_app/dashboard")({
  head: () => pageHead('Seu painel de estudos', 'Acompanhe seus exercícios e objetivos na Lumina AI.'), component: Dashboard });
function Dashboard() {
  const { data: profile } = useProfile();
  const { data: attempts = [], isError } = useAttempts();
  const stats = attemptStats(attempts);
  return <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
      <p className="font-mono text-xs tracking-widest uppercase text-primary mb-2">{todayLongLabel()}</p>
      <h1 className="text-4xl md:text-5xl font-extrabold">Olá{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋</h1>
      <p className="text-muted-foreground mt-2 text-lg">{profile?.goal || "Vamos começar seus estudos hoje?"}</p>
    </motion.div>
    {isError && <p role="alert" className="text-destructive mb-4">Não foi possível carregar seu progresso.</p>}
    {!attempts.length && <EmptyState icon={Rocket} title="Seu progresso começa aqui" description="Você ainda não respondeu exercícios." className="mb-8" action={<Button asChild><Link to="/exercises">Gerar exercícios <ArrowRight /></Link></Button>} />}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{[
      { icon: Target, label: "Questões respondidas", value: stats.total },
      { icon: Target, label: "Acertos", value: `${stats.accuracy}%` },
      { icon: Flame, label: "Sequência", value: `${stats.streak} dias` },
      { icon: BookOpen, label: "Sessões de exercícios", value: stats.sessions },
    ].map(s => <div key={s.label} className="bg-surface border border-border rounded-2xl p-5"><div className="size-10 rounded-xl bg-primary/10 grid place-items-center mb-3"><s.icon className="size-5 text-primary" /></div><p className="text-2xl font-extrabold">{s.value}</p><p className="text-xs text-muted-foreground mt-1">{s.label}</p></div>)}</div>
    <div className="grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 space-y-5"><h3 className="font-bold text-lg">O que estudar agora</h3>{profile?.weak_subjects.map(s => <Button asChild variant="outline" key={s} className="mr-2 h-auto py-3"><Link to="/exercises">{s}<ArrowRight /></Link></Button>)}{!profile?.weak_subjects.length && <p className="text-sm text-muted-foreground">Nenhuma dificuldade informada.</p>}<Button asChild variant="link"><Link to="/plan">Ver meu plano de estudos</Link></Button></section>
      <section><h3 className="font-bold text-lg mb-6">Atividade recente</h3><ul className="space-y-4">{attempts.slice(0,5).map(a => <li key={a.id} className="flex items-start gap-3"><Target className="size-4 text-primary shrink-0 mt-1"/><div className="min-w-0"><p className="text-sm font-semibold">{a.topic}</p><p className="text-xs text-muted-foreground">{a.subject} · {a.correct}/{a.total} · {new Date(a.created_at).toLocaleDateString("pt-BR")}</p></div></li>)}</ul>{!attempts.length && <p className="text-sm text-muted-foreground">Nenhuma atividade ainda.</p>}</section>
    </div>
  </div>;
}
