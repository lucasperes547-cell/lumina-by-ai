import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, NoObjectGeneratedError, Output, streamText } from "ai";
import type { z } from "zod";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server.ts";

const MODEL = "openai/gpt-6-astra";
const BASE_URL = "https://ai.gateway.lovable.dev/v1";

export class AiError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function friendly(e: unknown): AiError {
  if (APICallError.isInstance(e)) {
    try {
      const body = JSON.parse(e.responseBody || "{}");
      const message = body.message || body.error?.message;
      if (typeof message === "string") return new AiError(message);
    } catch {}
    if (e.statusCode === 401) return new AiError("IA indisponível: configuração inválida.");
    if (e.statusCode === 429) return new AiError("Muitas solicitações agora. Aguarde e tente novamente.");
    if (e.statusCode === 402) return new AiError("Créditos de IA insuficientes. O responsável pela plataforma precisa adicionar créditos.");
    return new AiError("O serviço de IA está indisponível no momento.");
  }
  if (NoObjectGeneratedError.isInstance(e)) return new AiError("A IA não retornou um resultado válido. Nenhuma questão foi iniciada.");
  return new AiError("Não foi possível gerar o conteúdo agora.");
}

/** Streams a structured-output call and returns the parsed object. */
export async function generateStructured<T>(opts: {
  schema: z.ZodType<T>;
  system: string;
  prompt: string;
}): Promise<T> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiError("IA indisponível: configuração ausente.");
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: BASE_URL,
    fetch: runIdFetch.fetch,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  try {
    const result = streamText({
      model: provider.responses(MODEL),
      instructions: opts.system,
      maxRetries: 0,
      prompt: opts.prompt,
      output: Output.object({ schema: opts.schema }),
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
    return (await result.output) as T;
  } catch (e) {
    throw friendly(e);
  }
}
