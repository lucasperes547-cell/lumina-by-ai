export const subjects = [
  { id: "math", name: "Matemática", color: "#6366f1", progress: 72, hours: 18.5 },
  { id: "physics", name: "Física", color: "#a855f7", progress: 58, hours: 12.2 },
  { id: "chem", name: "Química", color: "#3b82f6", progress: 41, hours: 8.4 },
  { id: "bio", name: "Biologia", color: "#10b981", progress: 64, hours: 10.1 },
  { id: "hist", name: "História", color: "#f59e0b", progress: 35, hours: 5.6 },
  { id: "port", name: "Português", color: "#ef4444", progress: 81, hours: 14.0 },
];

export const weeklyStudy = [
  { day: "Seg", min: 95 },
  { day: "Ter", min: 120 },
  { day: "Qua", min: 60 },
  { day: "Qui", min: 145 },
  { day: "Sex", min: 80 },
  { day: "Sáb", min: 180 },
  { day: "Dom", min: 40 },
];

import { formatDayMonth, shiftDays } from "@/lib/dates";

export const recentActivity = [
  { id: 1, type: "exercise", title: "10 questões de Funções Quadráticas", subject: "Matemática", score: "8/10", when: "Hoje, 14:32" },
  { id: 2, type: "chat", title: "Explicação sobre Leis de Newton", subject: "Física", when: "Hoje, 11:05" },
  { id: 3, type: "pdf", title: "Resumo: Revolução Francesa", subject: "História", when: "Ontem" },
  { id: 4, type: "plan", title: "Plano semanal atualizado", subject: "Geral", when: "Ontem" },
];

export const recommendations = [
  { title: "Revisar Trigonometria", reason: "Você teve 2 erros consecutivos ontem", action: "Iniciar revisão" },
  { title: "Flashcards de Citologia", reason: "Última revisão há 5 dias", action: "Praticar agora" },
  { title: "Simulado de Português", reason: "Recomendado pela sua banca", action: "Começar" },
];

export const badges = [
  { name: "Sequência de 7 dias", icon: "🔥", earned: true },
  { name: "Primeira centena", icon: "💯", earned: true },
  { name: "Maratonista", icon: "🏃", earned: true },
  { name: "Mestre em Física", icon: "⚛️", earned: false },
  { name: "Leitor voraz", icon: "📚", earned: true },
  { name: "Top 1%", icon: "👑", earned: false },
];

export const studyPlanWeek = [
  { day: "Segunda", blocks: [
    { time: "09:00 — 10:30", subject: "Matemática", topic: "Logaritmos", color: "#6366f1" },
    { time: "14:00 — 15:00", subject: "Português", topic: "Interpretação de texto", color: "#ef4444" },
  ]},
  { day: "Terça", blocks: [
    { time: "09:00 — 10:00", subject: "Física", topic: "Cinemática", color: "#a855f7" },
    { time: "10:30 — 11:30", subject: "Química", topic: "Estequiometria", color: "#3b82f6" },
    { time: "15:00 — 16:00", subject: "Biologia", topic: "Genética", color: "#10b981" },
  ]},
  { day: "Quarta", blocks: [
    { time: "09:00 — 11:00", subject: "Matemática", topic: "Revisão geral", color: "#6366f1" },
  ]},
  { day: "Quinta", blocks: [
    { time: "09:00 — 10:30", subject: "História", topic: "Era Vargas", color: "#f59e0b" },
    { time: "14:00 — 15:30", subject: "Física", topic: "Leis de Newton", color: "#a855f7" },
  ]},
  { day: "Sexta", blocks: [
    { time: "09:00 — 10:00", subject: "Português", topic: "Redação", color: "#ef4444" },
    { time: "10:30 — 12:00", subject: "Química", topic: "Soluções", color: "#3b82f6" },
  ]},
  { day: "Sábado", blocks: [
    { time: "09:00 — 12:00", subject: "Simulado", topic: "Bloco completo", color: "#0f172a" },
  ]},
  { day: "Domingo", blocks: [] },
];

export const sampleQuestions = [
  {
    id: 1,
    subject: "Matemática",
    question: "Qual o valor de x na equação 2x + 5 = 17?",
    options: ["x = 4", "x = 6", "x = 8", "x = 11"],
    answer: 1,
    explanation: "Subtraindo 5 dos dois lados: 2x = 12. Dividindo por 2: x = 6.",
  },
  {
    id: 2,
    subject: "Matemática",
    question: "A função f(x) = x² - 4x + 3 possui raízes iguais a:",
    options: ["1 e 3", "-1 e -3", "2 e 4", "0 e 4"],
    answer: 0,
    explanation: "Aplicando Bhaskara: Δ = 16 - 12 = 4. x = (4 ± 2)/2, logo x = 1 ou x = 3.",
  },
  {
    id: 3,
    subject: "Matemática",
    question: "Quanto é log₂(32)?",
    options: ["4", "5", "6", "8"],
    answer: 1,
    explanation: "32 = 2⁵, portanto log₂(32) = 5.",
  },
];

export const chatHistory = [
  { id: "1", title: "Leis de Newton explicadas", when: "Hoje" },
  { id: "2", title: "Resumo: Revolução Francesa", when: "Hoje" },
  { id: "3", title: "Funções Quadráticas", when: "Ontem" },
  { id: "4", title: "Análise sintática", when: "2 dias" },
  { id: "5", title: "Citologia básica", when: "3 dias" },
  { id: "6", title: "Geometria espacial", when: "Semana passada" },
];

export const userProfile = {
  name: "Lucas",
  fullName: "Lucas Peres",
  initials: "LP",
  email: "lucas@lumina.ai",
  level: "Vestibulando",
  streak: 12,
  totalHours: 142.5,
  questionsAnswered: 1284,
  accuracy: 78,
  rank: "Top 8%",
};

// ---- Gamificação ----
export const gamification = {
  xp: 4820,
  xpToNext: 1180,
  level: 14,
  levelName: "Estrategista",
  weekXp: 640,
  rankPosition: 142,
};

export const dailyMissions = [
  { id: 1, title: "Estudar 60 minutos", progress: 42, goal: 60, xp: 50, done: false },
  { id: 2, title: "Resolver 10 questões", progress: 10, goal: 10, xp: 80, done: true },
  { id: 3, title: "Revisar 1 flashcard set", progress: 0, goal: 1, xp: 30, done: false },
  { id: 4, title: "Manter sequência diária", progress: 1, goal: 1, xp: 40, done: true },
];

export const achievements = [
  { id: "a1", name: "Primeiro Passo", icon: "🎯", desc: "Complete sua 1ª sessão", earned: true, rarity: "Comum" },
  { id: "a2", name: "Maratonista", icon: "🏃", desc: "Estude 4h em um único dia", earned: true, rarity: "Raro" },
  { id: "a3", name: "Centena", icon: "💯", desc: "Responda 100 questões", earned: true, rarity: "Comum" },
  { id: "a4", name: "Em Chamas", icon: "🔥", desc: "Sequência de 7 dias", earned: true, rarity: "Raro" },
  { id: "a5", name: "Mestre da Física", icon: "⚛️", desc: "85% de acerto em Física", earned: false, rarity: "Épico" },
  { id: "a6", name: "Leitor Voraz", icon: "📚", desc: "Leia 10 PDFs com a IA", earned: true, rarity: "Comum" },
  { id: "a7", name: "Top 1%", icon: "👑", desc: "Entre no top 1% do ranking", earned: false, rarity: "Lendário" },
  { id: "a8", name: "Mente Aberta", icon: "🧠", desc: "Use 5 matérias diferentes", earned: true, rarity: "Comum" },
  { id: "a9", name: "Imparável", icon: "⚡", desc: "Sequência de 30 dias", earned: false, rarity: "Épico" },
];

// ---- Mapa de Conhecimento ----
export const knowledgeMap = [
  {
    subject: "Matemática", color: "#6366f1", mastery: 72,
    topics: [
      { name: "Funções", mastery: 88 },
      { name: "Geometria Plana", mastery: 74 },
      { name: "Trigonometria", mastery: 41 },
      { name: "Estatística", mastery: 82 },
      { name: "Logaritmos", mastery: 55 },
    ],
  },
  {
    subject: "Física", color: "#a855f7", mastery: 58,
    topics: [
      { name: "Cinemática", mastery: 78 },
      { name: "Dinâmica", mastery: 62 },
      { name: "Energia", mastery: 50 },
      { name: "Eletromagnetismo", mastery: 32 },
    ],
  },
  {
    subject: "Química", color: "#3b82f6", mastery: 41,
    topics: [
      { name: "Estequiometria", mastery: 48 },
      { name: "Soluções", mastery: 38 },
      { name: "Orgânica", mastery: 25 },
      { name: "Termoquímica", mastery: 52 },
    ],
  },
  {
    subject: "Biologia", color: "#10b981", mastery: 64,
    topics: [
      { name: "Citologia", mastery: 72 },
      { name: "Genética", mastery: 68 },
      { name: "Ecologia", mastery: 55 },
      { name: "Evolução", mastery: 61 },
    ],
  },
  {
    subject: "História", color: "#f59e0b", mastery: 35,
    topics: [
      { name: "Brasil Colônia", mastery: 42 },
      { name: "Era Vargas", mastery: 28 },
      { name: "Guerra Fria", mastery: 36 },
    ],
  },
  {
    subject: "Português", color: "#ef4444", mastery: 81,
    topics: [
      { name: "Interpretação", mastery: 90 },
      { name: "Gramática", mastery: 76 },
      { name: "Literatura", mastery: 72 },
      { name: "Redação", mastery: 84 },
    ],
  },
];

// ---- ENEM / Vestibular ----
export const enemSimulados = [
  { id: 1, name: "Simulado ENEM #08", date: formatDayMonth(shiftDays(-4)), score: 712, total: 1000, area: "Linguagens" },
  { id: 2, name: "Simulado ENEM #07", date: formatDayMonth(shiftDays(-18)), score: 684, total: 1000, area: "Matemática" },
  { id: 3, name: "Simulado ENEM #06", date: formatDayMonth(shiftDays(-32)), score: 658, total: 1000, area: "Ciências Humanas" },
  { id: 4, name: "Simulado ENEM #05", date: formatDayMonth(shiftDays(-46)), score: 702, total: 1000, area: "Ciências Natureza" },
  { id: 5, name: "Simulado ENEM #04", date: formatDayMonth(shiftDays(-60)), score: 631, total: 1000, area: "Redação" },
];

export const enemAreaEvolution = [
  { week: "S1", linguagens: 620, matematica: 580, humanas: 600, naturezas: 590 },
  { week: "S2", linguagens: 635, matematica: 600, humanas: 605, naturezas: 595 },
  { week: "S3", linguagens: 660, matematica: 612, humanas: 622, naturezas: 608 },
  { week: "S4", linguagens: 675, matematica: 640, humanas: 640, naturezas: 625 },
  { week: "S5", linguagens: 690, matematica: 655, humanas: 648, naturezas: 642 },
  { week: "S6", linguagens: 705, matematica: 672, humanas: 658, naturezas: 660 },
  { week: "S7", linguagens: 712, matematica: 684, humanas: 668, naturezas: 678 },
];

export const vestibulares = [
  { id: "enem", name: "ENEM", desc: "Exame Nacional do Ensino Médio", color: "#6366f1" },
  { id: "fuvest", name: "FUVEST", desc: "USP — São Paulo", color: "#ef4444" },
  { id: "unicamp", name: "UNICAMP", desc: "Campinas — SP", color: "#f59e0b" },
  { id: "unesp", name: "UNESP", desc: "Estadual Paulista", color: "#10b981" },
  { id: "ita", name: "ITA", desc: "Tecnológico de Aeronáutica", color: "#3b82f6" },
  { id: "ime", name: "IME", desc: "Militar de Engenharia", color: "#a855f7" },
];

// ---- Analytics ----
export const monthlyProgress = [
  { month: "Jan", hours: 38, accuracy: 62 },
  { month: "Fev", hours: 52, accuracy: 68 },
  { month: "Mar", hours: 61, accuracy: 71 },
  { month: "Abr", hours: 74, accuracy: 75 },
  { month: "Mai", hours: 88, accuracy: 78 },
];

export const accuracyTrend = [
  { day: "Seg", acc: 72 },
  { day: "Ter", acc: 78 },
  { day: "Qua", acc: 75 },
  { day: "Qui", acc: 82 },
  { day: "Sex", acc: 85 },
  { day: "Sáb", acc: 88 },
  { day: "Dom", acc: 84 },
];

// ---- Notificações ----
export const notifications = [
  { id: 1, type: "review", title: "Revisão pendente: Trigonometria", desc: "Última prática há 5 dias", when: "agora", read: false },
  { id: 2, type: "goal", title: "Meta diária concluída! 🎉", desc: "Você estudou 60 min hoje", when: "1h atrás", read: false },
  { id: 3, type: "achievement", title: "Nova conquista: Maratonista", desc: "+150 XP adicionados", when: "3h atrás", read: false },
  { id: 4, type: "reminder", title: "Hora de estudar Química", desc: "Bloco agendado para 15:00", when: "ontem", read: true },
  { id: 5, type: "review", title: "Flashcards de Citologia disponíveis", desc: "Revisão espaçada recomendada", when: "ontem", read: true },
  { id: 6, type: "achievement", title: "Sequência de 12 dias 🔥", desc: "Continue para desbloquear Imparável", when: "2 dias", read: true },
];