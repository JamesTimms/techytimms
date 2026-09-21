import { type CSSProperties, type ReactNode } from 'react';

import { iconAttributes, type IconName } from '~/lib/icons';

/*
 * The desktop's React parts: a shortcut, and the grid that places a group of
 * them. Composition lives in `Desktop.astro`, which owns the pieces these
 * cannot express — `transition:persist` is an Astro template directive with no
 * JSX equivalent.
 *
 * Nothing here hydrates. React is the authoring API; no `client:*` directive is
 * applied, so this renders to static HTML.
 */

export interface DesktopShortcutProps {
  icon: IconName;
  label: string;
  href: string | undefined;
  external?: boolean | undefined;
  labelOverflow?: 'wrap' | 'truncate' | undefined;
  selected?: boolean | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}

export function DesktopShortcut({
  icon,
  label,
  href,
  external = false,
  labelOverflow = 'wrap',
  selected = false,
  className = '',
  style,
}: DesktopShortcutProps) {
  const { src, width, height } = iconAttributes(icon);
  const classes = ['desktop-shortcut', selected ? 'is-selected' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      href={href}
      // Open external link in new tab, but don't allow it to access the opener's window.
      rel={external ? 'noopener' : undefined}
      target={external ? '_blank' : undefined}
      aria-current={selected ? 'page' : undefined}
      className={classes}
      style={style}
      data-selected={selected ? 'true' : undefined}
    >
      <img
        src={src}
        width={width}
        height={height}
        alt=""
        aria-hidden="true"
        decoding="async"
        className="pixel-icon"
      />
      <span
        className={labelOverflow === 'truncate' ? 'shortcut-label is-nowrap' : 'shortcut-label'}
      >
        {label}
        {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </span>
    </a>
  );
}

export interface DesktopSectionProps {
  children: ReactNode;
  /** Which edge the columns grow from. */
  align?: 'left' | 'right';
  /** Which edge the group is pinned to. `bottom` clears the fixed dock. */
  anchor?: 'top' | 'bottom' | undefined;
  /** Items per column before wrapping into the next one. Count the items with `desktopRows`. */
  rows: number;
  /** Gap between shortcuts, in rem. */
  gap?: number | undefined;
  /** Distance from the viewport edges, in rem. */
  inset?: number | undefined;
  /** Distance from the anchored edge alone, in rem, when a bar there needs more room. */
  anchorInset?: number | undefined;
  label?: string | undefined;
}

/*
 * Placement for a group of shortcuts. Only shows on large screens.
 */
export function DesktopSection({
  children,
  align = 'left',
  anchor = 'top',
  rows,
  gap = 0.75,
  inset = 1,
  anchorInset,
  label = 'Desktop shortcuts',
}: DesktopSectionProps) {
  const edgeInset = anchorInset ?? inset;
  const style: CSSProperties = {
    gridTemplateRows: `repeat(${rows}, min-content)`,
    gap: `${gap}rem`,
    [anchor]:
      anchor === 'bottom' ? `calc(${edgeInset}rem + var(--dock-clearance))` : `${edgeInset}rem`,
    [align]: `${inset}rem`,
  };

  return (
    <nav aria-label={label} className="desktop-shortcuts" data-anchor={anchor} style={style}>
      {children}
    </nav>
  );
}
