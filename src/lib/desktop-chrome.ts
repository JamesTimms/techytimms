import { enableDesktopShortcuts } from '~/lib/desktop-shortcuts';
import { normalisePath } from '~/lib/navigation';

/*
 * Client wiring for the desktop chrome under `<ClientRouter />`.
 *
 * The taskbar and the desktop shortcuts carry `transition:persist`, so after a
 * navigation they are the *previous* page's DOM: their listeners survive, and
 * so does anything the server rendered into them. Everything here exists to
 * reconcile that — either re-binding what was rebuilt, or correcting what was
 * kept.
 */

function windowFrame(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-window-frame]');
}

function taskButton(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>('[data-window-task]');
}

/*
 * Current-page markers are rendered by the server into chrome that is then
 * persisted, so without this they keep pointing at the page you just left —
 * which `aria-current` states as fact to a screen reader.
 */
export function syncCurrentPage(pathname: string, root: ParentNode = document): void {
  const currentPath = normalisePath(pathname);

  for (const link of root.querySelectorAll<HTMLAnchorElement>('.start-item, .desktop-shortcut')) {
    const opensNewTab = link.target === '_blank';
    const isCurrent = !opensNewTab && normalisePath(new URL(link.href).pathname) === currentPath;

    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');

    if (!link.classList.contains('desktop-shortcut')) continue;
    link.classList.toggle('is-selected', isCurrent);
    if (isCurrent) link.dataset.selected = 'true';
    else delete link.dataset.selected;
  }
}

/* Windows closes the Start menu when you pick an item; persistence would
 * otherwise leave it hanging open over the page it just opened. */
export function closeStartMenu(root: ParentNode = document): void {
  for (const menu of root.querySelectorAll<HTMLDetailsElement>('details.start')) {
    menu.open = false;
  }
}

/*
 * `hidden`, not offscreen: a minimised window must leave the accessibility tree
 * too, or a screen reader still reads a window the user has put away.
 */
function setMinimised(minimised: boolean, moveFocus: boolean): void {
  const frame = windowFrame();
  const task = taskButton();
  if (!frame || !task) return;

  frame.hidden = minimised;
  task.hidden = !minimised;

  if (!moveFocus) return;
  // Hiding the element holding focus drops it to <body>, losing a keyboard
  // user's place entirely.
  if (minimised) task.focus();
  else frame.querySelector<HTMLButtonElement>('[data-window-minimise]')?.focus();
}

export function enableWindowControls(root: ParentNode = document): void {
  // Following a link is a request to read something, so arriving minimised
  // would hide the very thing that was asked for. The frame is rebuilt each
  // navigation and so returns already open; the persisted task button is not.
  setMinimised(false, false);

  const minimise = root.querySelector<HTMLButtonElement>('[data-window-minimise]');
  if (minimise && !minimise.dataset.wired) {
    minimise.dataset.wired = 'true';
    minimise.addEventListener('click', () => setMinimised(true, true));
  }

  const task = taskButton();
  if (task && !task.dataset.wired) {
    task.dataset.wired = 'true';
    // Resolved at click time, not bind time: this button outlives the frame.
    task.addEventListener('click', () => setMinimised(false, true));
  }
}

let themeToggleWired = false;

/* Delegated so it survives both the toggle being persisted and this module
 * being re-entered; the toggle itself is replaced on some navigations. */
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

export function enableDesktopChrome(): void {
  enableThemeToggle();

  // Fires on the initial load as well as every client-side navigation, so this
  // is the only hook needed.
  document.addEventListener('astro:page-load', () => {
    enableDesktopShortcuts();
    enableWindowControls();
    syncCurrentPage(window.location.pathname);
    closeStartMenu();
  });
}
