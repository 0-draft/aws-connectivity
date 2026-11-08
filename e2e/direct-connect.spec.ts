import { expect, test, type Page } from "@playwright/test";

// The Direct Connect deep dive, the site's second page.

const LANGS = ["en", "ja"] as const;

async function open(page: Page, lang: (typeof LANGS)[number]) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    // Google Fonts can be unreachable in CI; that is not a page bug.
    if (m.type() === "error" && !m.location().url.includes("fonts.g"))
      errors.push(m.text());
  });
  await page.goto(`./direct-connect/?lang=${lang}`);
  await expect(page.locator("h1")).toBeVisible();
  // Settle fonts so text measurements are final.
  await page.evaluate(() => document.fonts.ready);
  return errors;
}

for (const lang of LANGS) {
  test.describe(`layout (${lang})`, () => {
    test("renders without errors and never scrolls sideways", async ({ page }) => {
      const errors = await open(page, lang);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      expect(errors).toEqual([]);
    });

    test("no diagram text is clipped or spills out of its box", async ({ page }) => {
      await open(page, lang);
      // Scan once as loaded, then again with the labs in their other states,
      // where the longest labels appear.
      const scan = () =>
        page.evaluate(() => {
          const out: string[] = [];
          for (const svg of document.querySelectorAll<SVGSVGElement>("main svg")) {
            const vb = svg.viewBox.baseVal;
            if (!vb || !vb.width) continue;
            const boxes = [...svg.querySelectorAll("rect")]
              .filter((r) => r.getAttribute("fill") !== "transparent")
              .map((r) => r.getBBox())
              .filter((b) => b.width >= 30 && b.height >= 20 && b.width <= 400);
            for (const text of svg.querySelectorAll("text")) {
              if (text.getAttribute("transform")) continue;
              const b = text.getBBox();
              if (!b.width) continue;
              const where = `${svg.closest("section")?.id ?? "hero"}: ${text.textContent?.trim()}`;
              if (b.x < vb.x - 1 || b.x + b.width > vb.x + vb.width + 1)
                out.push(`viewBox ${where}`);
              const cx = b.x + b.width / 2;
              const cy = b.y + b.height / 2;
              for (const r of boxes) {
                const inside =
                  cx > r.x && cx < r.x + r.width && cy > r.y && cy < r.y + r.height;
                if (inside && (b.x < r.x - 1 || b.x + b.width > r.x + r.width + 1))
                  out.push(`box ${where}`);
              }
            }
          }
          // Boxes in the same row must not overlap each other.
          for (const svg of document.querySelectorAll<SVGSVGElement>("main svg")) {
            const row = [...svg.querySelectorAll("rect")]
              .filter((r) => r.getAttribute("fill") !== "transparent")
              .map((r) => r.getBBox())
              .filter((b) => b.width <= 120 && b.height >= 20);
            for (let i = 0; i < row.length; i++)
              for (let j = i + 1; j < row.length; j++) {
                const a = row[i];
                const c = row[j];
                if (a.y !== c.y || a.height !== c.height) continue;
                if (a.x < c.x + c.width - 1 && c.x < a.x + a.width - 1)
                  out.push(`overlap ${svg.closest("section")?.id ?? "hero"} at y=${a.y}`);
              }
          }
          return [...new Set(out)];
        });
      expect(await scan()).toEqual([]);

      const radio = (section: string, i: number) =>
        page
          .locator(`section#${section} [role=radiogroup]`)
          .nth(i)
          .locator("[role=radio]");
      await radio("lag-macsec", 1).nth(1).click(); // must_encrypt
      await radio("lag-macsec", 2).nth(1).click(); // MKA failed
      await radio("vifs", 0).nth(2).click(); // transit VIF
      await radio("gateway", 0).nth(1).click(); // Transit Gateway mode
      await radio("gateway", 1).nth(1).click(); // SiteLink on
      // The phone layout has its own encryption-layer picker.
      const layers = page.locator("section#security [role=radiogroup]");
      if (await layers.count())
        await layers.first().locator("[role=radio]").nth(1).click();
      // Cut one connection in the resiliency lab.
      await page.locator("section#resiliency svg [aria-pressed]").nth(2).click();
      expect(await scan()).toEqual([]);
    });

    test("glossary tips stay on screen", async ({ page }) => {
      await open(page, lang);
      const vw = await page.evaluate(() => document.documentElement.clientWidth);

      const terms = page.locator("section#why button[aria-expanded]");
      const n = await terms.count();
      expect(n).toBeGreaterThan(10);
      for (let i = 0; i < n; i++) {
        const term = terms.nth(i);
        await term.scrollIntoViewIfNeeded();
        await term.click();
        const tip = await page.getByRole("note").boundingBox();
        expect(tip!.x, `term ${i}`).toBeGreaterThanOrEqual(0);
        expect(tip!.x + tip!.width, `term ${i}`).toBeLessThanOrEqual(vw + 1);
        await page.keyboard.press("Escape");
      }
    });
  });
}

test("every in-page link in the header and the page lands on a section", async ({
  page,
}) => {
  await open(page, "en");
  const hrefs = await page
    .locator("header nav a[href^='#'], main a[href^='#']")
    .evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  expect(hrefs.length).toBeGreaterThan(15);
  for (const h of new Set(hrefs)) {
    if (!h || h === "#") continue;
    await expect(page.locator(h), h).toHaveCount(1);
  }
});

test("the BGP lab flags asymmetric routing", async ({ page }) => {
  await open(page, "en");
  const lab = page.locator("section#routing");
  await lab.getByRole("button", { name: "Active / passive (communities)" }).click();
  await expect(lab.getByText("Asymmetric!")).toHaveCount(0);
  await lab.getByLabel(/Your router sends/).selectOption("DX-B");
  await expect(lab.getByText("Asymmetric!")).toBeVisible();
});

test("diagram text stays legible on phones", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "phone-only check");
  for (const lang of LANGS) {
    await open(page, lang);
    const tiny = await page.evaluate(() => {
      const out: string[] = [];
      for (const svg of document.querySelectorAll<SVGSVGElement>("main svg")) {
        const vb = svg.viewBox.baseVal;
        const w = svg.getBoundingClientRect().width;
        if (!vb || !vb.width || !w) continue;
        const scale = w / vb.width;
        for (const text of svg.querySelectorAll("text")) {
          const size = parseFloat(getComputedStyle(text).fontSize) * scale;
          if (size < 10)
            out.push(
              `${svg.closest("section")?.id}: ${text.textContent?.trim()} ${size.toFixed(1)}px`,
            );
        }
      }
      return out;
    });
    expect(tiny, lang).toEqual([]);
  }
});

test("the road map and the deep dive link to each other", async ({ page }) => {
  await page.goto("./?lang=ja");
  const deep = page.locator("section#dx a[href*='direct-connect/']").first();
  await deep.click();
  await expect(page).toHaveURL(/\/direct-connect\/\?lang=ja#/);
  await expect(page.locator("h1")).toHaveText(/Direct Connect を深掘り/);
  await page.getByRole("link", { name: "道路地図の DX の出口" }).click();
  await expect(page.locator("section#dx")).toBeVisible();
});
