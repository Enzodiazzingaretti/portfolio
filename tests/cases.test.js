import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { siteContent } from "../src/siteContent.i18n.js";
import { CASE_ASSETS, CASE_BODIES, CASE_UI } from "../src/cases/index.js";
import { buildCategories, piezasDelCaso } from "../src/categories.js";
import { buildShowcase } from "../src/showcasePicks.js";
import { CASE_COVERS, caseHref } from "../src/cases/covers.js";

/**
 * Casos de estudio (/tech/<slug> los sitios). El título y la bajada viven en el bundle,
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

  it("link a series site by site: a label and an https URL each, never next to a single site", () => {
    for (const slug of slugsOf("es")) {
      const { site, sites } = CASE_ASSETS[slug];
      if (!sites) continue;
      expect(site, slug).toBeFalsy();
      expect(sites.length, slug).toBeGreaterThan(1);
      for (const s of sites) {
        expect(s.label?.length, `${slug}/${s.url}`).toBeGreaterThan(0);
        expect(s.url, `${slug}/${s.label}`).toMatch(/^https:\/\/[^\s]+$/);
      }
      expect(new Set(sites.map((s) => s.url)).size, slug).toBe(sites.length);
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
    const sitios = slugsOf("es").filter((slug) => CASE_ASSETS[slug].category === "tech");
    const sources = [...LOCALES.map((l) => siteContent.locales[l].webProjects), editable.webProjects];
    for (const projects of sources) {
      const linked = projects.filter((p) => p.caseSlug).map((p) => p.caseSlug);
      expect([...linked].sort()).toEqual([...sitios].sort());
      for (const project of projects.filter((p) => p.caseSlug)) {
        expect(project.repoUrl, project.caseSlug).toBe(CASE_ASSETS[project.caseSlug].repo);
      }
    }
  });

  it("reach the web cards through the normalizer", () => {
    const categories = buildCategories(siteContent.locales.en);
    const sitios = categories.find((c) => c.slug === "tech").groups.find((g) => g.id === "proyectos");
    const enTech = slugsOf("en").filter((slug) => CASE_ASSETS[slug].category === "tech");
    expect(sitios.items.filter((i) => i.caseSlug).map((i) => i.caseSlug).sort()).toEqual([...enTech].sort());
  });

  it("outside TECH, are linked from the pieces they tell, in every language and in content.json", () => {
    const LISTAS = ["campaigns", "flyers", "logos", "motionReels", "aiCommercials", "blenderWorks", "espacios"];
    const otros = slugsOf("es").filter((slug) => CASE_ASSETS[slug].category !== "tech");
    expect(otros.length).toBeGreaterThan(0);
    const fuentes = [...LOCALES.map((l) => siteContent.locales[l]), editable];
    for (const slug of otros) {
      for (const fuente of fuentes) {
        const piezas = LISTAS.flatMap((k) => fuente[k] ?? []).filter((p) => p.caseSlug === slug);
        expect(piezas.length, slug).toBeGreaterThan(0);
      }
    }
    // y el visor las lleva al caso
    const grafica = buildCategories(siteContent.locales.es).find((c) => c.slug === "grafica");
    const campana = grafica.groups.find((g) => g.id === "campanas").items;
    expect(campana.every((i) => i.caseSlug === "sonar-produce")).toBe(true);
  });

  it("group a case's pieces in one card and show them all on the case", () => {
    for (const lang of LOCALES) {
      const content = siteContent.locales[lang];
      const grafica = buildCategories(content).find((c) => c.slug === "grafica");
      const tarjetas = grafica.groups.find((g) => g.id === "campanas").items.filter((i) => i.caseSlug === "sonar-produce");
      expect(tarjetas, lang).toHaveLength(1);
      expect(tarjetas[0].href).toBe("/grafica/sonar-produce");

      const piezas = piezasDelCaso(content, "sonar-produce");
      expect(piezas.length, lang).toBe(tarjetas[0].piezas + 1); // las de la campaña + el reel del caso
      const claves = piezas.map((p) => p.slides[0] ?? p.thumbnail);
      expect(new Set(claves).size, lang).toBe(claves.length);
      expect(piezas.every((p) => p.caseSlug === null)).toBe(true);
    }
  });

  it("link to the route of their category, from the home too", () => {
    for (const [slug, assets] of Object.entries(CASE_ASSETS)) {
      expect(CASE_COVERS[slug]?.category, slug).toBe(assets.category);
      expect(caseHref(slug)).toBe(`/${assets.category}/${slug}`);
      expect(buildCategories(siteContent.locales.es).map((c) => c.slug)).toContain(assets.category);
    }
  });

  it("keeps every selected-work piece pointing at its category", () => {
    // Desde el 2026-11 el trabajo seleccionado no lleva sitios web: son las
    // piezas para quien contrata (campaña, reel, 3D, spec, tiempo real).
    const picks = buildShowcase(buildCategories(siteContent.locales.en));
    expect(picks.map((p) => p.id)).toEqual(["sonar-caso", "golden-faces", "240-kmh"]);
    picks.forEach((p) => expect(p.href).toMatch(/^\/(motion|3d|grafica|tech)(\/|$)/));
  });
});
