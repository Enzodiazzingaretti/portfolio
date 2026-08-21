// Contrato de parámetros de Liturgia Máquina.
//
// Cada obra exporta su array `controls`. La regla del movimiento se mantiene:
// con todos los controles en su valor por defecto, la obra es exactamente la
// que fija la semilla — los sliders son multiplicadores u offsets neutros en
// `def`, nunca valores absolutos que pisen lo que decidió el azar notarial.

/** Defaults de un set de controles: { id: def } */
export function defaultParams(controls) {
  return Object.fromEntries(controls.map((c) => [c.id, c.def]));
}

/**
 * Lector de parámetros en vivo. `live` es un objeto mutado en su lugar por
 * GenerativeCanvas: la obra no se reconstruye al mover un slider, lee el
 * valor nuevo en el frame siguiente.
 * @param {Array} controls - spec de la obra
 * @param {Object} live - objeto de identidad estable con los valores actuales
 * @returns {(id: string) => number}
 */
export function paramReader(controls, live) {
  const defaults = defaultParams(controls);
  return (id) => {
    const v = live?.[id];
    return typeof v === "number" && Number.isFinite(v) ? v : defaults[id];
  };
}

/** ¿Los parámetros están intactos respecto de la semilla? */
export function isPristine(controls, values) {
  return controls.every((c) => Math.abs((values?.[c.id] ?? c.def) - c.def) < 1e-9);
}
