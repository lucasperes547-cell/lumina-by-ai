import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { saveOnboarding } from "@/lib/study.functions";
import { onboardingSchema } from "@/lib/study-validation";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  beforeLoad: async () => { if (!(await supabase.auth.getUser()).data.user) throw redirect({ to: "/login" }); },
  component: Onboarding,
});

const steps = [
  { key: "grade", title: "Em que série você está?", options: ["1º ano EM", "2º ano EM", "3º ano EM", "Cursinho", "Já formado"] },
  { key: "goal", title: "Qual seu principal objetivo?", options: ["Passar no ENEM", "Vestibular específico", "Melhorar notas", "Concurso técnico", "Aprender por conta"] },
  { key: "exam", title: "Qual vestibular você foca?", options: ["ENEM", "FUVEST", "UNICAMP", "UNESP", "Outro"] },
  { key: "date", title: "Quando é sua prova?", options: ["< 3 meses", "3 a 6 meses", "6 a 12 meses", "Mais de 1 ano"] },
  { key: "strong", title: "Quais matérias você domina mais?", options: ["Matemática", "Português", "Física", "Química", "Biologia", "História", "Geografia"], multi: true },
  { key: "weak", title: "Quais são suas maiores dificuldades?", options: ["Matemática", "Português", "Física", "Química", "Biologia", "História", "Geografia"], multi: true },
  { key: "hours", title: "Horas disponíveis por dia?", options: ["1 a 2h", "2 a 4h", "4 a 6h", "Mais de 6h"] },
  { key: "days", title: "Em quais dias você pode estudar?", options: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"], multi: true },
  { key: "start", title: "A que horas você começa a estudar?", options: [] },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();
  const save = useServerFn(saveOnboarding);
  const qc = useQueryClient();

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const value = answers[current.key];
  const canNext = current.multi ? Array.isArray(value) && value.length > 0 : !!value;

  const select = (opt: string) => {
    if (current.multi) {
      const arr = Array.isArray(value) ? value : [];
      setAnswers({ ...answers, [current.key]: arr.includes(opt) ? arr.filter((o) => o !== opt) : [...arr, opt] });
    } else {
      setAnswers({ ...answers, [current.key]: opt });
    }
  };

  const next = async () => {
    if (!canNext || generating) return;
    if (!isLast) { setStep(step + 1); return; }
    setGenerating(true);
    try {
      const payload = onboardingSchema.parse({ grade: answers.grade, goal: answers.goal, exam: answers.exam, exam_date: answers.date, strong_subjects: answers.strong, weak_subjects: answers.weak, hours_per_day: answers.hours, study_days: answers.days, study_start: answers.start });
      await save({ data: payload });
      await qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Preferências salvas. Seu aprendizado começa agora.");
      await navigate({ to: "/dashboard", replace: true });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível salvar."); setGenerating(false); }
  };

  const progress = ((step + 1) / steps.length) * 100;

  if (generating) {
    return (
      <div className="min-h-screen grid place-items-center gradient-mesh px-6">
        <div className="text-center max-w-md">
          <div className="size-20 mx-auto mb-6 bg-brand-gradient rounded-3xl grid place-items-center shadow-2xl shadow-primary/30 animate-pulse">
            <Sparkles className="size-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Salvando suas preferências...</h2>
          <p className="text-muted-foreground">Seus objetivos e horários serão usados no seu plano de estudos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 lg:px-10 h-16 flex items-center justify-between border-b border-border">
        <Logo />
        <span className="text-xs font-mono text-muted-foreground">Passo {step + 1} de {steps.length}</span>
      </header>

      <div className="h-1 bg-muted">
        <motion.div className="h-full bg-brand-gradient" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>

      <main className="flex-1 grid place-items-center px-6 py-10">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">Onboarding · Lumina AI</p>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{current.title}</h1>
              {current.multi && <p className="text-muted-foreground mb-6">Selecione todas que se aplicam</p>}
              {!current.multi && <p className="text-muted-foreground mb-6">Escolha uma opção</p>}

              {current.key === "start" && <label className="block mb-4">Horário de início<input aria-label="Horário de início" type="time" value={typeof value === "string" ? value : ""} onChange={e => select(e.target.value)} className="block mt-2 p-4 bg-surface border border-border rounded-2xl" /></label>}
              <div className="grid sm:grid-cols-2 gap-3">
                {current.options.map((opt) => {
                  const selected = current.multi ? Array.isArray(value) && value.includes(opt) : value === opt;
                  return (
                    <Button
                      key={opt}
                      onClick={() => select(opt)}
                      className={`h-auto whitespace-normal text-left p-4 rounded-2xl border-2 font-semibold text-sm transition-all flex items-center justify-between ${
                        selected ? "border-primary bg-primary/5 text-primary" : "border-border bg-surface hover:border-primary/30"
                      }`}
                    >
                      {opt}
                      {selected && <Check className="size-4" />}
                    </Button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center mt-10">
                <Button
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowLeft className="size-4" /> Voltar
                </Button>
                <Button
                  onClick={next}
                  disabled={!canNext}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  {isLast ? "Salvar e começar" : "Continuar"} <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}