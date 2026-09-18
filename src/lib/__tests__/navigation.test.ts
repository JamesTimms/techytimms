import { describe, expect, it } from "vitest";

import {
  desktopRows,
  desktopShortcuts,
  isCurrent,
  opensOnPress,
  primaryNav,
  secondaryNav,
} from "~/lib/navigation";

describe("desktopShortcuts", () => {
  it("duplicates About, Work and Blog", () => {
    expect(desktopShortcuts.map((item) => item.label)).toEqual(["About", "Work", "Blog"]);
  });

  it("excludes CV, which belongs below the separator only", () => {
    const labels = desktopShortcuts.map((item) => item.label);
    expect(labels).not.toContain("CV");
    expect(secondaryNav.map((item) => item.label)).toContain("CV");
  });

  it("excludes Home, since the shortcut would point at the page showing it", () => {
    expect(desktopShortcuts.map((item) => item.href)).not.toContain("/");
    expect(primaryNav.map((item) => item.href)).toContain("/");
  });

  it("only surfaces destinations the Start menu also carries", () => {
    const menuHrefs = [...primaryNav, ...secondaryNav].map((item) => item.href);
    for (const shortcut of desktopShortcuts) {
      expect(menuHrefs).toContain(shortcut.href);
    }
  });
});

describe("isCurrent", () => {
  it("matches the active path", () => {
    expect(isCurrent({ href: "/work", label: "Work", icon: "work" }, "/work")).toBe(true);
  });

  it("never marks an external link as current", () => {
    const github = { href: "https://example.com", label: "GitHub", icon: "external" as const, external: true };
    expect(isCurrent(github, "https://example.com")).toBe(false);
  });
});

describe("opensOnPress", () => {
  const plainMousePress = {
    pointerType: "mouse",
    button: 0,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    altKey: false,
  };

  it("opens on a plain left mouse press", () => {
    expect(opensOnPress(plainMousePress)).toBe(true);
  });

  it("leaves touch and pen to the click, so a scroll starting on an icon does not navigate", () => {
    expect(opensOnPress({ ...plainMousePress, pointerType: "touch" })).toBe(false);
    expect(opensOnPress({ ...plainMousePress, pointerType: "pen" })).toBe(false);
  });

  it("leaves middle-click and modified clicks to the browser", () => {
    expect(opensOnPress({ ...plainMousePress, button: 1 })).toBe(false);
    expect(opensOnPress({ ...plainMousePress, metaKey: true })).toBe(false);
    expect(opensOnPress({ ...plainMousePress, ctrlKey: true })).toBe(false);
    expect(opensOnPress({ ...plainMousePress, shiftKey: true })).toBe(false);
  });
});

describe("desktopRows", () => {
  it("gives one row per item, so no empty rows leave gaps", () => {
    expect(desktopRows(secondaryNav)).toBe(secondaryNav.length);
  });

  it("caps the rows so a long list wraps into another column", () => {
    const manyItems = Array.from({ length: 12 }, () => primaryNav[0]!);
    expect(desktopRows(manyItems)).toBe(8);
  });
});
