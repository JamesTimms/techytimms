import { Fragment, useEffect, useState } from 'react';

import { apcaContrast } from '~/lib/apca';
import type { Oklch } from '~/lib/color-tokens';
import { contrastTargets, type BackgroundRow, type ForegroundPairing } from '~/data/color-system';
import { ColourSliders, formatOklch, RESET_EVENT, setColourOverride, type Theme } from '~/components/ui/ColourControl';

type ThemedValues = Record<string, Record<Theme, Oklch>>;

interface Editing {
  row: number;
  token: string;
  theme: Theme;
}

export interface TokenPairingsProps {
  values: ThemedValues;
  rows: BackgroundRow[];
  otherTokens: string[];
}

const themes: Theme[] = ['light', 'dark'];

const targetLabels: Record<number, string> = {
  90: 'primary text',
  75: 'body text',
  60: 'secondary text',
  30: 'marks and boundaries',
  15: 'decorative lines',
};

function resultInfo(contrast: number, target: number, { kind }: ForegroundPairing): string {
  const magnitude = Math.abs(contrast);
  const figures = `APCA ${magnitude.toFixed(1)} against a target of ${target}`;
  if (magnitude >= target) return `Passes: ${figures} for ${targetLabels[target] ?? 'this use'}.`;
  const noun = kind === 'boundary' ? 'line' : kind === 'mark' ? 'mark' : 'text';
  const advice = contrast >= 0 ? `darken the ${noun} or lighten the background` : `lighten the ${noun} or darken the background`;
  return `Fails: ${figures} — ${(target - magnitude).toFixed(1)} short; ${advice}`;
}

function Example({ pairing, foreground, background }: { pairing: ForegroundPairing; foreground: string; background: string }) {
  return (
    <span
      className="flex h-10 w-20 shrink-0 items-center justify-center border border-border p-1 text-[0.65rem]"
      style={{ backgroundColor: background }}
    >
      {pairing.kind === 'boundary' ? (
        <span className="block h-6 w-10 border-4" style={{ borderColor: foreground }} />
      ) : (
        <span
          className={`truncate px-1 ${pairing.kind === 'link' ? 'underline decoration-2 underline-offset-2' : ''}`}
          style={{ color: foreground }}
        >
          {pairing.sample ?? '●'}
        </span>
      )}
    </span>
  );
}

function Result({ contrast, pairing }: { contrast: number; pairing: ForegroundPairing }) {
  const target = contrastTargets[pairing.token]!;
  const passes = Math.abs(contrast) >= target;
  return (
    <span className="relative whitespace-nowrap font-mono text-ink-muted" tabIndex={0} data-swatch-info={resultInfo(contrast, target, pairing)}>
      <span className={passes ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>{passes ? '✓' : '✗'}</span>{' '}
      {Math.abs(contrast).toFixed(1)} / {target}
    </span>
  );
}

export function TokenPairings({ values: savedValues, rows, otherTokens }: TokenPairingsProps) {
  const [values, setValues] = useState(savedValues);
  const [measured, setMeasured] = useState(savedValues);
  const [editing, setEditing] = useState<Editing | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setMeasured(values), 150);
    return () => clearTimeout(timeout);
  }, [values]);

  useEffect(() => {
    const reset = () => {
      setValues(savedValues);
      setMeasured(savedValues);
    };
    window.addEventListener(RESET_EVENT, reset);
    return () => window.removeEventListener(RESET_EVENT, reset);
  }, [savedValues]);

  const css = (token: string, theme: Theme) => formatOklch(values[token]![theme]);

  function edit(token: string, theme: Theme, next: Oklch) {
    setValues((current) => ({ ...current, [token]: { ...current[token]!, [theme]: next } }));
    setColourOverride(token, theme, next);
  }

  function chip(row: number, token: string) {
    return (
      <span className="flex items-center gap-1 font-mono text-ink-muted">
        {themes.map((theme) => {
          const open = editing?.row === row && editing.token === token && editing.theme === theme;
          return (
            <button
              key={theme}
              type="button"
              aria-pressed={open}
              aria-label={`Edit ${token} (${theme})`}
              onClick={() => setEditing(open ? null : { row, token, theme })}
              className={`relative block h-4 w-4 cursor-pointer border ${open ? 'border-accent ring-2 ring-accent' : 'border-border'}`}
              style={{ backgroundColor: css(token, theme) }}
              data-swatch-info={`${token} (${theme})\n${css(token, theme)}`}
            />
          );
        })}
        <span>{token}</span>
      </span>
    );
  }

  function editor(row: number) {
    if (editing?.row !== row) return null;
    const { token, theme } = editing;
    return (
      <tr>
        <td colSpan={5} className="pb-3">
          <div className="flex items-start gap-3 border border-border bg-sunk p-2">
            <span className="font-mono text-ink-muted">
              {token} ({theme})
            </span>
            <ColourSliders value={values[token]![theme]} onChange={(next) => edit(token, theme, next)} />
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[52rem] border-collapse text-xs">
        <thead>
          <tr className="text-left text-ink-faint">
            <th className="py-1 pr-3 font-medium">Background</th>
            <th className="py-1 pr-3 font-medium">Light</th>
            <th className="py-1 pr-3 font-medium">Dark</th>
            <th className="py-1 pr-3 font-medium">Foreground</th>
            <th className="py-1 font-medium">Use</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ background, foregrounds }, row) => (
            <Fragment key={row}>
              {foregrounds.map((pairing, index) => (
                <tr
                  key={pairing.token}
                  data-pairing={`${pairing.token} on ${background}`}
                  className={`align-middle ${index === 0 ? 'border-t border-rule' : ''}`}
                >
                  {index === 0 && (
                    <td rowSpan={foregrounds.length} className="py-1.5 pr-3 align-top">
                      {chip(row, background)}
                    </td>
                  )}
                  {themes.map((theme) => (
                    <td key={theme} className="py-1.5 pr-3">
                      <span className="flex items-center gap-2">
                        <Example pairing={pairing} foreground={css(pairing.token, theme)} background={css(background, theme)} />
                        <Result
                          contrast={apcaContrast(measured[pairing.token]![theme], measured[background]![theme])}
                          pairing={pairing}
                        />
                      </span>
                    </td>
                  ))}
                  <td className="py-1.5 pr-3">{chip(row, pairing.token)}</td>
                  <td className="py-1.5 text-ink-muted">{pairing.use}</td>
                </tr>
              ))}
              {editor(row)}
            </Fragment>
          ))}
          <tr className="border-t border-rule">
            <td className="py-1.5 pr-3 text-ink-faint">Other tokens</td>
            <td colSpan={4} className="py-1.5">
              <span className="flex flex-wrap gap-4">
                {otherTokens.map((token) => (
                  <Fragment key={token}>{chip(rows.length, token)}</Fragment>
                ))}
              </span>
            </td>
          </tr>
          {editor(rows.length)}
        </tbody>
      </table>
    </div>
  );
}
