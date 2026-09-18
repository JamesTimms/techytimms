import type { CSSProperties } from 'react';

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

export default function DesktopShortcut({
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
