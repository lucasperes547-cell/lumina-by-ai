import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { APICallError, NoObjectGeneratedError, Output, streamText } from "ai";
import type { z } from "zod";

const MODEL = "gemini-2.5-flash-lite";

export class AiError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function friendly(e: unknown): AiError {
  if (APICallError.isInstance(e)) {
    if (e.statusCode === 429) return new AiError("O limite gratuito da IA foi atingido agora. Aguarde um pouco e tente novamente.");
    if (e.statusCode === 400 || e.statusCode === 401 || e.statusCode === 403) return new AiError("IA indisponível: chave de configuração inválida.");
    return new AiError("O serviço de IA está indisponível no momento.");
  }
  if (NoObjectGeneratedError.isInstance(e)) return new AiError("A IA não retornou um resultado válido. Nenhuma questão foi iniciada.");
  return new AiError("Não foi possível gerar o conteúdo agora. Verifique sua conexão e tente novamente.");
}

/** Streams a structured-output call and returns the parsed object. */
export async function generateStructured<T>(opts: {
  schema: z.ZodType<T>;
  system: string;
  prompt: string;
}): Promise<T> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) throw new AiError("IA indisponível: configuração ausente.");
  const provider = createGoogleGenerativeAI({ apiKey });
  try {
    const result = streamText({
      model: provider(MODEL),
      system: opts.system,
      maxRetries: 0,
      prompt: opts.prompt,
      output: Output.object({ schema: opts.schema }),
    });
    return (await result.output) as T;
  } catch (e) {
    throw friendly(e);
  }
}
