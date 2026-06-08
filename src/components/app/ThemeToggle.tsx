import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function getInitial(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("lumina-theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const initial = getInitial();
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("lumina-theme", next);
  };

  return (
    <button
      onClick={toggle}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border border-border bg-surface hover:bg-surface-2 transition-colors"
      aria-label="Alternar tema"
    >
      {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
      <span className="flex-1 text-left">{theme === "dark" ? "Tema claro" : "Tema escuro"}</span>
    </button>
  );
}