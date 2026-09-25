import { cva, type VariantProps } from 'class-variance-authority';

// Window chrome: palette variants (CVA) below, the page-owning frame's drag/resize/maximise geometry and DOM wiring further down.

// One palette axis, two stops — each a 10-step (50–900) OKLCH ramp off that palette's main colour. Chrome is modern and flat, but keeps Win9x anatomy: icon+title left, minimise/restore/close right.
export const windowPalettes = ['fallen-leaf', 'pumpkin'] as const;

export type WindowPalette = (typeof windowPalettes)[number];

// Face is a light tint (step 50), not the main colour, so ink-faint clears contrast; side border/radius drop below lg since there's no wallpaper there to sit against.
// `pumpkin`, the live palette, reads its face and edge off semantic tokens
// (`surface`, `window-edge`) rather than ramp steps — see the PALETTE block
// in global.css for why. `fallen-leaf` is unmeasured and unused; it keeps its
// own ramp steps rather than being folded into tokens tuned for the other.
export const windowFrame = cva('border border-x-0 lg:border-x lg:rounded-window', {
  variants: {
    palette: {
      'fallen-leaf': 'bg-leaf-50 border-leaf-500 dark:bg-leaf-700',
      pumpkin: 'bg-surface border-window-edge',
    },
  },
  defaultVariants: { palette: 'fallen-leaf' },
});

// No border-b: the frame's own outer border is the only boundary a window
// draws now — an internal divide between the bar and the face read as a
// second, redundant edge. Corners use radius-window-inner to nest inside the
// frame's own.
export const titleBar = cva(
  'flex items-center justify-between gap-3 px-3 py-1.5 lg:rounded-t-window-inner',
  {
    variants: {
      palette: {
        'fallen-leaf': 'bg-leaf-900 text-leaf-50',
        pumpkin: 'bg-title-bar text-title-bar-ink',
      },
    },
    defaultVariants: { palette: 'fallen-leaf' },
  },
);

// 24px touch target (not Win9x's 16x14) around a glyph at step 100, one below the title text; hover brings the fill up and the glyph to step 50.
export const titleControl = cva(
  'flex size-6 shrink-0 items-center justify-center rounded-control p-0',
  {
    variants: {
      palette: {
        'fallen-leaf': 'text-leaf-100',
        pumpkin: 'text-title-bar-ink',
      },
      pressable: { true: 'cursor-pointer', false: '' },
    },
    compoundVariants: [
      {
        palette: 'fallen-leaf',
        pressable: true,
        class: 'hover:bg-leaf-500 hover:text-leaf-50 active:bg-leaf-200 active:text-leaf-900',
      },
      {
        // One fill for both hover and active — accent/title-bar sit close
        // enough in lightness that a three-way split (resting/hover/pressed)
        // couldn't clear Lc 75 in both themes at once; accent-sunk + ink can.
        palette: 'pumpkin',
        pressable: true,
        class: 'hover:bg-accent-sunk hover:text-ink active:bg-accent-sunk active:text-ink',
      },
    ],
    defaultVariants: { palette: 'fallen-leaf', pressable: false },
  },
);

// 1.5px boxes, not font glyphs, so all three controls align identically.
export const glyphMinimise = 'block h-[1.5px] w-[10px] bg-current';
// The heavier top edge reads as a title bar — the one period detail worth keeping.
export const glyphRestore = 'block h-[9px] w-[9px] border border-current border-t-2';

export const paletteDescriptions: Record<WindowPalette, string> = {
  'fallen-leaf':
    'Straw at 80% as the main colour. The calmest of the two: the face is barely tinted and the edge is a warm brown rather than a line of colour.',
  pumpkin:
    'The live palette. Rust red off the accent hue-drift curve, not the pumpkin ramp — the face is a pumpkin-tinted `surface`, the edge is `window-edge`.',
};

export type PaletteVariantProps = VariantProps<typeof windowFrame>;

// Geometry below is unit tested; the DOM wiring is thin glue, untested — desktop-only, gated live via matchMedia so crossing the breakpoint mid-session still resets flow.

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Viewport {
  width: number;
  height: number;
}

// The two fixed bars' heights — the frame must stay clear of them since they win the stacking order (z-20 over z-10) regardless.
export interface BarClearance {
  top: number;
  bottom: number;
}

export interface Constraints {
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  /** Pixels of the frame that must always stay on screen, so it can be grabbed again. */
  visibleEdge: number;
}

// minWidth doubles as the readable-content floor; WindowFrame.astro's lg:positioned:min-w-80 holds it even if this module fails to load.
export const defaultConstraints: Constraints = {
  minWidth: 320,
  minHeight: 240,
  maxWidth: 1600,
  maxHeight: 1400,
  visibleEdge: 96,
};

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

export function clampSize(
  width: number,
  height: number,
  viewport: Viewport,
  barClearance: BarClearance,
  constraints: Constraints = defaultConstraints,
): { width: number; height: number } {
  const maxWidth = Math.min(constraints.maxWidth, viewport.width);
  const maxHeight = Math.min(
    constraints.maxHeight,
    viewport.height - barClearance.top - barClearance.bottom,
  );

  return {
    width: clamp(width, Math.min(constraints.minWidth, maxWidth), maxWidth),
    height: clamp(height, Math.min(constraints.minHeight, maxHeight), maxHeight),
  };
}

export function clampPosition(
  left: number,
  top: number,
  width: number,
  height: number,
  viewport: Viewport,
  barClearance: BarClearance,
  constraints: Constraints = defaultConstraints,
): { left: number; top: number } {
  // Never demand more visible edge than the frame actually has.
  const edge = Math.min(constraints.visibleEdge, width, height);

  const minLeft = edge - width;
  const maxLeft = viewport.width - edge;
  const minTop = barClearance.top;
  const maxTop = Math.max(minTop, viewport.height - barClearance.bottom - edge);

  return {
    left: clamp(left, minLeft, maxLeft),
    top: clamp(top, minTop, maxTop),
  };
}

export function clampRect(
  rect: Rect,
  viewport: Viewport,
  barClearance: BarClearance,
  constraints: Constraints = defaultConstraints,
): Rect {
  const { width, height } = clampSize(rect.width, rect.height, viewport, barClearance, constraints);
  const { left, top } = clampPosition(
    rect.left,
    rect.top,
    width,
    height,
    viewport,
    barClearance,
    constraints,
  );
  return { left, top, width, height };
}

// Unlike clampSize, ignores constraints — maximise means all available area, not the largest allowed size.
export function maximisedRect(viewport: Viewport, barClearance: BarClearance): Rect {
  return {
    left: 0,
    top: barClearance.top,
    width: viewport.width,
    height: Math.max(0, viewport.height - barClearance.top - barClearance.bottom),
  };
}

export type HandleDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export const handleDirections: readonly HandleDirection[] = [
  'n',
  's',
  'e',
  'w',
  'ne',
  'nw',
  'se',
  'sw',
];

// -1 grows left/up while anchoring the opposite edge, as resizeRect uses below — standard OS resize-handle behaviour.
const HANDLE_AXES: Record<HandleDirection, { x: -1 | 0 | 1; y: -1 | 0 | 1 }> = {
  n: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  e: { x: 1, y: 0 },
  w: { x: -1, y: 0 },
  ne: { x: 1, y: -1 },
  nw: { x: -1, y: -1 },
  se: { x: 1, y: 1 },
  sw: { x: -1, y: 1 },
};

export function resizeRect(
  base: Rect,
  handle: HandleDirection,
  dx: number,
  dy: number,
  viewport: Viewport,
  barClearance: BarClearance,
  constraints: Constraints = defaultConstraints,
): Rect {
  const axis = HANDLE_AXES[handle];
  const rawWidth = base.width + axis.x * dx;
  const rawHeight = base.height + axis.y * dy;
  const { width, height } = clampSize(rawWidth, rawHeight, viewport, barClearance, constraints);

  // A w/n drag moves that edge only — left/top shift, the other edge doesn't.
  const left = axis.x === -1 ? base.left + (base.width - width) : base.left;
  const top = axis.y === -1 ? base.top + (base.height - height) : base.top;

  const position = clampPosition(left, top, width, height, viewport, barClearance, constraints);
  return { left: position.left, top: position.top, width, height };
}

// DOM wiring below — not unit tested, same convention as desktop.ts.

// Duplicated as literals in BaseLayout.astro's pre-paint script (which can't import this) — keep in sync by hand.
const DESKTOP_QUERY = '(min-width: 64rem)';
const STORAGE_KEY = 'window-rect';
const MOVE_STEP = 16;
const MOVE_STEP_LARGE = 64;
const RESIZE_STEP = 16;
const RESIZE_STEP_LARGE = 64;

const ARROW_DELTAS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

function frameElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-window-frame]');
}

function viewportSize(): Viewport {
  return { width: window.innerWidth, height: window.innerHeight };
}

// Read live, not cached — a bar's height can change (e.g. a label wrapping), and this runs once per drag/keypress, not per frame.
function currentBarClearance(): BarClearance {
  const top = document.querySelector<HTMLElement>('.dock[data-position="top"]');
  const bottom = document.querySelector<HTMLElement>('.dock[data-position="bottom"]');
  return {
    top: top ? top.getBoundingClientRect().height : 0,
    bottom: bottom ? bottom.getBoundingClientRect().height : 0,
  };
}

function readStoredRect(): Rect | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as Rect).left === 'number' &&
      typeof (parsed as Rect).top === 'number' &&
      typeof (parsed as Rect).width === 'number' &&
      typeof (parsed as Rect).height === 'number'
    ) {
      return parsed as Rect;
    }
    return null;
  } catch {
    return null;
  }
}

function writeStoredRect(rect: Rect): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rect));
  } catch {
    // Private browsing, or a full quota: the window just resets next navigation.
  }
}

function clearStoredRect(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private browsing: nothing was persisted to begin with.
  }
}

function currentRect(frame: HTMLElement): Rect {
  const box = frame.getBoundingClientRect();
  return { left: box.left, top: box.top, width: box.width, height: box.height };
}

// Geometry lives on <html> (data-positioned + --window-* vars, consumed by the positioned: variant in global.css) — the same mechanism BaseLayout's pre-paint script uses before the frame exists.
function applyRect(rect: Rect): void {
  const root = document.documentElement;
  root.dataset.positioned = 'true';
  root.style.setProperty('--window-left', `${rect.left}px`);
  root.style.setProperty('--window-top', `${rect.top}px`);
  root.style.setProperty('--window-width', `${rect.width}px`);
  root.style.setProperty('--window-height', `${rect.height}px`);
}

function maximiseButton(frame: HTMLElement): HTMLButtonElement | null {
  return frame.querySelector<HTMLButtonElement>('[data-window-maximise]');
}

// Any drag/resize invalidates an existing maximise — otherwise restore would snap back to a size the user has since abandoned.
function exitMaximised(frame: HTMLElement): void {
  if (frame.dataset.maximised !== 'true') return;
  delete frame.dataset.maximised;
  delete frame.dataset.preMaximiseRect;
  maximiseButton(frame)?.setAttribute('aria-label', 'Maximise window');
}

function resetRect(frame: HTMLElement): void {
  const root = document.documentElement;
  delete root.dataset.positioned;
  root.style.removeProperty('--window-left');
  root.style.removeProperty('--window-top');
  root.style.removeProperty('--window-width');
  root.style.removeProperty('--window-height');
  exitMaximised(frame);
}

// Double-click on the title bar: unlike Windows, always returns to flow rather than toggling maximise — also clears the persisted rect.
export function resetWindow(frame: HTMLElement): void {
  resetRect(frame);
  clearStoredRect();
}

// Shared by drag and resize: locks the frame into a stable base rect, captures one pointer, and disables the transition for the duration.
function beginPointerInteraction(
  frame: HTMLElement,
  target: HTMLElement,
  event: PointerEvent,
  compute: (dx: number, dy: number, base: Rect) => Rect,
): void {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  event.preventDefault();

  exitMaximised(frame);
  const base = currentRect(frame);
  applyRect(base);
  const startX = event.clientX;
  const startY = event.clientY;
  const pointerId = event.pointerId;
  target.setPointerCapture(pointerId);
  const previousTransition = frame.style.transition;
  frame.style.transition = 'none';

  function move(e: PointerEvent): void {
    if (e.pointerId !== pointerId) return;
    applyRect(compute(e.clientX - startX, e.clientY - startY, base));
  }

  function stop(e: PointerEvent): void {
    if (e.pointerId !== pointerId) return;
    target.releasePointerCapture(pointerId);
    target.removeEventListener('pointermove', move);
    target.removeEventListener('pointerup', stop);
    target.removeEventListener('pointercancel', stop);
    frame.style.transition = previousTransition;
    writeStoredRect(currentRect(frame));
  }

  target.addEventListener('pointermove', move);
  target.addEventListener('pointerup', stop);
  target.addEventListener('pointercancel', stop);
}

function wireDrag(frame: HTMLElement): void {
  const surface = document.querySelector<HTMLElement>('[data-window-drag]');
  if (surface && !surface.dataset.wired) {
    surface.dataset.wired = 'true';
    surface.addEventListener('pointerdown', (event) => {
      // The minimise button lives inside this surface; let its own click fire.
      if ((event.target as Element).closest('button')) return;
      beginPointerInteraction(frame, surface, event, (dx, dy, base) =>
        clampRect(
          { left: base.left + dx, top: base.top + dy, width: base.width, height: base.height },
          viewportSize(),
          currentBarClearance(),
        ),
      );
    });

    // Each click already ran its own harmless no-op drag; dblclick fires last and resets on top of that.
    surface.addEventListener('dblclick', (event) => {
      if ((event.target as Element).closest('button')) return;
      event.preventDefault();
      resetWindow(frame);
    });
  }

  const handle = document.querySelector<HTMLElement>('[data-window-drag-handle]');
  if (handle && !handle.dataset.wiredKey) {
    handle.dataset.wiredKey = 'true';
    handle.addEventListener('keydown', (event) => {
      const delta = ARROW_DELTAS[event.key];
      if (!delta) return;
      event.preventDefault();
      const step = event.shiftKey ? MOVE_STEP_LARGE : MOVE_STEP;
      exitMaximised(frame);
      const base = currentRect(frame);
      applyRect(base);
      const next = clampRect(
        {
          left: base.left + delta[0] * step,
          top: base.top + delta[1] * step,
          width: base.width,
          height: base.height,
        },
        viewportSize(),
        currentBarClearance(),
      );
      applyRect(next);
      writeStoredRect(next);
    });
  }
}

function wireResize(frame: HTMLElement): void {
  for (const handle of document.querySelectorAll<HTMLElement>('[data-resize-handle]')) {
    if (handle.dataset.wired) continue;
    handle.dataset.wired = 'true';
    const direction = handle.dataset.resizeHandle as HandleDirection;

    handle.addEventListener('pointerdown', (event) => {
      beginPointerInteraction(frame, handle, event, (dx, dy, base) =>
        resizeRect(base, direction, dx, dy, viewportSize(), currentBarClearance()),
      );
    });

    handle.addEventListener('keydown', (event) => {
      const delta = ARROW_DELTAS[event.key];
      if (!delta) return;
      event.preventDefault();
      const step = event.shiftKey ? RESIZE_STEP_LARGE : RESIZE_STEP;
      exitMaximised(frame);
      const base = currentRect(frame);
      applyRect(base);
      const next = resizeRect(
        base,
        direction,
        delta[0] * step,
        delta[1] * step,
        viewportSize(),
        currentBarClearance(),
      );
      applyRect(next);
      writeStoredRect(next);
    });
  }
}

// Only maximise/restore animate (drag/resize disable transition to avoid lag); reduced-motion is handled by global.css's blanket rule, and a timeout — not transitionend — always clears the inline style.
const MAXIMISE_TRANSITION_MS = 200;
const MAXIMISE_TRANSITION = `left ${MAXIMISE_TRANSITION_MS}ms ease, top ${MAXIMISE_TRANSITION_MS}ms ease, width ${MAXIMISE_TRANSITION_MS}ms ease, height ${MAXIMISE_TRANSITION_MS}ms ease`;

function animateRect(frame: HTMLElement, rect: Rect): void {
  frame.style.transition = MAXIMISE_TRANSITION;
  applyRect(rect);
  setTimeout(() => {
    frame.style.transition = '';
  }, MAXIMISE_TRANSITION_MS + 20);
}

// Remembers the pre-maximise rect only if one existed (otherwise restore is resetRect); never touches sessionStorage — a maximised frame always arrives un-maximised.
function wireMaximise(frame: HTMLElement): void {
  const button = maximiseButton(frame);
  if (!button || button.dataset.wired) return;
  button.dataset.wired = 'true';

  button.addEventListener('click', () => {
    if (frame.dataset.maximised === 'true') {
      const preMaximiseRect = frame.dataset.preMaximiseRect;
      delete frame.dataset.maximised;
      delete frame.dataset.preMaximiseRect;
      button.setAttribute('aria-label', 'Maximise window');
      if (preMaximiseRect) animateRect(frame, JSON.parse(preMaximiseRect) as Rect);
      else resetRect(frame);
      return;
    }

    if (document.documentElement.dataset.positioned === 'true') {
      frame.dataset.preMaximiseRect = JSON.stringify(currentRect(frame));
    }
    frame.dataset.maximised = 'true';
    animateRect(frame, maximisedRect(viewportSize(), currentBarClearance()));
    button.setAttribute('aria-label', 'Restore window');
  });
}

// Called once at module init (see BaseLayout.astro); re-wiring happens inside the astro:page-load handler since the frame rebuilds every navigation.
export function enableWindowInteract(): void {
  const desktop = window.matchMedia(DESKTOP_QUERY);

  function sync(): void {
    const frame = frameElement();
    if (!frame) return;

    // Wired at every breakpoint, like minimise/close — below lg the CSS this toggles doesn't apply, so it's an inert no-op.
    wireMaximise(frame);

    if (!desktop.matches) {
      resetRect(frame);
      return;
    }

    const stored = readStoredRect();
    if (stored) {
      const clamped = clampRect(stored, viewportSize(), currentBarClearance());
      applyRect(clamped);
      writeStoredRect(clamped);
    }

    wireDrag(frame);
    wireResize(frame);
  }

  desktop.addEventListener('change', sync);

  // Re-clamp a drag/resize rect in place on viewport resize; a maximised frame just re-fills instead (clamping would cap it at maxWidth/maxHeight on a large screen).
  window.addEventListener('resize', () => {
    if (!desktop.matches) return;
    const frame = frameElement();
    if (!frame) return;
    if (frame.dataset.maximised === 'true') {
      applyRect(maximisedRect(viewportSize(), currentBarClearance()));
      return;
    }
    if (document.documentElement.dataset.positioned !== 'true') return;
    const clamped = clampRect(currentRect(frame), viewportSize(), currentBarClearance());
    applyRect(clamped);
    writeStoredRect(clamped);
  });

  document.addEventListener('astro:page-load', sync);
}
