import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Ctx = { demo: boolean; toggle: () => void; setDemo: (v: boolean) => void };

const DemoContext = createContext<Ctx | null>(null);
const KEY = "lumina:demo-mode";

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [demo, setDemoState] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v === "1") setDemoState(true);
    } catch {
      // ignore
    }
  }, []);

  const setDemo = useCallback((v: boolean) => {
    setDemoState(v);
    try {
      localStorage.setItem(KEY, v ? "1" : "0");
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => setDemo(!demo), [demo, setDemo]);

  return (
    <DemoContext.Provider value={{ demo, toggle, setDemo }}>{children}</DemoContext.Provider>
  );
}

export function useDemoMode() {
  const ctx = useContext(DemoContext);
  if (!ctx) return { demo: false, toggle: () => {}, setDemo: () => {} } as Ctx;
  return ctx;
}