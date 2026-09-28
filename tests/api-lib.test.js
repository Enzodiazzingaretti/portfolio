import { randomBytes, scryptSync } from "node:crypto";
import { createRequire } from "node:module";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// api/ is CommonJS (Vercel functions); tests live outside it on purpose:
// any .js file inside api/ would be deployed as an endpoint.
const require = createRequire(import.meta.url);
const lib = require("../api/_lib.js");

describe("admin session tokens", () => {
  beforeEach(() => {
    vi.stubEnv("SESSION_SECRET", "test-secret");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("verifies a token it signed", () => {
    const token = lib.sign({ user: "admin", exp: Date.now() + 60_000 });
    expect(lib.verify(token)).toMatchObject({ user: "admin" });
  });

  it("rejects a token whose payload was edited", () => {
    const token = lib.sign({ user: "admin", exp: Date.now() + 60_000 });
    const [, mac] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ user: "admin", exp: Date.now() + 10 ** 9 })).toString("base64url");
    expect(lib.verify(`${forged}.${mac}`)).toBeNull();
  });

  it("rejects a token signed with another secret", () => {
    const token = lib.sign({ exp: Date.now() + 60_000 });
    vi.stubEnv("SESSION_SECRET", "another-secret");
    expect(lib.verify(token)).toBeNull();
  });

  it("rejects an expired token", () => {
    vi.useFakeTimers();
    const token = lib.sign({ exp: Date.now() + 1_000 });
    vi.advanceTimersByTime(2_000);
    expect(lib.verify(token)).toBeNull();
  });

  it("rejects garbage", () => {
    expect(lib.verify("")).toBeNull();
    expect(lib.verify("no-dot")).toBeNull();
    expect(lib.verify(null)).toBeNull();
  });
});

describe("admin password", () => {
  afterEach(() => vi.unstubAllEnvs());

  const storeHash = (password) => {
    const salt = randomBytes(16);
    const key = scryptSync(password, salt, 32);
    vi.stubEnv("ADMIN_PASSWORD_HASH", `scrypt$${salt.toString("base64")}$${key.toString("base64")}`);
  };

  it("accepts the right password and nothing else", () => {
    storeHash("correct horse");
    expect(lib.checkPassword("correct horse")).toBe(true);
    expect(lib.checkPassword("correct hors")).toBe(false);
    expect(lib.checkPassword("")).toBe(false);
    expect(lib.checkPassword(undefined)).toBe(false);
  });

  it("refuses everything when no hash is configured", () => {
    vi.stubEnv("ADMIN_PASSWORD_HASH", "");
    expect(lib.checkPassword("anything")).toBe(false);
  });
});

describe("paths the API may write", () => {
  it("only public/content.json among files", () => {
    expect(lib.isAllowedFile("public/content.json")).toBe(true);
    expect(lib.isAllowedFile("src/siteContent.i18n.js")).toBe(false);
    expect(lib.isAllowedFile("public/../api/_lib.js")).toBe(false);
  });

  it("only webp uploads with a slot and a timestamp", () => {
    expect(lib.isAllowedImagePath("public/images/uploads/about-1785219407379.webp")).toBe(true);
    expect(lib.isAllowedImagePath("public/images/uploads/../../api/login.webp")).toBe(false);
    expect(lib.isAllowedImagePath("public/images/uploads/about-123.png")).toBe(false);
    expect(lib.isAllowedImagePath("public/images/uploads/about.webp")).toBe(false);
    expect(lib.isAllowedImagePath("public/images/blender/about-123.webp")).toBe(false);
  });
});
