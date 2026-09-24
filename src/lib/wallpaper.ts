export interface WallpaperNoise {
  type: 'turbulence' | 'fractalNoise';
  /** One value, or an x/y pair for stretched grain. */
  frequency: number | [number, number];
  octaves: number;
  seed: number;
  stitch: boolean;
  /** Tile edge in px, or a width/height pair. */
  tile: number | [number, number];
  opacity: number;
  /** Drains colour from the filter output; 0 is achromatic, 1 leaves it untouched. */
  saturation: number;
  fill: string;
  lighting: 'specular' | 'diffuse' | 'none';
  surfaceScale: number;
  elevation: number;
  azimuth: number;
  specularConstant: number;
  specularExponent: number;
  diffuseConstant: number;
  lightColour: string;
  blend: string;
  repeat: string;
  position: string;
}

export interface WallpaperGradient {
  type: 'linear' | 'radial' | 'conic';
  angle: number;
  /** `#hex` or `#hex 40%` — the stop is written through untouched. */
  stops: string[];
  blend: string;
  size: string;
  repeat: string;
  position: string;
}

export interface WallpaperTheme {
  colour: string;
  gradient: WallpaperGradient | false;
  noise: WallpaperNoise | false;
  attachment: string;
}

export interface WallpaperCssOptions {
  selector: string;
  /** Cascade layer to emit into, or `false` for unlayered. */
  layer: string | false;
  /** Custom property the gradient is published as, for other rules to reuse. */
  gradientProperty: string;
  light: WallpaperTheme;
  dark: WallpaperTheme;
  /** Selector prefix the dark rule is nested under. */
  darkSelector: string;
}

const pair = (value: number | [number, number]): [number, number] =>
  Array.isArray(value) ? value : [value, value];

function lightingPrimitive(noise: WallpaperNoise): string {
  if (noise.lighting === 'none') return '';

  const element = noise.lighting === 'diffuse' ? 'feDiffuseLighting' : 'feSpecularLighting';
  const constants =
    noise.lighting === 'diffuse'
      ? `diffuseConstant="${noise.diffuseConstant}"`
      : `specularConstant="${noise.specularConstant}" specularExponent="${noise.specularExponent}"`;

  return `<${element} in="turb" surfaceScale="${noise.surfaceScale}" ${constants} lighting-color="${noise.lightColour}" result="lit"><feDistantLight azimuth="${noise.azimuth}" elevation="${noise.elevation}"/></${element}>`;
}

function noiseImage(noise: WallpaperNoise): string {
  const [width, height] = pair(noise.tile);
  const [fx, fy] = pair(noise.frequency);
  const frequency = fx === fy ? `${fx}` : `${fx} ${fy}`;

  const turbulence = `<feTurbulence type="${noise.type}" baseFrequency="${frequency}" numOctaves="${noise.octaves}" seed="${noise.seed}"${noise.stitch ? ' stitchTiles="stitch"' : ''} result="turb"/>`;
  const saturate =
    noise.saturation === 1 ? '' : `<feColorMatrix type="saturate" values="${noise.saturation}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><filter id="n">${turbulence}${lightingPrimitive(noise)}${saturate}</filter><rect width="${width}" height="${height}" filter="url(#n)" fill="${noise.fill}" opacity="${noise.opacity}"/></svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const gradientImage = (gradient: WallpaperGradient): string =>
  gradient.type === 'linear'
    ? `linear-gradient(${gradient.angle}deg, ${gradient.stops.join(', ')})`
    : gradient.type === 'conic'
      ? `conic-gradient(from ${gradient.angle}deg, ${gradient.stops.join(', ')})`
      : `radial-gradient(${gradient.stops.join(', ')})`;

function declarations(theme: WallpaperTheme, gradientProperty: string): string {
  const layers: { image: string; blend: string; size: string; repeat: string; position: string }[] =
    [];

  if (theme.noise) {
    const [width, height] = pair(theme.noise.tile);
    layers.push({
      image: noiseImage(theme.noise),
      blend: theme.noise.blend,
      size: `${width}px ${height}px`,
      repeat: theme.noise.repeat,
      position: theme.noise.position,
    });
  }

  if (theme.gradient) {
    layers.push({
      image: `var(${gradientProperty})`,
      blend: theme.gradient.blend,
      size: theme.gradient.size,
      repeat: theme.gradient.repeat,
      position: theme.gradient.position,
    });
  }

  const lines = [`background-color: ${theme.colour};`];

  if (theme.gradient) lines.push(`${gradientProperty}: ${gradientImage(theme.gradient)};`);

  if (layers.length > 0) {
    lines.push(
      `background-image: ${layers.map((layer) => layer.image).join(', ')};`,
      `background-blend-mode: ${layers.map((layer) => layer.blend).join(', ')};`,
      `background-size: ${layers.map((layer) => layer.size).join(', ')};`,
      `background-repeat: ${layers.map((layer) => layer.repeat).join(', ')};`,
      `background-position: ${layers.map((layer) => layer.position).join(', ')};`,
    );
  }

  lines.push(`background-attachment: ${theme.attachment};`);

  return lines.map((line) => `  ${line}`).join('\n');
}

export function wallpaperCss({
  selector,
  layer,
  gradientProperty,
  light,
  dark,
  darkSelector,
}: WallpaperCssOptions): string {
  const rules = [
    `${selector} {`,
    declarations(light, gradientProperty),
    '}',
    `${darkSelector} ${selector} {`,
    declarations(dark, gradientProperty),
    '}',
  ];

  return layer === false ? rules.join('\n') : [`@layer ${layer} {`, ...rules, '}'].join('\n');
}
