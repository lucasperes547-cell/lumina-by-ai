import { z } from "zod";
export const subjectNames = ["Matemática", "Português", "Física", "Química", "Biologia", "História", "Geografia"] as const;
export const exerciseInput = z.object({ subject: z.enum(subjectNames), topic: z.string().trim().min(2).max(200), difficulty: z.enum(["Fácil", "Médio", "Difícil"]), count: z.number().int().min(1).max(15) });
export const questionSchema = z.object({ context: z.string(), question: z.string(), options: z.array(z.string()), answer: z.number(), explanation: z.string() });
export type GeneratedQuestion = z.infer<typeof questionSchema>;
export function validateQuestions(questions: GeneratedQuestion[], count: number) {
  if (questions.length !== count) throw new Error("A IA não retornou a quantidade solicitada. Nenhuma lista incompleta foi iniciada.");
  if (questions.some(q => q.options.length !== 5 || !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 4 || !q.question.trim() || !q.explanation.trim() || q.options.some(o => !o.trim()))) throw new Error("A IA retornou uma questão inválida. Tente uma nova geração.");
  if (new Set(questions.map(q => q.question.trim())).size !== count) throw new Error("A IA repetiu questões. Tente uma nova geração.");
  return questions;
}
export const materialSchema = z.object({ summary: z.string(), topics: z.array(z.string()).min(1).max(12), flashcards: z.array(z.object({ q: z.string(), a: z.string() })).min(1).max(12) });
export type MaterialResult = z.infer<typeof materialSchema>;
export const planSchema = z.object({ summary: z.string(), days: z.array(z.object({ day: z.string(), blocks: z.array(z.object({ time: z.string(), subject: z.string(), topic: z.string() })) })) });
export type StudyPlan = z.infer<typeof planSchema>;
export const studyDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
export const onboardingSchema = z.object({ grade: z.string().min(1).max(60), goal: z.string().min(1).max(100), exam: z.string().min(1).max(60), exam_date: z.string().min(1).max(60), strong_subjects: z.array(z.enum(subjectNames)), weak_subjects: z.array(z.enum(subjectNames)), hours_per_day: z.string().min(1).max(60), study_days: z.array(z.enum(["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"])).min(1), study_start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/) });
export type OnboardingInput = z.infer<typeof onboardingSchema>;
