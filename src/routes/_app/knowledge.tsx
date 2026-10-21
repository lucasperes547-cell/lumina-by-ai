import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Network } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { useAttempts, attemptStats } from "@/lib/auth";
export const Route = createFileRoute("/_app/knowledge")({
  head: () => pageHead('Mapa de conhecimento', 'Resultados por matéria e tópico estudado na Lumina AI.'),component: KnowledgePage});
function KnowledgePage() {
 const {data:attempts=[]}=useAttempts(); const stats=attemptStats(attempts); const [selected,setSelected]=useState(""); const active=selected || stats.subjects[0]?.name;
 const topics = new Map<string,{correct:number,total:number}>(); for(const a of attempts.filter(a=>a.subject===active)){const value=topics.get(a.topic)||{correct:0,total:0};value.correct+=a.correct;value.total+=a.total;topics.set(a.topic,value);}
 return <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto"><PageHeader title="Mapa de Conhecimento" subtitle="Seu desempenho por matéria e assunto nos exercícios concluídos."/>{!attempts.length ? <EmptyState icon={Network} title="Nenhum dado de domínio ainda" description="Você ainda não respondeu exercícios."/> : <><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">{stats.subjects.map(s=><Button key={s.name} variant="outline" onClick={()=>setSelected(s.name)} className={`h-auto whitespace-normal text-left p-5 rounded-2xl border-2 flex-col items-stretch ${active===s.name?'border-primary':'border-border'}`}><span className="font-bold">{s.name}</span><span className="text-3xl font-extrabold">{s.pct}%</span><span className="text-xs text-muted-foreground">{s.correct} de {s.total} acertos</span></Button>)}</div><section><h3 className="text-xl font-extrabold mb-6">{active}</h3><div className="grid md:grid-cols-2 gap-3">{[...topics].map(([name,t])=><div key={name} className="p-4 rounded-2xl border border-border bg-surface-2"><p className="font-semibold text-sm mb-2">{name}</p><p className="text-xs text-muted-foreground">{t.correct} de {t.total} acertos ({Math.round(t.correct/t.total*100)}%)</p></div>)}</div></section></>}</div>;
}
