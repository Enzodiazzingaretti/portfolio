import { describe, expect, it } from "vitest";
import { beatEnv, makeRng, mulberry32 } from "../src/lab/prng.js";
import { pickQuality } from "../src/lib/compressImage.js";

describe("seeded randomness (the lab's contract: same seed, same artwork)", () => {
  const take = (rng, n) => Array.from({ length: n }, () => rng());

  it("repeats the same sequence for the same seed", () => {
    expect(take(mulberry32(145), 5)).toEqual(take(mulberry32(145), 5));
  });

  it("produces a different sequence for another seed", () => {
    expect(take(mulberry32(145), 5)).not.toEqual(take(mulberry32(146), 5));
  });

  it("stays in [0, 1)", () => {
    for (const value of take(mulberry32(7), 1000)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("makeRng helpers are deterministic and stay in range", () => {
    const a = makeRng(99);
    const b = makeRng(99);
    const ints = (rng) => Array.from({ length: 50 }, () => rng.int(1, 6));
    const first = ints(a);
    expect(first).toEqual(ints(b));
    expect(Math.min(...first)).toBeGreaterThanOrEqual(1);
    expect(Math.max(...first)).toBeLessThanOrEqual(6);
  });

  it("the beat envelope stays in [0, 1]", () => {
    for (let t = 0; t < 4; t += 0.01) {
      const env = beatEnv(t);
      expect(env).toBeGreaterThanOrEqual(0);
      expect(env).toBeLessThanOrEqual(1);
    }
  });
});

describe("pickQuality (admin uploads under a size budget)", () => {
  // Fake encoder: bytes grow linearly with quality.
  const sizeFor = (q) => q * 1000;

  it("keeps the starting quality when it already fits", () => {
    expect(pickQuality(sizeFor, 10_000)).toBe(0.82);
  });

  it("lowers quality until the file fits", () => {
    expect(pickQuality(sizeFor, 600)).toBeLessThanOrEqual(0.6);
    expect(sizeFor(pickQuality(sizeFor, 600))).toBeLessThanOrEqual(600);
  });

  it("never goes below the floor, even if the budget is impossible", () => {
    expect(pickQuality(sizeFor, 1)).toBeGreaterThanOrEqual(0.4);
  });
});
