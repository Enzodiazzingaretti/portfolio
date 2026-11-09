import { flushSync } from "react-dom";
import { sonar } from "./sonido";

/**
 * La pieza crece hasta el visor y vuelve a su lugar al cerrarlo (View
 * Transitions, 2026-11-08). La tarjeta tocada (`[data-obra]`) y el medio del
 * visor (`[data-obra-visor]`) comparten un nombre de transición solo durante
 * el cambio; el navegador interpola tamaño y lugar. Sin soporte o con
 * movimiento reducido, se abre y se cierra como siempre.
 */
let tocada = null;
let abierta = null;

if (typeof document !== "undefined") {
  document.addEventListener(
    "pointerdown",
    (e) => {
      tocada = e.target?.closest?.("[data-obra]") ?? null;
    },
    true,
  );
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Enter" || e.key === " ") tocada = document.activeElement?.querySelector?.("[data-obra]") ?? null;
    },
    true,
  );
}

const puede = () =>
  typeof document !== "undefined" &&
  Boolean(document.startViewTransition) &&
  !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches &&
  !document.documentElement.classList.contains("sin-gpu");

const visor = () => document.querySelector("[data-obra-visor]");

export function abrirObra(cambio) {
  sonar("abrir");
  const origen = tocada;
  tocada = null;
  if (!puede() || !origen?.isConnected) {
    cambio();
    return;
  }
  abierta = origen;
  origen.style.viewTransitionName = "obra";
  document.startViewTransition(() => {
    origen.style.viewTransitionName = "";
    flushSync(cambio);
    const v = visor();
    if (v) v.style.viewTransitionName = "obra";
  }).finished.finally(() => {
    const v = visor();
    if (v) v.style.viewTransitionName = "";
  });
}

/** `mismaPieza`: si el visor sigue en la obra que se abrió, vuelve a ella */
export function cerrarObra(cambio, mismaPieza = true) {
  sonar("cerrar");
  const destino = abierta;
  abierta = null;
  const v = visor();
  if (!puede() || !mismaPieza || !destino?.isConnected || !v) {
    cambio();
    return;
  }
  v.style.viewTransitionName = "obra";
  document.startViewTransition(() => {
    flushSync(cambio);
    destino.style.viewTransitionName = "obra";
  }).finished.finally(() => {
    destino.style.viewTransitionName = "";
  });
}
