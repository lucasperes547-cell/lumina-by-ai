import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Flame, Zap, Star, CheckCircle2, Circle } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { gamification, dailyMissions, achievements } from "@/lib/mock-data";
import { useDemoMode } from "@/lib/demo-mode";
import { EmptyState } from "@/components/app/EmptyState";

export const Route = createFileRoute("/_app/achievements")({
  component: AchievementsPage,
});

const rarityCls: Record<string, string> = {
  Comum: "from-slate-400 to-slate-600",
  Raro: "from-blue-400 to-indigo-600",
  Épico: "from-purple-500 to-fuchsia-600",
  Lendário: "from-amber-400 to-orange-600",
};

function AchievementsPage() {
  const { demo } = useDemoMode();
  const pct = Math.round((gamification.xp / (gamification.xp + gamification.xpToNext)) * 100);
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      <PageHeader title="Conquistas & XP" subtitle="Suba de nível, complete missões diárias e colecione medalhas." />

      {!demo && (
        <EmptyState
          icon={Trophy}
          title="Comece sua jornada para colecionar conquistas"
          description="Você ainda não desbloqueou nenhuma medalha. Complete missões diárias e suba de nível para ver seu progresso aqui."
        />
      )}

      {demo && (
      <>
      {/* Level card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-foreground text-background rounded-3xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-72 bg-brand-gradient opacity-25 rounded-full blur-3xl" />
        <div className="relative grid md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-5">
            <div className="size-24 rounded-3xl bg-brand-gradient grid place-items-center shadow-xl shadow-primary/30 relative">
              <span className="text-3xl font-black">{gamification.level}</span>
              <Star className="absolute -top-2 -right-2 size-6 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-background/60">Nível {gamification.level}</p>
              <h2 className="text-2xl font-extrabold">{gamification.levelName}</h2>
              <p className="text-sm text-background/70 mt-1">#{gamification.rankPosition} no ranking semanal</p>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="flex justify-between text-xs font-mono text-background/70 mb-2">
              <span>{gamification.xp.toLocaleString("pt-BR")} XP</span>
              <span>{(gamification.xp + gamification.xpToNext).toLocaleString("pt-BR")} XP</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-brand-gradient rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5 text-center">
              <div><p className="text-xl font-extrabold">{gamification.weekXp}</p><p className="text-[10px] text-background/60 font-mono uppercase">XP esta semana</p></div>
              <div><p className="text-xl font-extrabold flex items-center justify-center gap-1"><Flame className="size-4 text-orange-400" />12d</p><p className="text-[10px] text-background/60 font-mono uppercase">Sequência</p></div>
              <div><p className="text-xl font-extrabold">{earnedCount}/{achievements.length}</p><p className="text-[10px] text-background/60 font-mono uppercase">Medalhas</p></div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Missions */}
        <div className="lg:col-span-1 bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="size-5 text-amber-500" />
            <h3 className="font-bold text-lg">Missões diárias</h3>
          </div>
          <ul className="space-y-3">
            {dailyMissions.map((m) => {
              const pctM = Math.min(100, Math.round((m.progress / m.goal) * 100));
              return (
                <li key={m.id} className={`p-4 rounded-2xl border transition-all ${m.done ? "bg-emerald-500/5 border-emerald-500/20" : "bg-surface-2 border-border"}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      {m.done ? <CheckCircle2 className="size-4 text-emerald-500" /> : <Circle className="size-4 text-muted-foreground" />}
                      {m.title}
                    </p>
                    <span className="text-[10px] font-mono text-primary shrink-0">+{m.xp} XP</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${m.done ? "bg-emerald-500" : "bg-primary"}`} style={{ width: `${pctM}%` }} />
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground mt-1">{m.progress}/{m.goal}</p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Achievements */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="size-5 text-amber-500" />
            <h3 className="font-bold text-lg">Medalhas</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {achievements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -3 }}
                className={`relative p-4 rounded-2xl border text-center overflow-hidden ${
                  a.earned ? "border-transparent text-white" : "border-border bg-surface-2 opacity-50 grayscale"
                }`}
              >
                {a.earned && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${rarityCls[a.rarity]}`} />
                )}
                <div className="relative">
                  <div className="text-3xl mb-1">{a.icon}</div>
                  <p className="text-xs font-bold leading-tight">{a.name}</p>
                  <p className={`text-[10px] mt-1 leading-tight ${a.earned ? "text-white/80" : "text-muted-foreground"}`}>{a.desc}</p>
                  <span className={`mt-2 inline-block text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded ${a.earned ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>{a.rarity}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}