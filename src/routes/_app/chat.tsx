import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Plus, BookOpen, Lightbulb, Target, FileText, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { chatHistory } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/chat")({
  component: ChatPage,
});

type Msg = { id: string; role: "user" | "assistant"; content: string };

const CANNED = `Claro! Vou te explicar de forma simples 🌟

**A Terceira Lei de Newton** diz que: para toda ação, existe uma reação de mesma intensidade e sentido oposto.

### Em outras palavras
- Quando você empurra uma parede, **ela empurra você de volta** com a mesma força.
- É por isso que um foguete sobe: ele expulsa gases para baixo (ação) e os gases o empurram para cima (reação).

### Exemplos do dia a dia
1. Pular de um barco — você vai pra frente, o barco vai pra trás.
2. Caminhar — seu pé empurra o chão, o chão te impulsiona.
3. Nadar — suas mãos empurram a água, a água te empurra adiante.

> Quer que eu gere alguns exercícios sobre isso?`;

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "1", role: "assistant", content: "Oi Matheus! 👋 Sou seu tutor Lumina. Sobre o que vamos estudar hoje?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: value };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const aiMsg: Msg = { id: crypto.randomUUID(), role: "assistant", content: CANNED };
      setMessages((m) => [...m, aiMsg]);
      setLoading(false);
    }, 1100);
  };

  const action = (label: string) => {
    toast.success(`${label} solicitado à IA`);
    send(label);
  };

  return (
    <div className="flex h-screen lg:h-screen">
      {/* History sidebar */}
      <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-border bg-surface-2/40">
        <div className="p-4 border-b border-border">
          <button
            onClick={() => setMessages([{ id: "1", role: "assistant", content: "Nova conversa iniciada. Como posso ajudar?" }])}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus className="size-4" />
            Nova conversa
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <p className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Histórico</p>
          {chatHistory.map((c) => (
            <button
              key={c.id}
              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-surface transition-colors group"
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="size-3.5 mt-0.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.title}</p>
                  <p className="text-[10px] text-muted-foreground">{c.when}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-surface/40 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-brand-gradient grid place-items-center">
              <Sparkles className="size-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">Tutor Lumina</p>
              <p className="text-[10px] text-emerald-500 font-mono">● Online</p>
            </div>
          </div>
          <span className="text-xs font-mono text-muted-foreground hidden sm:block">Modo: Explicativo</span>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
                >
                  {m.role === "assistant" && (
                    <div className="size-8 shrink-0 rounded-lg bg-brand-gradient grid place-items-center text-[10px] font-bold text-white">AI</div>
                  )}
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm bg-primary text-primary-foreground text-sm"
                        : "max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-sm bg-surface border border-border text-sm prose prose-sm dark:prose-invert prose-p:my-2 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2"
                    }
                  >
                    {m.role === "assistant" ? <ReactMarkdown>{m.content}</ReactMarkdown> : m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="size-8 shrink-0 rounded-lg bg-foreground text-background grid place-items-center text-[10px] font-bold">MS</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="size-8 shrink-0 rounded-lg bg-brand-gradient grid place-items-center text-[10px] font-bold text-white">AI</div>
                <div className="px-4 py-3 rounded-2xl bg-surface border border-border flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* Quick actions + Composer */}
        <div className="border-t border-border bg-surface/40 px-4 md:px-8 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { icon: Lightbulb, label: "Explicar mais simples" },
                { icon: Target, label: "Gerar exercícios" },
                { icon: FileText, label: "Resumir resposta" },
                { icon: BookOpen, label: "Criar flashcards" },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => action(a.label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-border bg-surface hover:bg-surface-2 hover:border-primary/30 transition-all"
                >
                  <a.icon className="size-3" />
                  {a.label}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-end gap-2 p-2 bg-surface border border-border rounded-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Pergunte qualquer coisa..."
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none resize-none max-h-32"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="size-10 rounded-xl bg-primary text-primary-foreground grid place-items-center hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}