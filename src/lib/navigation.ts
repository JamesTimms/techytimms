import { site } from '~/data/site';
import type { IconName } from '~/lib/icons';

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  external?: boolean;
  onDesktop?: boolean;
};

/* The Start menu's main group. Acts as a header. */
export const primaryNav: NavItem[] = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/about', label: 'About', icon: 'about', onDesktop: true },
  { href: '/work', label: 'Work', icon: 'work', onDesktop: true },
  { href: '/blog', label: 'Blog', icon: 'blog', onDesktop: true },
];

/* Below the separator, where logoff and shutdown would normally go. Acts as a footer */
export const secondaryNav: NavItem[] = [
  { href: '/cv', label: 'CV', icon: 'cv' },
  { href: site.socials.github, label: 'GitHub', icon: 'external', external: true },
];

export const desktopShortcuts: NavItem[] = primaryNav.filter((item) => item.onDesktop);

const maxDesktopRows = 8;

/* One row per item up to the cap. Every row in the grid takes a gap, so a spare empty row would still push the group apart. */
export function desktopRows(items: readonly NavItem[]): number {
  return Math.min(items.length, maxDesktopRows);
}

export function isCurrent(item: NavItem, currentPath: string): boolean {
  return !item.external && item.href === currentPath;
}

/* Trailing slashes vary between the server render and `location.pathname`, and
 * the two are compared against each other once the chrome is persisted. */
export function normalisePath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

export type Press = Pick<
  PointerEvent,
  'pointerType' | 'button' | 'ctrlKey' | 'metaKey' | 'shiftKey' | 'altKey'
>;

/*
 * Desktop shortcuts open on mouse down, like a desktop icon rather than a web
 * link. Touch and pen are left to the ordinary click, because a finger landing
 * on an icon may be the start of a scroll. A modified or non-primary press is
 * left alone so middle-click and cmd-click still open a new tab.
 */
export function opensOnPress(press: Press): boolean {
  return (
    press.pointerType === 'mouse' &&
    press.button === 0 &&
    !press.ctrlKey &&
    !press.metaKey &&
    !press.shiftKey &&
    !press.altKey
  );
}
