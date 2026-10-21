import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

// Netlify AI Gateway injects OPENAI_API_KEY and OPENAI_BASE_URL at runtime.
const MODEL = "gpt-6-astra";

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

export async function handleTutorChat(request: Request) {
  let messages: UIMessage[];
  try {
    const body = (await request.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages)) throw new Error("invalid");
    messages = body.messages as UIMessage[];
  } catch {
    return new Response("Requisição inválida.", { status: 400 });
  }

  const result = streamText({
    model: createOpenAI().responses(MODEL),
    instructions: SYSTEM_PROMPT,
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

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: false,
    onError: (error) => {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes("402")) return "Os créditos de IA acabaram. Tente novamente mais tarde.";
      if (msg.includes("429")) return "Muitas perguntas ao mesmo tempo. Aguarde alguns segundos e tente de novo.";
      return "O tutor não conseguiu responder agora. Tente novamente.";
    },
  });
}
