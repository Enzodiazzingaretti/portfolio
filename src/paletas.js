import { sonar } from "./sonido";

// Las paletas del sitio (los canales viven en src/styles/paletas.css). La
// elegida se guarda en localStorage; `?paleta=<id>` la fija desde un link.
export const GRUPOS = ["oscuras", "monocromas", "claras"];

export const PALETAS = [
  { id: "grafito", grupo: "oscuras", muestra: "#E52436", fondo: "#17191D" },
  { id: "brasa", grupo: "oscuras", muestra: "#FF5C1F", fondo: "#181411" },
  { id: "cobalto", grupo: "oscuras", muestra: "#3D63FF", fondo: "#11141B" },
  { id: "ultravioleta", grupo: "oscuras", muestra: "#8B5CFF", fondo: "#15121A" },
  { id: "acido", grupo: "oscuras", muestra: "#C8F23C", fondo: "#121412" },
  { id: "hueso", grupo: "monocromas", muestra: "#D6D0C4", fondo: "#17191D" },
  { id: "tinta", grupo: "monocromas", muestra: "#F5F5F5", fondo: "#111111" },
  { id: "acero", grupo: "monocromas", muestra: "#9FB3C8", fondo: "#13161A" },
  { id: "tinta-papel", grupo: "monocromas", muestra: "#E9E4DA", fondo: "#131312" },
  { id: "papel", grupo: "claras", muestra: "#D61E30", fondo: "#E9E4DA" },
  { id: "papel-tinta", grupo: "claras", muestra: "#17191D", fondo: "#E9E4DA" },
  { id: "hormigon", grupo: "claras", muestra: "#2846E6", fondo: "#D9DAD6" },
];

const CLAVE = "paleta";
const valida = (id) => PALETAS.some((p) => p.id === id);

export function paletaActual() {
  if (typeof document === "undefined") return "grafito";
  return document.documentElement.dataset.paleta || "grafito";
}

function guardar(id) {
  try {
    if (id === "grafito") localStorage.removeItem(CLAVE);
    else localStorage.setItem(CLAVE, id);
  } catch {
    /* sin localStorage: dura la visita */
  }
}

function fijar(id) {
  const html = document.documentElement;
  if (id === "grafito") delete html.dataset.paleta;
  else html.dataset.paleta = id;
  const fondo = PALETAS.find((p) => p.id === id)?.fondo;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", fondo ?? "#17191D");
}

export function aplicarPaleta(id, { guardar: persistir = false, fundido = false } = {}) {
  if (!valida(id)) return;
  if (persistir) sonar("color");
  if (persistir) guardar(id);
  const reducido = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (fundido && !reducido && document.startViewTransition) {
    // Si el navegador saltea la transición (pestaña en segundo plano, otra en
    // curso), el cambio se aplica igual
    const vt = document.startViewTransition(() => fijar(id));
    vt.finished.finally(() => {
      if (paletaActual() !== id) fijar(id);
    });
  } else fijar(id);
}

/** Al arrancar, antes del primer render: el link manda, si no lo guardado. */
export function iniciarPaleta() {
  try {
    const pedida = new URLSearchParams(window.location.search).get(CLAVE);
    if (pedida && valida(pedida)) guardar(pedida);
    const id = localStorage.getItem(CLAVE);
    if (id && valida(id)) fijar(id);
  } catch {
    /* sin localStorage: la de siempre */
  }
}
