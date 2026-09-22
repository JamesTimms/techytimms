import { type CSSProperties, type ReactNode } from 'react';

import { iconAttributes, type IconName } from '~/lib/icons';

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

// The distance from the align edge, and the baseline before an anchored bar's own clearance (added in global.css, keyed off data-anchor).
const EDGE_INSET = 1;

export interface DesktopSectionProps {
  children: ReactNode;
  /** Which edge the columns grow from. */
  align?: 'left' | 'right';
  /** Which edge the group is pinned to, and which fixed bar it clears. */
  anchor?: 'top' | 'bottom' | undefined;
  /** Items per column before wrapping into the next one. Count the items with `desktopRows`. */
  rows: number;
  /** Gap between shortcuts, in rem. */
  gap?: number | undefined;
  label?: string | undefined;
}

// Placement for a group of shortcuts. Only shows on large screens.
export function DesktopSection({
  children,
  align = 'left',
  anchor = 'top',
  rows,
  gap = 0.75,
  label = 'Desktop shortcuts',
}: DesktopSectionProps) {
  const style: CSSProperties = {
    gridTemplateRows: `repeat(${rows}, min-content)`,
    gap: `${gap}rem`,
    [align]: `${EDGE_INSET}rem`,
  };

  return (
    <nav aria-label={label} className="desktop-shortcuts" data-anchor={anchor} style={style}>
      {children}
    </nav>
  );
}
