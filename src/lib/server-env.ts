// Hosts like Netlify don't load the committed .env into the server runtime, so the
// server falls back to the public Supabase values Vite embeds at build time.
// Values set on the host still take precedence.
// Exported and called explicitly: package.json sets "sideEffects": false, so a
// side-effect-only import of this module would be tree-shaken away.
export function applyServerEnvFallbacks() {
  if (typeof process === "undefined") return;
  const fallbacks: Record<string, string | undefined> = {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  };
  for (const [key, value] of Object.entries(fallbacks)) {
    if (!process.env[key] && value) process.env[key] = value;
  }
}
