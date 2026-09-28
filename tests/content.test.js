import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { siteContent } from "../src/siteContent.i18n.js";

/**
 * Content integrity. The site has two sources of copy: the bundle
 * (src/siteContent.i18n.js, all three languages) and public/content.json,
 * which the /admin panel edits and which overrides Spanish only. On
 * 2026-09-24 they drifted and Spanish visitors saw the old positioning for
 * three days. These tests fail when that happens again, and when a piece
 * points at a file that is not in public/.
 */

const LOCALES = ["es", "en", "pt"];
const WORK_LISTS = ["webProjects", "touchDesignerLoops", "blenderWorks", "flyers", "logos", "espacios", "labPieces"];
const editable = JSON.parse(readFileSync(new URL("../public/content.json", import.meta.url), "utf8"));

/** Same rule MediaAsset applies at runtime: .png/.jpg are served as .webp. */
const servedPath = (p) => p.replace(/\.(png|jpe?g)$/i, ".webp");

/** The files an item points at, in order. Identity of a piece across languages. */
const assetsOf = (item) =>
  [item.thumbnail, item.imageUrl, item.previewImage, ...(item.slides ?? [])].filter(Boolean);

/** Dotted key paths of an object tree, ignoring array contents. */
function keyPaths(value, prefix = "") {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [prefix];
  return Object.keys(value).flatMap((k) => keyPaths(value[k], prefix ? `${prefix}.${k}` : k));
}

describe("the three languages", () => {
  for (const section of ["ui", "categories", "hero", "about", "contact"]) {
    it(`share the same keys in ${section}`, () => {
      const [es, ...rest] = LOCALES.map((l) => keyPaths(siteContent.locales[l][section]).sort());
      for (const other of rest) expect(other).toEqual(es);
    });
  }

  for (const list of WORK_LISTS) {
    it(`list the same ${list}, with the same files, in the same order`, () => {
      const [es, ...rest] = LOCALES.map((l) => siteContent.locales[l][list].map(assetsOf));
      for (const other of rest) expect(other).toEqual(es);
    });
  }
});

describe("public/content.json (Spanish, edited from /admin)", () => {
  for (const list of WORK_LISTS) {
    it(`matches the bundle's Spanish ${list}`, () => {
      const bundle = siteContent.locales.es[list];
      expect(editable[list].map(assetsOf)).toEqual(bundle.map(assetsOf));
      expect(editable[list].map((item) => item.enabled !== false)).toEqual(
        bundle.map((item) => item.enabled !== false),
      );
    });
  }

  it("uses the same hero and about copy as the bundle", () => {
    const es = siteContent.locales.es;
    expect(editable.hero.description).toBe(es.hero.description);
    expect(editable.hero.roles).toEqual(es.hero.roles);
    expect(editable.about.headline).toBe(es.about.headline);
    expect(editable.about.paragraph).toBe(es.about.paragraph);
  });
});

describe("files referenced by the content", () => {
  const paths = new Set();
  const collect = (node) => {
    if (typeof node === "string" && node.startsWith("/images/")) paths.add(servedPath(node));
    else if (Array.isArray(node)) node.forEach(collect);
    else if (node && typeof node === "object") Object.values(node).forEach(collect);
  };
  collect(siteContent);
  collect(editable);

  it("all exist in public/", () => {
    const missing = [...paths].filter((p) => !existsSync(new URL(`../public${p}`, import.meta.url)));
    expect(missing).toEqual([]);
  });

  it("include a CV for every language", () => {
    for (const locale of LOCALES) {
      const cv = siteContent.locales[locale].contact.cv;
      expect(cv, locale).toMatch(/^\/cv\/.+\.pdf$/);
      expect(existsSync(new URL(`../public${cv}`, import.meta.url)), cv).toBe(true);
    }
  });
});
