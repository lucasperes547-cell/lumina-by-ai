import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { createThread, loadThreads } from "@/lib/tutor-threads";

export const Route = createFileRoute("/_app/tutor/")({
  head: () => ({
    meta: [
      { title: "Tutor Lumina · Aprenda resolvendo desafios" },
      { name: "description", content: "Tire dúvidas com um tutor de IA que te desafia com exercícios em vez de dar respostas prontas." },
      { property: "og:title", content: "Tutor Lumina · Aprenda resolvendo desafios" },
      { property: "og:description", content: "Tutor de IA que explica, desafia e corrige com o porquê." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TutorIndex,
});

function TutorIndex() {
  const navigate = useNavigate();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const existing = loadThreads()[0];
    const t = existing && existing.messages.length === 0 ? existing : existing ?? createThread();
    navigate({ to: "/tutor/$threadId", params: { threadId: t.id }, replace: true });
  }, [navigate]);
  return <div className="p-10 text-sm text-muted-foreground">Abrindo o tutor…</div>;
}
