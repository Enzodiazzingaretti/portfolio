import { useState } from "react";
import { Lock, LogIn, Loader2, AlertCircle } from "lucide-react";
import { login } from "./api.js";

export default function Login({ onSuccess }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try { await login(pw); onSuccess(); }
    catch (err) {
      setError(err.message === "rate_limited" ? "Demasiados intentos. Esperá unos minutos." : "Contraseña incorrecta.");
    } finally { setBusy(false); }
  }

  return (
    <div className="relative min-h-screen grid place-items-center bg-[#050505] px-6 overflow-hidden text-[#EAEAEA]">
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[38rem] h-[38rem] rounded-full bg-raveRed/10 blur-[120px]" />
      <form onSubmit={submit} className="relative w-full max-w-sm border border-white/10 bg-white/[0.02] p-8 text-center">
        <h1 className="font-display text-3xl font-bold uppercase tracking-[0.14em]">Panel</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45 mt-2 mb-7">Enzo Diaz Zingaretti</p>

        <div className="relative text-left">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" strokeWidth={1.5} />
          <input
            type="password" value={pw} onChange={(e) => setPw(e.target.value)}
            placeholder="Contraseña" autoFocus aria-label="Contraseña"
            className="w-full bg-black/40 border border-white/10 pl-11 pr-4 py-3 text-[#EAEAEA] placeholder-white/30 outline-none transition-colors focus:border-raveRedBright"
          />
        </div>

        {error && (
          <p className="flex items-center justify-center gap-1.5 text-raveRedBright text-sm mt-3">
            <AlertCircle size={14} /> {error}
          </p>
        )}

        <button
          type="submit" disabled={busy}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-raveRed text-white font-display font-bold uppercase tracking-[0.18em] py-3 transition-colors hover:bg-raveRedBright disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} strokeWidth={1.75} />}
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
