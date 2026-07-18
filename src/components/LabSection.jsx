import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import GenerativeCanvas from "./GenerativeCanvas";
import { LAB_PIECES } from "../lab/pieces";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);
  return reduced;
}

/**
 * LabSection - Sección de arte generativo (Liturgia Máquina)
 * Cinco sistemas en vivo con semilla reproducible; click/Enter = nueva semilla.
 * @param {Object} props
 * @param {Object} props.section - {index, title, subtitle} localizados
 * @param {Array} props.pieces - [{id, title, description}] localizados
 * @param {Object} props.labels - {seed, hint, reseed} localizados
 */
export default function LabSection({ section, pieces, labels }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [seeds, setSeeds] = useState(() =>
    Object.fromEntries(LAB_PIECES.map((piece) => [piece.id, piece.defaultSeed])),
  );

  const reseed = (id) => {
    setSeeds((current) => ({ ...current, [id]: Math.floor(Math.random() * 90000) + 1 }));
  };

  return (
    <section
      id="lab"
      aria-label={section.title}
      className="section-band relative mb-32 md:mb-44"
      style={{ marginLeft: "calc(-1 * var(--page-px))", marginRight: "calc(-1 * var(--page-px))" }}
    >
      <div className="py-16 md:py-20" style={{ paddingLeft: "var(--page-px)", paddingRight: "var(--page-px)" }}>
        <SectionHeading index={section.index} title={section.title} subtitle={section.subtitle} />

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {LAB_PIECES.map((piece) => {
            const copy = pieces.find((p) => p.id === piece.id) ?? { title: piece.id, description: "" };
            const seed = seeds[piece.id];
            return (
              <article key={piece.id} className={`lab-card group ${piece.featured ? "md:col-span-2" : ""}`}>
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
                      staticMode={prefersReducedMotion}
                    />
                    {/* HUD de la obra: semilla actual, estilo terminal */}
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
                  <div className="mt-3 px-0.5">
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
      </div>
    </section>
  );
}
