import { describe, it, expect } from "vitest";
import { compileScss } from "./compile";
import { examples } from "./boucles";

const css = (name: keyof typeof examples) => {
  const result = compileScss(examples[name]);
  if (!result.ok) throw new Error(`${name}: ${result.message}`);
  return result.css;
};

describe("advanced Sass examples", () => {
  it("compiles every example without error", () => {
    for (const name of Object.keys(examples) as (keyof typeof examples)[]) {
      expect(compileScss(examples[name]).ok, name).toBe(true);
    }
  });

  it("each over a map writes one rule per entry", () => {
    const out = css("each");
    expect(out).toContain(".btn-primary");
    expect(out).toContain(".btn-danger");
    expect(out).toContain(".btn-success");
    expect(out).toContain("#2c5aa0");
  });

  it("for ... through includes the last step", () => {
    const out = css("for");
    expect(out).toContain(".mt-1");
    expect(out).toContain(".mt-5");
    expect(out).toContain("margin-top: 40px");
  });

  it("math.div builds the 12-column grid", () => {
    const out = css("grid");
    expect(out).toContain(".col-3");
    expect(out).toContain("width: 25%");
    expect(out).toContain(".col-12");
    expect(out).toContain("width: 100%");
  });

  it("a function returns a value", () => {
    const out = css("function");
    expect(out).toContain("font-size: 2rem");
    expect(out).toContain("font-size: 1.5rem");
  });

  it("if / else picks a branch", () => {
    const out = css("if");
    expect(out).toMatch(/\.alerte-erreur\s*\{[^}]*#c0392b/);
    expect(out).toMatch(/\.alerte-info\s*\{[^}]*#2c5aa0/);
  });

  it("@content wraps the block in a media query", () => {
    const out = css("content");
    expect(out).toContain("@media (max-width: 768px)");
    expect(out).toContain("width: 100%");
  });

  it("a map of maps generates the themes", () => {
    const out = css("themes");
    expect(out).toMatch(/\.theme-sombre\s*\{[^}]*#1a1a1a/);
    expect(out).toMatch(/\.theme-clair\s*\{[^}]*#ffffff/);
  });

  it("learner-facing examples contain no dash punctuation or emoji", () => {
    const all = Object.values(examples).join("\n");
    expect(all).not.toMatch(/[–—]/);
    expect(all).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});
