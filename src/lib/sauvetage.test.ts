import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { compileScss } from "./compile";
import { legacyCss, effectsPartial, indexHtml } from "./sauvetage";

describe("sauvetage starter files", () => {
  it("compiles the legacy CSS untouched, since plain CSS is valid SCSS", () => {
    const result = compileScss(legacyCss);
    expect(result.ok).toBe(true);
  });
  it("repeats each of the three colours several times", () => {
    for (const hex of ["#2c5aa0", "#c0392b", "#333333"]) {
      expect(legacyCss.split(hex).length - 1, hex).toBeGreaterThanOrEqual(4);
    }
  });
  it("keeps the two button blocks near-identical apart from the colour", () => {
    expect(legacyCss).toMatch(/\.btn-primary/);
    expect(legacyCss).toMatch(/\.btn-danger/);
  });
  it("splits the card selectors instead of nesting them", () => {
    expect(legacyCss).toMatch(/\.card-title/);
    expect(legacyCss).toMatch(/\.card-hover/);
  });
  it("fails with a readable message once the effects partial is used", () => {
    const result = compileScss(`@use "effects";`, { files: { "_effects.scss": effectsPartial } });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/\$shadow/);
      expect(result.line).toBeGreaterThan(0);
    }
  });
  it("compiles fine as long as the effects partial is not used", () => {
    expect(compileScss(legacyCss, { files: { "_effects.scss": effectsPartial } }).ok).toBe(true);
  });
});

describe("tp page", () => {
  it("never publishes trainer-only material", () => {
    const text = readFileSync(new URL("../pages/tp/index.astro", import.meta.url), "utf8");
    expect(text).not.toMatch(/corrig[ée]|bar[eè]me|grille d'observation|fiche de s[ée]ance|le pi[èe]ge/i);
  });
});

describe("downloads", () => {
  const pub = (name: string) => readFileSync(new URL(`../../public/tp/${name}`, import.meta.url), "utf8");
  it("match the strings shown on the page", () => {
    expect(pub("legacy.css")).toBe(legacyCss);
    expect(pub("_effects.scss")).toBe(effectsPartial);
    expect(pub("sauvetage-index.html")).toBe(indexHtml);
  });
});
