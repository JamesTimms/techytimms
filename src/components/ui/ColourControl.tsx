import { useEffect, useState } from 'react';

import { oklchToHex } from '~/lib/color-tokens';

interface Oklch {
  l: number;
  c: number;
  h: number;
}

export interface ColourControlProps {
  token: string;
  theme: 'light' | 'dark';
  oklch: Oklch;
}

const RESET_EVENT = 'colour-tweaks-reset';
const overrides = new Map<string, string>();

const formatOklch = ({ l, c, h }: Oklch) => `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${Math.round(h)})`;

function tweaksStyleElement(): HTMLStyleElement {
  const existing = document.getElementById('colour-tweaks');
  if (existing instanceof HTMLStyleElement) return existing;
  const created = document.createElement('style');
  created.id = 'colour-tweaks';
  document.head.append(created);
  return created;
}

function writeOverrides() {
  const light: string[] = [];
  const dark: string[] = [];
  for (const [key, value] of overrides) {
    const [token, theme] = key.split(':');
    (theme === 'dark' ? dark : light).push(`--color-${token}:${value}`);
  }
  // Doubled/negated selectors outrank global.css's unlayered `.dark {}` regardless of source order.
  tweaksStyleElement().textContent = `:root:not(.dark){${light.join(';')}}.dark.dark{${dark.join(';')}}`;
}

export function ColourControl({ token, theme, oklch }: ColourControlProps) {
  const [value, setValue] = useState(oklch);

  useEffect(() => {
    const reset = () => setValue(oklch);
    window.addEventListener(RESET_EVENT, reset);
    return () => window.removeEventListener(RESET_EVENT, reset);
  }, [oklch]);

  function update(channel: keyof Oklch, raw: string) {
    const next = { ...value, [channel]: Number(raw) };
    setValue(next);
    overrides.set(`${token}:${theme}`, formatOklch(next));
    writeOverrides();
  }

  const css = formatOklch(value);
  const sliders: { channel: keyof Oklch; max: number; step: number }[] = [
    { channel: 'l', max: 1, step: 0.001 },
    { channel: 'c', max: 0.37, step: 0.001 },
    { channel: 'h', max: 360, step: 1 },
  ];

  return (
    <div className="flex w-40 flex-col gap-1">
      <span
        className="relative block h-5 w-full border border-border"
        style={{ backgroundColor: css }}
        data-swatch-info={`${token} (${theme})\n${css}\n${oklchToHex(value)}`}
      />
      {sliders.map(({ channel, max, step }) => (
        <label key={channel} className="flex items-center gap-1 text-[0.6rem] text-ink-faint">
          <span className="w-2 font-mono uppercase">{channel}</span>
          <input
            type="range"
            min={0}
            max={max}
            step={step}
            value={value[channel]}
            onChange={(event) => update(channel, event.currentTarget.value)}
            className="min-w-0 flex-1 accent-accent"
          />
        </label>
      ))}
      <code className="text-[0.6rem] text-ink-faint">{css}</code>
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
