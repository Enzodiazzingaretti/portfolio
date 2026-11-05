import { describe, expect, it } from "vitest";
import { siteContent } from "../src/siteContent.i18n.js";
import { FORMATOS_LOOP, formatoPropio, orientacion, planificarSala } from "../src/salaPlan.js";

/** Filas tal como las arma la grilla: una pieza baja de fila si su columna queda antes. */
function filas(plan) {
  const out = [];
  let fila = [];
  let cursor = 0;
  for (const p of plan) {
    if (p.col < cursor && fila.length) {
      out.push(fila);
      fila = [];
    }
    fila.push(p);
    cursor = p.col + p.span;
  }
  if (fila.length) out.push(fila);
  return out;
}

function chequear(formatos) {
  const plan = planificarSala(formatos);
  expect(plan).toHaveLength(formatos.length);
  for (const p of plan) {
    expect(p.col).toBeGreaterThanOrEqual(1);
    expect(p.span).toBeGreaterThanOrEqual(3);
    // Ninguna pieza se pasa de la columna 12
    expect(p.col + p.span - 1).toBeLessThanOrEqual(12);
  }
  for (const fila of filas(plan)) {
    // A lo sumo dos por fila (o el tríptico) y sin pisarse
    expect(fila.length).toBeLessThanOrEqual(3);
    for (let i = 1; i < fila.length; i++) expect(fila[i].col).toBeGreaterThan(fila[i - 1].col + fila[i - 1].span - 1);
  }
  return plan;
}

describe("la sala", () => {
  it("cuelga los renders de 3D sin pisarse ni pasarse de la grilla", () => {
    for (const lang of ["es", "en", "pt"]) {
      const obras = siteContent.locales[lang].blenderWorks.filter((w) => w.enabled !== false);
      chequear(obras.map(formatoPropio));
    }
  });

  it("arma un tríptico con tres verticales", () => {
    const plan = chequear(["4/5", "4/5", "4/5"]);
    expect(plan.map((p) => p.col)).toEqual([1, 5, 9]);
  });

  it("deja sola cada panorámica de los loops", () => {
    const plan = chequear(FORMATOS_LOOP);
    expect(orientacion(FORMATOS_LOOP[0])).toBe("W");
    expect(plan[0].span).toBe(10);
  });

  it("aguanta cualquier mezcla de formatos", () => {
    const todos = ["4/5", "1/1", "16/10", "21/9", "3/4", "16/9"];
    for (let n = 1; n <= 9; n++) {
      for (let k = 0; k < todos.length; k++) {
        chequear(Array.from({ length: n }, (_, i) => todos[(i * (k + 1) + k) % todos.length]));
      }
    }
  });
});
