import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";
const MODEL = "openai/gpt-6-astra";
const BASE_URL = "https://ai.gateway.lovable.dev/v1";

const SYSTEM_PROMPT = `Você é o Tutor Lumina, um tutor socrático para estudantes brasileiros (Ensino Médio, ENEM, vestibulares e cursos técnicos). Responda sempre em português do Brasil.

Sua missão é fazer o estudante APRENDER, não entregar respostas prontas.

Regras obrigatórias:
1. Quando o estudante trouxer uma dúvida, NUNCA dê a resposta final pronta. Explique rapidamente o conceito-chave necessário (2 a 5 frases, com uma dica ou exemplo curto diferente do problema dele).
2. Em seguida, SEMPRE proponha um desafio: uma pergunta ou um exercício curto sobre o mesmo assunto (pode ser múltipla escolha A–E no estilo ENEM ou uma pergunta aberta). Termine a mensagem com o desafio em destaque, por exemplo: "**Sua vez:** ...".
3. Quando o estudante responder o desafio:
   - Diga claramente se está **Certo** ✅, **Parcialmente certo** 🟡 ou **Errado** ❌.
   - Explique o PORQUÊ: o raciocínio correto, onde ele acertou e onde errou (erros comuns).
   - Depois de avaliar, aprofunde um pouco o assunto e ofereça um novo desafio um pouco mais difícil (se acertou) ou parecido (se errou).
4. Se o estudante pedir "só a resposta" ou tentar pular etapas, recuse com gentileza, dê uma dica menor e incentive a tentar. Só revele a resolução completa de um desafio DEPOIS que ele tentar responder.
5. Se o estudante disser "não sei", dê uma dica progressiva (uma pista por vez), sem resolver por ele.
6. Seja caloroso, motivador e direto. Use markdown, listas curtas e fórmulas em LaTeX com $...$ quando útil. Evite textos longos.`;

function createRunIdFetch(initial?: string) {
  let runId = initial?.trim() || undefined;
  let resolve: (v: string | undefined) => void = () => {};
  let done = false;
  const ready = new Promise<string | undefined>((r) => (resolve = r));
  const publish = (v?: string) => {
    if (!runId && v?.trim()) runId = v.trim();
    if (!done) {
      done = true;
      resolve(runId);
    }
  };
  if (runId) publish(runId);
  return {
    getRunId: () => runId,
    waitForRunId: () => (runId ? Promise.resolve(runId) : ready),
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID_HEADER)) headers.set(RUN_ID_HEADER, runId);
      try {
        const res = await fetch(input, { ...init, headers });
        publish(res.headers.get(RUN_ID_HEADER) ?? undefined);
        return res;
      } catch (e) {
        publish(undefined);
        throw e;
      }
    },
  };
}

export async function handleTutorChat(request: Request) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return new Response("Tutor indisponível: configuração ausente.", { status: 500 });

  let messages: UIMessage[];
  try {
    const body = (await request.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages)) throw new Error("invalid");
    messages = body.messages as UIMessage[];
  } catch {
    return new Response("Requisição inválida.", { status: 400 });
  }

  const runIdFetch = createRunIdFetch(request.headers.get(RUN_ID_HEADER) ?? undefined);
  const provider = createOpenAI({
    baseURL: BASE_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const response = result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: false,
    onError: (error) => {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes("402")) return "Os créditos de IA acabaram. Tente novamente mais tarde.";
      if (msg.includes("429")) return "Muitas perguntas ao mesmo tempo. Aguarde alguns segundos e tente de novo.";
      return "O tutor não conseguiu responder agora. Tente novamente.";
    },
  });

  const runId = await runIdFetch.waitForRunId().catch(() => undefined);
  const headers = new Headers(response.headers);
  if (runId) headers.set(RUN_ID_HEADER, runId);
  return new Response(response.body, { status: response.status, headers });
}
