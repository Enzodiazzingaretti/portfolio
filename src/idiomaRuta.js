/**
 * Idioma por URL (2026-11-08, para Google): el español va sin prefijo y el
 * inglés y el portugués en /en y /pt. Las tres versiones de cada página están
 * pregeneradas (scripts/prerender.mjs) y enlazadas con hreflang.
 *
 * Orden para elegir el idioma:
 * 1. el forzado (el build que pregenera cada página)
 * 2. el prefijo de la URL
 * 3. sin prefijo, un buscador ve el español (es la versión de esa URL)
 * 4. sin prefijo, una persona: lo guardado o el idioma del navegador (como
 *    siempre: el portfolio apunta a trabajo remoto)
 */
export const PREFIJOS = ["en", "pt"];
const RX = /^\/(en|pt)(?=\/|$)/;

export function prefijoDe(pathname = "") {
  return RX.exec(pathname)?.[1] ?? null;
}

/** La ruta sin el prefijo de idioma: /en/motion → /motion */
export function sinPrefijo(pathname = "/") {
  return pathname.replace(RX, "") || "/";
}

/** La misma ruta en otro idioma */
export function rutaEn(idioma, pathname = "/") {
  const resto = sinPrefijo(pathname);
  if (idioma === "es") return resto;
  return `/${idioma}${resto === "/" ? "" : resto}`;
}

let forzado = null;
export function forzarIdioma(idioma) {
  forzado = idioma;
}
export const idiomaForzado = () => forzado;

export function esBuscador() {
  return typeof navigator !== "undefined" && /bot|crawl|spider|slurp|lighthouse|preview/i.test(navigator.userAgent || "");
}

// Contenido editable (content.json) conocido de antemano: lo pasa el build,
// así el español pregenerado ya trae lo que se editó en /admin
let contenidoInicial = null;
export function fijarContenidoInicial(datos) {
  contenidoInicial = datos;
}
export const contenidoDeInicio = () => contenidoInicial;
