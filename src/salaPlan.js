/**
 * Dónde cuelga cada pieza de la «sala» (Sala.jsx): funciones puras, aparte
 * del componente para poder probarlas (tests/sala.test.js).
 */

/** Formato de una pieza: el propio (un render no se recorta) o uno asignado. */
export function formatoPropio(item) {
  if (item.portrait) return "4/5";
  if (item.square) return "1/1";
  return "16/10";
}

/**
 * Los loops de TouchDesigner son abstractos y aguantan otro encuadre: cada
 * uno sale en un formato distinto, así la sala no es una fila de 16:9.
 */
export const FORMATOS_LOOP = ["21/9", "4/5", "16/10", "1/1", "16/9", "3/4", "16/10", "21/9"];

export function orientacion(formato) {
  const [w, h] = formato.split("/").map(Number);
  const r = w / h;
  if (r >= 2) return "W";
  if (r > 1.05) return "L";
  if (r < 0.95) return "P";
  return "S";
}

// Columnas (de 12) que ocupa cada pieza según su orientación
const GRANDE = { W: 10, L: 7, S: 6, P: 5 };
const CHICA = { W: 6, L: 5, S: 4, P: 4 };

/**
 * Dónde cuelga cada pieza en la grilla de 12 columnas: inicio, ancho y si
 * baja (desfase). Filas de a dos (grande + chica, alternando el lado de la
 * grande); una panorámica o la última impar van solas.
 */
export function planificarSala(formatos) {
  const os = formatos.map(orientacion);
  // Tres del mismo formato (verticales o cuadradas): tríptico
  if (os.length === 3 && os.every((o) => o === os[0]) && (os[0] === "P" || os[0] === "S")) {
    return [
      { col: 1, span: 4, desfase: 0 },
      { col: 5, span: 4, desfase: 1 },
      { col: 9, span: 4, desfase: 0.4 },
    ];
  }
  const plan = [];
  let fila = 0;
  let i = 0;
  while (i < os.length) {
    const o = os[i];
    const sig = os[i + 1];
    if (o === "W" || sig === undefined || sig === "W") {
      const span = o === "W" ? GRANDE.W : GRANDE[o] + 1;
      plan.push({ col: fila % 2 ? 13 - span - 1 : 2, span, desfase: 0 });
      i += 1;
    } else {
      const grandeIzq = fila % 2 === 0;
      let sa = grandeIzq ? GRANDE[o] : CHICA[o];
      let sb = grandeIzq ? CHICA[sig] : GRANDE[sig];
      // Entre las dos queda al menos una columna libre
      if (sa + sb > 11) {
        if (grandeIzq) sb = 11 - sa;
        else sa = 11 - sb;
      }
      if (grandeIzq) {
        plan.push({ col: 1, span: sa, desfase: 0 });
        plan.push({ col: Math.min(13 - sb, sa + 3), span: sb, desfase: 1 });
      } else {
        const colB = 13 - sb;
        plan.push({ col: Math.max(1, colB - 2 - sa), span: sa, desfase: 1 });
        plan.push({ col: colB, span: sb, desfase: 0 });
      }
      i += 2;
    }
    fila += 1;
  }
  return plan;
}

