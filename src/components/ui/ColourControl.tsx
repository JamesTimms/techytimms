import { useRef, useState } from 'react';

import { hexToOklch, oklchToHex, type Oklch } from '~/lib/color-tokens';

export type Theme = 'light' | 'dark';

export const RESET_EVENT = 'colour-tweaks-reset';
const overrides = new Map<string, string>();

export const formatOklch = ({ l, c, h, alpha = 1 }: Oklch) =>
  `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${Math.round(h)}${alpha < 1 ? ` / ${Number(alpha.toFixed(2))}` : ''})`;

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

const sliders: { channel: keyof Oklch; label: string; max: number; step: number }[] = [
  { channel: 'l', label: 'L', max: 1, step: 0.001 },
  { channel: 'c', label: 'C', max: 0.37, step: 0.001 },
  { channel: 'h', label: 'H', max: 360, step: 1 },
  { channel: 'alpha', label: 'A', max: 1, step: 0.01 },
];

type EyeDropperConstructor = new () => { open(): Promise<{ sRGBHex: string }> };

function PickButton({ value, onPick }: { value: Oklch; onPick: (hex: string) => void }) {
  const fallback = useRef<HTMLInputElement>(null);

  async function pick() {
    const EyeDropper = (window as { EyeDropper?: EyeDropperConstructor }).EyeDropper;
    if (!EyeDropper) return fallback.current?.click();
    try {
      onPick((await new EyeDropper().open()).sRGBHex);
    } catch {
      // Cancelled with Escape.
    }
  }

  return (
    <>
      <button type="button" onClick={pick} className="border border-border bg-surface px-1.5 text-[0.6rem] text-ink">
        Pick
      </button>
      <input
        ref={fallback}
        type="color"
        tabIndex={-1}
        aria-hidden="true"
        value={oklchToHex(value)}
        onChange={(event) => onPick(event.currentTarget.value)}
        className="sr-only"
      />
    </>
  );
}

export function ColourSliders({ value, onChange }: { value: Oklch; onChange: (next: Oklch) => void }) {
  const [picked, setPicked] = useState<string | null>(null);

  function change(channel: keyof Oklch, next: number) {
    const { alpha, ...opaque } = { ...value, [channel]: next };
    onChange(alpha === undefined || alpha >= 1 ? opaque : { ...opaque, alpha });
  }

  function applyPick(hex: string) {
    const oklch = hexToOklch(hex);
    const next = value.alpha === undefined ? oklch : { ...oklch, alpha: value.alpha };
    setPicked(`${hex} ${formatOklch(oklch)}`);
    onChange(next);
  }

  return (
    <div className="flex w-48 flex-col gap-1">
      {sliders.map(({ channel, label, max, step }) => (
        <label key={channel} className="flex items-center gap-1 text-[0.6rem] text-ink-faint">
          <span className="w-2 font-mono">{label}</span>
          <input
            type="range"
            min={0}
            max={max}
            step={step}
            value={value[channel] ?? 1}
            onChange={(event) => change(channel, Number(event.currentTarget.value))}
            className="min-w-0 flex-1 accent-accent"
          />
        </label>
      ))}
      <span className="flex items-center gap-1">
        <code className="flex-1 text-[0.6rem] text-ink-faint">{formatOklch(value)}</code>
        <PickButton value={value} onPick={applyPick} />
      </span>
      {picked && <code className="select-all text-[0.6rem] text-ink-muted">{picked}</code>}
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
