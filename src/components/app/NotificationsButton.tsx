import { useState } from "react";
import { Bell, BellOff, BookOpen, Target, Trophy, Clock, Trash2, X, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications, formatNotificationWhen } from "@/lib/notifications";

const iconMap = {
  review: BookOpen,
  goal: Target,
  achievement: Trophy,
  reminder: Clock,
} as const;

const colorMap = {
  review: "text-primary bg-primary/10",
  goal: "text-emerald-500 bg-emerald-500/10",
  achievement: "text-amber-500 bg-amber-500/10",
  reminder: "text-accent bg-accent/10",
} as const;

export function NotificationsButton() {
  const [open, setOpen] = useState(false);
  const { items, unread, markRead, markAllRead, remove, clear } = useNotifications();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative size-9 rounded-xl border border-border bg-surface hover:bg-surface-2 grid place-items-center transition-colors"
        aria-label="Notificações"
      >
        <Bell className="size-4" />
        {unread > 0 && (
          <motion.span
            key={unread}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 size-4 rounded-full bg-rose-500 text-white text-[9px] font-bold grid place-items-center"
          >
            {unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/30 z-40"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-background border-l border-border z-50 flex flex-col"
            >
              <div className="h-16 px-5 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-2">
                  <Bell className="size-4 text-primary" />
                  <h3 className="font-bold">Notificações</h3>
                  {unread > 0 && <span className="text-[10px] font-mono px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">{unread} novas</span>}
                </div>
                <button onClick={() => setOpen(false)} className="size-8 rounded-lg hover:bg-surface-2 grid place-items-center">
                  <X className="size-4" />
                </button>
              </div>
              {items.length > 0 && (
                <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                  <button
                    onClick={markAllRead}
                    disabled={unread === 0}
                    className="text-xs font-semibold text-primary hover:underline disabled:opacity-40 disabled:no-underline inline-flex items-center gap-1"
                  >
                    <CheckCheck className="size-3" /> Marcar todas como lidas
                  </button>
                  <button
                    onClick={clear}
                    className="text-xs font-semibold text-muted-foreground hover:text-rose-500 inline-flex items-center gap-1"
                  >
                    <Trash2 className="size-3" /> Limpar
                  </button>
                </div>
              )}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                {items.length === 0 ? (
                  <div className="h-full grid place-items-center text-center px-6">
                    <div>
                      <div className="size-14 mx-auto mb-3 rounded-2xl bg-surface-2 grid place-items-center">
                        <BellOff className="size-6 text-muted-foreground" />
                      </div>
                      <p className="font-bold text-sm">Nenhuma notificação</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-[18rem]">
                        Quando houver lembretes de revisão, metas ou conquistas, elas aparecerão aqui.
                      </p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {items.map((n) => {
                      const Icon = iconMap[n.type as keyof typeof iconMap];
                      const cls = colorMap[n.type as keyof typeof colorMap];
                      return (
                        <motion.div
                          key={n.id}
                          layout
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 30, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => !n.read && markRead(n.id)}
                          className={`group p-3 rounded-2xl border cursor-pointer ${n.read ? "border-border bg-surface" : "border-primary/20 bg-primary/5"} hover:border-primary/30 transition-all`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`size-9 rounded-xl ${cls} grid place-items-center shrink-0`}>
                              <Icon className="size-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold">{n.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                              <p className="text-[10px] font-mono text-muted-foreground mt-1">{formatNotificationWhen(n)}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {!n.read && <span className="size-2 rounded-full bg-primary mt-1" />}
                              <button
                                onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                                className="size-7 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground grid place-items-center opacity-60 group-hover:opacity-100 transition-opacity"
                                aria-label="Excluir notificação"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}