import type { CSSProperties, ReactNode } from 'react';

/*
 * Placement for desktop shortcuts. Only should show on large screens.
 */
export interface DesktopProps {
  children: ReactNode;
  /** Which edge the columns grow from. */
  align?: 'left' | 'right';
  /** Which edge the group is pinned to. `bottom` clears the fixed taskbar. */
  anchor?: 'top' | 'bottom';
  /** Items per column before wrapping into the next one. Count the items with `desktopRows`. */
  rows: number;
  /** Gap between shortcuts, in rem. */
  gap?: number;
  /** Distance from the viewport edges, in rem. */
  inset?: number;
  label?: string;
}

export default function Desktop({
  children,
  align = 'left',
  anchor = 'top',
  rows,
  gap = 0.75,
  inset = 1,
  label = 'Desktop shortcuts',
}: DesktopProps) {
  const style: CSSProperties = {
    gridTemplateRows: `repeat(${rows}, min-content)`,
    gap: `${gap}rem`,
    [anchor]: anchor === 'bottom' ? `calc(${inset}rem + var(--taskbar-clearance))` : `${inset}rem`,
    [align]: `${inset}rem`,
  };

  return (
    <nav aria-label={label} className="desktop-shortcuts" data-anchor={anchor} style={style}>
      {children}
    </nav>
  );
}
