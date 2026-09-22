import { navigate } from 'astro:transitions/client';
import { normalisePath, opensOnPress, sectionLabel } from '~/lib/navigation';
import { resetWindow } from '~/lib/window';

export function enableDesktopShortcuts(root: ParentNode = document): void {
  for (const shortcut of root.querySelectorAll<HTMLAnchorElement>('.desktop-shortcut')) {
    // Persisted across navigation — arrives already wired, so binding again would fire a press twice.
    if (shortcut.dataset.pressWired) continue;
    shortcut.dataset.pressWired = 'true';

    let openedOnPress = false;

    shortcut.addEventListener('pointerdown', (event) => {
      shortcut.classList.add('is-pressed');
      openedOnPress = opensOnPress(event);
      if (!openedOnPress) return;
      if (shortcut.target === '_blank') window.open(shortcut.href, '_blank', 'noopener');
      // navigate(), not location.assign() — the router only intercepts anchor clicks, so assign() would drop the view transition and persisted chrome.
      else void navigate(shortcut.href);
    });

    // Suppress the click that follows the press, or a new-tab link opens twice.
    shortcut.addEventListener('click', (event) => {
      if (openedOnPress) event.preventDefault();
      openedOnPress = false;
    });

    for (const releaseType of ['pointerup', 'pointercancel', 'pointerleave']) {
      shortcut.addEventListener(releaseType, () => shortcut.classList.remove('is-pressed'));
    }
  }
}

// The dock and shortcuts persist across navigation, so this reconciles server-rendered state (current page, minimised window) with the previous page's surviving DOM.

function windowFrame(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-window-frame]');
}

function taskButton(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>('[data-window-task]');
}

// Persisted chrome would otherwise keep stating the previous page's aria-current/selected as fact.
export function syncCurrentPage(pathname: string, root: ParentNode = document): void {
  const currentPath = normalisePath(pathname);

  for (const link of root.querySelectorAll<HTMLAnchorElement>('.dock-item, .desktop-shortcut')) {
    const opensNewTab = link.target === '_blank';
    const isCurrent = !opensNewTab && normalisePath(new URL(link.href).pathname) === currentPath;

    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');

    if (!link.classList.contains('desktop-shortcut')) continue;
    link.classList.toggle('is-selected', isCurrent);
    if (isCurrent) link.dataset.selected = 'true';
    else delete link.dataset.selected;
  }

  for (const label of root.querySelectorAll<HTMLElement>('[data-dock-section]')) {
    label.textContent = sectionLabel(currentPath);
  }
}

// hidden, not offscreen — a minimised window must leave the accessibility tree too.
function setMinimised(minimised: boolean, moveFocus: boolean): void {
  const frame = windowFrame();
  const task = taskButton();
  if (!frame || !task) return;

  frame.hidden = minimised;
  task.hidden = !minimised;

  if (!moveFocus) return;
  // Hiding the focused element would drop focus to <body>.
  if (minimised) task.focus();
  else frame.querySelector<HTMLButtonElement>('[data-window-minimise]')?.focus();
}

// Closing hides the whole frame (no task button to reopen it) and clears the stored rect, since the frame isn't persisted and rebuilds open by default anyway.
function setClosed(closed: boolean): void {
  const frame = windowFrame();
  if (!frame) return;
  if (closed) {
    resetWindow(frame);
    document.querySelector<HTMLElement>('#dock-nav')?.focus();
  }
  frame.hidden = closed;
}

export function enableWindowControls(root: ParentNode = document): void {
  // Force un-minimised on arrival — the frame rebuilds open each navigation, but the persisted task button doesn't know that.
  setMinimised(false, false);

  const minimise = root.querySelector<HTMLButtonElement>('[data-window-minimise]');
  if (minimise && !minimise.dataset.wired) {
    minimise.dataset.wired = 'true';
    minimise.addEventListener('click', () => setMinimised(true, true));
  }

  const close = root.querySelector<HTMLButtonElement>('[data-window-close]');
  if (close && !close.dataset.wired) {
    close.dataset.wired = 'true';
    close.addEventListener('click', () => setClosed(true));
  }

  const task = taskButton();
  if (task && !task.dataset.wired) {
    task.dataset.wired = 'true';
    // Resolved at click time, not bind time: this button outlives the frame.
    task.addEventListener('click', () => setMinimised(false, true));
  }
}

let themeToggleWired = false;

// Delegated: survives both a persisted toggle and this module re-running.
export function enableThemeToggle(): void {
  if (themeToggleWired) return;
  themeToggleWired = true;

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element) || !target.closest('#theme-toggle')) return;

    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

export function enableDesktop(): void {
  enableThemeToggle();

  // Covers first load and every navigation, so this is the only hook needed.
  document.addEventListener('astro:page-load', () => {
    enableDesktopShortcuts();
    enableWindowControls();
    syncCurrentPage(window.location.pathname);
  });
}
