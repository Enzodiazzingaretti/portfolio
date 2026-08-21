import { makeRng, beatEnv, beatIndex, PALETTE } from "../prng";
import { paramReader } from "../controls";

/**
 * SALMO DE ARENA — figuras de Chladni.
 * Una placa cuadrada vibra en un modo (n, m) y la arena camina al azar con un
 * paso proporcional a cuánto se mueve la placa bajo ella: donde la amplitud es
 * cero el grano se queda quieto, así que el polvo se acumula solo sobre las
 * líneas nodales. Nadie dibuja la figura — la figura es el único lugar donde
 * la arena puede descansar. La placa se golpea a 145 BPM y cambia de modo cada
 * 16 golpes.
 */

/** `modo` corre el modo n que fijó la semilla; `simetria` pesa el segundo término. */
export const controls = [
  { id: "modo", min: -3, max: 4, step: 1, def: 0 },
  { id: "simetria", min: 0, max: 1.5, step: 0.01, def: 1 },
  { id: "agitacion", min: 0.3, max: 2.5, step: 0.01, def: 1 },
  { id: "densidad", min: 0.2, max: 1, step: 0.01, def: 1 },
];

export default function createSalmo({ w, h, seed, params }) {
  const rng = makeRng(seed);
  const p = paramReader(controls, params);

  const COUNT = 7000;
  const px = new Float32Array(COUNT);
  const py = new Float32Array(COUNT);
  const hot = new Uint8Array(COUNT);

  for (let i = 0; i < COUNT; i += 1) {
    px[i] = rng.rand();
    py[i] = rng.rand();
  }

  let baseN = rng.int(2, 6);
  let baseM = rng.int(2, 7);
  let epoch = -1;

  const STEP = 0.021;   // paso máximo en unidades de placa (~17 px de 800)
  const PI = Math.PI;

  return {
    warmupFrames: 420,
    frame(ctx, t, dt) {
      // Modo nuevo cada 16 golpes: el salmo cambia de estrofa
      const currentEpoch = Math.floor(beatIndex(t) / 16);
      if (currentEpoch !== epoch) {
        epoch = currentEpoch;
        baseN = rng.int(2, 6);
        baseM = rng.int(2, 7);
      }

      let n = baseN + Math.round(p("modo"));
      const m = baseM;
      n = Math.min(Math.max(n, 1), 9);
      // Con n === m y simetría en 1 los dos términos se cancelan: placa muerta
      if (n === m) n = m === 9 ? 8 : n + 1;

      const sym = p("simetria");
      const agit = p("agitacion");
      const alive = Math.max(1, Math.round(COUNT * p("densidad")));
      const f = Math.min(dt * 60, 2);
      // El golpe sacude la placa entera y la arena vuelve a saltar. El piso
      // (`kick`) es lo que hace que el pulso se vea: sobre la línea nodal la
      // amplitud es cero, así que un golpe multiplicativo no movería nada.
      const env = beatEnv(t, 1);
      const strike = 1 + env * 1.35;
      const kick = env * 0.14;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `${PALETTE.fade}0.075)`;
      ctx.fillRect(0, 0, w, h);

      const rand = rng.rand;
      for (let i = 0; i < alive; i += 1) {
        const x = px[i];
        const y = py[i];
        const u = Math.cos(n * PI * x) * Math.cos(m * PI * y)
          - sym * Math.cos(m * PI * x) * Math.cos(n * PI * y);
        const amp = Math.abs(u);
        const step = (amp + kick) * STEP * agit * strike * f;
        let nx = x + (rand() - 0.5) * 2 * step;
        let ny = y + (rand() - 0.5) * 2 * step;
        // Rebote en el marco: la arena no se cae de la placa
        if (nx < 0) nx = -nx; else if (nx > 1) nx = 2 - nx;
        if (ny < 0) ny = -ny; else if (ny > 1) ny = 2 - ny;
        px[i] = nx;
        py[i] = ny;
        hot[i] = amp > 0.45 ? 1 : 0;
      }

      ctx.globalCompositeOperation = "lighter";
      // Grano quieto: fósforo sobre la línea nodal
      ctx.fillStyle = `${PALETTE.white}0.30)`;
      for (let i = 0; i < alive; i += 1) if (!hot[i]) ctx.fillRect(px[i] * w, py[i] * h, 1, 1);
      // Grano saltando: donde la placa golpea más fuerte
      ctx.fillStyle = `${PALETTE.hot}0.30)`;
      for (let i = 0; i < alive; i += 1) if (hot[i]) ctx.fillRect(px[i] * w, py[i] * h, 1, 1);
      ctx.globalCompositeOperation = "source-over";
    },
  };
}
