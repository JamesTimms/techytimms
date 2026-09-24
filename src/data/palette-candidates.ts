/*
 * Palette candidates for the styleguide. Hex is deliberate: the swatches must
 * render both themes at once, so they cannot use theme-dependent tokens.
 * Source of truth for the reasoning is docs/palette-exploration.md.
 */

export interface PaletteSwatch {
  token: string;
  light: string;
  dark: string;
}

export interface PaletteCandidate {
  name: string;
  blurb: string;
  /** Whether light mode's wallpaper is dark or genuinely light. */
  mode: 'dark-ground' | 'light-ground';
  /** The one currently applied in global.css. Exactly one candidate sets this. */
  live?: boolean;
  tokens: PaletteSwatch[];
}

export const paletteCandidates: PaletteCandidate[] = [
  {
    name: "Pumpkin",
    blurb: "Bright pumpkin wallpaper, burnt-umber accent. The most literal reading of autumn.",
    mode: "light-ground",
    live: true,
    tokens: [
      {
        token: "desktop",
        light: "#cf8d60",
        dark: "#140804"
      },
      {
        token: "surface",
        light: "#ffffff",
        dark: "#1b1811"
      },
      {
        token: "ground",
        light: "#fcfaf6",
        dark: "#120f09"
      },
      {
        token: "sunk",
        light: "#f4f0e7",
        dark: "#0b0905"
      },
      {
        token: "border",
        light: "#8e897d",
        dark: "#6e685d"
      },
      {
        token: "ink",
        light: "#261e0e",
        dark: "#ece7de"
      },
      {
        token: "accent",
        light: "#832e09",
        dark: "#f7a974"
      },
      {
        token: "accent-ink",
        light: "#8d4226",
        dark: "#f9b281"
      },
      {
        token: "titlebar-from",
        light: "#512d1c",
        dark: "#512d1c"
      },
      {
        token: "titlebar-to",
        light: "#7c6352",
        dark: "#7c6352"
      }
    ]
  },
  {
    name: "FallenLeaf",
    blurb: "Pale straw wallpaper, deep russet accent. The lightest and calmest of the two.",
    mode: "light-ground",
    tokens: [
      {
        token: "desktop",
        light: "#d2ba92",
        dark: "#150b04"
      },
      {
        token: "surface",
        light: "#ffffff",
        dark: "#1b1811"
      },
      {
        token: "ground",
        light: "#fcfaf6",
        dark: "#120f09"
      },
      {
        token: "sunk",
        light: "#f4f0e7",
        dark: "#0b0905"
      },
      {
        token: "border",
        light: "#8e897d",
        dark: "#6e685d"
      },
      {
        token: "ink",
        light: "#261e0e",
        dark: "#ece7de"
      },
      {
        token: "accent",
        light: "#97400d",
        dark: "#f5b076"
      },
      {
        token: "accent-ink",
        light: "#8c431f",
        dark: "#f7b47d"
      },
      {
        token: "titlebar-from",
        light: "#4d3119",
        dark: "#4d3119"
      },
      {
        token: "titlebar-to",
        light: "#776551",
        dark: "#776551"
      }
    ]
  }
];
