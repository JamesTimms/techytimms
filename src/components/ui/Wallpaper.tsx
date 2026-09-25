import {
  wallpaperCss,
  type WallpaperGradient,
  type WallpaperNoise,
  type WallpaperTheme,
} from '~/lib/wallpaper';

type ThemeProps = {
  colour?: string;
  attachment?: string;
  gradient?: Partial<WallpaperGradient> | false;
  noise?: Partial<WallpaperNoise> | false;
};

export interface WallpaperProps {
  light?: ThemeProps;
  dark?: ThemeProps;
  selector?: string;
  layer?: string | false;
  gradientProperty?: string;
  darkSelector?: string;
}

const noise: WallpaperNoise = {
  type: 'turbulence',
  frequency: 0.715,
  octaves: 6,
  seed: 13,
  stitch: true,
  tile: 180,
  opacity: 0.75,
  saturation: 1,
  fill: '#000000',
  lighting: 'specular',
  surfaceScale: 8.5,
  elevation: 45,
  azimuth: 235,
  specularConstant: 1,
  specularExponent: 12,
  diffuseConstant: 1,
  lightColour: '#ffffff',
  blend: 'soft-light',
  repeat: 'repeat',
  position: '0 0',
};

const gradient: WallpaperGradient = {
  type: 'linear',
  angle: 90,
  stops: ['oklch(92% 0.03 60)', 'oklch(96.5% 0.012 60)'],
  blend: 'normal',
  size: 'auto',
  repeat: 'no-repeat',
  position: '0 0',
};

export const lightWallpaper: WallpaperTheme = {
  colour: 'var(--color-desktop)',
  gradient,
  noise,
  attachment: 'fixed',
};

export const darkWallpaper: WallpaperTheme = {
  colour: 'var(--color-desktop)',
  // Warm charcoal, low chroma.
  gradient: { ...gradient, angle: 135, stops: ['oklch(32% 0.018 60)', 'oklch(15% 0.010 60)'] },
  noise: {
    ...noise,
    frequency: 0.65,
    octaves: 3,
    seed: 2,
    tile: 140,
    surfaceScale: 8,
    azimuth: 95,
    specularConstant: 0.55,
  },
  attachment: 'fixed',
};

function theme(overrides: ThemeProps, base: WallpaperTheme): WallpaperTheme {
  return {
    ...base,
    ...overrides,
    gradient:
      overrides.gradient === false
        ? false
        : { ...(base.gradient || gradient), ...overrides.gradient },
    noise: overrides.noise === false ? false : { ...(base.noise || noise), ...overrides.noise },
  };
}

export function Wallpaper({
  light = {},
  dark = {},
  selector = '.desktop-ground',
  layer = 'base',
  gradientProperty = '--desktop-gradient',
  darkSelector = '.dark',
}: WallpaperProps) {
  const css = wallpaperCss({
    selector,
    layer,
    gradientProperty,
    darkSelector,
    light: theme(light, lightWallpaper),
    dark: theme(dark, darkWallpaper),
  });

  return <style>{css}</style>;
}
