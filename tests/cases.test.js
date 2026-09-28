import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { siteContent } from "../src/siteContent.i18n.js";
import { CASE_ASSETS, CASE_BODIES, CASE_UI } from "../src/cases/index.js";
import { buildCategories } from "../src/categories.js";
import { buildShowcase } from "../src/showcasePicks.js";

/**
 * Casos de estudio (/web/<slug>). El título y la bajada viven en el bundle,
 * el cuerpo en src/cases/, las imágenes en public/images/casos/. Estos tests
 * fallan si alguna de las tres partes se desalinea, o si un idioma cuenta un
 * caso con otra estructura que los demás.
 */

const LOCALES = ["es", "en", "pt"];
const editable = JSON.parse(readFileSync(new URL("../public/content.json", import.meta.url), "utf8"));
const slugsOf = (locale) => siteContent.locales[locale].cases.map((c) => c.slug);

/** Ancho y alto reales de un .webp, leídos del encabezado (VP8, VP8L o VP8X). */
function webpSize(path) {
  const buf = readFileSync(path);
  expect(buf.toString("ascii", 0, 4)).toBe("RIFF");
  expect(buf.toString("ascii", 8, 12)).toBe("WEBP");
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
  }
  if (chunk === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return { w: 1 + (bits & 0x3fff), h: 1 + ((bits >> 14) & 0x3fff) };
  }
  // VP8 con pérdida: el frame arranca en 20 y las medidas van después del código de inicio
  return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
}

/** La forma de un caso sin el texto: qué bloques, cuántos ítems, qué figuras. */
const shapeOf = (body) =>
  body.blocks.map((b) => ({
    type: b.type,
    figures: b.figures?.map((f) => f.key),
    items: b.items?.length ?? b.paragraphs?.length ?? null,
    discarded: b.items?.map((item) => Boolean(item.discarded)),
    intro: Boolean(b.intro),
  }));

/** Todos los strings de un árbol, para revisar el texto de un saque. */
function strings(node, out = []) {
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) node.forEach((n) => strings(n, out));
  else if (node && typeof node === "object") Object.values(node).forEach((n) => strings(n, out));
  return out;
}

describe("case studies", () => {
  it("list the same cases, in the same order, in the three languages", () => {
    const [es, ...rest] = LOCALES.map(slugsOf);
    for (const other of rest) expect(other).toEqual(es);
    expect(es.length).toBeGreaterThan(0);
  });

  it("have a body in every language and shared assets for every case", () => {
    for (const locale of LOCALES) {
      for (const slug of slugsOf(locale)) {
        expect(CASE_BODIES[locale][slug], `${locale}/${slug}`).toBeTruthy();
        expect(CASE_ASSETS[slug], slug).toBeTruthy();
      }
      expect(Object.keys(CASE_BODIES[locale]).sort()).toEqual([...slugsOf("es")].sort());
    }
  });

  it("tell each case with the same structure in every language", () => {
    for (const slug of slugsOf("es")) {
      const [es, ...rest] = LOCALES.map((l) => shapeOf(CASE_BODIES[l][slug]));
      for (const other of rest) expect(other).toEqual(es);
    }
  });

  it("share the same interface labels in every language", () => {
    const [es, ...rest] = LOCALES.map((l) => Object.keys(CASE_UI[l]).sort());
    for (const other of rest) expect(other).toEqual(es);
  });

  it("only point at figures that are declared, exist and measure what they say", () => {
    for (const slug of slugsOf("es")) {
      const { figures } = CASE_ASSETS[slug];
      const used = CASE_BODIES.es[slug].blocks.flatMap((b) => b.figures?.map((f) => f.key) ?? []);
      for (const key of used) expect(figures[key], `${slug}/${key}`).toBeTruthy();

      for (const [key, figure] of Object.entries(figures)) {
        const file = new URL(`../public${figure.src}`, import.meta.url);
        expect(existsSync(file), figure.src).toBe(true);
        expect(webpSize(file), `${slug}/${key}`).toEqual({ w: figure.w, h: figure.h });
        // Mismo tope que el resto de la obra y que /admin al subir
        expect(Math.max(figure.w, figure.h), figure.src).toBeLessThanOrEqual(1600);
      }
    }
  });

  it("give every figure an alt text", () => {
    for (const locale of LOCALES) {
      for (const slug of slugsOf(locale)) {
        for (const block of CASE_BODIES[locale][slug].blocks.filter((b) => b.type === "figure")) {
          for (const figure of block.figures) expect(figure.alt?.length, `${locale}/${slug}/${figure.key}`).toBeGreaterThan(10);
        }
      }
    }
  });

  it("write text, not markup: no HTML and every `code` span closed", () => {
    for (const locale of LOCALES) {
      for (const text of strings(CASE_BODIES[locale])) {
        expect(text, text.slice(0, 60)).not.toMatch(/<\/?[a-z][^>]*>/i);
        expect(text.split("`").length % 2, text.slice(0, 60)).toBe(1);
      }
    }
  });

  it("are linked from the web project they tell, in the bundle and in content.json", () => {
    const sources = [...LOCALES.map((l) => siteContent.locales[l].webProjects), editable.webProjects];
    for (const projects of sources) {
      const linked = projects.filter((p) => p.caseSlug).map((p) => p.caseSlug);
      expect([...linked].sort()).toEqual([...slugsOf("es")].sort());
      for (const project of projects.filter((p) => p.caseSlug)) {
        expect(project.repoUrl, project.caseSlug).toBe(CASE_ASSETS[project.caseSlug].repo);
      }
    }
  });

  it("reach the web cards and the home showcase through the normalizer", () => {
    const categories = buildCategories(siteContent.locales.en);
    const web = categories.find((c) => c.slug === "web");
    expect(web.groups[0].items.filter((i) => i.caseSlug).map((i) => i.caseSlug).sort()).toEqual([...slugsOf("en")].sort());

    const tamara = buildShowcase(categories).find((item) => item.id === "tamara");
    expect(tamara.href).toBe("/web/tamara-gonzalez");
  });
});
