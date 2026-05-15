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
  name: "Matheus Silva",
  email: "matheus@lumina.ai",
  level: "Vestibulando",
  streak: 12,
  totalHours: 142.5,
  questionsAnswered: 1284,
  accuracy: 78,
  rank: "Top 8%",
};