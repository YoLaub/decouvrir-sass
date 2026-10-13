import { describe, it, expect } from "vitest";
import { pages, neighbors } from "./pages";

describe("neighbors", () => {
  it("has no previous page for the first page", () => {
    expect(neighbors(pages[0].slug).prev).toBeUndefined();
    expect(neighbors(pages[0].slug).next?.slug).toBe(pages[1].slug);
  });

  it("has no next page for the last page", () => {
    const last = pages[pages.length - 1];
    expect(neighbors(last.slug).next).toBeUndefined();
    expect(neighbors(last.slug).prev?.slug).toBe(pages[pages.length - 2].slug);
  });

  it("returns both neighbours for a middle page", () => {
    const { prev, next } = neighbors(pages[2].slug);
    expect(prev?.slug).toBe(pages[1].slug);
    expect(next?.slug).toBe(pages[3].slug);
  });

  it("returns no neighbours for an unknown slug", () => {
    expect(neighbors("nope")).toEqual({});
  });

  it("lists the course pages in teaching order", () => {
    expect(pages.map((p) => p.slug).slice(0, 5)).toEqual([
      "variables",
      "imbrication",
      "partials",
      "mixins-extend",
      "compilation",
    ]);
  });
});
