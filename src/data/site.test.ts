import { describe, expect, it } from "vitest";
import { DX_DEEP, HOME, pageUrl } from "./site";

describe("pageUrl", () => {
  it("links the English page without a query", () => {
    expect(pageUrl(HOME, "en")).toBe(HOME);
    expect(pageUrl(HOME, "en", "routing")).toBe(`${HOME}#routing`);
  });

  it("carries ?lang=ja before the section hash", () => {
    expect(pageUrl(HOME, "ja")).toBe(`${HOME}?lang=ja`);
    expect(pageUrl(DX_DEEP, "ja", "vifs")).toBe(`${DX_DEEP}?lang=ja#vifs`);
  });

  it("puts the deep dive under the site root", () => {
    expect(DX_DEEP).toBe(`${HOME}direct-connect/`);
  });
});
