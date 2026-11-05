import { describe, expect, it } from "vitest";
import { buildCategories, buildCategory, CATEGORIES } from "../src/categories.js";
import { buildShowcase, SHOWCASE_PICKS } from "../src/showcasePicks.js";
import { siteContent } from "../src/siteContent.i18n.js";

const english = siteContent.locales.en;

describe("buildCategories", () => {
  it("returns the four disciplines in route order", () => {
    expect(buildCategories(english).map((c) => c.slug)).toEqual(["motion", "3d", "grafica", "tech"]);
  });

  it("drops a group whose list is empty and counts only what is left", () => {
    const tresd = CATEGORIES.find((c) => c.id === "tresd");
    const built = buildCategory(tresd, { ...english, espacios: [] });
    expect(built.groups.map((g) => g.id)).toEqual(["blender"]);
    expect(built.count).toBe(english.blenderWorks.length);
  });

  it("drops a category with nothing in it", () => {
    // MOTION es solo reels desde 2026-11: sin reels, no hay categoría
    const withoutReels = buildCategories({ ...english, motionReels: [] });
    expect(withoutReels.map((c) => c.slug)).not.toContain("motion");
  });

  it("groups real-time, generative and web work under TECH, sites last", () => {
    const tech = buildCategories(english).find((c) => c.slug === "tech");
    expect(tech.groups.map((g) => g.id)).toEqual(["touchdesigner", "lab", "proyectos"]);
    const sinSitios = buildCategories({ ...english, webProjects: [] }).find((c) => c.slug === "tech");
    expect(sinSitios.groups.map((g) => g.id)).toEqual(["touchdesigner", "lab"]);
  });

  it("passes the repository link of web projects through to the card", () => {
    const tech = buildCategories(english).find((c) => c.slug === "tech");
    const sitios = tech.groups.find((g) => g.id === "proyectos");
    const portfolio = sitios.items.find((item) => item.repoUrl?.endsWith("/portfolio"));
    expect(portfolio).toBeTruthy();
  });

  it("prefers a light cover over the first slide", () => {
    const motion = buildCategories(english).find((c) => c.slug === "motion");
    const loop = motion.groups[0].items[0];
    expect(loop.thumbnail).toMatch(/\/images\/loops\//);
  });
});

describe("buildShowcase", () => {
  it("finds every selected piece in the current content", () => {
    const picks = buildShowcase(buildCategories(english));
    expect(picks.map((p) => p.id)).toEqual(SHOWCASE_PICKS.map((p) => p.id));
  });

  it("skips a piece that was removed instead of breaking the home page", () => {
    const withoutRenders = buildCategories({ ...english, blenderWorks: [] });
    const ids = buildShowcase(withoutRenders).map((p) => p.id);
    expect(ids).not.toContain("golden-faces");
    expect(ids).not.toContain("240-kmh");
    const renders = SHOWCASE_PICKS.filter((p) => p.group === "blender").length;
    expect(ids).toHaveLength(SHOWCASE_PICKS.length - renders);
  });
});
