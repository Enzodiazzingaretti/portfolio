import { useEffect, useState, useRef, useCallback } from "react";

const TRIGGER = "KEXXY";
const BPM = 142;

const ASCII_ART = `██╗  ██╗███████╗██╗  ██╗██╗  ██╗██╗   ██╗   ██████╗ ██████╗      ██╗
██║ ██╔╝██╔════╝╚██╗██╔╝╚██╗██╔╝╚██╗ ██╔╝  ██╔═══██╗██╔══██╗     ██║
█████╔╝ █████╗   ╚███╔╝  ╚███╔╝  ╚████╔╝   ██║   ██║██████╔╝     ██║
██╔═██╗ ██╔══╝   ██╔██╗  ██╔██╗   ╚██╔╝    ██║   ██║██╔══██╗██   ██║
██║  ██╗███████╗██╔╝ ██╗██╔╝ ██╗   ██║     ╚██████╔╝██████╔╝╚█████╔╝
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝      ╚═════╝ ╚═════╝  ╚════╝`;

const BOOT_LINES = [
  "——————————————————————————",
  "KEXXY_ROOT > ACCESS GRANTED",
  "DECRYPTING SECURE LAYER...",
  "LOADING HIDDEN ARCHIVE...",
  "——————————————————————————",
  "3D ARTIST · MOTION DESIGNER · VISUAL CREATOR",
  "BASED IN ARGENTINA / OPERATING WORLDWIDE",
  "——————————————————————————",
  'TYPE "help" FOR AVAILABLE COMMANDS',
];

const EQ_CHARS = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
const EQ_COLS = 24;

function randomEqBar() {
  return Array.from({ length: EQ_COLS }, () =>
    EQ_CHARS[Math.floor(Math.random() * EQ_CHARS.length)]
  ).join("");
}

const DIAG_LINES = [
  "——————————————————————————",
  "INITIATING SYSTEM DIAGNOSTIC...",
  "——————————————————————————",
  "CORE ENGINE         : ACTIVE [100%]",
  "RENDER PIPELINE     : BLENDER 4.2 — CYCLES X",
  "MOTION LAYER        : TOUCHDESIGNER 2023.11340",
  "REKORDBOX LINK      : CONNECTED — 2 DECKS",
  "RESOLUME ARENA      : RENDERING FRAMEBUFFER",
  "CURRENT BPM         : 142 ///",
  "SOUND PRESSURE      : OVERCLOCK — CLIP DETECTED",
  "LOCATION            : MENDOZA_NODE_AR",
  "VISUAL OUTPUT       : 1920×1080 / 60FPS",
  "NETWORK             : UNDERGROUND_MESH_v4",
  "STATUS              : OPERATIONAL / UNDERGROUND",
  "——————————————————————————",
  "DIAGNOSTIC COMPLETE. NO ANOMALIES FOUND.",
  "——————————————————————————",
];

const HELP_LINES = [
  "——————————————————————————",
  "AVAILABLE COMMANDS:",
  "——————————————————————————",
  "  about              — manifiesto de identidad",
  "  links              — redes y contacto",
  "  stack              — herramientas y software",
  "  kexxy --play       — activar stream de audio underground",
  "  get --vj-pack      — descargar VJ asset pack (coming soon)",
  "  glitch --overdrive — fragmentar la interfaz visual",
  "  sys --status       — diagnóstico del sistema",
  "  credits            — stack técnico + mensaje oculto",
  "  clear              — limpiar consola",
  "  exit               — cerrar terminal",
  "——————————————————————————",
];

const CREDITS_LINES = [
  "——————————————————————————",
  "KEXXY.OBJ // BUILD CREDITS",
  "——————————————————————————",
  "FRONTEND         : React 18 + Vite 6",
  "STYLING          : TailwindCSS 3",
  "3D ENGINE        : Blender 4.2 Cycles X",
  "MOTION SYSTEM    : TouchDesigner 2023",
  "FONTS            : JetBrains Mono + Geist",
  "DEPLOY           : Vercel",
  "ANALYTICS        : Vercel Web Analytics",
  "CURSOR           : Custom WebGL-free CSS",
  "EASTER EGG       : Designed & coded by KEXXY",
  "——————————————————————————",
  "SPECIAL THANKS   : A todo el underground",
  "                   que inspira cada frame.",
  "——————————————————————————",
  "// si llegáste hasta acá, sabés lo que hacés.",
  "// o sos muy curioso. los dos están bien.",
  "——————————————————————————",
  "[HIDDEN] enzo@kexxy.com.ar | SAL FUERZA",
  "——————————————————————————",
];

export default function KonsoleEasterEgg({ onGlitch }) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [eqRow, setEqRow] = useState("");
  const [bpmBlink, setBpmBlink] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const eqRef = useRef(null);
  const bpmRef = useRef(null);
  const audioRef = useRef(null);
  // bufferRef tracks the typed sequence without causing re-renders

  const openRef = useRef(false);
  const bufferRef = useRef("");

  const handleClose = useCallback(() => {
    setOpen(false);
    setLines([]);
    setBooted(false);
    setInput("");
    setIsPlaying(false);
    setEqRow("");
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
  }, []);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (openRef.current) {
        if (e.key === "Escape") {
          e.preventDefault();
          handleClose();
        }
        return;
      }
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key.length !== 1) return;
      bufferRef.current = (bufferRef.current + e.key).toUpperCase().slice(-TRIGGER.length);
      if (bufferRef.current === TRIGGER) {
        bufferRef.current = "";
        setOpen(true);
      }
    };
    // Alternativa a escribir "kexxy": abrir por tap (útil en mobile, sin teclado).
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-konsole", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-konsole", onOpenEvent);
    };
  }, [handleClose]);

  useEffect(() => {
    if (!open || booted) return;
    let i = 0;
    const iv = setInterval(() => {
      setLines((prev) => [...prev, BOOT_LINES[i]]);
      i++;
      if (i >= BOOT_LINES.length) {
        clearInterval(iv);
        setBooted(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }, 90);
    return () => clearInterval(iv);
  }, [open, booted]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, eqRow]);

  useEffect(() => {
    if (!isPlaying) return;
    eqRef.current = setInterval(() => setEqRow(randomEqBar()), 120);
    const beatMs = (60 / BPM) * 1000;
    bpmRef.current = setInterval(() => setBpmBlink((b) => !b), beatMs / 2);
    return () => {
      clearInterval(eqRef.current);
      clearInterval(bpmRef.current);
    };
  }, [isPlaying]);

  const runCommand = useCallback((raw) => {
    const cmd = raw.toLowerCase();
    setLines((prev) => [...prev, `> ${raw}`]);
    setInput("");

    if (cmd === "exit") { handleClose(); return; }
    if (cmd === "clear") { setLines([]); return; }
    const push = (arr) => setLines((prev) => [...prev, ...arr]);

    if (cmd === "help") { push(HELP_LINES); return; }

    if (cmd === "about") {
      push([
        "KEXXY // IDENTITY MANIFESTO",
        "——————————————————————————",
        "Exploraciones visuales entre lo analógico y lo digital.",
        "3D cinematográfico, sistemas de motion y experiencias",
        "que mezclan la estética del club underground con",
        "la precisión técnica del diseño contemporáneo.",
        "——————————————————————————",
      ]); return;
    }

    if (cmd === "links") {
      push([
        "EXTERNAL LINKS:",
        "  Instagram → @kexxy",
        "  Press Kit → presskit.kexxy.com.ar",
        "  Email     → enzo@kexxy.com.ar",
      ]); return;
    }

    if (cmd === "stack") {
      push([
        "TOOLS & STACK:",
        "  Blender — 3D / Render / Motion",
        "  TouchDesigner — Generative / AV",
        "  React + Vite + Tailwind — Web",
        "  Photoshop / Illustrator — Print",
        "  Ableton — Audio Reference",
      ]); return;
    }

    if (cmd === "kexxy --play") {
      if (isPlaying) {
        push(["STREAM ALREADY ACTIVE. USE clear TO RESET OR exit TO QUIT."]);
        return;
      }
      push([
        "——————————————————————————",
        "LOADING STREAM: KEXXY_UNDERGROUND_LIVE.wav",
        "BUFFERING... ████████████ 100%",
        "STREAM ACTIVE — BPM: " + BPM + " — HARDGROOVE",
        "——————————————————————————",
        "[!] No audio file linked yet — visual mode only",
        "——————————————————————————",
      ]);
      setIsPlaying(true);
      return;
    }

    if (cmd === "get --vj-pack") {
      push([
        "——————————————————————————",
        "LOCATING VJ ASSET PACK...",
        "COMPRESSING: loops/, textures/, wallpapers/",
        "PACKAGING... ████████████ 100%",
        "——————————————————————————",
        "[!] VJ PACK NOT UPLOADED YET — COMING SOON",
        "    Contact: enzo@kexxy.com.ar to request early access",
        "——————————————————————————",
      ]);
      return;
    }

    if (cmd === "glitch --overdrive") {
      push([
        "——————————————————————————",
        "WARNING: INITIATING GLITCH OVERDRIVE",
        "FRAGMENTING VISUAL LAYER...",
        "——————————————————————————",
      ]);
      setTimeout(() => {
        handleClose();
        if (typeof onGlitch === "function") onGlitch();
      }, 800);
      return;
    }

    if (cmd === "credits") {
      let i = 0;
      const iv = setInterval(() => {
        if (i >= CREDITS_LINES.length) { clearInterval(iv); return; }
        const line = CREDITS_LINES[i];
        i++;
        setLines((prev) => [...prev, line]);
      }, 100);
      return;
    }

    if (cmd === "sys --status") {
      let i = 0;
      const iv = setInterval(() => {
        if (i >= DIAG_LINES.length) { clearInterval(iv); return; }
        const line = DIAG_LINES[i];
        i++;
        setLines((prev) => [...prev, line]);
      }, 80);
      return;
    }

    push([`COMMAND NOT FOUND: "${raw}" — type "help"`]);
  }, [handleClose, isPlaying, onGlitch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    runCommand(input.trim());
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/88 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="konsole-window flex w-full max-w-4xl flex-col border border-white/10 bg-ink shadow-2xl"
        style={{ height: "72vh" }}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2 shrink-0">
          <span className="font-mono text-label uppercase tracking-[0.3em] text-raveRed/70">
            KEXXY_ROOT — TERMINAL v1.0
          </span>
          <div className="flex items-center gap-4">
            {isPlaying && (
              <span className={`font-mono text-label tracking-[0.2em] transition-colors duration-150 ${bpmBlink ? "text-raveRed" : "text-raveRed/30"}`}>
                ♦ BPM: {BPM}
              </span>
            )}
            <button onClick={handleClose} className="font-mono text-label text-white/30 transition hover:text-white/80">
              [ESC] CLOSE
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="konsole-body flex-1 overflow-y-auto overflow-x-auto p-5 font-mono text-meta leading-relaxed scrollbar-hide">
          <pre className="text-raveRed/70 mb-3" style={{ fontSize: "7px", lineHeight: 1.18, letterSpacing: 0, whiteSpace: "pre" }}>{ASCII_ART}</pre>
          {lines.filter(Boolean).map((line, i) => {
            return (
              <p key={i} className={
                line.startsWith(">") ? "text-white/90" :
                line.startsWith("——") ? "text-white/10" :
                line.startsWith("WARNING") || line.startsWith("[!]") ? "text-raveRed/80" :
                line.includes(":") && !line.startsWith(" ") && !line.startsWith("TYPE") ? "text-white/60" :
                "text-white/40"
              }>{line}</p>
            );
          })}

          {/* EQ visualizer */}
          {isPlaying && eqRow && (
            <div className="mt-2">
              <p className="text-raveRed/60 tracking-widest text-caption">{eqRow}</p>
              <p className="text-white/20 text-micro mt-1 tracking-[0.3em]">
                STREAM ACTIVE — UNDERGROUND_MESH — {BPM} BPM
              </p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Command shortcuts */}
        {booted && (
          <div className="border-t border-white/[0.04] px-5 py-2 flex flex-wrap gap-2 shrink-0">
            {[
              "about", "links", "stack", "kexxy --play", "get --vj-pack",
              "glitch --overdrive", "sys --status", "credits", "clear",
            ].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { runCommand(c); inputRef.current?.focus(); }}
                className="font-mono text-micro uppercase tracking-[0.2em] border border-white/[0.08] px-2 py-1 text-white/30 transition hover:border-raveRed/50 hover:text-white/70"
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        {booted && (
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/[0.07] px-5 py-3 flex items-center gap-2 shrink-0"
          >
            <span className="font-mono text-caption text-raveRed/70 shrink-0">KEXXY_ROOT &gt;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent font-mono text-meta text-white/80 outline-none placeholder:text-white/20 uppercase tracking-[0.1em]"
              placeholder="type a command..."
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        )}
      </div>
    </div>
  );
}
