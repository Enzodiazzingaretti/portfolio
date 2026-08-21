import { useState } from "react";
import GenerativeCanvas from "./GenerativeCanvas";
import { LAB_PIECES } from "../lab/pieces";
import { defaultParams, isPristine } from "../lab/controls";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Lab generativo sin la envoltura de sección: ahora es un grupo dentro de
 * MOTION, no una sección propia del scroll.
 *
 * Cada obra trae dos formas de intervenir: click/Enter sobre el lienzo =
 * nueva semilla (otra cara del mismo organismo), y el tablero de sliders =
 * el visitante corriendo el sistema fuera de donde lo dejó el autor. Las dos
 * son ortogonales: cambiar la semilla no toca los parámetros.
 */

/** Notarial y corto: enteros para los pasos enteros, dos decimales si no. */
function formatValue(control, value) {
  if (control.step >= 1) return String(Math.round(value));
  const text = value.toFixed(2);
  return control.min < 0 && value > 0 ? `+${text}` : text;
}

export default function LabGrid({ pieces, labels }) {
  const reduced = usePrefersReducedMotion();
  const [seeds, setSeeds] = useState(() =>
    Object.fromEntries(LAB_PIECES.map((piece) => [piece.id, piece.defaultSeed])),
  );
  const [params, setParams] = useState(() =>
    Object.fromEntries(LAB_PIECES.map((piece) => [piece.id, defaultParams(piece.controls)])),
  );

  const reseed = (id) => {
    setSeeds((current) => ({ ...current, [id]: Math.floor(Math.random() * 90000) + 1 }));
  };

  const setParam = (id, key, value) => {
    setParams((current) => ({ ...current, [id]: { ...current[id], [key]: value } }));
  };

  const resetParams = (piece) => {
    setParams((current) => ({ ...current, [piece.id]: defaultParams(piece.controls) }));
  };

  const controlLabels = labels.controls ?? {};

  return (
    <div className="lab-grid">
      {LAB_PIECES.map((piece) => {
        const copy = pieces.find((p) => p.id === piece.id) ?? { title: piece.id, description: "" };
        const seed = seeds[piece.id];
        const values = params[piece.id];
        const pristine = isPristine(piece.controls, values);
        return (
          <article key={piece.id} className={`lab-card group reveal-on-scroll${piece.featured ? " lab-card--wide" : ""}`}>
            <button
              type="button"
              onClick={() => reseed(piece.id)}
              aria-label={`${copy.title} — ${labels.reseed}`}
              className="lab-shot block w-full text-left"
            >
              <div className={`lab-frame relative overflow-hidden bg-ink ${piece.featured ? "aspect-video" : "aspect-[4/3]"}`}>
                <GenerativeCanvas
                  createPiece={piece.create}
                  seed={seed}
                  params={values}
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
            </button>

            <div className="mt-3">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-[-0.02em] text-paper transition group-hover:text-white md:text-2xl">
                  {copy.title}
                </h3>
                <span className="font-mono text-micro uppercase tracking-[0.25em] text-raveRed/70">RT</span>
              </div>
              <p className="mt-1.5 max-w-xl text-meta leading-relaxed text-dim">{copy.description}</p>
            </div>

            <div className="lab-controls">
              <div className="lab-controls__bar">
                <span className="font-mono text-micro uppercase tracking-[0.3em] text-white/45">
                  {labels.controlsTitle}
                </span>
                <button
                  type="button"
                  className="lab-reset font-mono text-micro uppercase tracking-[0.25em]"
                  onClick={() => resetParams(piece)}
                  disabled={pristine}
                >
                  {labels.reset}
                </button>
              </div>
              <div className="lab-controls__grid">
                {piece.controls.map((control) => {
                  const name = controlLabels[control.id] ?? control.id;
                  const value = values[control.id];
                  // El range nativo no expone en CSS cuánto lleva recorrido
                  const fill = ((value - control.min) / (control.max - control.min)) * 100;
                  return (
                    <label key={control.id} className="lab-ctrl">
                      <span className="lab-ctrl__head">
                        <span className="lab-ctrl__name font-mono">{name}</span>
                        <span className="lab-ctrl__value font-mono">{formatValue(control, value)}</span>
                      </span>
                      <input
                        type="range"
                        className="lab-slider"
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        value={value}
                        style={{ "--fill": `${fill}%` }}
                        aria-label={`${copy.title} — ${name}`}
                        onChange={(event) => setParam(piece.id, control.id, Number(event.target.value))}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
