import { describe, it, expect } from "vitest";
import { compileScss } from "./compile";

describe("compileScss", () => {
  it("compiles a variable into plain CSS", () => {
    const result = compileScss("$c: #3498db;\n.btn { color: $c; }");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.css).toContain("color: #3498db");
  });

  it("expands nesting with the parent selector", () => {
    const result = compileScss(".card { &:hover { opacity: .8; } }");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.css).toContain(".card:hover");
  });

  it("reports an undefined variable with its line and column", () => {
    const result = compileScss("$primary-color: red;\n.a {\n  color: $primry-color;\n}");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("Undefined variable");
      expect(result.line).toBe(3);
      expect(result.column).toBe(10);
    }
  });

  it("returns an empty stylesheet for empty input without failing", () => {
    const result = compileScss("");
    expect(result).toEqual({ ok: true, css: "" });
  });
});
