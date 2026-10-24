import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { APICallError, convertToModelMessages, streamText, type UIMessage } from "ai";

const MODEL = "gemini-3.5-flash-lite";

const SYSTEM_PROMPT = `Você é o Tutor Lumina, um tutor socrático para estudantes brasileiros (Ensino Médio, ENEM, vestibulares e cursos técnicos). Responda sempre em português do Brasil.

Sua missão é fazer o estudante APRENDER, não entregar respostas prontas. Responda a qualquer pergunta ou pedido do estudante (qualquer matéria, dúvidas gerais, organização dos estudos, redação, curiosidades): sempre responda de verdade, com conteúdo útil — nunca ignore o pedido.

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
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) return new Response("Tutor indisponível: configuração ausente.", { status: 500 });

  let messages: UIMessage[];
  try {
    const body = (await request.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages)) throw new Error("invalid");
    messages = body.messages as UIMessage[];
  } catch {
    return new Response("Requisição inválida.", { status: 400 });
  }

  const provider = createGoogleGenerativeAI({ apiKey });

  const result = streamText({
    model: provider(MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: false,
    onError: (error) => {
      console.error("[tutor]", error);
      const status = APICallError.isInstance(error) ? error.statusCode : undefined;
      const msg = error instanceof Error ? error.message : String(error);
      if (status === 429 || msg.includes("429") || /quota|rate.?limit/i.test(msg)) return "O limite gratuito da IA foi atingido agora. Aguarde um pouco e tente de novo.";
      if (status === 400 || status === 401 || status === 403) return "Tutor indisponível: chave de configuração inválida.";
      return "O tutor não conseguiu responder agora. Verifique sua conexão e tente novamente.";
    },
  });
}
