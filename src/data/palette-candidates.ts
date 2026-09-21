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
  /** Whether light mode's wallpaper is dark (Ember-like) or genuinely light. */
  mode: 'dark-ground' | 'light-ground';
  /** The one currently applied in global.css. Exactly one candidate sets this. */
  live?: boolean;
  tokens: PaletteSwatch[];
}

export const paletteCandidates: PaletteCandidate[] = [
  {
    name: "Bracken",
    blurb: "Rust wallpaper, warm grey chrome, teal accent.",
    mode: "dark-ground",
    tokens: [
      {
        token: "desktop",
        light: "#693827",
        dark: "#1c0904"
      },
      {
        token: "surface",
        light: "#ffffff",
        dark: "#1c1811"
      },
      {
        token: "ground",
        light: "#fcfaf6",
        dark: "#120f0a"
      },
      {
        token: "sunk",
        light: "#f4efe7",
        dark: "#0b0905"
      },
      {
        token: "border",
        light: "#8f887d",
        dark: "#6e685e"
      },
      {
        token: "ink",
        light: "#271e0e",
        dark: "#ede7de"
      },
      {
        token: "accent",
        light: "#05818b",
        dark: "#6bc8d3"
      },
      {
        token: "accent-ink",
        light: "#00616a",
        dark: "#77ced8"
      },
      {
        token: "titlebar-from",
        light: "#612b17",
        dark: "#592715"
      },
      {
        token: "titlebar-to",
        light: "#906b5a",
        dark: "#8a6554"
      }
    ]
  },
  {
    name: "Ember",
    blurb: "Near-black warm wallpaper, warm grey chrome, amber accent.",
    mode: "dark-ground",
    tokens: [
      {
        token: "desktop",
        light: "#25170d",
        dark: "#130803"
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
        light: "#bb731b",
        dark: "#f1ae6b"
      },
      {
        token: "accent-ink",
        light: "#864900",
        dark: "#f3b67a"
      },
      {
        token: "titlebar-from",
        light: "#432610",
        dark: "#432610"
      },
      {
        token: "titlebar-to",
        light: "#745e4e",
        dark: "#745e4e"
      }
    ]
  },
  {
    name: "Moss",
    blurb: "Deep olive wallpaper, warm grey chrome, ochre accent.",
    mode: "dark-ground",
    tokens: [
      {
        token: "desktop",
        light: "#35492b",
        dark: "#081005"
      },
      {
        token: "surface",
        light: "#ffffff",
        dark: "#1b1811"
      },
      {
        token: "ground",
        light: "#fcfaf6",
        dark: "#110f09"
      },
      {
        token: "sunk",
        light: "#f3f0e7",
        dark: "#0b0905"
      },
      {
        token: "border",
        light: "#8d897d",
        dark: "#6d695d"
      },
      {
        token: "ink",
        light: "#251f0e",
        dark: "#ebe8de"
      },
      {
        token: "accent",
        light: "#a87520",
        dark: "#e7b369"
      },
      {
        token: "accent-ink",
        light: "#7b4c00",
        dark: "#eabb79"
      },
      {
        token: "titlebar-from",
        light: "#2a3f1e",
        dark: "#26391a"
      },
      {
        token: "titlebar-to",
        light: "#67745a",
        dark: "#616e55"
      }
    ]
  },
  {
    name: "Damson",
    blurb: "Deep plum wallpaper, warm grey chrome, burnt-orange accent.",
    mode: "dark-ground",
    tokens: [
      {
        token: "desktop",
        light: "#512840",
        dark: "#180711"
      },
      {
        token: "surface",
        light: "#ffffff",
        dark: "#1c1712"
      },
      {
        token: "ground",
        light: "#fdf9f6",
        dark: "#130e0b"
      },
      {
        token: "sunk",
        light: "#f5efe9",
        dark: "#0c0806"
      },
      {
        token: "border",
        light: "#90877f",
        dark: "#70675f"
      },
      {
        token: "ink",
        light: "#281d11",
        dark: "#eee6df"
      },
      {
        token: "accent",
        light: "#b65f35",
        dark: "#f8a27c"
      },
      {
        token: "accent-ink",
        light: "#893f21",
        dark: "#faab88"
      },
      {
        token: "titlebar-from",
        light: "#4e203c",
        dark: "#4b1e39"
      },
      {
        token: "titlebar-to",
        light: "#825c6d",
        dark: "#7f596a"
      }
    ]
  },
  {
    name: "Pumpkin",
    blurb: "Bright pumpkin wallpaper, burnt-umber accent. The most literal reading of autumn.",
    mode: "light-ground",
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
    name: "Orchard",
    blurb: "Light leaf-green wallpaper, deep apple red. Fruit on the tree rather than fallen.",
    mode: "light-ground",
    tokens: [
      {
        token: "desktop",
        light: "#a9b17d",
        dark: "#0a0d03"
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
        light: "#94221d",
        dark: "#c2c564"
      },
      {
        token: "accent-ink",
        light: "#8e3f36",
        dark: "#c8ca78"
      },
      {
        token: "titlebar-from",
        light: "#2f3710",
        dark: "#2f3710"
      },
      {
        token: "titlebar-to",
        light: "#62664c",
        dark: "#62664c"
      }
    ]
  },
  {
    name: "FallenLeaf",
    blurb: "Pale straw wallpaper, deep russet accent. The lightest and calmest of the three.",
    mode: "light-ground",
    live: true,
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
