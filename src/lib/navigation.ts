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

/* After the dock's separator; reachable but not the headline (blueprint decision 12). */
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

export function normalisePath(pathname: string): string {
  // Trailing slashes differ between server render and `location.pathname`.
  return pathname.replace(/\/+$/, '') || '/';
}

export type Press = Pick<
  PointerEvent,
  'pointerType' | 'button' | 'ctrlKey' | 'metaKey' | 'shiftKey' | 'altKey'
>;

export function opensOnPress(press: Press): boolean {
  // Mouse-down opens, like a desktop icon; touch/pen and modified or non-primary presses keep the ordinary click.
  return (
    press.pointerType === 'mouse' &&
    press.button === 0 &&
    !press.ctrlKey &&
    !press.metaKey &&
    !press.shiftKey &&
    !press.altKey
  );
}

export function sectionLabel(currentPath: string): string {
  // The section, not the page: `/blog/hello` is Blog. Unknown paths fall back to their own segment.
  const [segment = ''] = normalisePath(currentPath).slice(1).split('/');
  const entry = [...primaryNav, ...secondaryNav].find(
    (item) => !item.external && item.href === `/${segment}`,
  );

  return entry?.label ?? segment.replace(/-/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase());
}
