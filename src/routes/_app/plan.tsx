import { pageHead } from "@/lib/page-head";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CalendarDays } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/app/PageHeader";
import { useProfile } from "@/lib/auth";
import { generateStudyPlan } from "@/lib/study.functions";
import { planSchema } from "@/lib/study-validation";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/_app/plan")({
  head: () => pageHead('Plano de estudos', 'Cronograma personalizado para sua disponibilidade na Lumina AI.'), component: PlanPage });
function PlanPage() {
  const { data: profile } = useProfile(); const qc = useQueryClient(); const generate = useServerFn(generateStudyPlan);
  const [loading,setLoading] = useState(false); const [error,setError] = useState("");
  const parsed = planSchema.safeParse(profile?.study_plan); const plan = parsed.success ? parsed.data : null;
  const regenerate = async () => { if(loading) return; setLoading(true);setError(""); try { await generate(); await qc.invalidateQueries({queryKey:["profile"]}); } catch(e) {setError(e instanceof Error ? e.message : "Não foi possível gerar.");} finally {setLoading(false);} };
  const action = <Button onClick={regenerate} disabled={loading} className="h-auto py-3 rounded-xl"><Sparkles/>{loading ? "Gerando…" : plan ? "Regenerar" : "Gerar plano com IA"}</Button>;
  return <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto"><PageHeader title="Plano de Estudos" subtitle="Cronograma baseado nos seus objetivos e disponibilidade." action={action}/>
    {error && <p role="alert" className="text-destructive text-sm mb-5">{error}</p>}
    <div className="grid lg:grid-cols-4 gap-6 mb-8">{[["Prova alvo",profile?.exam],["Horas/dia",profile?.hours_per_day],["Dias disponíveis",profile?.study_days.join(", ")],["Início",profile?.study_start]].map(([label,value]) => <div key={label} className="bg-surface border border-border rounded-2xl p-5"><p className="text-xs font-mono uppercase text-muted-foreground mb-2">{label}</p><p className="font-bold">{value || "Não informado"}</p></div>)}</div>
    <Button asChild variant="link" className="mb-4"><Link to="/onboarding">Editar disponibilidade</Link></Button>
    {!plan && <EmptyState icon={CalendarDays} title="Seu plano ainda não foi gerado" description="Suas preferências estão salvas." action={action}/>}
    {plan && <><p className="text-sm text-muted-foreground mb-6">{plan.summary}</p><motion.div initial={{ y:12}} animate={{opacity:1,y:0}} className="grid md:grid-cols-2 lg:grid-cols-7 gap-3">{plan.days.map(d => <div key={d.day} className="bg-surface border border-border rounded-2xl p-4 min-h-[200px]"><div className="flex items-center justify-between mb-3"><h4 className="text-sm font-bold">{d.day}</h4><CalendarDays className="size-3.5 text-muted-foreground"/></div><div className="space-y-2">{!d.blocks.length && <p className="text-xs text-muted-foreground text-center mt-6">Descanso 🌿</p>}{d.blocks.map((b,i) => <div key={i} className="p-2.5 rounded-lg border-l-2 border-primary bg-primary/5"><p className="text-[10px] font-mono text-muted-foreground">{b.time}</p><p className="text-xs font-bold mt-0.5">{b.subject}</p><p className="text-[11px] text-muted-foreground">{b.topic}</p></div>)}</div></div>)}</motion.div></>}
  </div>;
}
