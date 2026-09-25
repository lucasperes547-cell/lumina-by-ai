import type { UIMessage } from "ai";

export type TutorThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const KEY = "lumina-tutor-threads";
const listeners = new Set<() => void>();

export function loadThreads(): TutorThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as TutorThread[]) : [];
    return Array.isArray(parsed) ? parsed.sort((a, b) => b.updatedAt - a.updatedAt) : [];
  } catch {
    return [];
  }
}

function save(threads: TutorThread[]) {
  window.localStorage.setItem(KEY, JSON.stringify(threads));
  listeners.forEach((l) => l());
}

export function subscribeThreads(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getThread(id: string) {
  return loadThreads().find((t) => t.id === id);
}

export function createThread(): TutorThread {
  const t: TutorThread = {
    id: crypto.randomUUID().slice(0, 8),
    title: "Nova dúvida",
    updatedAt: Date.now(),
    messages: [],
  };
  save([t, ...loadThreads()]);
  return t;
}

export function ensureThread(id: string): TutorThread {
  const existing = getThread(id);
  if (existing) return existing;
  const t: TutorThread = { id, title: "Nova dúvida", updatedAt: Date.now(), messages: [] };
  save([t, ...loadThreads()]);
  return t;
}

export function saveThreadMessages(id: string, messages: UIMessage[]) {
  const threads = loadThreads();
  const idx = threads.findIndex((t) => t.id === id);
  const firstUser = messages.find((m) => m.role === "user");
  const firstText = firstUser?.parts.find((p) => p.type === "text");
  const title =
    firstText && "text" in firstText ? firstText.text.slice(0, 48) : "Nova dúvida";
  const updated: TutorThread = {
    id,
    title,
    updatedAt: Date.now(),
    messages,
  };
  if (idx >= 0) threads[idx] = updated;
  else threads.unshift(updated);
  save(threads);
}

export function deleteThread(id: string) {
  save(loadThreads().filter((t) => t.id !== id));
}
