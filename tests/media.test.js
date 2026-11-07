import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { VIDEOS_HQ } from "../src/media.js";

describe("videos en alta", () => {
  it("cada video con versión en alta tiene su respaldo liviano en public/", () => {
    for (const src of VIDEOS_HQ) expect(existsSync(`public${src}`), src).toBe(true);
  });
});
