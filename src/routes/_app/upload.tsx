import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Sparkles, CheckCircle2, X } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { useServerFn } from "@tanstack/react-start";
import { summarizeMaterial } from "@/lib/study.functions";
import type { MaterialResult } from "@/lib/study-validation";
import { MessageResponse } from "@/components/ai-elements/message";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/upload")({
  head: () => pageHead('Materiais de estudo', 'Organize seus materiais de estudo na Lumina AI.'),
  component: UploadPage,
});

async function extractText(f: File): Promise<string> {
  if (f.type === "text/plain" || f.name.endsWith(".txt") || f.name.endsWith(".md")) {
    return f.text();
  }
  if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Envie um PDF ou arquivo de texto (.txt, .md).");
  }
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const doc = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= Math.min(doc.numPages, 40); i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    parts.push(content.items.map((it) => ("str" in it ? it.str : "")).join(" "));
  }
  const text = parts.join("\n").replace(/\s+/g, " ").trim();
  if (text.length < 50) throw new Error("Não consegui ler texto neste PDF. Ele pode ser digitalizado (imagem).");
  return text;
}

function UploadPage() {
  const summarizeFn = useServerFn(summarizeMaterial);
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<MaterialResult | null>(null);

  const handleFile = async (f: File) => {
    setFile({ name: f.name, size: (f.size / 1024 / 1024).toFixed(1) + " MB" });
    setProcessing(true);
    setResult(null);
    try {
      const text = await extractText(f);
      const out = await summarizeFn({ data: { fileName: f.name, text } });
      setResult(out);
      toast.success("Documento processado pela IA");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível processar o documento.");
      setFile(null);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="px-6 lg:px-10 py-8 max-w-6xl mx-auto">
      <PageHeader title="Materiais & PDFs" subtitle="Suba documentos e a IA gera resumos, tópicos e flashcards automaticamente." />

      {!file && (
        <label
          htmlFor="file"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) void handleFile(f);
          }}
          className="block cursor-pointer border-2 border-dashed border-border hover:border-primary/40 rounded-3xl p-16 text-center bg-surface transition-all"
        >
          <input
            id="file"
            type="file"
            accept=".pdf,.txt,.md"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && void handleFile(e.target.files[0])}
          />
          <div className="size-16 mx-auto mb-6 bg-primary/10 rounded-2xl grid place-items-center">
            <Upload className="size-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Arraste um PDF ou texto</h3>
          <p className="text-sm text-muted-foreground mb-6">ou clique para selecionar do seu computador</p>
          <div className="flex justify-center gap-3 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1"><FileText className="size-3" /> PDF, TXT, MD</span>
          </div>
        </label>
      )}

      <AnimatePresence>
        {file && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 p-5 bg-surface border border-border rounded-2xl mb-6">
              <div className="size-12 bg-primary/10 rounded-xl grid place-items-center">
                <FileText className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{file.size} · {processing ? "Processando..." : "Pronto"}</p>
              </div>
              {result && <CheckCircle2 className="size-5 text-emerald-500" />}
              <button
                onClick={() => { setFile(null); setResult(null); }}
                className="size-9 rounded-lg hover:bg-surface-2 grid place-items-center"
              >
                <X className="size-4" />
              </button>
            </div>

            {processing && (
              <div className="bg-surface border border-border rounded-2xl p-8 text-center">
                <Sparkles className="size-8 text-primary mx-auto mb-3 animate-pulse" />
                <p className="font-semibold">Lumina está lendo seu documento...</p>
                <p className="text-sm text-muted-foreground mt-1">Extraindo tópicos e gerando resumo</p>
              </div>
            )}

            {result && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="size-4 text-primary" />
                    <h3 className="font-bold">Resumo automático</h3>
                  </div>
                  <div className="text-sm leading-relaxed text-muted-foreground"><MessageResponse>{result.summary}</MessageResponse></div>
                </div>

                <div className="bg-surface border border-border rounded-3xl p-6">
                  <h3 className="font-bold mb-4">Tópicos principais</h3>
                  <ul className="space-y-2">
                    {result.topics.map((t) => (
                      <li key={t} className="flex items-center gap-2 text-sm">
                        <span className="size-1.5 bg-accent rounded-full" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-3 bg-surface border border-border rounded-3xl p-6">
                  <h3 className="font-bold mb-4">Flashcards gerados</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {result.flashcards.map((c, i) => (
                      <div key={i} className="p-5 rounded-2xl border border-border bg-surface-2 hover:border-primary/30 transition-all">
                        <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">Pergunta</p>
                        <p className="font-semibold mb-3">{c.q}</p>
                        <p className="text-xs font-mono uppercase tracking-widest text-accent mb-2">Resposta</p>
                        <p className="text-sm text-muted-foreground">{c.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
