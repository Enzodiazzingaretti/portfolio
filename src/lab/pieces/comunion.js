import { makeRng, beatIndex, BEAT_S } from "../prng";

/**
 * COMUNIÓN CELULAR — reacción-difusión de Gray-Scott.
 * Dos químicos virtuales se devoran y regeneran sobre una grilla toroidal;
 * membranas, gusanos y mitosis emergen solo de la ecuación. Cada 16 golpes
 * se inyecta una nueva semilla química para que la misa nunca termine.
 * Paleta: negro → sangre → rojo → blanco incandescente.
 */
const REGIMES = [
  { f: 0.0367, k: 0.0649 },  // mitosis
  { f: 0.037,  k: 0.06 },    // gusanos
  { f: 0.029,  k: 0.057 },   // laberintos
  { f: 0.034,  k: 0.0618 },  // coral
  { f: 0.026,  k: 0.053 },   // caos pulsante
];

export default function createComunion({ w, h, seed }) {
  const rng = makeRng(seed);
  const GW = 160;
  const GH = 120;
  const N = GW * GH;

  const regime = rng.pick(REGIMES);
  const F = regime.f + rng.range(-0.0008, 0.0008);
  const K = regime.k + rng.range(-0.0006, 0.0006);
  const DA = 1.0;
  const DB = 0.48;

  let A = new Float32Array(N).fill(1);
  let B = new Float32Array(N);
  let A2 = new Float32Array(N);
  let B2 = new Float32Array(N);

  function inject(x0, y0, r) {
    for (let y = -r; y <= r; y += 1) {
      for (let x = -r; x <= r; x += 1) {
        if (x * x + y * y > r * r) continue;
        const xi = (x0 + x + GW) % GW;
        const yi = (y0 + y + GH) % GH;
        B[yi * GW + xi] = 1;
      }
    }
  }

  const spots = rng.int(5, 9);
  for (let i = 0; i < spots; i += 1) {
    inject(rng.int(0, GW - 1), rng.int(0, GH - 1), rng.int(2, 4));
  }

  // Buffer de render a resolución de grilla, escalado con suavizado al canvas
  const off = document.createElement("canvas");
  off.width = GW;
  off.height = GH;
  const offCtx = off.getContext("2d");
  const image = offCtx.createImageData(GW, GH);

  function step() {
    for (let y = 0; y < GH; y += 1) {
      const up = ((y - 1 + GH) % GH) * GW;
      const dn = ((y + 1) % GH) * GW;
      const row = y * GW;
      for (let x = 0; x < GW; x += 1) {
        const lf = (x - 1 + GW) % GW;
        const rt = (x + 1) % GW;
        const i = row + x;
        const a = A[i];
        const b = B[i];
        // Laplaciano de 9 puntos (0.2 ejes, 0.05 diagonales)
        const lapA = (A[row + lf] + A[row + rt] + A[up + x] + A[dn + x]) * 0.2
          + (A[up + lf] + A[up + rt] + A[dn + lf] + A[dn + rt]) * 0.05 - a;
        const lapB = (B[row + lf] + B[row + rt] + B[up + x] + B[dn + x]) * 0.2
          + (B[up + lf] + B[up + rt] + B[dn + lf] + B[dn + rt]) * 0.05 - b;
        const abb = a * b * b;
        A2[i] = a + DA * lapA - abb + F * (1 - a);
        B2[i] = b + DB * lapB + abb - (K + F) * b;
      }
    }
    [A, A2] = [A2, A];
    [B, B2] = [B2, B];
  }

  // Rampa de color: negro → sangre → rojo → hot → blanco
  function ramp(v, ch) {
    const stops = [
      [0.00, 5, 5, 5],
      [0.30, 91, 0, 0],
      [0.58, 177, 18, 18],
      [0.82, 255, 42, 42],
      [1.00, 255, 205, 190],
    ];
    for (let i = 1; i < stops.length; i += 1) {
      if (v <= stops[i][0]) {
        const [t0, ...c0] = stops[i - 1];
        const [t1, ...c1] = stops[i];
        const u = (v - t0) / (t1 - t0);
        return c0[ch] + (c1[ch] - c0[ch]) * u;
      }
    }
    return stops[stops.length - 1][ch + 1];
  }

  let lastInjection = -1;

  return {
    warmupFrames: 230,
    frame(ctx, t) {
      // Comunión a tempo: nueva semilla química cada 16 golpes
      const beat = Math.floor(beatIndex(t) / 16);
      if (beat !== lastInjection && t > BEAT_S) {
        lastInjection = beat;
        inject(rng.int(0, GW - 1), rng.int(0, GH - 1), rng.int(2, 3));
      }

      for (let i = 0; i < 9; i += 1) step();

      const data = image.data;
      for (let i = 0; i < N; i += 1) {
        const v = Math.min(Math.max(B[i] * 2.6, 0), 1);
        const j = i * 4;
        data[j] = ramp(v, 0);
        data[j + 1] = ramp(v, 1);
        data[j + 2] = ramp(v, 2);
        data[j + 3] = 255;
      }
      offCtx.putImageData(image, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(off, 0, 0, w, h);
    },
  };
}
