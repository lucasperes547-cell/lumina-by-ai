import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Sparkles, CheckCircle2, X, Image as ImageIcon } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/upload")({
  head: () => pageHead('Materiais de estudo', 'Organize seus materiais de estudo na Lumina AI.'),
  component: UploadPage,
});

function UploadPage() {
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handleFile = (f: File) => {
    setFile({ name: f.name, size: (f.size / 1024 / 1024).toFixed(1) + " MB" });
    setProcessing(true);
    setDone(false);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      toast.success("Documento processado pela IA");
    }, 1800);
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
            if (f) handleFile(f);
          }}
          className="block cursor-pointer border-2 border-dashed border-border hover:border-primary/40 rounded-3xl p-16 text-center bg-surface transition-all"
        >
          <input
            id="file"
            type="file"
            accept=".pdf,image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="size-16 mx-auto mb-6 bg-primary/10 rounded-2xl grid place-items-center">
            <Upload className="size-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Arraste um PDF ou imagem</h3>
          <p className="text-sm text-muted-foreground mb-6">ou clique para selecionar do seu computador</p>
          <div className="flex justify-center gap-3 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1"><FileText className="size-3" /> PDF</span>
            <span className="flex items-center gap-1"><ImageIcon className="size-3" /> JPG, PNG</span>
          </div>
        </label>
      )}

      <AnimatePresence>
        {file && (
          <motion.div initial={{ y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 p-5 bg-surface border border-border rounded-2xl mb-6">
              <div className="size-12 bg-primary/10 rounded-xl grid place-items-center">
                <FileText className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{file.size} · {processing ? "Processando..." : "Pronto"}</p>
              </div>
              {done && <CheckCircle2 className="size-5 text-emerald-500" />}
              <button
                onClick={() => { setFile(null); setDone(false); }}
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

            {done && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="size-4 text-primary" />
                    <h3 className="font-bold">Resumo automático</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    O documento aborda os princípios fundamentais da <strong className="text-foreground">Mecânica Newtoniana</strong>, com foco nas três leis do movimento. A primeira lei (inércia) estabelece que um corpo permanece em repouso ou em movimento retilíneo uniforme até que uma força atue sobre ele. A segunda lei define a relação F = m·a, e a terceira trata das interações ação-reação. O texto inclui exemplos práticos e exercícios resolvidos.
                  </p>
                </div>

                <div className="bg-surface border border-border rounded-3xl p-6">
                  <h3 className="font-bold mb-4">Tópicos principais</h3>
                  <ul className="space-y-2">
                    {["Lei da Inércia", "Força Resultante (F=ma)", "Ação e Reação", "Atrito", "Aplicações no cotidiano"].map((t) => (
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
                    {[
                      { q: "O que é inércia?", a: "Tendência de um corpo manter seu estado de movimento." },
                      { q: "Qual a fórmula da 2ª Lei?", a: "F = m · a (Força = massa × aceleração)" },
                      { q: "O que diz a 3ª Lei?", a: "Para toda ação há uma reação igual e oposta." },
                    ].map((c, i) => (
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