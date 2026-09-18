import { opensOnPress } from '~/lib/navigation';

export function enableDesktopShortcuts(root: ParentNode = document): void {
  for (const shortcut of root.querySelectorAll<HTMLAnchorElement>('.desktop-shortcut')) {
    let openedOnPress = false;

    shortcut.addEventListener('pointerdown', (event) => {
      shortcut.classList.add('is-pressed');
      openedOnPress = opensOnPress(event);
      if (!openedOnPress) return;
      if (shortcut.target === '_blank') window.open(shortcut.href, '_blank', 'noopener');
      else window.location.assign(shortcut.href);
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
