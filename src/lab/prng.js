// Núcleo de Liturgia Máquina: azar notarial (misma semilla, misma obra)
// y ruido de valor con fbm para los campos de fuerza.

/** PRNG mulberry32: determinista, rápido, suficiente para arte generativo */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Utilidades sobre un rand(): rangos, enteros, elección */
export function makeRng(seed) {
  const rand = mulberry32(seed);
  return {
    rand,
    range: (min, max) => min + rand() * (max - min),
    int: (min, max) => Math.floor(min + rand() * (max - min + 1)),
    pick: (arr) => arr[Math.floor(rand() * arr.length)],
    chance: (p) => rand() < p,
  };
}

// ── Ruido de valor 3D con interpolación smoothstep ──
// Hash entero determinista (independiente de la semilla del PRNG: el campo
// se desplaza con offsets derivados de la semilla, no re-hasheando).

function hash3(x, y, z) {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (((h ^ (h >>> 16)) >>> 0) / 4294967296);
}

function smooth(t) {
  return t * t * (3 - 2 * t);
}

/** Ruido de valor en [0,1] sobre coordenadas continuas (x, y, z) */
export function noise3(x, y, z) {
  const xi = Math.floor(x); const yi = Math.floor(y); const zi = Math.floor(z);
  const xf = smooth(x - xi); const yf = smooth(y - yi); const zf = smooth(z - zi);

  const lerp = (a, b, t) => a + (b - a) * t;
  const v000 = hash3(xi, yi, zi);       const v100 = hash3(xi + 1, yi, zi);
  const v010 = hash3(xi, yi + 1, zi);   const v110 = hash3(xi + 1, yi + 1, zi);
  const v001 = hash3(xi, yi, zi + 1);   const v101 = hash3(xi + 1, yi, zi + 1);
  const v011 = hash3(xi, yi + 1, zi + 1); const v111 = hash3(xi + 1, yi + 1, zi + 1);

  return lerp(
    lerp(lerp(v000, v100, xf), lerp(v010, v110, xf), yf),
    lerp(lerp(v001, v101, xf), lerp(v011, v111, xf), yf),
    zf,
  );
}

/** fbm: octavas de noise3, en [0,1] aprox */
export function fbm3(x, y, z, octaves = 3) {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i += 1) {
    value += amp * noise3(x * freq, y * freq, z * freq);
    freq *= 2.03;
    amp *= 0.5;
  }
  return value;
}

// ── Pulso litúrgico ──
// 145 BPM: el mismo tempo oculto que late en el hero del sitio.
export const BPM = 145;
export const BEAT_S = 60 / BPM;

/** Envolvente de pulso en [0,1]: golpe seco con decaimiento exponencial */
export function beatEnv(timeS, beatsPerHit = 1) {
  const phase = (timeS / (BEAT_S * beatsPerHit)) % 1;
  return Math.exp(-phase * 6);
}

/** Índice de beat entero (para disparar eventos cada N golpes) */
export function beatIndex(timeS) {
  return Math.floor(timeS / BEAT_S);
}

// Paleta litúrgica compartida
export const PALETTE = {
  bg: "#050505",
  fade: "rgba(5,5,5,",
  white: "rgba(234,234,234,",
  red: "rgba(177,18,18,",
  hot: "rgba(255,42,42,",
  blood: "rgba(91,0,0,",
};
