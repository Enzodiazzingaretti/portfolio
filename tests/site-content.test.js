import { describe, expect, it } from "vitest";
import { idiomaDelNavegador, mergeContent } from "../src/hooks/useSiteContent.js";

describe("mergeContent", () => {
  it("merges objects deeply, so an override only touches what it defines", () => {
    const defaults = { hero: { title: "A", roles: ["x"], cta: "Go" } };
    const merged = mergeContent(defaults, { hero: { title: "B" } });
    expect(merged).toEqual({ hero: { title: "B", roles: ["x"], cta: "Go" } });
  });

  it("replaces arrays whole instead of merging them item by item", () => {
    const merged = mergeContent({ roles: ["a", "b", "c"] }, { roles: ["z"] });
    expect(merged.roles).toEqual(["z"]);
  });

  it("keeps the defaults when there is no override", () => {
    const defaults = { a: 1 };
    expect(mergeContent(defaults, null)).toBe(defaults);
    expect(mergeContent(defaults, undefined)).toBe(defaults);
  });
});

describe("idiomaDelNavegador (initial language)", () => {
  const locales = { es: {}, en: {}, pt: {} };
  const withLanguages = (languages, run) => {
    const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");
    Object.defineProperty(globalThis, "navigator", { value: { languages, language: languages[0] }, configurable: true });
    try {
      return run();
    } finally {
      if (original) Object.defineProperty(globalThis, "navigator", original);
      else delete globalThis.navigator;
    }
  };

  it("takes the first browser language the site speaks", () => {
    expect(withLanguages(["de-DE", "pt-BR", "en-US"], () => idiomaDelNavegador(locales))).toBe("pt");
  });

  it("falls back to English, since the site targets remote roles", () => {
    expect(withLanguages(["de-DE", "fr-FR"], () => idiomaDelNavegador(locales))).toBe("en");
  });
});
