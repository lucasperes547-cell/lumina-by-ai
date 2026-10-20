import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [notice, setNotice] = useState("");
  const destination = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: p, error } = await supabase.from("profiles").select("onboarded").eq("id", user.id).maybeSingle();
    if (error) throw error;
    await navigate({ to: p?.onboarded ? "/dashboard" : "/onboarding", replace: true });
  };
  const social = async (provider: "google" | "apple" | "lovable") => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
      if (result.error) throw result.error;
      if (!result.redirected) await destination();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível entrar."); }
    finally { setLoading(false); }
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setNotice("");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin, data: { full_name: name.trim() } } });
        if (error) throw error;
        if (!data.session) { setNotice("Confira seu e-mail para confirmar o cadastro. Depois, entre para definir seu plano de estudos."); return; }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
      await destination();
    } catch (e) { setNotice(e instanceof Error ? e.message : "Não foi possível entrar. Tente novamente."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left visual panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-foreground text-background flex-col p-12">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <Logo className="relative z-10 [&_span]:text-background" />
        <div className="relative z-10 my-auto max-w-md">
          <p className="font-mono text-xs tracking-widest uppercase text-background/50 mb-6">Aprenda do seu jeito</p>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight mb-6">
            Seu tutor de IA está esperando para ajudar você a evoluir.
          </h2>
          <p className="text-background/70">
            Um caminho de estudos pensado para seus objetivos, suas dificuldades e seu tempo.
          </p>
        </div>
        <div className="relative z-10 flex gap-6 text-xs text-background/50 font-mono">
          <span>Seu ritmo</span>
          <span>Seus objetivos</span>
          <span>24/7 disponível</span>
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-col items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {mode === "login" ? "Entre para continuar seus estudos." : "Comece grátis em segundos."}
          </p>

          <div className="space-y-3 mb-6">
            <Button disabled={loading} type="button" onClick={() => social("google")} className="h-auto w-full flex items-center justify-center gap-3 px-4 py-3 bg-surface border border-border rounded-2xl font-semibold text-sm hover:bg-surface-2 transition-colors">
              <span className="size-5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-500" />
              Continuar com Google
            </Button>
            <Button disabled={loading} type="button" onClick={() => social("apple")} className="h-auto w-full flex items-center justify-center gap-3 px-4 py-3 bg-surface border border-border rounded-2xl font-semibold text-sm hover:bg-surface-2 transition-colors">
              <span className="size-5 rounded-full bg-foreground" />
              Continuar com Apple
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase font-mono tracking-widest">
              <span className="bg-background px-3 text-muted-foreground">ou</span>
            </div>
          </div>

          {notice && <p role="status" className="mb-4 text-sm text-primary">{notice}</p>}
          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && <label className="block"><span className="text-xs font-semibold text-muted-foreground mb-1.5 block">Nome</span><input required maxLength={100} value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-surface border border-border rounded-2xl" autoComplete="name" /></label>}
            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground mb-1.5 block">E-mail</span>
              <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                <Mail className="size-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" maxLength={255}
                  required
                  placeholder="voce@exemplo.com"
                  className="bg-transparent flex-1 outline-none text-sm"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground mb-1.5 block">Senha</span>
              <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                <Lock className="size-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password} onChange={e => setPassword(e.target.value)} minLength={8} maxLength={128} autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  required
                  placeholder="••••••••"
                  className="bg-transparent flex-1 outline-none text-sm"
                />
              </div>
            </label>
            <Button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Entrando..." : (
                <>
                  {mode === "login" ? "Entrar" : "Criar conta"}
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>

          </form>

          <p className="text-sm text-muted-foreground mt-8 text-center">
            {mode === "login" ? "Não tem uma conta? " : "Já tem uma conta? "}
            <Button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-primary font-semibold hover:underline"
            >
              {mode === "login" ? "Cadastre-se" : "Entrar"}
            </Button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}