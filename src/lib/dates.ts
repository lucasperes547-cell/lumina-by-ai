const WEEKDAYS_LONG = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS_LONG = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const MONTHS_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function today(): Date {
  return new Date();
}

export function todayLongLabel(d: Date = today()): string {
  return `${WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()} de ${MONTHS_LONG[d.getMonth()]}`;
}

export function shortDay(d: Date): string {
  return WEEKDAYS_SHORT[d.getDay()];
}

export function shortMonth(d: Date): string {
  return MONTHS_SHORT[d.getMonth()];
}

export function formatDayMonth(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

/** Returns 7 dates Monday → Sunday for the current week. */
export function currentWeekDates(ref: Date = today()): Date[] {
  const day = ref.getDay(); // 0 Sun..6 Sat
  const offsetToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() + offsetToMonday);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/** Days remaining until a target date. */
export function daysUntil(target: Date, ref: Date = today()): number {
  const ms = target.getTime() - ref.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

/** Returns a Date n days before/after now. */
export function shiftDays(days: number, ref: Date = today()): Date {
  const d = new Date(ref);
  d.setDate(ref.getDate() + days);
  return d;
}

/** Next ENEM exam date (first Sunday of November of the next year). */
export function nextEnemDate(ref: Date = today()): Date {
  const year = ref.getMonth() >= 10 ? ref.getFullYear() + 1 : ref.getFullYear();
  const nov = new Date(year, 10, 1);
  const firstSun = 1 + ((7 - nov.getDay()) % 7);
  return new Date(year, 10, firstSun);
}

export function relativeWhen(d: Date, ref: Date = today()): string {
  const diffMs = ref.getTime() - d.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins} min atrás`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.round(hours / 24);
  if (days === 1) return "ontem";
  if (days < 7) return `${days} dias`;
  return formatDayMonth(d);
}