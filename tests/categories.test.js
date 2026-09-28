import { describe, expect, it } from "vitest";
import { buildCategories, buildCategory, CATEGORIES } from "../src/categories.js";
import { buildShowcase, SHOWCASE_PICKS } from "../src/showcasePicks.js";
import { siteContent } from "../src/siteContent.i18n.js";

const english = siteContent.locales.en;

describe("buildCategories", () => {
  it("returns the four disciplines in route order", () => {
    expect(buildCategories(english).map((c) => c.slug)).toEqual(["motion", "3d", "grafica", "web"]);
  });

  it("drops a group whose list is empty and counts only what is left", () => {
    const tresd = CATEGORIES.find((c) => c.id === "tresd");
    const built = buildCategory(tresd, { ...english, espacios: [] });
    expect(built.groups.map((g) => g.id)).toEqual(["blender"]);
    expect(built.count).toBe(english.blenderWorks.length);
  });

  it("drops a category with nothing in it", () => {
    const withoutWeb = buildCategories({ ...english, webProjects: [] });
    expect(withoutWeb.map((c) => c.slug)).not.toContain("web");
  });

  it("passes the repository link of web projects through to the card", () => {
    const web = buildCategories(english).find((c) => c.slug === "web");
    const portfolio = web.groups[0].items.find((item) => item.repoUrl?.endsWith("/portfolio"));
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
    expect(ids).toHaveLength(SHOWCASE_PICKS.length - 1);
  });
});
