import { describe, expect, it } from 'vitest';
import { darkWallpaper, lightWallpaper } from '~/components/ui/Wallpaper';
import { wallpaperCss, type WallpaperCssOptions } from '~/lib/wallpaper';

const options: WallpaperCssOptions = {
  selector: '.desktop-ground',
  layer: 'base',
  gradientProperty: '--desktop-gradient',
  darkSelector: '.dark',
  light: lightWallpaper,
  dark: darkWallpaper,
};

const build = (overrides: Partial<WallpaperCssOptions> = {}) =>
  wallpaperCss({ ...options, ...overrides });

const decode = (css: string) =>
  css.replace(/data:image\/svg\+xml,([^"]+)/g, (_, uri: string) => decodeURIComponent(uri));

describe('wallpaperCss', () => {
  it('emits a rule for each theme, inside the layer', () => {
    const css = build();
    expect(css).toContain('@layer base {');
    expect(css).toContain('.desktop-ground {');
    expect(css).toContain('.dark .desktop-ground {');
  });

  it('keeps the live gradients and tile sizes', () => {
    const css = build();
    expect(css).toContain('linear-gradient(90deg, oklch(92% 0.03 60), oklch(96.5% 0.012 60))');
    expect(css).toContain('linear-gradient(135deg, oklch(28% 0.016 60), oklch(15% 0.010 60))');
    expect(css).toContain('background-size: 180px 180px, auto;');
    expect(css).toContain('background-size: 140px 140px, auto;');
  });

  it('carries the lighting settings into the filter', () => {
    const svg = decode(build());
    expect(svg).toContain('baseFrequency="0.715"');
    expect(svg).toContain('<feSpecularLighting in="turb" surfaceScale="8.5"');
    expect(svg).toContain('<feDistantLight azimuth="235" elevation="45"/>');
  });

  it('swaps in diffuse lighting and its own constant', () => {
    const light = { ...lightWallpaper, noise: { ...lightWallpaper.noise, lighting: 'diffuse' } };
    const svg = decode(build({ light: light as WallpaperCssOptions['light'] }));
    expect(svg).toContain('<feDiffuseLighting in="turb"');
    expect(svg).toContain('diffuseConstant="1"');
  });

  it('writes an x/y pair only when the frequencies differ', () => {
    const stretched = {
      ...lightWallpaper,
      noise: { ...lightWallpaper.noise, frequency: [0.2, 0.9] },
    };
    expect(decode(build({ light: stretched as WallpaperCssOptions['light'] }))).toContain(
      'baseFrequency="0.2 0.9"',
    );
  });

  it('drops the noise layer, keeping the gradient', () => {
    const css = build({ light: { ...lightWallpaper, noise: false } });
    const [rule] = css.split('.dark');
    expect(rule).toContain('background-image: var(--desktop-gradient);');
    expect(rule).not.toContain('data:image/svg+xml');
  });

  it('honours a different selector and an unlayered emit', () => {
    const css = build({ selector: '.preview', layer: false, darkSelector: '[data-theme="dark"]' });
    expect(css).not.toContain('@layer');
    expect(css).toContain('.preview {');
    expect(css).toContain('[data-theme="dark"] .preview {');
  });
});
