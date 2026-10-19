import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { compileScss } from "./compile";
// @ts-ignore plain ES module published as a download
import { compareCss } from "../../public/tp/verifier.mjs";

const pub = (name: string) => readFileSync(new URL(`../../public/tp/${name}`, import.meta.url), "utf8");
const page = readFileSync(new URL("../pages/tp/index.astro", import.meta.url), "utf8");
const legacy = pub("legacy-enorme.css");

const compile = (scss: string) => {
  const r = compileScss(scss);
  if (!r.ok) throw new Error(r.message);
  return r.css;
};

describe("legacy-enorme.css download", () => {
  it("is plain CSS that compiles as SCSS", () => {
    expect(compileScss(legacy).ok).toBe(true);
  });
  it("repeats the brand colours many times", () => {
    for (const [hex, min] of [["#2c5aa0", 20], ["#c0392b", 10], ["#333333", 10]] as const) {
      expect(legacy.toLowerCase().split(hex).length - 1, hex).toBeGreaterThanOrEqual(min);
    }
  });
  it("has the duplicated blocks the activity is built on", () => {
    for (const sel of [".btn-warning", ".btn-secondary", ".alert-warning", ".card-product", ".card-article", "@media print"]) {
      expect(legacy, sel).toContain(sel);
    }
  });
});

describe("control page", () => {
  const html = pub("grand-menage-index.html");
  it("links the stylesheet the learners compile", () => {
    expect(html).toContain('href="style.css"');
  });
  it("shows every component family so a visual comparison is possible", () => {
    for (const cls of ["btn-primary", "btn-danger", "btn-success", "btn-warning", "btn-secondary", "card-product", "card-article", "card-hover", "alert-info", "alert-success", "alert-warning", "form-group", "table-danger", "pagination", "sidebar", "footer"]) {
      expect(html, cls).toContain(cls);
    }
  });
});

describe("verifier", () => {
  it("accepts the file compared with itself", () => {
    const r = compareCss(legacy, legacy);
    expect(r.ok).toBe(true);
    expect(r.total).toBeGreaterThan(100);
    expect(r.missing).toEqual([]);
  });

  it("accepts a refactoring that groups selectors and uses variables", () => {
    const refactored = compile(`$c: #2c5aa0;
.a { color: $c; }
.b { color: $c; }
@media (max-width: 768px) { .a { width: 100%; } }`);
    const original = `.a{color:#2c5aa0}.b{color:#2c5aa0}@media (max-width:768px){.a{width:100%}}`;
    expect(compareCss(original, refactored).ok).toBe(true);
  });

  it("ignores spacing, case and the order of rules", () => {
    const a = `.x{color:#2C5AA0;box-shadow:0 0 5px rgba(44,90,160,0.4)}.y{margin:0}`;
    const b = `.y { margin: 0; }\n.x { box-shadow: 0 0 5px rgba(44, 90, 160, 0.4); color: #2c5aa0; }`;
    expect(compareCss(a, b).ok).toBe(true);
  });

  it("reports a missing rule", () => {
    const r = compareCss(`.x{color:red}.y{color:blue}`, `.x{color:red}`);
    expect(r.ok).toBe(false);
    expect(r.missing).toContain(".y");
  });

  it("reports a changed value and says which declaration", () => {
    const r = compareCss(`.x{color:red;margin:0}`, `.x{color:green;margin:0}`);
    expect(r.ok).toBe(false);
    expect(r.changed[0]).toMatchObject({ selector: ".x" });
    expect(r.changed[0].missing).toContain("color:red");
    expect(r.changed[0].extra).toContain("color:green");
  });

  it("tells a media query rule apart from the same selector outside", () => {
    const r = compareCss(`.x{width:1px}@media (max-width:768px){.x{width:2px}}`, `.x{width:1px}`);
    expect(r.ok).toBe(false);
    expect(r.missing[0]).toContain("@media (max-width:768px)");
  });

  it("accepts extra rules and lists them separately", () => {
    const r = compareCss(`.x{color:red}`, `.x{color:red}.mt-1{margin-top:8px}`);
    expect(r.ok).toBe(true);
    expect(r.added).toContain(".mt-1");
  });

  it("flags an extra declaration inside an existing rule", () => {
    expect(compareCss(`.x{color:red}`, `.x{color:red;margin:0}`).ok).toBe(false);
  });
});

describe("tp page", () => {
  it("never publishes trainer-only material", () => {
    expect(page).not.toMatch(/corrig[ée]|bar[eè]me|grille d'observation|fiche de s[ée]ance|le pi[èe]ge/i);
  });
  it("gives the three downloads and the commands", () => {
    for (const s of ["legacy-enorme.css", "grand-menage-index.html", "verifier.mjs", "node verifier.mjs legacy-enorme.css style.css", "npx sass style.scss style.css --watch"]) {
      expect(page, s).toContain(s);
    }
  });
  it("uses no dash punctuation or emoji in learner-facing text", () => {
    for (const text of [page, pub("grand-menage-index.html"), pub("verifier.mjs")]) {
      expect(text).not.toMatch(/[–—]/);
      expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
    }
  });
});
