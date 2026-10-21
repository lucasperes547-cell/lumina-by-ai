import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Brain, Plus, Trash2, Lightbulb, Target, MessageCircleQuestion } from "lucide-react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import {
  createThread,
  deleteThread,
  ensureThread,
  loadThreads,
  saveThreadMessages,
  subscribeThreads,
  type TutorThread,
} from "@/lib/tutor-threads";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/tutor/$threadId")({
  head: () => ({
    meta: [
      { title: "Tutor Lumina · Conversa" },
      { name: "description", content: "Sua conversa com o Tutor Lumina: dúvidas, desafios e correções explicadas." },
      { property: "og:title", content: "Tutor Lumina · Conversa" },
      { property: "og:description", content: "Aprenda tentando: o tutor desafia e explica o porquê." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TutorPage,
});

const EMPTY: TutorThread[] = [];
let cache: TutorThread[] = EMPTY;
let cacheKey = "";
function snapshot() {
  const next = loadThreads();
  const key = JSON.stringify(next.map((t) => [t.id, t.updatedAt, t.title]));
  if (key !== cacheKey) {
    cacheKey = key;
    cache = next;
  }
  return cache;
}

function TutorPage() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const threads = useSyncExternalStore(subscribeThreads, snapshot, () => EMPTY);
  const [initial, setInitial] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    setInitial(ensureThread(threadId).messages);
  }, [threadId]);

  const newThread = () => {
    const t = createThread();
    navigate({ to: "/tutor/$threadId", params: { threadId: t.id } });
  };

  const remove = (id: string) => {
    deleteThread(id);
    if (id === threadId) {
      const next = loadThreads()[0] ?? createThread();
      navigate({ to: "/tutor/$threadId", params: { threadId: next.id }, replace: true });
    }
  };

  return (
    <div className="flex h-[calc(100dvh-3.5rem-5rem)] lg:h-[calc(100dvh-3.5rem)]">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border">
        <div className="p-3">
          <button
            onClick={newThread}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90"
          >
            <Plus className="size-4" /> Nova dúvida
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
          {threads.map((t) => (
            <div
              key={t.id}
              className={cn(
                "group flex items-center rounded-lg text-sm",
                t.id === threadId ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Link
                to="/tutor/$threadId"
                params={{ threadId: t.id }}
                className="flex-1 min-w-0 truncate px-3 py-2"
              >
                {t.title}
              </Link>
              <button
                onClick={() => remove(t.id)}
                aria-label="Apagar conversa"
                className="p-2 opacity-60 group-hover:opacity-100 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-border">
          <span className="text-sm font-semibold">Tutor Lumina</span>
          <button onClick={newThread} className="text-xs font-semibold text-primary flex items-center gap-1">
            <Plus className="size-3.5" /> Nova dúvida
          </button>
        </div>
        {initial && <ChatWindow key={threadId} threadId={threadId} initialMessages={initial} />}
      </div>
    </div>
  );
}

const suggestions = [
  { icon: MessageCircleQuestion, text: "Não entendo como funciona a regra de três composta" },
  { icon: Lightbulb, text: "Qual a diferença entre mitose e meiose?" },
  { icon: Target, text: "Quero treinar interpretação de gráficos para o ENEM" },
];

function ChatWindow({ threadId, initialMessages }: { threadId: string; initialMessages: UIMessage[] }) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, stop, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat", body: { threadId } }),
    onError: (e) => toast.error(e.message || "Não foi possível falar com o tutor."),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (status === "ready" || status === "error") {
      if (messages.length > 0) saveThreadMessages(threadId, messages);
      textareaRef.current?.focus();
    }
  }, [messages, status, threadId]);

  const send = (value: string) => {
    const v = value.trim();
    if (!v || busy) return;
    sendMessage({ text: v });
    setText("");
    saveThreadMessages(threadId, [
      ...messages,
      { id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text: v }] },
    ]);
  };

  const onSubmit = (m: PromptInputMessage) => send(m.text);

  return (
    <>
      <Conversation className="flex-1">
        <ConversationContent className="max-w-3xl mx-auto w-full px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center text-center pt-10 gap-4">
              <div className="size-14 rounded-2xl bg-brand-gradient grid place-items-center">
                <Brain className="size-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Tutor Lumina</h1>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Conte sua dúvida. Eu explico o essencial e te lanço um desafio — você tenta, e eu te digo se acertou e por quê.
                </p>
              </div>
              <div className="grid gap-2 w-full max-w-md mt-2">
                {suggestions.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => send(s.text)}
                    className="flex items-center gap-3 text-left rounded-xl border border-border px-4 py-3 text-sm hover:bg-muted transition-colors"
                  >
                    <s.icon className="size-4 text-primary shrink-0" />
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent
                className={cn(
                  m.role === "user"
                    ? "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground"
                    : "bg-transparent"
                )}
              >
                {m.parts.map((p, i) =>
                  p.type === "text" ? (
                    m.role === "assistant" ? (
                      <MessageResponse key={i}>{p.text}</MessageResponse>
                    ) : (
                      <p key={i} className="whitespace-pre-wrap">{p.text}</p>
                    )
                  ) : null
                )}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent className="bg-transparent">
                <Shimmer>Pensando no seu desafio…</Shimmer>
              </MessageContent>
            </Message>
          )}
          {error && (
            <p className="text-sm text-destructive text-center">{error.message}</p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="px-4 pb-4 max-w-3xl mx-auto w-full">
        <PromptInput onSubmit={onSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              ref={textareaRef}
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva sua dúvida ou sua resposta ao desafio…"
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <span className="text-[11px] text-muted-foreground px-2">
                O tutor não dá respostas prontas — ele te desafia.
              </span>
            </PromptInputTools>
            <PromptInputSubmit status={status} onStop={stop} disabled={!busy && !text.trim()} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </>
  );
}
