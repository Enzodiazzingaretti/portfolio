/**
 * El tempo del sitio (2026-11-08, a pedido: «que tenga mi personalidad»):
 * todo lo que late, late a 124 BPM y en fase. Un solo reloj para la
 * escultura de vidrio (HeroGlass lo lee) y para los puntos de la interfaz
 * con `data-pulso`, que reciben `--pulso` (0–1, golpe con caída) en un rAF
 * propio que solo toca esos pocos nodos. Quieto con movimiento reducido,
 * sin placa de video o con la pestaña oculta.
 */
export const BPM = 124;
const PERIODO = 60000 / BPM;

/** Envolvente del golpe: sube de golpe y cae en ~un cuarto del compás */
export function pulso(ahora = performance.now()) {
  const fase = (ahora % PERIODO) / PERIODO;
  return Math.exp(-fase * 7);
}

let raf = 0;

function quieto() {
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("sin-gpu")
  );
}

function latir() {
  raf = requestAnimationFrame(latir);
  if (document.hidden) return;
  const v = pulso().toFixed(3);
  document.querySelectorAll("[data-pulso]").forEach((el) => el.style.setProperty("--pulso", v));
}

export function iniciarPulso() {
  if (typeof window === "undefined" || raf || quieto()) return;
  raf = requestAnimationFrame(latir);
}
