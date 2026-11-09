import { flushSync } from "react-dom";
import { sonar } from "./sonido";

/**
 * La pieza crece hasta el visor y vuelve a su lugar al cerrarlo (View
 * Transitions, 2026-11-08). Comparten el nombre `obra`, solo durante el
 * cambio, la imagen de la tarjeta tocada (`[data-obra]`) y la del visor
 * (`[data-obra-visor]`), que tiene el formato real de la obra: así el
 * navegador interpola una sola imagen sin deformarla.
 *
 * Tres detalles que la hacían tosca (2026-11-09, «se ve medio tosca»):
 * - el visor pide otra imagen, más grande: la transición espera a que esté
 *   decodificada (tope de 500 ms), si no la obra crecía hacia un cuadro vacío
 * - el panel del visor tenía su propia entrada (escala y desplazamiento) y
 *   la obra daba un salto al final para acomodarse: durante la transición
 *   se apaga (`html.vt-obra`)
 * - la inclinación que sigue al mouse quedaba en la foto de partida
 *
 * Sin soporte, con movimiento reducido o sin placa de video, se abre y se
 * cierra como siempre.
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

/** La imagen (o el video) de una tarjeta o del visor, no su caja */
const medio = (raiz) => raiz?.querySelector?.("img, video") ?? raiz ?? null;
const visor = () => medio(document.querySelector("[data-obra-visor]"));

/** Espera a que la imagen o el video tengan algo que mostrar, con tope */
function cargado(el, tope = 500) {
  return new Promise((listo) => {
    if (!el) return listo();
    const corte = window.setTimeout(listo, tope);
    const ok = () => {
      window.clearTimeout(corte);
      listo();
    };
    if (el.tagName === "IMG") {
      if (el.complete && el.naturalWidth) return ok();
      if (el.decode) el.decode().then(ok, ok);
      else el.addEventListener("load", ok, { once: true });
    } else if (el.tagName === "VIDEO") {
      if (el.readyState >= 2) return ok();
      el.addEventListener("loadeddata", ok, { once: true });
    } else ok();
    return undefined;
  });
}

const nombrar = (el, nombre) => {
  if (el) el.style.viewTransitionName = nombre;
};

function transicion(actualizar) {
  const html = document.documentElement;
  html.classList.add("vt-obra");
  const vt = document.startViewTransition(actualizar);
  vt.finished.finally(() => html.classList.remove("vt-obra"));
  return vt;
}

export function abrirObra(cambio) {
  sonar("abrir");
  const origen = medio(tocada);
  tocada = null;
  if (!puede() || !origen?.isConnected) {
    cambio();
    return;
  }
  abierta = origen;
  nombrar(origen, "obra");
  transicion(async () => {
    nombrar(origen, "");
    flushSync(cambio);
    const destino = visor();
    await cargado(destino);
    nombrar(destino, "obra");
  }).finished.finally(() => nombrar(visor(), ""));
}

/** `mismaPieza`: si el visor sigue en la obra que se abrió, vuelve a ella */
export function cerrarObra(cambio, mismaPieza = true) {
  sonar("cerrar");
  const destino = abierta;
  abierta = null;
  const desde = visor();
  if (!puede() || !mismaPieza || !destino?.isConnected || !desde) {
    cambio();
    return;
  }
  nombrar(desde, "obra");
  transicion(() => {
    flushSync(cambio);
    nombrar(destino, "obra");
  }).finished.finally(() => nombrar(destino, ""));
}
