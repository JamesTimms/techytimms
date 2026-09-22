import { describe, expect, it } from "vitest";
import { linkClass, underlineSlot } from "~/lib/link-accent";

describe("underlineSlot", () => {
  it("is stable for the same href", () => {
    expect(underlineSlot("/blog/hello")).toBe(underlineSlot("/blog/hello"));
  });

  it("stays within the five defined slots", () => {
    const hrefs = ["/", "/about", "/cv", "/work", "/blog", "https://github.com/JamesTimms"];
    for (const href of hrefs) {
      const slot = underlineSlot(href);
      expect(slot).toBeGreaterThanOrEqual(1);
      expect(slot).toBeLessThanOrEqual(5);
    }
  });

  it("spreads a realistic set of links across more than one slot", () => {
    const slots = new Set(
      ["/", "/about", "/cv", "/work", "/blog", "/colophon", "/uses"].map(underlineSlot),
    );
    expect(slots.size).toBeGreaterThan(1);
  });

  it("handles an empty href without throwing", () => {
    expect(underlineSlot("")).toBeGreaterThanOrEqual(1);
  });
});

describe("linkClass", () => {
  it("pairs the base class with the slot class", () => {
    expect(linkClass("/about")).toMatch(/^link link-[1-5]$/);
  });
});
