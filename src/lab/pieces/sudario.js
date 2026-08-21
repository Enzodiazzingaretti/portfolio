import { makeRng, noise3, beatEnv, PALETTE } from "../prng";
import { paramReader } from "../controls";

/**
 * SUDARIO — nube de puntos deformada por un campo de ruido.
 * Un cuerpo de 5.200 puntos repartidos sobre una esfera irregular gira en 3D
 * mientras un campo de ruido que deriva lo hincha y lo hunde radialmente: la
 * forma nunca termina de cerrar. Los puntos que el campo estira más allá del
 * cuerpo queman en rojo aditivo; el resto es fósforo blanco, más brillante
 * cuanto más cerca de la cámara. El pulso a 145 BPM lo expande de golpe.
 */

/** `deformacion` en 0 devuelve el cuerpo intacto; en 2 lo disuelve. */
export const controls = [
  { id: "densidad", min: 0.2, max: 1, step: 0.01, def: 1 },
  { id: "deformacion", min: 0, max: 2, step: 0.01, def: 1 },
  { id: "campo", min: 0.4, max: 2.4, step: 0.01, def: 1 },
  { id: "rotacion", min: 0, max: 2.5, step: 0.01, def: 1 },
];

export default function createSudario({ w, h, seed, params }) {
  const rng = makeRng(seed);
  const p = paramReader(controls, params);

  const COUNT = 5200;
  const ox = rng.range(0, 200);
  const oy = rng.range(0, 200);
  const oz = rng.range(0, 200);
  const lumpFreq = rng.range(1.2, 2.1);   // qué tan irregular es el cuerpo
  const drift = rng.range(0.16, 0.28);    // mutación temporal del campo

  const hx = new Float32Array(COUNT);
  const hy = new Float32Array(COUNT);
  const hz = new Float32Array(COUNT);

  // Esfera de Fibonacci: reparto parejo, sin la acumulación en los polos que
  // deja el muestreo por lat/lon
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < COUNT; i += 1) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    // Jitter angular: sin él, la espiral de Fibonacci se lee como una trama
    // regular de puntos —moiré de malla 3D, no polvo
    const th = golden * i + rng.range(-0.09, 0.09);
    const x = Math.cos(th) * r;
    const z = Math.sin(th) * r;
    // El radio lo modula un ruido de baja frecuencia: cuerpo, no pelota
    const lump = (0.74 + noise3(x * lumpFreq + ox, y * lumpFreq + oy, z * lumpFreq + oz) * 0.52)
      * (1 + rng.range(-0.045, 0.045));
    hx[i] = x * lump;
    hy[i] = y * lump;
    hz[i] = z * lump;
  }

  // Buffers de pantalla: se llenan una vez por frame y se dibujan en tres
  // pasadas con un solo fillStyle cada una. Cambiar el estilo por punto son
  // 5.200 cambios de contexto por frame.
  const sx = new Float32Array(COUNT);
  const sy = new Float32Array(COUNT);
  const bucket = new Uint8Array(COUNT);

  const cx = w / 2;
  const cy = h / 2;
  const SCALE = Math.min(w, h) * 0.25;
  const FOV = 3.2;   // cámara en z = 3.2: perspectiva marcada sin deformar los bordes

  let angle = 0;

  return {
    warmupFrames: 90,
    frame(ctx, t, dt) {
      const amp = p("deformacion");
      const freq = 0.9 * p("campo");
      const alive = Math.max(1, Math.round(COUNT * p("densidad")));
      // Acumulador y no t * velocidad: si fuera t * k, mover el slider
      // teletransportaría el giro en vez de acelerarlo
      angle += dt * 0.26 * p("rotacion");

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `${PALETTE.fade}0.20)`;
      ctx.fillRect(0, 0, w, h);

      const pulse = beatEnv(t, 2);
      const zt = oz + t * drift;
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      const tilt = Math.sin(t * 0.11) * 0.22;   // cabeceo lento
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);

      let nFar = 0;
      let nNear = 0;
      let nHot = 0;
      for (let i = 0; i < alive; i += 1) {
        const x0 = hx[i];
        const y0 = hy[i];
        const z0 = hz[i];
        const n = noise3(x0 * freq + ox, y0 * freq + oy, z0 * freq + zt) - 0.5;
        const d = 1 + n * amp + pulse * 0.14 * amp;
        const x = x0 * d;
        const y = y0 * d;
        const z = z0 * d;
        // Giro en Y y cabeceo en X
        const rx = x * ca - z * sa;
        const rz = x * sa + z * ca;
        const ry = y * ct - rz * st;
        const rz2 = y * st + rz * ct;
        const s = FOV / (FOV + rz2);
        sx[i] = cx + rx * s * SCALE;
        sy[i] = cy + ry * s * SCALE;
        // 2 = estirado (quema), 1 = cerca, 0 = lejos
        const b = n * amp > 0.25 ? 2 : s > 1.02 ? 1 : 0;
        bucket[i] = b;
        if (b === 2) nHot += 1; else if (b === 1) nNear += 1; else nFar += 1;
      }

      ctx.globalCompositeOperation = "lighter";
      // Lejos: polvo tenue
      if (nFar) {
        ctx.fillStyle = `${PALETTE.white}0.16)`;
        for (let i = 0; i < alive; i += 1) if (bucket[i] === 0) ctx.fillRect(sx[i], sy[i], 1, 1);
      }
      // Cerca: fósforo
      if (nNear) {
        ctx.fillStyle = `${PALETTE.white}${(0.30 + pulse * 0.10).toFixed(3)})`;
        for (let i = 0; i < alive; i += 1) if (bucket[i] === 1) ctx.fillRect(sx[i], sy[i], 1.5, 1.5);
      }
      // Lo que el campo arrancó del cuerpo
      if (nHot) {
        ctx.fillStyle = `${PALETTE.hot}${(0.26 + pulse * 0.14).toFixed(3)})`;
        for (let i = 0; i < alive; i += 1) if (bucket[i] === 2) ctx.fillRect(sx[i], sy[i], 1.5, 1.5);
      }
      ctx.globalCompositeOperation = "source-over";
    },
  };
}
