import { NAV } from "@/data/nav";
import { CARDS } from "./cards";
import { DX_DEEP } from "@/data/site";

describe("quiz cards", () => {
  it("every card points at a real exit", () => {
    const ids = new Set(NAV.map((n) => n.id));
    for (const c of CARDS) expect(ids.has(c.to)).toBe(true);
  });
  it("mixes myths and facts", () => {
    expect(CARDS.some((c) => c.fact)).toBe(true);
    expect(CARDS.some((c) => !c.fact)).toBe(true);
  });
  it("deeper links point at the DX deep dive page", () => {
    for (const c of CARDS)
      if (c.deeper) expect(c.deeper.startsWith(`${DX_DEEP}#`)).toBe(true);
  });
});
