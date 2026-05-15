import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Trophy, Clock, Target, TrendingUp, TrendingDown } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { PageHeader } from "@/components/app/PageHeader";
import { userProfile, subjects, badges } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const radarData = subjects.map((s) => ({ subject: s.name, value: s.progress }));
  const strong = [...subjects].sort((a, b) => b.progress - a.progress).slice(0, 2);
  const weak = [...subjects].sort((a, b) => a.progress - b.progress).slice(0, 2);

  return (
    <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
      <PageHeader title="Seu perfil" subtitle="Acompanhe sua evolução, conquistas e onde você pode melhorar." />

      {/* Profile card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-foreground text-background rounded-3xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-64 bg-brand-gradient opacity-30 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="size-20 rounded-2xl bg-brand-gradient grid place-items-center text-2xl font-extrabold shadow-xl">
            MS
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold">{userProfile.name}</h2>
            <p className="text-background/60">{userProfile.email} · {userProfile.level}</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-background/50 font-mono uppercase">Sequência</p>
              <p className="text-xl font-bold flex items-center gap-1"><Flame className="size-4 text-orange-400" />{userProfile.streak}d</p>
            </div>
            <div>
              <p className="text-xs text-background/50 font-mono uppercase">Acertos</p>
              <p className="text-xl font-bold">{userProfile.accuracy}%</p>
            </div>
            <div>
              <p className="text-xs text-background/50 font-mono uppercase">Rank</p>
              <p className="text-xl font-bold">{userProfile.rank}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="space-y-4">
          {[
            { icon: Clock, label: "Horas totais", value: `${userProfile.totalHours}h`, color: "text-primary", bg: "bg-primary/10" },
            { icon: Target, label: "Questões respondidas", value: userProfile.questionsAnswered.toLocaleString("pt-BR"), color: "text-accent", bg: "bg-accent/10" },
            { icon: Trophy, label: "Conquistas", value: `${badges.filter((b) => b.earned).length}/${badges.length}`, color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className={`size-12 ${s.bg} rounded-xl grid place-items-center`}>
                <s.icon className={`size-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Radar */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-2">Mapa de domínio</h3>
          <p className="text-xs text-muted-foreground mb-4">Seu desempenho relativo em cada área</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
              <Radar dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Strong / Weak */}
        <div className="bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="size-4 text-emerald-500" />
            <h3 className="font-bold">Pontos fortes</h3>
          </div>
          <ul className="space-y-3">
            {strong.map((s) => (
              <li key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <span className="font-semibold text-sm">{s.name}</span>
                <span className="text-xs font-mono text-emerald-600">{s.progress}%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="size-4 text-rose-500" />
            <h3 className="font-bold">Dificuldades</h3>
          </div>
          <ul className="space-y-3">
            {weak.map((s) => (
              <li key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/15">
                <span className="font-semibold text-sm">{s.name}</span>
                <span className="text-xs font-mono text-rose-600">{s.progress}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Badges */}
        <div className="bg-surface border border-border rounded-3xl p-6">
          <h3 className="font-bold mb-4">Conquistas</h3>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((b) => (
              <div
                key={b.name}
                className={`aspect-square rounded-2xl border grid place-items-center text-center p-2 ${
                  b.earned ? "bg-brand-gradient text-white border-transparent shadow-md shadow-primary/15" : "bg-surface-2 border-border opacity-40"
                }`}
              >
                <span className="text-2xl">{b.icon}</span>
                <span className="text-[9px] font-semibold mt-1 leading-tight">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}