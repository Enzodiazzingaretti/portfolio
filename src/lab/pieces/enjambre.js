import { makeRng, BEAT_S, PALETTE } from "../prng";
import { paramReader } from "../controls";

/**
 * ENJAMBRE 145 — atractor de De Jong en morfosis.
 * Un mapa caótico pliega el plano sobre sí mismo; miles de iteraciones por
 * frame se acumulan en aditivo hasta que la densidad se vuelve incandescente.
 * Los cuatro parámetros derivan lentamente hacia nuevos destinos cada 8
 * compases: el enjambre nunca repite figura, pero nunca rompe su ley.
 */

/** `plegado` escala los cuatro parámetros del mapa; en 1 son los de la semilla. */
export const controls = [
  { id: "densidad", min: 0.25, max: 2, step: 0.01, def: 1 },
  { id: "plegado", min: 0.6, max: 1.4, step: 0.01, def: 1 },
  { id: "morfosis", min: 0.25, max: 3, step: 0.01, def: 1 },
  { id: "estela", min: 0.25, max: 3, step: 0.01, def: 1 },
];

export default function createEnjambre({ w, h, seed, params }) {
  const rng = makeRng(seed);
  const p = paramReader(controls, params);

  function newParams() {
    return [
      rng.range(1.4, 2.6) * (rng.chance(0.5) ? 1 : -1),
      rng.range(1.4, 2.6) * (rng.chance(0.5) ? 1 : -1),
      rng.range(1.4, 2.6) * (rng.chance(0.5) ? 1 : -1),
      rng.range(1.4, 2.6) * (rng.chance(0.5) ? 1 : -1),
    ];
  }

  let P = newParams();
  let Q = newParams();
  let u = 0;
  const MORPH_BASE = BEAT_S * 32; // 8 compases por transición

  let x = 0.1;
  let y = 0.1;

  const cx = w / 2;
  const cy = h / 2;
  const S = Math.min(w, h) * 0.31;
  const ITER = 7500;

  return {
    warmupFrames: 240,
    frame(ctx, t, dt) {
      const fold = p("plegado");
      const iters = Math.round(ITER * p("densidad"));
      const fade = 0.03 / p("estela");

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `${PALETTE.fade}${fade.toFixed(4)})`;
      ctx.fillRect(0, 0, w, h);

      u += dt / (MORPH_BASE / p("morfosis"));
      if (u >= 1) {
        u = 0;
        P = Q;
        Q = newParams();
      }
      // Easing suave del morph: el enjambre respira, no salta
      const e = u * u * (3 - 2 * u);
      const a = (P[0] + (Q[0] - P[0]) * e) * fold;
      const b = (P[1] + (Q[1] - P[1]) * e) * fold;
      const c = (P[2] + (Q[2] - P[2]) * e) * fold;
      const d = (P[3] + (Q[3] - P[3]) * e) * fold;

      // Brasa única en aditivo: donde el enjambre insiste, el rojo se
      // acumula hasta blanco — la incandescencia es densidad, no paleta
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `${PALETTE.hot}0.10)`;
      for (let i = 0; i < iters; i += 1) {
        const nx = Math.sin(a * y) - Math.cos(b * x);
        const ny = Math.sin(c * x) - Math.cos(d * y);
        x = nx;
        y = ny;
        ctx.fillRect(cx + x * S, cy + y * S, 1, 1);
      }
      ctx.globalCompositeOperation = "source-over";
    },
  };
}
