
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

// minWidth doubles as the readable-content floor; the frame's CSS min-width holds it even if this module fails to load.
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

export function maximisedRect(viewport: Viewport, barClearance: BarClearance): Rect {
  // Unlike clampSize, ignores constraints — maximise means all available area, not the largest allowed size.
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
const MAXIMISED_KEY = 'window-maximised'; // Holds the pre-maximise rect; empty if the window was in flow.
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

function currentBarClearance(): BarClearance {
  // Read live, not cached — a bar's height can change (e.g. a label wrapping), and this runs once per drag/keypress, not per frame.
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
    const parsed = JSON.parse(raw) as Partial<Rect> | null;
    if (
      typeof parsed?.left === 'number' &&
      typeof parsed.top === 'number' &&
      typeof parsed.width === 'number' &&
      typeof parsed.height === 'number'
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

function readStoredMaximise(): string | null {
  try {
    return sessionStorage.getItem(MAXIMISED_KEY);
  } catch {
    return null;
  }
}

function writeStoredMaximise(preMaximiseRect: string | undefined): void {
  try {
    sessionStorage.setItem(MAXIMISED_KEY, preMaximiseRect ?? '');
  } catch {
    // Private browsing: the window arrives un-maximised next navigation.
  }
}

function clearStoredMaximise(): void {
  try {
    sessionStorage.removeItem(MAXIMISED_KEY);
  } catch {
    // Private browsing: nothing was persisted to begin with.
  }
}

function currentRect(frame: HTMLElement): Rect {
  const box = frame.getBoundingClientRect();
  return { left: box.left, top: box.top, width: box.width, height: box.height };
}

function applyRect(rect: Rect): void {
  // On <html>, not the frame, so BaseLayout's pre-paint script can apply it before the frame exists.
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

function markMaximised(frame: HTMLElement, preMaximiseRect: string | undefined): void {
  frame.dataset.maximised = 'true';
  if (preMaximiseRect) frame.dataset.preMaximiseRect = preMaximiseRect;
  maximiseButton(frame)?.setAttribute('aria-label', 'Restore window');
}

function unmarkMaximised(frame: HTMLElement): void {
  delete frame.dataset.maximised;
  delete frame.dataset.preMaximiseRect;
  maximiseButton(frame)?.setAttribute('aria-label', 'Maximise window');
}

function exitMaximised(frame: HTMLElement): void {
  // Any drag/resize invalidates an existing maximise — otherwise restore would snap back to a size the user has since abandoned.
  if (frame.dataset.maximised !== 'true') return;
  unmarkMaximised(frame);
  clearStoredMaximise();
}

function resetRect(frame: HTMLElement): void {
  const root = document.documentElement;
  delete root.dataset.positioned;
  root.style.removeProperty('--window-left');
  root.style.removeProperty('--window-top');
  root.style.removeProperty('--window-width');
  root.style.removeProperty('--window-height');
  unmarkMaximised(frame);
}

export function resetWindow(frame: HTMLElement): void {
  resetRect(frame);
  clearStoredRect();
  clearStoredMaximise();
}

const DRAG_START_THRESHOLD = 3;

function beginPointerInteraction(
  frame: HTMLElement,
  target: HTMLElement,
  event: PointerEvent,
  compute: (dx: number, dy: number, base: Rect) => Rect,
): void {
  // Shared by drag and resize: locks the frame into a stable base rect, captures one pointer, and disables the transition for the duration.
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  event.preventDefault();

  const base = currentRect(frame);
  const startX = event.clientX;
  const startY = event.clientY;
  const pointerId = event.pointerId;
  target.setPointerCapture(pointerId);
  const previousTransition = frame.style.transition;
  let hasMoved = false;

  function move(e: PointerEvent): void {
    if (e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!hasMoved) {
      if (Math.hypot(dx, dy) < DRAG_START_THRESHOLD) return;
      hasMoved = true;
      exitMaximised(frame);
      frame.style.transition = 'none';
    }
    applyRect(compute(dx, dy, base));
  }

  function stop(e: PointerEvent): void {
    if (e.pointerId !== pointerId) return;
    target.releasePointerCapture(pointerId);
    target.removeEventListener('pointermove', move);
    target.removeEventListener('pointerup', stop);
    target.removeEventListener('pointercancel', stop);
    if (!hasMoved) return;
    frame.style.transition = previousTransition;
    writeStoredRect(currentRect(frame));
  }

  target.addEventListener('pointermove', move);
  target.addEventListener('pointerup', stop);
  target.addEventListener('pointercancel', stop);
}

const TITLE_CONTROL_SELECTOR = '[data-window-minimise], [data-window-maximise], [data-window-close]';

function isTitleControl(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(TITLE_CONTROL_SELECTOR) !== null;
}

function wireDrag(frame: HTMLElement): void {
  const surface = document.querySelector<HTMLElement>('[data-window-drag]');
  if (surface && !surface.dataset.wired) {
    surface.dataset.wired = 'true';
    surface.addEventListener('pointerdown', (event) => {
      if (isTitleControl(event.target)) return;
      beginPointerInteraction(frame, surface, event, (dx, dy, base) =>
        clampRect(
          { left: base.left + dx, top: base.top + dy, width: base.width, height: base.height },
          viewportSize(),
          currentBarClearance(),
        ),
      );
    });

    surface.addEventListener('dblclick', (event) => {
      if (isTitleControl(event.target)) return;
      event.preventDefault();
      maximiseButton(frame)?.click();
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

function wireMaximise(frame: HTMLElement): void {
  // Restore returns to the pre-maximise rect, or to flow if the window was never positioned.
  const button = maximiseButton(frame);
  if (!button || button.dataset.wired) return;
  button.dataset.wired = 'true';

  button.addEventListener('click', () => {
    if (frame.dataset.maximised === 'true') {
      const preMaximiseRect = frame.dataset.preMaximiseRect;
      unmarkMaximised(frame);
      clearStoredMaximise();
      if (!preMaximiseRect) return resetWindow(frame);
      const restored = JSON.parse(preMaximiseRect) as Rect;
      animateRect(frame, restored);
      writeStoredRect(restored);
      return;
    }

    const preMaximiseRect =
      document.documentElement.dataset.positioned === 'true'
        ? JSON.stringify(currentRect(frame))
        : undefined;
    markMaximised(frame, preMaximiseRect);
    writeStoredMaximise(preMaximiseRect);
    const maximised = maximisedRect(viewportSize(), currentBarClearance());
    animateRect(frame, maximised);
    writeStoredRect(maximised); // Lets the pre-paint script show it maximised on the next page.
  });
}

export function enableWindowInteract(): void {
  // Called once at module init (see BaseLayout.astro); re-wiring happens inside the astro:page-load handler since the frame rebuilds every navigation.
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

    const storedMaximise = readStoredMaximise();
    if (storedMaximise !== null) {
      markMaximised(frame, storedMaximise || undefined);
      const maximised = maximisedRect(viewportSize(), currentBarClearance());
      applyRect(maximised);
      writeStoredRect(maximised);
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
      const maximised = maximisedRect(viewportSize(), currentBarClearance());
      applyRect(maximised);
      writeStoredRect(maximised);
      return;
    }
    if (document.documentElement.dataset.positioned !== 'true') return;
    const clamped = clampRect(currentRect(frame), viewportSize(), currentBarClearance());
    applyRect(clamped);
    writeStoredRect(clamped);
  });

  document.addEventListener('astro:page-load', sync);
}
