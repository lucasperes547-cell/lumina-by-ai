import { Sparkles, Eraser } from "lucide-react";
import { useDemoMode } from "@/lib/demo-mode";
import { toast } from "sonner";

export function DemoToggle({ variant = "default" }: { variant?: "default" | "compact" }) {
  const { demo, toggle } = useDemoMode();

  const onClick = () => {
    toggle();
    toast.success(demo ? "Voltando para conta limpa" : "Modo demonstração ativado");
  };

  if (variant === "compact") {
    return (
      <button
        onClick={onClick}
        title={demo ? "Voltar para conta limpa" : "Ativar demonstração"}
        className={`size-9 rounded-xl border grid place-items-center transition-colors ${
          demo
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-border bg-surface hover:bg-surface-2 text-muted-foreground"
        }`}
      >
        {demo ? <Eraser className="size-4" /> : <Sparkles className="size-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
        demo
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-surface border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
      }`}
    >
      {demo ? (
        <>
          <Eraser className="size-3.5" /> Voltar para conta limpa
        </>
      ) : (
        <>
          <Sparkles className="size-3.5" /> Ativar demonstração
        </>
      )}
    </button>
  );
}