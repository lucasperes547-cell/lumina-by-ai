import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateStructured } from "@/lib/ai.server";

const questionSchema = z.object({
  context: z.string().describe("Texto-base / situação-problema (pode ser vazio)"),
  question: z.string().describe("Enunciado / comando da questão"),
  options: z.array(z.string()).describe("Exatamente 5 alternativas, sem a letra no início"),
  answer: z.number().describe("Índice 0-4 da alternativa correta"),
  explanation: z.string().describe("Explicação detalhada de por que a correta é a correta e por que as outras estão erradas"),
});

export type GeneratedQuestion = z.infer<typeof questionSchema>;

export const generateExercises = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { subject: string; topic: string; difficulty: string; count: number }) =>
    z
      .object({
        subject: z.string().min(1).max(60),
        topic: z.string().min(2).max(200),
        difficulty: z.string().min(1).max(20),
        count: z.number().int().min(1).max(15),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const schema = z.object({ questions: z.array(questionSchema) });
    const out = await generateStructured({
      schema,
      system:
        "Você é um elaborador de questões do ENEM e de vestibulares brasileiros. Escreva em português do Brasil. Crie questões inéditas, contextualizadas (texto-base, situação do cotidiano, gráfico descrito em texto, trecho literário etc.), com comando claro e 5 alternativas plausíveis (A a E), apenas uma correta. Todas as questões DEVEM ser estritamente da matéria e do assunto pedidos — nunca de outra matéria. Varie a posição da alternativa correta. Use LaTeX entre $...$ para fórmulas quando necessário.",
      prompt: `Matéria: ${data.subject}\nAssunto específico: ${data.topic}\nDificuldade: ${data.difficulty}\nQuantidade: exatamente ${data.count} questões.\n\nGere exatamente ${data.count} questões no estilo ENEM sobre "${data.topic}" dentro de ${data.subject}.`,
    });
    const questions = out.questions
      .filter((q) => q.options.length >= 4 && q.answer >= 0 && q.answer < q.options.length)
      .slice(0, data.count);
    if (questions.length === 0) throw new Error("A IA não conseguiu gerar questões. Tente novamente.");
    return { questions };
  });

const planSchema = z.object({
  summary: z.string(),
  days: z.array(
    z.object({
      day: z.string().describe("Seg, Ter, Qua, Qui, Sex, Sáb ou Dom"),
      blocks: z.array(
        z.object({
          time: z.string().describe("ex: 19:00 – 20:00"),
          subject: z.string(),
          topic: z.string(),
        }),
      ),
    }),
  ),
});

export type StudyPlan = z.infer<typeof planSchema>;

export const generateStudyPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: p, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error || !p) throw new Error("Perfil não encontrado.");
    const plan = await generateStructured({
      schema: planSchema,
      system:
        "Você é um coordenador pedagógico especialista em ENEM e vestibulares. Monte cronogramas semanais realistas, em português do Brasil, priorizando as dificuldades do aluno, incluindo revisões e respeitando o tempo disponível. Retorne os 7 dias (Seg a Dom); dias sem estudo têm blocks vazio.",
      prompt: `Perfil do aluno:\n- Série: ${p.grade ?? "-"}\n- Objetivo: ${p.goal ?? "-"}\n- Prova foco: ${p.exam ?? "-"}\n- Tempo até a prova: ${p.exam_date ?? "-"}\n- Matérias fortes: ${p.strong_subjects.join(", ") || "-"}\n- Dificuldades: ${p.weak_subjects.join(", ") || "-"}\n- Horas por dia: ${p.hours_per_day ?? "-"}\n- Dias disponíveis: ${p.study_days.join(", ") || "todos"}\n\nCrie o plano semanal com tópicos específicos de cada matéria e um resumo curto da estratégia.`,
    });
    await supabase.from("profiles").update({ study_plan: plan, updated_at: new Date().toISOString() }).eq("id", userId);
    return plan;
  });
