import { makeRng, beatEnv, beatIndex, PALETTE } from "../prng";
import { paramReader } from "../controls";

/**
 * VELO DEL TEMPLO — tela de Verlet que se rasga a tempo.
 * Una retícula de 30x20 nudos colgada de la viga superior, resuelta con
 * relajación de restricciones. El viento la infla, la gravedad la cuelga y
 * cada golpe a 145 BPM la sacude; los hilos que se estiran más allá de su
 * límite se cortan y no vuelven — el velo se rompe de a poco hasta que, cada
 * 16 golpes, se vuelve a tejer entero. Los hilos bajo tensión queman en rojo.
 *
 * El paso de integración es fijo (60 Hz, hasta 3 subpasos por frame): con
 * dt variable, un frame largo estira las restricciones más de lo que la
 * relajación puede corregir y la tela explota.
 */

/** `desgarro` sube = corta antes; en el mínimo el velo es indestructible. */
export const controls = [
  { id: "gravedad", min: 0, max: 2.5, step: 0.01, def: 1 },
  { id: "viento", min: 0, max: 2.5, step: 0.01, def: 1 },
  { id: "rigidez", min: 1, max: 6, step: 1, def: 3 },
  { id: "desgarro", min: 0.3, max: 3, step: 0.01, def: 1 },
];

const GW = 30;
const GH = 20;
const STEP_S = 1 / 60;
const DAMP = 0.985;
const TEAR_BASE = 1.9;   // múltiplo del largo de reposo al que se corta un hilo
const TEAR_FLOOR = 1.15; // por debajo de esto el velo se haría polvo en un frame
const TEAR_ON = 0.3;     // el hilo solo se puede cortar mientras dura el golpe
const REWEAVE_AT = 0.45; // si queda menos que esto en pie, se teje sin esperar
const ONSCREEN_AT = 0.25; // ídem si el velo se desprendió y se está yendo del cuadro

export default function createVelo({ w, h, seed, params }) {
  const rng = makeRng(seed);
  const p = paramReader(controls, params);

  const N = GW * GH;
  const x = new Float32Array(N);
  const y = new Float32Array(N);
  const ox = new Float32Array(N);
  const oy = new Float32Array(N);
  const pinned = new Uint8Array(N);

  const spacing = (w * 0.66) / (GW - 1);   // deja aire a los costados para el vuelo
  const originX = (w - spacing * (GW - 1)) / 2;
  const originY = h * 0.14;

  // Restricciones estructurales: derecha y abajo. Se guardan planas para no
  // recorrer objetos 1.100 veces por subpaso.
  const ca = new Int32Array(N * 2);
  const cb = new Int32Array(N * 2);
  const crest = new Float32Array(N * 2);
  const calive = new Uint8Array(N * 2);
  let cCount = 0;

  const pinPhase = rng.int(0, 2);   // de qué nudos cuelga el velo
  let alive = 0;   // hilos en pie, para saber cuándo el velo ya no es un velo

  function weave() {
    for (let row = 0; row < GH; row += 1) {
      for (let col = 0; col < GW; col += 1) {
        const i = row * GW + col;
        x[i] = originX + col * spacing;
        y[i] = originY + row * spacing;
        ox[i] = x[i];
        oy[i] = y[i];
        pinned[i] = row === 0 && (col % 3 === pinPhase || col === 0 || col === GW - 1) ? 1 : 0;
      }
    }
    cCount = 0;
    for (let row = 0; row < GH; row += 1) {
      for (let col = 0; col < GW; col += 1) {
        const i = row * GW + col;
        if (col < GW - 1) { ca[cCount] = i; cb[cCount] = i + 1; crest[cCount] = spacing; calive[cCount] = 1; cCount += 1; }
        if (row < GH - 1) { ca[cCount] = i; cb[cCount] = i + GW; crest[cCount] = spacing; calive[cCount] = 1; cCount += 1; }
      }
    }
    alive = cCount;
  }

  weave();

  const MAX_V = spacing * 0.6;   // techo de velocidad por subpaso
  let acc = 0;
  let epoch = -1;
  let clock = 0;
  let onscreen = N;

  function simulate(gravity, wind, iterations, tearAt) {
    // El corte va atado al golpe y no a la tensión sola. Si dependiera solo
    // de cuánto se estira un hilo, subir gravedad o bajar rigidez rompía el
    // velo entero en un segundo y el lienzo quedaba vacío hasta el próximo
    // tejido: dos sliders que no hablan de desgarro lo destruían igual.
    // Racha: dos senoidales desfasadas hacen un viento que nunca se repite
    // igual, sin el coste de un campo de ruido por nudo
    const gust = (Math.sin(clock * 0.83) * 0.6 + Math.sin(clock * 0.31 + 1.7) * 0.4) * wind;
    const beat = beatEnv(clock, 1);
    // El latigazo alterna de lado en cada golpe. Con signo fijo, beatEnv es
    // siempre positivo y suma una componente constante: deja de ser un
    // sacudón y se vuelve un viento que empuja el velo fuera del cuadro.
    const whip = beat * wind * 0.55 * (beatIndex(clock) % 2 ? 1 : -1);
    const canTear = beat > TEAR_ON;

    onscreen = 0;
    for (let i = 0; i < N; i += 1) {
      if (y[i] > -h && y[i] < h * 1.05 && x[i] > -w * 0.5 && x[i] < w * 1.5) onscreen += 1;
      if (pinned[i]) continue;
      let vx = (x[i] - ox[i]) * DAMP;
      let vy = (y[i] - oy[i]) * DAMP;
      // Techo de velocidad: con gravedad o viento al máximo, un nudo puede
      // tomar más velocidad de la que la relajación alcanza a corregir y el
      // paño entero se dispara fuera del lienzo
      const v2 = vx * vx + vy * vy;
      if (v2 > MAX_V * MAX_V) {
        const k = MAX_V / Math.sqrt(v2);
        vx *= k;
        vy *= k;
      }
      ox[i] = x[i];
      oy[i] = y[i];
      // El viento empuja más abajo del velo, que es donde la tela sobra
      const depth = 0.35 + (y[i] - originY) / (h * 0.9);
      x[i] += vx + (gust * 0.095 + whip) * depth;
      y[i] += vy + gravity * 0.30 - beat * 0.07;
    }

    for (let k = 0; k < iterations; k += 1) {
      for (let c = 0; c < cCount; c += 1) {
        if (!calive[c]) continue;
        const a = ca[c];
        const b = cb[c];
        const dx = x[b] - x[a];
        const dy = y[b] - y[a];
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        const rest = crest[c];
        if (canTear && dist > rest * tearAt) { calive[c] = 0; alive -= 1; continue; }
        const diff = (dist - rest) / dist * 0.5;
        const mx = dx * diff;
        const my = dy * diff;
        if (!pinned[a]) { x[a] += mx; y[a] += my; }
        if (!pinned[b]) { x[b] -= mx; y[b] -= my; }
      }
    }
  }

  return {
    warmupFrames: 200,
    frame(ctx, t, dt) {
      const gravity = p("gravedad");
      const wind = p("viento");
      const iterations = Math.round(p("rigidez"));
      const tearAt = Math.max(TEAR_FLOOR, TEAR_BASE / p("desgarro"));

      // Se vuelve a tejer cada 16 golpes, y antes si ya quedan jirones: sin
      // esa segunda condición, con el desgarro al máximo el lienzo se queda
      // en negro esperando el final de la época
      const currentEpoch = Math.floor(beatIndex(t) / 16);
      if (currentEpoch !== epoch || alive < cCount * REWEAVE_AT || onscreen < N * ONSCREEN_AT) {
        epoch = currentEpoch;
        weave();
      }

      acc += dt;
      let steps = 0;
      while (acc >= STEP_S && steps < 3) {
        clock = t - acc;
        simulate(gravity, wind, iterations, tearAt);
        acc -= STEP_S;
        steps += 1;
      }
      if (acc > STEP_S) acc = STEP_S;   // frame larguísimo: se descarta el atraso

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `${PALETTE.fade}0.5)`;
      ctx.fillRect(0, 0, w, h);

      // Dos caminos: hilo flojo y hilo tenso. Un stroke por estado, no por hilo.
      const slack = new Path2D();
      const taut = new Path2D();
      // El solver deja los hilos cerca del largo de reposo: si el umbral de
      // "tenso" fuera un porcentaje alto del de corte, nunca se encendería
      const tautAt = 1 + (tearAt - 1) * 0.16;
      for (let c = 0; c < cCount; c += 1) {
        if (!calive[c]) continue;
        const a = ca[c];
        const b = cb[c];
        const dx = x[b] - x[a];
        const dy = y[b] - y[a];
        const path = dx * dx + dy * dy > (crest[c] * tautAt) ** 2 ? taut : slack;
        path.moveTo(x[a], y[a]);
        path.lineTo(x[b], y[b]);
      }

      ctx.strokeStyle = `${PALETTE.white}0.26)`;
      ctx.lineWidth = 1;
      ctx.stroke(slack);
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = `${PALETTE.hot}0.42)`;
      ctx.lineWidth = 1.2;
      ctx.stroke(taut);
      ctx.globalCompositeOperation = "source-over";
    },
  };
}
