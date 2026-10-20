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
      rel={external ? 'me noopener' : undefined}
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
  align?: 'left' | 'right'; // The edge the columns grow from.
  anchor?: 'top' | 'bottom' | undefined; // The edge the group is pinned to, clearing its bar.
  rows: number; // Items per column before wrapping; see `desktopRows`.
  gapRem?: number | undefined;
  label?: string | undefined;
}

export function DesktopSection({
  children,
  align = 'left',
  anchor = 'top',
  rows,
  gapRem = 0.75,
  label = 'Desktop shortcuts',
}: DesktopSectionProps) {
  /** Hidden below `xl`, where there is no room beside the window. */

  const style: CSSProperties = {
    gridTemplateRows: `repeat(${rows}, min-content)`,
    gap: `${gapRem}rem`,
  };

  return (
    <nav
      aria-label={label}
      className="desktop-shortcuts hidden xl:fixed xl:z-0 xl:grid xl:grid-flow-col xl:justify-items-center"
      data-anchor={anchor}
      data-align={align}
      style={style}
    >
      {children}
    </nav>
  );
}
