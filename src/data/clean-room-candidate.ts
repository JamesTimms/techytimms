/*
 * The clean-room palette candidate for the styleguide's "Palette candidates"
 * matrix: built from nothing but the two live 500 steps (leaf, pumpkin) plus
 * one neutral ramp, with every required role landing on a ramp step rather
 * than an off-ramp value. Reasoning against the shipped scheme lives on the
 * styleguide page itself, not here — this file only holds the ramps and the
 * role → step mapping.
 */

export interface RequiredTokenRole {
  key: string;
  /** The current semantic token this role corresponds to, for the table's left column. */
  label: string;
}

// The full role set every palette candidate is judged against, in the order
// the matrix renders them.
export const requiredTokenRoles: RequiredTokenRole[] = [
  { key: 'desktop', label: 'desktop' },
  { key: 'chrome', label: 'chrome (bars + window frame)' },
  { key: 'surface', label: 'surface' },
  { key: 'sunk', label: 'sunk' },
  { key: 'fill', label: 'fill (title bar)' },
  { key: 'ink', label: 'ink' },
  { key: 'ink-muted', label: 'ink-muted' },
  { key: 'ink-faint', label: 'ink-faint' },
  { key: 'on-fill', label: 'on-fill (title bar / desktop text)' },
  { key: 'accent-ink', label: 'accent-ink (link)' },
  { key: 'accent', label: 'accent' },
  { key: 'rule', label: 'rule (border)' },
  { key: 'border', label: 'border (border-strong)' },
];

// Ramp source hex, exactly as given — leaf and pumpkin ten steps (50–900),
// neutral eleven (50–950, hue 80, chroma 0.008).
const leafRamp: Record<string, string> = {
  '50': 'f9f4eb', '100': 'f1e7d7', '200': 'dfd3c0', '300': 'c3b49c', '400': '9f8e73',
  '500': '786547', '600': '5b4c34', '700': '453a27', '800': '332a1b', '900': '1c160d',
};

const pumpkinRamp: Record<string, string> = {
  '50': 'fcf3eb', '100': 'f9e5d4', '200': 'f0cfb3', '300': 'd8ae8d', '400': 'b78661',
  '500': '905931', '600': '704324', '700': '57321a', '800': '422311', '900': '251106',
};

const neutralRamp: Record<string, string> = {
  '50': 'faf6f1', '100': 'f0ece7', '200': 'e6e2dd', '300': 'd6d3cd', '400': 'bcb9b4',
  '500': '97948f', '600': '6b6863', '700': '474440', '800': '2e2c28', '900': '25221e', '950': '1b1915',
};

export const cleanRoomRamps = {
  leaf: leafRamp,
  pumpkin: pumpkinRamp,
  neutral: neutralRamp,
};

function step(ramp: 'leaf' | 'pumpkin' | 'neutral', value: string): string {
  const source = ramp === 'leaf' ? leafRamp : ramp === 'pumpkin' ? pumpkinRamp : neutralRamp;
  const hex = source[value];
  if (!hex) throw new Error(`no ${ramp}-${value} in the clean-room ramps`);
  return `#${hex}`;
}

export interface CleanRoomRoleValue {
  light: string;
  dark: string;
  /** The ramp step each theme draws from, e.g. "leaf-600". */
  lightStep: string;
  darkStep: string;
}

function role(lightStep: string, darkStep: string): CleanRoomRoleValue {
  const [lightRamp, lightValue] = lightStep.split('-') as ['leaf' | 'pumpkin' | 'neutral' | 'n', string];
  const [darkRamp, darkValue] = darkStep.split('-') as ['leaf' | 'pumpkin' | 'neutral' | 'n', string];
  const resolve = (ramp: string) => (ramp === 'n' ? 'neutral' : (ramp as 'leaf' | 'pumpkin' | 'neutral'));
  return {
    light: step(resolve(lightRamp), lightValue),
    dark: step(resolve(darkRamp), darkValue),
    lightStep,
    darkStep,
  };
}

// Verbatim mapping from the brief: every role a live ramp step, nothing
// interpolated or hand-picked off it.
export const cleanRoomCandidate: Record<string, CleanRoomRoleValue> = {
  desktop: role('leaf-600', 'leaf-900'),
  chrome: role('n-200', 'n-900'),
  surface: role('n-50', 'n-800'),
  sunk: role('n-100', 'n-950'),
  fill: role('pumpkin-600', 'pumpkin-600'),
  ink: role('n-900', 'n-50'),
  'ink-muted': role('n-700', 'n-300'),
  'ink-faint': role('n-600', 'n-400'),
  'on-fill': role('n-50', 'n-50'),
  'accent-ink': role('pumpkin-700', 'pumpkin-200'),
  accent: role('pumpkin-500', 'pumpkin-300'),
  rule: role('n-400', 'n-600'),
  border: role('n-500', 'n-500'),
};

// The two shipped candidates (palette-candidates.ts) predate this role set —
// they were authored around a two-stop title-bar gradient, before `chrome`,
// `ink-muted`, `ink-faint`, `on-fill` and `rule` existed as separate ideas.
// `null` means the role genuinely has no equivalent there, not an oversight.
export const legacyCandidateRoleToken: Record<string, string | null> = {
  desktop: 'desktop',
  chrome: null,
  surface: 'surface',
  sunk: 'sunk',
  fill: 'titlebar-from',
  ink: 'ink',
  'ink-muted': null,
  'ink-faint': null,
  'on-fill': null,
  'accent-ink': 'accent-ink',
  accent: 'accent',
  rule: null,
  border: 'border',
};
