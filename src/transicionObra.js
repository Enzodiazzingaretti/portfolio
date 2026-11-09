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
 * - el visor pide otra imagen, más grande: se precarga y decodifica antes de
 *   empezar (tope de 450 ms), si no la obra crecía hacia un cuadro vacío
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

/** La primera imagen que va a mostrar el visor (los videos no se precargan) */
const primeraImagen = (pieza) => {
  const src = pieza?.slides?.[0] ?? pieza?.previewImage;
  return typeof src === "string" && !/\.(mp4|webm|mov)$/i.test(src) ? src : null;
};

/** Baja y decodifica una imagen fuera del documento, con tope */
function precargar(src, tope = 450) {
  if (!src) return Promise.resolve();
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  return Promise.race([
    img.decode().catch(() => {}),
    new Promise((listo) => window.setTimeout(listo, tope)),
  ]);
}

/**
 * `pieza`: la obra que se abre, para tener su imagen lista antes de empezar.
 * La espera va ANTES de la transición y no adentro: con el cambio asíncrono
 * (2026-11-09) el celular mostraba el visor, volvía un cuadro a la página y
 * recién ahí arrancaba el vuelo («un pestañeo raro»).
 */
export function abrirObra(cambio, pieza) {
  sonar("abrir");
  const origen = medio(tocada);
  tocada = null;
  if (!puede() || !origen?.isConnected) {
    cambio();
    return;
  }
  precargar(primeraImagen(pieza)).then(() => {
    if (!origen.isConnected) {
      cambio();
      return;
    }
    abierta = origen;
    nombrar(origen, "obra");
    transicion(() => {
      nombrar(origen, "");
      flushSync(cambio);
      // El panel ya entró con la transición: su animación propia queda
      // apagada para siempre (no solo mientras dura), si no arrancaba de
      // cero al terminar y la página se veía un instante detrás.
      document
        .querySelectorAll(".modal-scrim, .modal-cinematic")
        .forEach((el) => el.setAttribute("data-sin-entrada", ""));
      const destino = visor();
      if (destino?.tagName === "IMG") destino.decoding = "sync";
      nombrar(destino, "obra");
    }).finished.finally(() => nombrar(visor(), ""));
  });
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
