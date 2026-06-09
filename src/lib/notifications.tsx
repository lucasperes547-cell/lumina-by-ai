import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useDemoMode } from "@/lib/demo-mode";
import { relativeWhen, shiftDays } from "@/lib/dates";

export type NotificationType = "review" | "goal" | "achievement" | "reminder";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  desc: string;
  createdAt: number; // epoch ms
  read: boolean;
};

type Ctx = {
  items: Notification[];
  unread: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clear: () => void;
};

const NotificationsContext = createContext<Ctx | null>(null);
const KEY = "lumina:notifications";

function demoNotifications(): Notification[] {
  const now = Date.now();
  return [
    {
      id: "n1",
      type: "review",
      title: "Revisão pendente: Trigonometria",
      desc: "Última prática há 5 dias",
      createdAt: now - 15 * 60 * 1000,
      read: false,
    },
    {
      id: "n2",
      type: "goal",
      title: "Meta diária concluída! 🎉",
      desc: "Você estudou 60 min hoje",
      createdAt: now - 60 * 60 * 1000,
      read: false,
    },
    {
      id: "n3",
      type: "achievement",
      title: "Nova conquista: Maratonista",
      desc: "+150 XP adicionados",
      createdAt: now - 3 * 60 * 60 * 1000,
      read: false,
    },
    {
      id: "n4",
      type: "reminder",
      title: "Hora de estudar Química",
      desc: "Bloco agendado para 15:00",
      createdAt: shiftDays(-1).getTime(),
      read: true,
    },
    {
      id: "n5",
      type: "review",
      title: "Flashcards de Citologia disponíveis",
      desc: "Revisão espaçada recomendada",
      createdAt: shiftDays(-1).getTime(),
      read: true,
    },
  ];
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { demo } = useDemoMode();
  const [items, setItems] = useState<Notification[]>([]);

  // Load from storage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  // Sync with demo toggle
  useEffect(() => {
    setItems(demo ? demoNotifications() : []);
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }, [demo]);

  const persist = useCallback((next: Notification[]) => {
    setItems(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const markRead = useCallback(
    (id: string) => {
      persist(items.map((n) => (n.id === id ? { ...n, read: true } : n)));
    },
    [items, persist],
  );

  const markAllRead = useCallback(() => {
    persist(items.map((n) => ({ ...n, read: true })));
  }, [items, persist]);

  const remove = useCallback(
    (id: string) => {
      persist(items.filter((n) => n.id !== id));
    },
    [items, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const value = useMemo<Ctx>(
    () => ({
      items,
      unread: items.filter((n) => !n.read).length,
      markRead,
      markAllRead,
      remove,
      clear,
    }),
    [items, markRead, markAllRead, remove, clear],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    return {
      items: [] as Notification[],
      unread: 0,
      markRead: () => {},
      markAllRead: () => {},
      remove: () => {},
      clear: () => {},
    } as Ctx;
  return ctx;
}

export function formatNotificationWhen(n: Notification): string {
  return relativeWhen(new Date(n.createdAt));
}