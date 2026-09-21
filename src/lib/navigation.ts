import { site } from '~/data/site';
import type { IconName } from '~/lib/icons';

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  external?: boolean;
  onDesktop?: boolean;
};

/* The dock row's leading group. */
export const primaryNav: NavItem[] = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/about', label: 'About', icon: 'about', onDesktop: true },
  { href: '/work', label: 'Work', icon: 'work', onDesktop: true },
  { href: '/blog', label: 'Blog', icon: 'blog', onDesktop: true },
];

/* After the dock's separator, where logoff and shutdown used to sit: reachable,
 * and plainly not the headline — see blueprint decision 12. */
export const secondaryNav: NavItem[] = [
  { href: '/cv', label: 'CV', icon: 'cv', onDesktop: true },
  {
    href: site.socials.github,
    label: 'GitHub',
    icon: 'external',
    external: true,
    onDesktop: true,
  },
];

export const primaryShortcuts: NavItem[] = primaryNav.filter((item) => item.onDesktop);
export const secondaryShortcuts: NavItem[] = secondaryNav.filter((item) => item.onDesktop);

const maxDesktopRows = 8;

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

/*
 * What the dock's side region names: the section, not the page. `/blog/hello`
 * is still Blog, because the first segment is what the navigation is keyed on.
 * A path with no nav entry falls back to its own segment rather than to a
 * blank region.
 */
export function sectionLabel(currentPath: string): string {
  const [segment = ''] = normalisePath(currentPath).slice(1).split('/');
  const entry = [...primaryNav, ...secondaryNav].find(
    (item) => !item.external && item.href === `/${segment}`,
  );

  return entry?.label ?? segment.replace(/-/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase());
}
