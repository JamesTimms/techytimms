import type { Oklch } from '~/lib/color-tokens';

export type Theme = 'light' | 'dark';

export const RESET_EVENT = 'colour-tweaks-reset';
const overrides = new Map<string, string>();

export const formatOklch = ({ l, c, h }: Oklch) => `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${Math.round(h)})`;

function tweaksStyleElement(): HTMLStyleElement {
  const existing = document.getElementById('colour-tweaks');
  if (existing instanceof HTMLStyleElement) return existing;
  const created = document.createElement('style');
  created.id = 'colour-tweaks';
  document.head.append(created);
  return created;
}

export function setColourOverride(token: string, theme: Theme, oklch: Oklch) {
  overrides.set(`${token}:${theme}`, formatOklch(oklch));
  const light: string[] = [];
  const dark: string[] = [];
  for (const [key, value] of overrides) {
    const [name, keyTheme] = key.split(':');
    (keyTheme === 'dark' ? dark : light).push(`--color-${name}:${value}`);
  }
  // Doubled/negated selectors outrank global.css's `.dark {}` and the page's `.theme-light {}`.
  tweaksStyleElement().textContent = `:root:not(.dark),.theme-light.theme-light{${light.join(';')}}.dark.dark{${dark.join(';')}}`;
}

const sliders: { channel: keyof Oklch; max: number; step: number }[] = [
  { channel: 'l', max: 1, step: 0.001 },
  { channel: 'c', max: 0.37, step: 0.001 },
  { channel: 'h', max: 360, step: 1 },
];

export function ColourSliders({ value, onChange }: { value: Oklch; onChange: (next: Oklch) => void }) {
  return (
    <div className="flex w-48 flex-col gap-1">
      {sliders.map(({ channel, max, step }) => (
        <label key={channel} className="flex items-center gap-1 text-[0.6rem] text-ink-faint">
          <span className="w-2 font-mono uppercase">{channel}</span>
          <input
            type="range"
            min={0}
            max={max}
            step={step}
            value={value[channel]}
            onChange={(event) => onChange({ ...value, [channel]: Number(event.currentTarget.value) })}
            className="min-w-0 flex-1 accent-accent"
          />
        </label>
      ))}
      <code className="text-[0.6rem] text-ink-faint">{formatOklch(value)}</code>
    </div>
  );
}

export function ResetColourTweaks() {
  function resetAll() {
    overrides.clear();
    tweaksStyleElement().textContent = '';
    window.dispatchEvent(new Event(RESET_EVENT));
  }

  return (
    <button type="button" onClick={resetAll} className="border border-border bg-sunk px-2 py-1 text-xs text-ink">
      Reset all
    </button>
  );
}
