import { useState } from "react";
import GenerativeCanvas from "./GenerativeCanvas";
import { LAB_PIECES } from "../lab/pieces";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Lab generativo sin la envoltura de sección: ahora es un grupo dentro de
 * MOTION, no una sección propia del scroll. Click/Enter = nueva semilla.
 */
export default function LabGrid({ pieces, labels }) {
  const reduced = usePrefersReducedMotion();
  const [seeds, setSeeds] = useState(() =>
    Object.fromEntries(LAB_PIECES.map((piece) => [piece.id, piece.defaultSeed])),
  );

  const reseed = (id) => {
    setSeeds((current) => ({ ...current, [id]: Math.floor(Math.random() * 90000) + 1 }));
  };

  return (
    <div className="lab-grid">
      {LAB_PIECES.map((piece) => {
        const copy = pieces.find((p) => p.id === piece.id) ?? { title: piece.id, description: "" };
        const seed = seeds[piece.id];
        return (
          <article key={piece.id} className={`lab-card group reveal-on-scroll${piece.featured ? " lab-card--wide" : ""}`}>
            <button
              type="button"
              onClick={() => reseed(piece.id)}
              aria-label={`${copy.title} — ${labels.reseed}`}
              className="block w-full text-left"
            >
              <div className={`lab-frame relative overflow-hidden bg-ink ${piece.featured ? "aspect-video" : "aspect-[4/3]"}`}>
                <GenerativeCanvas
                  createPiece={piece.create}
                  seed={seed}
                  width={piece.w}
                  height={piece.h}
                  staticMode={reduced}
                />
                <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-raveRed" />
                  <span className="font-mono text-micro uppercase tracking-[0.3em] text-white/50">
                    {labels.seed} {String(seed).padStart(5, "0")}
                  </span>
                </div>
                <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-micro uppercase tracking-[0.25em] text-white/0 transition-colors duration-300 group-hover:text-white/45">
                  {labels.hint}
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-[-0.02em] text-paper transition group-hover:text-white md:text-2xl">
                    {copy.title}
                  </h3>
                  <span className="font-mono text-micro uppercase tracking-[0.25em] text-raveRed/70">RT</span>
                </div>
                <p className="mt-1.5 max-w-xl text-meta leading-relaxed text-dim">{copy.description}</p>
              </div>
            </button>
          </article>
        );
      })}
    </div>
  );
}
