import { navigate } from 'astro:transitions/client';

import { opensOnPress } from '~/lib/navigation';

export function enableDesktopShortcuts(root: ParentNode = document): void {
  for (const shortcut of root.querySelectorAll<HTMLAnchorElement>('.desktop-shortcut')) {
    // Shortcuts are persisted across navigation, so they arrive already wired
    // and binding again would open two tabs on one press.
    if (shortcut.dataset.pressWired) continue;
    shortcut.dataset.pressWired = 'true';

    let openedOnPress = false;

    shortcut.addEventListener('pointerdown', (event) => {
      shortcut.classList.add('is-pressed');
      openedOnPress = opensOnPress(event);
      if (!openedOnPress) return;
      if (shortcut.target === '_blank') window.open(shortcut.href, '_blank', 'noopener');
      // navigate(), not location.assign(): the router only intercepts clicks on
      // anchors, so a programmatic assign is a full page load and loses the
      // view transition and the persisted chrome.
      else void navigate(shortcut.href);
    });

    // The click that follows the press would open the link a second time,
    // which for a new-tab link means a second tab.
    shortcut.addEventListener('click', (event) => {
      if (openedOnPress) event.preventDefault();
      openedOnPress = false;
    });

    for (const releaseType of ['pointerup', 'pointercancel', 'pointerleave']) {
      shortcut.addEventListener(releaseType, () => shortcut.classList.remove('is-pressed'));
    }
  }
}
