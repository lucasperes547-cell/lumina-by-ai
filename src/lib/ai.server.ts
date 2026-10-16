import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import type { z } from "zod";

const MODEL = "openai/gpt-6-astra";
const BASE_URL = "https://ai.gateway.lovable.dev/v1";

export class AiError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function friendly(e: unknown): AiError {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes("402")) return new AiError("Os créditos de IA acabaram. Tente novamente mais tarde.");
  if (msg.includes("429")) return new AiError("Muitas solicitações agora. Aguarde alguns segundos e tente de novo.");
  console.error("AI error:", msg);
  return new AiError("A IA não conseguiu gerar agora. Tente novamente.");
}

/** Streams a structured-output call and returns the parsed object. */
export async function generateStructured<T>(opts: {
  schema: z.ZodType<T>;
  system: string;
  prompt: string;
}): Promise<T> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiError("IA indisponível: configuração ausente.");
  const provider = createOpenAI({
    baseURL: BASE_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  try {
    const result = streamText({
      model: provider.responses(MODEL),
      system: opts.system,
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
