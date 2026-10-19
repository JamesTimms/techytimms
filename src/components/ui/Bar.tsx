import { cva } from 'class-variance-authority';
import { type ReactNode } from 'react';

import { Tooltip } from '~/components/ui/Tooltip';
import { iconAttributes, type IconName } from '~/lib/icons';

export const barPositions = ['top', 'bottom', 'left', 'right'] as const;
export type BarPosition = (typeof barPositions)[number];

export const barSizes = ['compact', 'regular', 'spacious'] as const;
export type BarSize = (typeof barSizes)[number];

const barSizeClasses: Record<BarSize, string> = {
  compact: 'px-2 py-1',
  regular: 'px-3 py-2',
  spacious: 'px-4 py-3',
};

export const barPurposes = ['menu', 'dock'] as const;
export type BarPurpose = (typeof barPurposes)[number];

const barVariantClasses: Record<BarPurpose, string> = {
  menu: 'bg-elevation-1 border-elevation-1-edge backdrop-blur-sm',
  dock: 'bg-elevation-2 border-elevation-2-edge shadow-[inset_0_1px_0_var(--color-elevation-2-highlight)] backdrop-blur-md',
};

export const bar = cva('dock z-20 grid items-center gap-3', {
  variants: {
    position: {
      top: 'border-b lg:fixed lg:inset-x-0 lg:top-0',
      bottom: 'border-t lg:fixed lg:inset-x-0 lg:bottom-0',
      left: 'border-r lg:fixed lg:inset-y-0 lg:left-0 lg:grid-cols-none lg:px-2 lg:py-3',
      right: 'border-l lg:fixed lg:inset-y-0 lg:right-0 lg:grid-cols-none lg:px-2 lg:py-3',
    },
    purpose: barVariantClasses,
    middle: { true: 'grid-cols-[1fr_auto_1fr]', false: 'grid-cols-[1fr_auto]' },
    sticky: { true: 'fixed', false: '' },
    size: barSizeClasses,
  },
  compoundVariants: [
    { position: ['left', 'right'], middle: true, class: 'lg:grid-rows-[1fr_auto_1fr]' },
    { position: ['left', 'right'], middle: false, class: 'lg:grid-rows-[1fr_auto]' },
    { position: 'top', sticky: true, class: 'inset-x-0 top-0' },
    /* Vertical bars are the bottom bar below `lg`, so they stick to that edge. */
    { position: ['bottom', 'left', 'right'], sticky: true, class: 'inset-x-0 bottom-0' },
  ],
  defaultVariants: {
    position: 'bottom',
    purpose: 'dock',
    middle: false,
    sticky: false,
    size: 'regular',
  },
});

export interface DockItemProps {
  href: string;
  label: string;
  icon: IconName;
  external?: boolean;
  current: boolean;
}

export function DockItem({ href, label, icon, external = false, current }: DockItemProps) {
  const { src, width, height } = iconAttributes(icon);

  return (
    <a
      href={href}
      rel={external ? 'me noopener' : undefined}
      target={external ? '_blank' : undefined}
      aria-current={current ? 'page' : undefined}
      className="dock-item tooltip-anchor"
    >
      <img src={src} width={width} height={height} alt="" decoding="async" className="pixel-icon" />
      <span className="sr-only">
        {label}
        {external && ' (opens in a new tab)'}
      </span>
      <Tooltip label={label} />
    </a>
  );
}

export function WindowTaskButton({ windowTitle }: { windowTitle: string }) {
  const { src, width, height } = iconAttributes('document');

  return (
    <button type="button" className="task-button tooltip-anchor" data-window-task hidden>
      <img src={src} width={width} height={height} alt="" decoding="async" className="pixel-icon" />
      <span className="sr-only">Restore</span>
      <span className="dock-item-label sr-only">{windowTitle}</span>
      <Tooltip label={windowTitle} />
    </button>
  );
}

export const dockCluster = cva('dock-cluster flex items-stretch justify-center gap-3', {
  variants: {
    position: {
      top: '',
      bottom: '',
      left: 'lg:flex-col lg:items-center',
      right: 'lg:flex-col lg:items-center',
    },
  },
  defaultVariants: { position: 'bottom' },
});

export const dockNav = cva('dock-nav flex items-stretch gap-1', {
  variants: {
    position: {
      top: '',
      bottom: '',
      left: 'lg:flex-col lg:items-center',
      right: 'lg:flex-col lg:items-center',
    },
  },
  defaultVariants: { position: 'bottom' },
});

interface DockPartProps {
  position: BarPosition;
  children: ReactNode;
}

export function DockCluster({ position, children }: DockPartProps) {
  return <div className={dockCluster({ position })}>{children}</div>;
}

export function DockNav({ position, children }: DockPartProps) {
  return (
    <nav id="dock-nav" tabIndex={-1} aria-label="Site" className={dockNav({ position })}>
      {children}
    </nav>
  );
}

export const barRegion = cva('flex min-w-0 items-center gap-2 text-xs text-ink', {
  variants: {
    position: { top: '', bottom: '', left: '', right: '' },
    region: {
      start: 'justify-self-start',
      middle: 'justify-self-center',
      end: 'justify-self-end',
    },
  },
  compoundVariants: [
    {
      position: ['left', 'right'],
      region: 'start',
      class: 'lg:flex-col lg:justify-self-center lg:self-start',
    },
    {
      position: ['left', 'right'],
      region: 'middle',
      class: 'lg:flex-col lg:justify-self-center lg:self-center',
    },
    {
      position: ['left', 'right'],
      region: 'end',
      class: 'lg:flex-col lg:justify-self-center lg:self-end',
    },
  ],
  defaultVariants: { position: 'bottom', region: 'start' },
});

interface BarRegionProps {
  position: BarPosition;
  region: 'start' | 'middle' | 'end';
  children?: ReactNode | undefined;
}

export function BarRegion({ position, region, children }: BarRegionProps) {
  return <div className={barRegion({ position, region })}>{children}</div>;
}
