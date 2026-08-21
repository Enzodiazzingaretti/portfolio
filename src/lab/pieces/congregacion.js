import { makeRng, fbm3, beatEnv, PALETTE } from "../prng";
import { paramReader } from "../controls";

/**
 * CONGREGACIÓN — campo de flujo litúrgico.
 * Cientos de partículas siguen un campo de ruido fbm que muta lentamente.
 * La luz es memoria: los trazos se acumulan sobre un fade translúcido.
 * El pulso a 145 BPM inyecta velocidad; las "brasas" (15%) queman en rojo aditivo.
 */

/** Multiplicadores sobre lo que fijó la semilla: en 1 la obra es la notarial. */
export const controls = [
  { id: "densidad", min: 0.15, max: 1, step: 0.01, def: 1 },
  { id: "campo", min: 0.4, max: 2.4, step: 0.01, def: 1 },
  { id: "turbulencia", min: 0.3, max: 2.5, step: 0.01, def: 1 },
  { id: "estela", min: 0.25, max: 3, step: 0.01, def: 1 },
];

export default function createCongregacion({ w, h, seed, params }) {
  const rng = makeRng(seed);
  const p = paramReader(controls, params);

  const COUNT = Math.round((w * h) / 760);
  const ox = rng.range(0, 200);
  const oy = rng.range(0, 200);
  const oz = rng.range(0, 200);
  const scale = rng.range(0.0022, 0.0034);   // frecuencia espacial del campo
  const curl = rng.pick([2, 2, 3]);          // vueltas: 3 es más turbulento
  const drift = rng.range(0.024, 0.04);      // mutación temporal del campo

  const px = new Float32Array(COUNT);
  const py = new Float32Array(COUNT);
  const temper = new Float32Array(COUNT);    // personalidad de velocidad
  const ember = new Uint8Array(COUNT);       // 1 = brasa roja aditiva

  for (let i = 0; i < COUNT; i += 1) {
    px[i] = rng.range(0, w);
    py[i] = rng.range(0, h);
    temper[i] = rng.rand();
    ember[i] = rng.chance(0.15) ? 1 : 0;
  }

  return {
    warmupFrames: 260,
    frame(ctx, t, dt) {
      // Un solo read por frame: adentro del loop serían 900 lecturas por pasada
      const alive = Math.max(1, Math.round(COUNT * p("densidad")));
      const fieldScale = scale * p("campo");
      const twist = Math.PI * 2 * curl * p("turbulencia");
      const fade = 0.022 / p("estela");

      const f = dt * 60;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `${PALETTE.fade}${fade.toFixed(4)})`;
      ctx.fillRect(0, 0, w, h);

      const pulse = beatEnv(t);
      const zt = oz + t * drift;

      // Dos pasadas batcheadas: fieles (blanco tenue) y brasas (rojo aditivo)
      for (let pass = 0; pass < 2; pass += 1) {
        ctx.beginPath();
        for (let i = 0; i < alive; i += 1) {
          if (ember[i] !== pass) continue;
          const angle = fbm3(px[i] * fieldScale + ox, py[i] * fieldScale + oy, zt) * twist;
          const speed = (0.5 + temper[i] * 0.95) * (1 + pulse * 1.7) * f;
          const nx = px[i] + Math.cos(angle) * speed;
          const ny = py[i] + Math.sin(angle) * speed;
          ctx.moveTo(px[i], py[i]);
          ctx.lineTo(nx, ny);
          px[i] = nx;
          py[i] = ny;
          // Renacer fuera de límites: la congregación nunca se disuelve
          if (nx < -4 || nx > w + 4 || ny < -4 || ny > h + 4) {
            px[i] = Math.abs((nx * 7919 + ny * 104729) % w);
            py[i] = Math.abs((ny * 7919 + nx * 104729) % h);
          }
        }
        if (pass === 0) {
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = `${PALETTE.white}${0.17 + pulse * 0.05})`;
          ctx.lineWidth = 1;
        } else {
          ctx.globalCompositeOperation = "lighter";
          ctx.strokeStyle = `${PALETTE.hot}${0.24 + pulse * 0.12})`;
          ctx.lineWidth = 1.35;
        }
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
    },
  };
}
