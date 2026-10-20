import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { relativeWhen } from "@/lib/dates";

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
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Notification[]>([]);
  const persist = useCallback((next: Notification[]) => setItems(next), []);

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