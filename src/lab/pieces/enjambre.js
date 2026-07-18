import { makeRng, BEAT_S, PALETTE } from "../prng";

/**
 * ENJAMBRE 145 — atractor de De Jong en morfosis.
 * Un mapa caótico pliega el plano sobre sí mismo; miles de iteraciones por
 * frame se acumulan en aditivo hasta que la densidad se vuelve incandescente.
 * Los cuatro parámetros derivan lentamente hacia nuevos destinos cada 8
 * compases: el enjambre nunca repite figura, pero nunca rompe su ley.
 */
export default function createEnjambre({ w, h, seed }) {
  const rng = makeRng(seed);

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
  const MORPH_S = BEAT_S * 32; // 8 compases por transición

  let x = 0.1;
  let y = 0.1;

  const cx = w / 2;
  const cy = h / 2;
  const S = Math.min(w, h) * 0.31;
  const ITER = 7500;

  return {
    warmupFrames: 240,
    frame(ctx, t, dt) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `${PALETTE.fade}0.03)`;
      ctx.fillRect(0, 0, w, h);

      u += dt / MORPH_S;
      if (u >= 1) {
        u = 0;
        P = Q;
        Q = newParams();
      }
      // Easing suave del morph: el enjambre respira, no salta
      const e = u * u * (3 - 2 * u);
      const a = P[0] + (Q[0] - P[0]) * e;
      const b = P[1] + (Q[1] - P[1]) * e;
      const c = P[2] + (Q[2] - P[2]) * e;
      const d = P[3] + (Q[3] - P[3]) * e;

      // Brasa única en aditivo: donde el enjambre insiste, el rojo se
      // acumula hasta blanco — la incandescencia es densidad, no paleta
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `${PALETTE.hot}0.10)`;
      for (let i = 0; i < ITER; i += 1) {
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
