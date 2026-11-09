/**
 * Diseño sonoro de la interfaz (2026-11-08): apagado por defecto, se prende
 * desde la barra (SonidoToggle) y queda guardado. Todo se sintetiza con
 * WebAudio, sin archivos, y en la misma tonalidad (la menor: La 220 Hz):
 * - roce: un ruido filtrado de 30 ms al pasar por una obra o un link (solo
 *   con mouse)
 * - abrir: un golpe grave y un brillo, al abrir una obra en el visor
 * - cerrar: el golpe sin brillo, más corto
 * - color: un acorde de tres notas al cambiar la paleta
 */
const CLAVE = "sonido";
let ctx = null;
let salida = null;
let activo = false;
const oyentes = new Set();

try {
  activo = typeof localStorage !== "undefined" && localStorage.getItem(CLAVE) === "1";
} catch {
  activo = false;
}

export const sonidoActivo = () => activo;

export function alCambiarSonido(fn) {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}

function asegurar() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  salida = ctx.createGain();
  salida.gain.value = 0.5;
  // Un compresor suave: ningún sonido salta por encima de los otros
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 4;
  salida.connect(comp).connect(ctx.destination);
  return ctx;
}

export function activarSonido(si) {
  activo = si;
  try {
    if (si) localStorage.setItem(CLAVE, "1");
    else localStorage.removeItem(CLAVE);
  } catch {
    /* sin localStorage: dura la visita */
  }
  if (si) {
    asegurar()?.resume?.();
    sonar("color");
  }
  oyentes.forEach((fn) => fn(si));
}

function tono(frec, { t = 0, dur = 0.3, vol = 0.2, tipo = "sine", ataque = 0.004 } = {}) {
  const ahora = ctx.currentTime + t;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = tipo;
  osc.frequency.value = frec;
  g.gain.setValueAtTime(0, ahora);
  g.gain.linearRampToValueAtTime(vol, ahora + ataque);
  g.gain.exponentialRampToValueAtTime(0.0001, ahora + dur);
  osc.connect(g).connect(salida);
  osc.start(ahora);
  osc.stop(ahora + dur + 0.05);
  return osc;
}

function ruido({ dur = 0.03, vol = 0.05, frec = 4200 } = {}) {
  const largo = Math.ceil(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, largo, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < largo; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / largo) ** 2;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filtro = ctx.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.frequency.value = frec;
  filtro.Q.value = 1.4;
  const g = ctx.createGain();
  g.gain.value = vol;
  src.connect(filtro).connect(g).connect(salida);
  src.start();
}

let ultimoRoce = 0;

export function sonar(que) {
  if (!activo || !asegurar()) return;
  if (ctx.state === "suspended") ctx.resume();
  if (que === "roce") {
    const ahora = performance.now();
    if (ahora - ultimoRoce < 70) return;
    ultimoRoce = ahora;
    ruido({ dur: 0.028, vol: 0.035, frec: 3800 + Math.random() * 900 });
  } else if (que === "abrir") {
    const o = tono(110, { dur: 0.45, vol: 0.32 });
    o.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.4);
    tono(1320, { t: 0.02, dur: 0.5, vol: 0.035, tipo: "triangle", ataque: 0.01 });
    tono(1760, { t: 0.06, dur: 0.6, vol: 0.025, tipo: "triangle", ataque: 0.01 });
  } else if (que === "cerrar") {
    const o = tono(98, { dur: 0.25, vol: 0.24 });
    o.frequency.exponentialRampToValueAtTime(49, ctx.currentTime + 0.22);
  } else if (que === "color") {
    [440, 523.25, 659.25].forEach((f, i) => tono(f, { t: i * 0.045, dur: 0.7, vol: 0.05, tipo: "triangle", ataque: 0.01 }));
  }
}

// Roce al pasar con el mouse por una obra, una fila del índice o un link
if (typeof document !== "undefined") {
  const fino = () => window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
  let ultimo = null;
  document.addEventListener(
    "pointerover",
    (e) => {
      if (!activo || e.pointerType !== "mouse" || !fino()) return;
      const el = e.target?.closest?.("a, button, [data-obra]");
      if (!el || el === ultimo) return;
      ultimo = el;
      sonar("roce");
    },
    { passive: true },
  );
}
