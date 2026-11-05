import * as THREE from "three";

/**
 * Máscara de legibilidad del fondo ASCII, en coordenadas de página.
 *
 * Donde hay texto, botones o tarjetas, el fondo baja la tinta de los
 * caracteres; en los huecos se ve entero. Así el ASCII puede ocupar todo el
 * fondo sin competir con lo que hay que leer. Se dibuja chica (1/8) en un
 * canvas 2D: un rectángulo por elemento, con margen, y un desenfoque encima
 * para que el borde no se lea como una caja. Se vuelve a medir solo cuando
 * cambia el layout (no en cada cuadro): el shader la corre con el scroll.
 */

// Lo que se protege: todo lo que tiene texto o es una tarjeta clickeable. El
// <h1> del hero no (es un bloque con un hueco a la derecha de «ENZO»): van
// sus renglones, que miden lo que mide cada palabra.
const SELECTOR = [
  "h1:not(.vx-name)",
  "h2",
  "h3",
  "h4",
  "h5",
  "p",
  "li",
  "dt",
  "dd",
  "blockquote",
  "figcaption",
  "label",
  "a",
  "button",
  "input",
  "textarea",
  "span",
  "video",
  "img",
  "[data-legible]",
  ".vx-name-line",
]
  .map((s) => `#main ${s}`)
  .join(",");

const PAD = 22; // px CSS alrededor de cada elemento

export function createLegibilityMask() {
  const sharp = document.createElement("canvas");
  const soft = document.createElement("canvas");
  const texture = new THREE.CanvasTexture(soft);
  texture.colorSpace = THREE.NoColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  // La barra es fija: se protege aparte, en coordenadas de pantalla
  const state = { pageH: 1, barra: 0 };

  const update = () => {
    const pageW = Math.max(1, window.innerWidth);
    const pageH = Math.max(document.documentElement.scrollHeight, window.innerHeight, 1);
    const k = Math.min(1 / 8, 4096 / pageH);
    const W = Math.max(2, Math.ceil(pageW * k));
    const H = Math.max(2, Math.ceil(pageH * k));
    if (soft.width !== W || soft.height !== H) {
      for (const c of [sharp, soft]) {
        c.width = W;
        c.height = H;
      }
      // Con otro tamaño la textura se vuelve a crear en la GPU: subirla
      // encima de la anterior desborda su almacenamiento (GL_INVALID_VALUE)
      texture.dispose();
    }
    const a = sharp.getContext("2d");
    a.clearRect(0, 0, W, H);
    a.fillStyle = "#fff";
    const sy = window.scrollY;
    document.querySelectorAll(SELECTOR).forEach((el) => {
      // Lo decorativo (aria-hidden) no se protege: el ancla del vidrio y las
      // marcas del hero cubren zonas enteras. Los renglones del nombre sí,
      // aunque vayan ocultos para lectores (el <h1> lleva el nombre entero).
      if (!el.classList.contains("vx-name-line") && el.closest('[aria-hidden="true"]')) return;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      a.fillRect((r.left - PAD) * k, (r.top + sy - PAD) * k, (r.width + PAD * 2) * k, (r.height + PAD * 2) * k);
    });
    const b = soft.getContext("2d");
    b.clearRect(0, 0, W, H);
    b.filter = "blur(3px)";
    b.drawImage(sharp, 0, 0);
    b.filter = "none";
    texture.needsUpdate = true;
    state.pageH = pageH;
    const barra = document.querySelector(".shell-bar")?.getBoundingClientRect();
    state.barra = barra ? Math.max(0, barra.bottom) : 0;
  };

  return { texture, state, update, dispose: () => texture.dispose() };
}
