import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./DirectConnectApp";
import { DX_DEEP, HOME } from "@/data/site";
import { LangProvider } from "@/i18n/LangContext";
import { NAV } from "@/features/direct-connect/content/nav";
import { EVENTS } from "@/features/direct-connect/content/timeline";
import { GLOSSARY, GLOSSARY_BY_ID } from "@/features/direct-connect/content/glossary";
import { MYTHS } from "@/features/direct-connect/content/myths";
import { TRAPS } from "@/features/direct-connect/content/traps";

const renderApp = (initial?: "en" | "ja") =>
  render(
    <LangProvider initial={initial}>
      <App />
    </LangProvider>,
  );

describe("Direct Connect deep dive", () => {
  it("renders every section the nav links to", () => {
    const { container } = renderApp();
    for (const n of NAV)
      expect(container.querySelector(`section#${n.id}`)).not.toBeNull();
  });

  it("defaults to English and switches to Japanese", async () => {
    renderApp();
    expect(document.documentElement.lang).toBe("en");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Direct Connect, up close",
    );
    await userEvent.click(screen.getByRole("button", { name: "日本語" }));
    expect(document.documentElement.lang).toBe("ja");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Direct Connect を深掘り",
    );
    expect(localStorage.getItem("on-ramp:lang")).toBe("ja");
  });

  it("the BGP lab reacts to a failed path", async () => {
    renderApp();
    const lab = screen.getByRole("heading", {
      name: /Path selection lab/,
    }).parentElement!;
    // Active/active by default: both DX paths win.
    const winner = () => within(lab).getByText(/^Traffic goes via/).textContent;
    expect(winner()).toBe("Traffic goes via: DX-A + DX-B");
    const [dxA, dxB] = within(lab).getAllByRole("checkbox", { name: "up" });
    await userEvent.click(dxA);
    expect(winner()).toBe("Traffic goes via: DX-B");
    // Both DX paths gone: the VPN takes over.
    await userEvent.click(dxB);
    expect(winner()).toBe("Traffic goes via: VPN");
  });

  it("warns when the two directions disagree", async () => {
    renderApp();
    const lab = screen.getByRole("heading", {
      name: /Path selection lab/,
    }).parentElement!;
    await userEvent.click(
      within(lab).getByRole("button", { name: "Active / passive (communities)" }),
    );
    expect(within(lab).queryByText("Asymmetric!")).toBeNull();
    await userEvent.selectOptions(
      within(lab).getByLabelText(/Your router sends/),
      "DX-B",
    );
    expect(within(lab).getByText("Asymmetric!")).toBeInTheDocument();
  });

  it("radio groups follow the arrow-key pattern", async () => {
    renderApp();
    const group = screen.getByRole("radiogroup", { name: "VIF type" });
    const [priv, pub] = within(group).getAllByRole("radio");
    expect(priv).toHaveAttribute("tabindex", "0");
    expect(pub).toHaveAttribute("tabindex", "-1");
    priv.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(pub).toHaveAttribute("aria-checked", "true");
    expect(pub).toHaveFocus();
  });

  it("switches wide diagrams to phone layouts on narrow screens", async () => {
    const original = Object.getOwnPropertyDescriptor(window, "matchMedia");
    window.matchMedia = ((q: string) => ({
      matches: q.includes("max-width"),
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
    try {
      renderApp();
      const overview = document.querySelector("section#overview") as HTMLElement;
      const xc = within(overview).getByRole("button", {
        name: "Cross connect",
        expanded: true,
      });
      expect(within(overview).getByText(/single-mode fiber patch/)).toBeInTheDocument();
      await userEvent.click(within(overview).getByRole("button", { name: "VPCs" }));
      expect(xc).toHaveAttribute("aria-expanded", "false");
      expect(
        within(overview).getByText(/Your private address space/),
      ).toBeInTheDocument();
    } finally {
      if (original) Object.defineProperty(window, "matchMedia", original);
      else delete (window as { matchMedia?: unknown }).matchMedia;
    }
  });

  it("each section lists the traps it untangles", () => {
    renderApp();
    const routing = document.querySelector("section#routing") as HTMLElement;
    expect(within(routing).getByText("Untangles these traps")).toBeInTheDocument();
    expect(
      within(routing).getByRole("link", { name: /Why is my traffic on the VPN/ }),
    ).toHaveAttribute("href", "#traps");
  });

  it("links back to the road map for the other roads, keeping the language", async () => {
    renderApp();
    const section = (id: string) =>
      document.querySelector(`section#${id}`) as HTMLElement;
    expect(
      within(section("why")).getByRole("link", { name: "the road map" }),
    ).toHaveAttribute("href", HOME);
    expect(
      within(section("routing")).getByRole("link", { name: "path selection" }),
    ).toHaveAttribute("href", `${HOME}#routing`);
    expect(
      within(section("gateway")).getByRole("link", { name: "hubs" }),
    ).toHaveAttribute("href", `${HOME}#hubs`);
    await userEvent.click(screen.getByRole("button", { name: "日本語" }));
    expect(
      within(section("gateway")).getByRole("link", { name: "ハブ" }),
    ).toHaveAttribute("href", `${HOME}?lang=ja#hubs`);
    expect(screen.getByRole("link", { name: "道路地図の DX の出口" })).toHaveAttribute(
      "href",
      `${HOME}?lang=ja#dx`,
    );
    // The footer's own entry for this page stays on this page.
    expect(
      screen.getByRole("link", { name: "Direct Connect を深掘り (このサイト内)" }),
    ).toHaveAttribute("href", DX_DEEP);
  });

  it("does not claim MACsec covers a carrier circuit unconditionally", () => {
    renderApp();
    const security = document.querySelector("section#security") as HTMLElement;
    // The default focus is MACsec; its note must state the carrier condition.
    expect(security).toHaveTextContent(/carrier circuit is covered only when/);
    expect(security).toHaveTextContent(/if L2-transparent/);
  });

  it("has both languages for every timeline entry", () => {
    for (const e of EVENTS) {
      expect(e.text.en.length).toBeGreaterThan(0);
      expect(e.text.ja.length).toBeGreaterThan(0);
    }
  });

  it("glossary entries are complete and cross-links resolve", () => {
    const ids = new Set(NAV.map((n) => n.id));
    for (const e of GLOSSARY) {
      expect(e.def.en && e.def.ja && e.en && e.ja).toBeTruthy();
      expect(ids.has(e.see)).toBe(true);
      if (e.notTo) expect(GLOSSARY_BY_ID[e.notTo.id]).toBeDefined();
    }
    for (const x of TRAPS) expect(ids.has(x.stop)).toBe(true);
  });

  it("a glossary term opens and closes with Escape", async () => {
    renderApp();
    const why = document.querySelector("section#why") as HTMLElement;
    const btn = within(why).getByRole("button", { name: "LOA-CFA" });
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(within(why).getByRole("note")).toHaveTextContent(/work permit/);
    await userEvent.keyboard("{Escape}");
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("the myth quiz scores answers", async () => {
    renderApp();
    const quiz = document.querySelector("section#myths") as HTMLElement;
    // Q1 (encrypted by default) is a myth.
    expect(MYTHS[0].truth).toBe(false);
    await userEvent.click(within(quiz).getAllByRole("button", { name: "Myth" })[0]);
    expect(within(quiz).getByText(/^Right!/)).toBeInTheDocument();
    expect(within(quiz).getByText(/1 of 1 correct/)).toBeInTheDocument();
  });
});
