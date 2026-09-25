import { createFileRoute } from "@tanstack/react-router";
import { handleTutorChat } from "@/lib/tutor.server";

export const Route = createFileRoute("/api/chat")({
  server: { handlers: { POST: ({ request }) => handleTutorChat(request) } },
});
