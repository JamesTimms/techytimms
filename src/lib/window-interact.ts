/*
 * Drag and resize for the window that owns the page (`[data-window-frame]`).
 *
 * Pure geometry lives here and is unit tested; the DOM wiring below it is not
 * — it is thin glue over Pointer Events, same as `desktop-chrome.ts`.
 *
 * Desktop-only by decision: below `lg` the frame fills the viewport and there
 * is nothing to drag it around on, so `enableWindowInteract` no-ops there
 * (checked live, via `matchMedia`, not just at load — a viewport that crosses
 * the breakpoint after load is put back into flow either way).
 */

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

/* The two fixed bars' rendered heights, above and below. The frame must not
 * be dragged so far that its own bar becomes unreachable behind them — they
 * would still WIN the stacking order (`z-20` beats the frame's `z-10`), so
 * "unreachable" here means unusable, not visually covered. */
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

/* `minWidth` doubles as the readable-content floor — see the matching
 * `lg:data-[positioned=true]:min-w-80` on the frame in WindowFrame.astro,
 * which holds the line even if this module fails to load. */
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

/* The rect a maximised frame fills: the full viewport width, less whatever
 * height the two bars claim. Unlike `clampSize`, this ignores `constraints` —
 * maximise means "all the available area", not "the largest allowed size",
 * so it is not capped at `maxWidth`/`maxHeight` on a large screen. */
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

/* Which edges a handle owns. `-1` (grows left/up) keeps the OPPOSITE edge
 * anchored — see `resizeRect` — the way every OS resize handle behaves. */
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

  // Growing/shrinking from the left or top edge moves that edge; the other
  // two stay put — a `w` drag pushes `left`, not the whole frame.
  const left = axis.x === -1 ? base.left + (base.width - width) : base.left;
  const top = axis.y === -1 ? base.top + (base.height - height) : base.top;

  const position = clampPosition(left, top, width, height, viewport, barClearance, constraints);
  return { left: position.left, top: position.top, width, height };
}

/* ------------------------------------------------------------------------
 * DOM wiring. Not unit tested — thin glue, same convention as
 * `desktop-chrome.ts`.
 * ------------------------------------------------------------------------ */

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

/* Read live, not cached: the bars' own height can change (e.g. a status bar
 * label wrapping), and this runs once per drag/keypress, not per frame. */
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

function applyRect(frame: HTMLElement, rect: Rect): void {
  frame.dataset.positioned = 'true';
  frame.style.left = `${rect.left}px`;
  frame.style.top = `${rect.top}px`;
  frame.style.width = `${rect.width}px`;
  frame.style.height = `${rect.height}px`;
}

function maximiseButton(frame: HTMLElement): HTMLButtonElement | null {
  return frame.querySelector<HTMLButtonElement>('[data-window-maximise]');
}

/* A manual drag/resize (pointer or keyboard) always leaves the frame at an
 * explicit, non-maximised rect, so any earlier maximise is stale the moment
 * one starts — otherwise restoring later would snap back to a size the user
 * has since abandoned, and the button's label would keep claiming "Restore"
 * for a window that no longer is one. */
function exitMaximised(frame: HTMLElement): void {
  if (frame.dataset.maximised !== 'true') return;
  delete frame.dataset.maximised;
  delete frame.dataset.preMaximiseRect;
  maximiseButton(frame)?.setAttribute('aria-label', 'Maximise window');
}

function resetRect(frame: HTMLElement): void {
  delete frame.dataset.positioned;
  exitMaximised(frame);
  frame.style.removeProperty('left');
  frame.style.removeProperty('top');
  frame.style.removeProperty('width');
  frame.style.removeProperty('height');
}

/* Double-clicking the title bar. Unlike the Windows convention (toggle
 * maximise), this always returns the frame to its original flow state —
 * `resetRect` already clears the inline rect, `data-positioned` and any
 * maximised state; the only thing it doesn't own is the persisted rect,
 * which must go too or the old position reapplies on the next navigation. */
function resetWindow(frame: HTMLElement): void {
  resetRect(frame);
  clearStoredRect();
}

/*
 * Shared by drag and resize: locks the frame into explicit pixel geometry (so
 * the first move has a stable `base` to add deltas to), tracks one pointer via
 * capture, and turns the transition off for the duration regardless of
 * `prefers-reduced-motion` — the frame carries none, but a future one must not
 * lag a drag either way.
 */
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
  applyRect(frame, base);
  const startX = event.clientX;
  const startY = event.clientY;
  const pointerId = event.pointerId;
  target.setPointerCapture(pointerId);
  const previousTransition = frame.style.transition;
  frame.style.transition = 'none';

  function move(e: PointerEvent): void {
    if (e.pointerId !== pointerId) return;
    applyRect(frame, compute(e.clientX - startX, e.clientY - startY, base));
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

    // Each click of the double-click has already run its own harmless
    // no-movement drag (pointerdown/pointerup fire, and resolve, before
    // `dblclick` does) — this fires last and resets on top of that.
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
      applyRect(frame, base);
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
      applyRect(frame, next);
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
      applyRect(frame, base);
      const next = resizeRect(
        base,
        direction,
        delta[0] * step,
        delta[1] * step,
        viewportSize(),
        currentBarClearance(),
      );
      applyRect(frame, next);
      writeStoredRect(next);
    });
  }
}

/* Only this animates: drag/resize set `transition: none` for the duration of
 * a pointer/keyboard move because those track a live position, one frame at a
 * time, and a transition would make them lag. Maximise/restore jump straight
 * to a target rect, so it is the one geometry change with something to
 * animate between. `prefers-reduced-motion: reduce` needs no extra check here
 * — the sitewide rule in global.css already forces every transition's
 * duration to ~0 under that query, so this collapses to an instant snap for
 * free. The timeout (rather than a `transitionend` listener) always clears
 * the inline style, even if the source and target rects are identical and no
 * transition actually fires. */
const MAXIMISE_TRANSITION_MS = 200;
const MAXIMISE_TRANSITION = `left ${MAXIMISE_TRANSITION_MS}ms ease, top ${MAXIMISE_TRANSITION_MS}ms ease, width ${MAXIMISE_TRANSITION_MS}ms ease, height ${MAXIMISE_TRANSITION_MS}ms ease`;

function animateRect(frame: HTMLElement, rect: Rect): void {
  frame.style.transition = MAXIMISE_TRANSITION;
  applyRect(frame, rect);
  setTimeout(() => {
    frame.style.transition = '';
  }, MAXIMISE_TRANSITION_MS + 20);
}

/*
 * Maximise fills the available area (`maximisedRect`) and remembers exactly
 * what to put back: the frame's own explicit rect if drag/resize had already
 * pulled it out of flow, or nothing at all if it had not — restoring then
 * means `resetRect`, back to the centred flow layout, rather than a rect that
 * was never real. Neither direction touches `sessionStorage`: maximise is a
 * view of the current page, not a stored position, so a drag/resize made
 * before maximising is exactly what the next navigation reapplies (a
 * maximised frame always arrives un-maximised, the same as it arrives
 * un-minimised — see WindowFrame.astro).
 */
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

    if (frame.dataset.positioned === 'true') {
      frame.dataset.preMaximiseRect = JSON.stringify(currentRect(frame));
    }
    frame.dataset.maximised = 'true';
    animateRect(frame, maximisedRect(viewportSize(), currentBarClearance()));
    button.setAttribute('aria-label', 'Restore window');
  });
}

/*
 * Called once, at module init (see BaseLayout.astro) — same convention as
 * `enableDesktopChrome`. The frame is rebuilt every navigation, so re-wiring
 * happens inside the `astro:page-load` handler registered here, not at the
 * top level.
 */
export function enableWindowInteract(): void {
  const desktop = window.matchMedia(DESKTOP_QUERY);

  function sync(): void {
    const frame = frameElement();
    if (!frame) return;

    // Wired at every breakpoint, like minimise/close: below `lg` the CSS this
    // toggles (`lg:data-[positioned=true]:fixed`) does not apply, so it is an
    // inert no-op rather than something that needs excluding.
    wireMaximise(frame);

    if (!desktop.matches) {
      resetRect(frame);
      return;
    }

    const stored = readStoredRect();
    if (stored) {
      const clamped = clampRect(stored, viewportSize(), currentBarClearance());
      applyRect(frame, clamped);
      writeStoredRect(clamped);
    }

    wireDrag(frame);
    wireResize(frame);
  }

  desktop.addEventListener('change', sync);

  // A viewport resize that stays above the breakpoint can still leave a
  // dragged/resized frame off-screen or oversized; re-clamp in place. A
  // maximised frame instead just re-fills the (possibly changed) available
  // area — clamping it against `defaultConstraints` would cap it at
  // `maxWidth`/`maxHeight` on a large screen, and it has no stored rect to
  // update since it was never written to one.
  window.addEventListener('resize', () => {
    if (!desktop.matches) return;
    const frame = frameElement();
    if (!frame) return;
    if (frame.dataset.maximised === 'true') {
      applyRect(frame, maximisedRect(viewportSize(), currentBarClearance()));
      return;
    }
    if (!frame.dataset.positioned) return;
    const clamped = clampRect(currentRect(frame), viewportSize(), currentBarClearance());
    applyRect(frame, clamped);
    writeStoredRect(clamped);
  });

  document.addEventListener('astro:page-load', sync);
}
