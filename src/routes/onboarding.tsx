import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const steps = [
  { key: "grade", title: "Em que série você está?", options: ["1º ano EM", "2º ano EM", "3º ano EM", "Cursinho", "Já formado"] },
  { key: "goal", title: "Qual seu principal objetivo?", options: ["Passar no ENEM", "Vestibular específico", "Melhorar notas", "Concurso técnico", "Aprender por conta"] },
  { key: "exam", title: "Qual vestibular você foca?", options: ["ENEM", "FUVEST", "UNICAMP", "UNESP", "ITA", "IME", "Outro"] },
  { key: "date", title: "Quando é sua prova?", options: ["< 3 meses", "3 a 6 meses", "6 a 12 meses", "Mais de 1 ano"] },
  { key: "strong", title: "Quais matérias você domina mais?", options: ["Matemática", "Português", "Física", "Química", "Biologia", "História", "Geografia"], multi: true },
  { key: "weak", title: "Quais são suas maiores dificuldades?", options: ["Matemática", "Português", "Física", "Química", "Biologia", "História", "Geografia"], multi: true },
  { key: "hours", title: "Horas disponíveis por dia?", options: ["1 a 2h", "2 a 4h", "4 a 6h", "Mais de 6h"] },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

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

  const next = () => {
    if (!canNext) return;
    if (isLast) {
      setGenerating(true);
      setTimeout(() => {
        toast.success("Perfil criado! Bem-vindo à Lumina.");
        navigate({ to: "/dashboard" });
      }, 1600);
    } else {
      setStep(step + 1);
    }
  };

  const progress = ((step + 1) / steps.length) * 100;

  if (generating) {
    return (
      <div className="min-h-screen grid place-items-center gradient-mesh px-6">
        <div className="text-center max-w-md">
          <div className="size-20 mx-auto mb-6 bg-brand-gradient rounded-3xl grid place-items-center shadow-2xl shadow-primary/30 animate-pulse">
            <Sparkles className="size-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Criando seu perfil de aprendizagem...</h2>
          <p className="text-muted-foreground">A IA está analisando suas respostas e montando seu plano personalizado.</p>
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

              <div className="grid sm:grid-cols-2 gap-3">
                {current.options.map((opt) => {
                  const selected = current.multi ? Array.isArray(value) && value.includes(opt) : value === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => select(opt)}
                      className={`text-left p-4 rounded-2xl border-2 font-semibold text-sm transition-all flex items-center justify-between ${
                        selected ? "border-primary bg-primary/5 text-primary" : "border-border bg-surface hover:border-primary/30"
                      }`}
                    >
                      {opt}
                      {selected && <Check className="size-4" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center mt-10">
                <button
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowLeft className="size-4" /> Voltar
                </button>
                <button
                  onClick={next}
                  disabled={!canNext}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  {isLast ? "Criar meu plano" : "Continuar"} <ArrowRight className="size-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}