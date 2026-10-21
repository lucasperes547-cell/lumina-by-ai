import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { subjects } from "@/lib/mock-data";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { generateExercises, saveAttempt } from "@/lib/study.functions";
import { exerciseInput, type GeneratedQuestion } from "@/lib/study-validation";
import { Button } from "@/components/ui/button";
import { MessageResponse } from "@/components/ai-elements/message";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/exercises")({
  head: () => pageHead('Exercícios estilo ENEM', 'Questões por matéria e assunto específico na Lumina AI.'),
  component: ExercisesPage,
});

type Phase = "config" | "loading" | "playing" | "done";

function ExercisesPage() {
  const generateFn = useServerFn(generateExercises);
  const saveFn = useServerFn(saveAttempt);
  const qc = useQueryClient();
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [topic, setTopic] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("config");
  const [subject, setSubject] = useState("Matemática");
  const [difficulty, setDifficulty] = useState("Médio");
  const [count, setCount] = useState(3);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const generate = async () => {
    const parsed = exerciseInput.safeParse({ subject, topic, difficulty, count });
    if (!parsed.success) { setError("Escolha uma matéria e escreva um assunto específico (2 a 200 caracteres)."); return; }
    setPhase("loading"); setError(""); setSaved(false);
    try {
      const result = await generateFn({ data: parsed.data });
      setQuestions(result.questions); setStep(0); setSelected(null); setAnswers([]); setPhase("playing");
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível gerar."); setPhase("config"); }
  };
  const submit = () => {
    const question = questions[step];
    if (selected === null || answers.length > step || !question) return;
    setAnswers([...answers, selected === question.answer]);
  };
  const persistResult = async () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      await saveFn({ data: { subject, topic, difficulty, total: questions.length, correct: answers.filter(Boolean).length } });
      setSaved(true); await qc.invalidateQueries({ queryKey: ["attempts"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível salvar."); }
    finally { setSaving(false); }
  };
  const next = () => {
    if (step + 1 >= questions.length) { setPhase("done"); void persistResult(); }
    else { setStep(step + 1); setSelected(null); }
  };

  const reset = () => { setPhase("config"); setAnswers([]); setStep(0); setSelected(null); };

  const q = questions[step];
  const correct = answers.filter(Boolean).length;

  return (
    <div className="px-6 lg:px-10 py-8 max-w-4xl mx-auto">
      <PageHeader title="Gerador de Exercícios" subtitle="Configure o simulado e a IA cria as questões para você." />

      {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
      {phase === "config" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface border border-border rounded-3xl p-8 space-y-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Matéria</p>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <Button
                  key={s.id}
                  onClick={() => setSubject(s.name)}
                  className={`h-auto px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    subject === s.name ? "bg-primary text-primary-foreground border-primary" : "bg-surface border-border hover:border-primary/30"
                  }`}
                >
                  {s.name}
                </Button>
              ))}
            </div>
          </div>

          <label className="block"><span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3 block">Assunto específico</span><input aria-label="Assunto específico" value={topic} onChange={e => setTopic(e.target.value)} maxLength={200} placeholder="Ex.: funções do segundo grau" className="w-full px-4 py-3 bg-surface border border-border rounded-xl outline-none focus:border-primary" /></label>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Dificuldade</p>
            <div className="flex gap-2">
              {["Fácil", "Médio", "Difícil"].map((d) => (
                <Button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`h-auto flex-1 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                    difficulty === d ? "bg-accent/10 text-accent border-accent/30" : "bg-surface border-border hover:border-accent/20"
                  }`}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-3">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Quantidade</p>
              <span className="text-sm font-bold text-primary">{count} questões</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              value={count}
              onChange={(e) => setCount(+e.target.value)}
              className="w-full accent-primary"
            />
          </div>

          <Button
            onClick={generate}
            className="h-auto w-full px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Sparkles className="size-4" />
            Gerar exercícios com IA
          </Button>
        </motion.div>
      )}

      {phase === "loading" && (
        <div className="bg-surface border border-border rounded-3xl p-16 text-center">
          <Sparkles className="size-10 text-primary mx-auto mb-4 animate-pulse" />
          <p className="font-semibold">Gerando questões personalizadas...</p>
          <p className="text-sm text-muted-foreground mt-1">{subject} · {difficulty} · {count} questões</p>
        </div>
      )}

      {phase === "playing" && q && (
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-muted-foreground">Questão {step + 1} de {count}</span>
            <div className="flex gap-1">
              {Array.from({ length: count }).map((_, i) => (
                <span key={i} className={`size-2 rounded-full ${i < answers.length ? (answers[i] ? "bg-primary" : "bg-destructive") : i === step ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-3xl p-8">
            <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">{subject} · {topic}</p>
            {q.context && <div className="text-sm mb-5"><MessageResponse>{q.context}</MessageResponse></div>}
            <div className="text-xl font-bold mb-6"><MessageResponse>{q.question}</MessageResponse></div>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const showResult = answers.length > step;
                const isCorrect = i === q.answer;
                let cls = "border-border hover:border-primary/30 bg-surface";
                if (showResult && isCorrect) cls = "border-primary bg-primary/5";
                else if (showResult && isSelected && !isCorrect) cls = "border-destructive bg-destructive/5";
                else if (isSelected) cls = "border-primary bg-primary/5";
                return (
                  <Button
                    key={i}
                    disabled={showResult}
                    onClick={() => setSelected(i)}
                    className={`h-auto whitespace-normal w-full text-left px-5 py-4 rounded-2xl border-2 font-medium text-sm transition-all flex items-center justify-between ${cls}`}
                  >
                    <span className="flex items-start gap-3 min-w-0"><span className="text-primary font-bold">{String.fromCharCode(65 + i)}</span><MessageResponse>{opt}</MessageResponse></span>
                    {showResult && isCorrect && <CheckCircle2 className="size-5 text-primary" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="size-5 text-destructive" />}
                  </Button>
                );
              })}
            </div>

            <AnimatePresence>
              {answers.length > step && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/15">
                  <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">Explicação</p>
                  <MessageResponse>{q.explanation}</MessageResponse>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {answers.length > step && <Button onClick={next} className="w-full h-auto py-4 rounded-2xl">{step + 1 === questions.length ? "Ver resultado" : "Próxima questão"}<ArrowRight /></Button>}
          {answers.length === step && (
            <Button
              onClick={submit}
              disabled={selected === null}
              className="h-auto w-full px-6 py-4 bg-foreground text-background rounded-2xl font-bold disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Confirmar resposta <ArrowRight className="size-4" />
            </Button>
          )}
        </motion.div>
      )}

      {phase === "done" && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-border rounded-3xl p-12 text-center">
          <div className="size-20 mx-auto bg-brand-gradient rounded-3xl grid place-items-center mb-6 shadow-xl shadow-primary/20">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Simulado concluído!</h2>
          <p className="text-muted-foreground mb-8">Você acertou <span className="text-primary font-bold">{correct} de {count}</span> questões ({Math.round((correct / count) * 100)}%)</p>
          <p role="status" className="text-sm text-muted-foreground mb-4">{saved ? "Resultado salvo no seu progresso." : saving ? "Salvando resultado…" : "Resultado não salvo."}</p>
          {!saved && !saving && <Button onClick={persistResult} variant="outline" className="mb-4">Salvar resultado</Button>}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Button onClick={() => { reset(); toast.success("Vamos lá!"); }} className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <RotateCcw className="size-4" /> Novo simulado
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}