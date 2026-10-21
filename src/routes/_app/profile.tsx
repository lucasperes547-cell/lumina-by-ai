import { pageHead } from "@/lib/page-head";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Target, Flame, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { useUser, useProfile, useAttempts, attemptStats, initialsOf } from "@/lib/auth";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/_app/profile")({
  head: () => pageHead('Seu perfil', 'Preferências e progresso pessoal de aprendizado na Lumina AI.'), component: ProfilePage });
function ProfilePage() {
  const { data: user } = useUser(); const { data: profile } = useProfile(); const { data: attempts = [] } = useAttempts(); const stats = attemptStats(attempts);
  return <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
    <PageHeader title="Seu perfil" subtitle="Seus objetivos e seu progresso." action={<Button asChild variant="outline"><Link to="/onboarding">Editar preferências</Link></Button>} />
    <motion.div className="bg-foreground text-background rounded-3xl p-8 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6"><div className="size-20 rounded-2xl bg-brand-gradient grid place-items-center text-2xl font-extrabold">{initialsOf(profile?.full_name, user?.email)}</div><div className="flex-1 min-w-0"><h2 className="text-2xl font-extrabold break-words">{profile?.full_name || "Estudante"}</h2><p className="text-background/60 break-words">{user?.email}</p><p className="text-background/60">{profile?.grade}</p></div></div>
    </motion.div>
    <div className="grid lg:grid-cols-3 gap-6"><div className="space-y-4">{[{icon:Target,label:"Questões respondidas",value:stats.total},{icon:Target,label:"Acertos",value:`${stats.accuracy}%`},{icon:Flame,label:"Sequência atual",value:`${stats.streak} dias`}].map(s => <div key={s.label} className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4"><s.icon className="size-5 text-primary"/><div><p className="text-2xl font-extrabold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></div>)}</div>
    <section className="lg:col-span-2 space-y-6"><h3 className="font-bold text-lg">Preferências de estudo</h3><dl className="grid sm:grid-cols-2 gap-5">{[["Objetivo",profile?.goal],["Prova",profile?.exam],["Prazo",profile?.exam_date],["Disponibilidade",profile?.hours_per_day],["Dias",profile?.study_days.join(", ")],["Horário",profile?.study_start],["Pontos fortes",profile?.strong_subjects.join(", ")],["Dificuldades",profile?.weak_subjects.join(", ")]].map(([label,value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="font-semibold mt-1">{value || "Não informado"}</dd></div>)}</dl><h3 className="font-bold flex gap-2"><BookOpen className="size-4"/>Desempenho por matéria</h3>{stats.subjects.map(s => <p key={s.name} className="text-sm">{s.name}: {s.correct} de {s.total} ({s.pct}%)</p>)}{!stats.total && <p className="text-sm text-muted-foreground">Nenhum exercício respondido ainda.</p>}</section></div>
  </div>;
}
