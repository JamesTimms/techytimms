import { clsx } from 'clsx';
import { cva } from 'class-variance-authority';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { type HandleDirection } from '~/lib/window';

export type WindowPalette = 'fallen-leaf' | 'pumpkin';

function cn(...inputs: Parameters<typeof clsx>): string {
  return twMerge(clsx(inputs));
}

// Below lg the frame fills the viewport, so the side borders and radius drop away.
const windowFrameVariants = cva(
  'pointer-events-auto mx-auto flex w-full flex-1 flex-col border border-x-0 lg:relative lg:max-w-4xl lg:flex-none lg:rounded-window lg:border-x lg:positioned:fixed lg:positioned:m-0 lg:positioned:h-(--window-height) lg:positioned:w-(--window-width) lg:positioned:max-w-none lg:positioned:min-w-80 lg:positioned:top-(--window-top) lg:positioned:left-(--window-left)',
  {
    variants: {
      palette: {
        'fallen-leaf': 'bg-leaf-50 border-leaf-500 dark:bg-leaf-700',
        pumpkin: 'bg-surface border-window-edge',
      },
    },
    defaultVariants: { palette: 'fallen-leaf' },
  },
);

const titleBarVariants = cva(
  'flex items-center justify-between gap-3 px-3 py-1.5 lg:rounded-t-window-inner',
  {
    variants: {
      palette: {
        'fallen-leaf': 'bg-leaf-900 text-leaf-50',
        pumpkin: 'bg-title-bar text-title-bar-ink',
      },
      draggable: { true: 'lg:cursor-move', false: '' },
    },
    defaultVariants: { palette: 'fallen-leaf', draggable: false },
  },
);

const titleControlVariants = cva(
  'flex size-6 shrink-0 items-center justify-center rounded-control p-0',
  {
    variants: {
      palette: {
        'fallen-leaf': 'text-leaf-100',
        pumpkin: 'text-title-bar-ink',
      },
      pressable: { true: 'cursor-pointer', false: '' },
    },
    compoundVariants: [
      {
        palette: 'fallen-leaf',
        pressable: true,
        class: 'hover:bg-leaf-500 hover:text-leaf-50 active:bg-leaf-200 active:text-leaf-900',
      },
      {
        // One fill for hover and active: a three-way split cannot clear Lc 75 in both themes.
        palette: 'pumpkin',
        pressable: true,
        class: 'hover:bg-accent-sunk hover:text-ink active:bg-accent-sunk active:text-ink',
      },
    ],
    defaultVariants: { palette: 'fallen-leaf', pressable: false },
  },
);

const minimiseGlyphClass = 'block h-[1.5px] w-[10px] bg-current';
const maximiseGlyphClass = 'block h-[9px] w-[9px] border border-current border-t-2';

interface WindowProps {
  palette?: WindowPalette;
  children?: ReactNode;
}

// Classes, not a component: the page-owning frame's `transition:name` must sit on an element the .astro file renders.
export function windowFrameClasses(palette?: WindowPalette): string {
  return cn(windowFrameVariants({ palette }));
}

export function TitleBar({
  palette,
  draggable = false,
  children,
}: WindowProps & { draggable?: boolean }) {
  return (
    <div
      className={cn(titleBarVariants({ palette, draggable }))}
      data-window-drag={draggable ? true : undefined}
    >
      {children}
    </div>
  );
}

const labelClass = 'flex min-w-0 items-center gap-2 text-left';

export function TitleBarLabel({
  draggable = false,
  children,
}: {
  draggable?: boolean;
  children?: ReactNode;
}) {
  if (!draggable) return <span className={labelClass}>{children}</span>;
  return (
    <button
      type="button"
      className={cn(labelClass, 'lg:cursor-move')}
      aria-label="Move window. Arrow keys move it, hold Shift to move further."
      data-window-drag-handle
    >
      {children}
    </button>
  );
}

export function TitleControls({ children }: { children?: ReactNode }) {
  return <span className="flex shrink-0 items-center gap-0.5">{children}</span>;
}

interface ControlProps {
  palette?: WindowPalette;
  decorative?: boolean;
}

function TitleControl({
  palette,
  decorative,
  label,
  dataAttribute,
  children,
}: ControlProps & { label: string; dataAttribute: string; children: ReactNode }) {
  if (decorative) {
    return (
      <span aria-hidden="true" className={titleControlVariants({ palette })}>
        {children}
      </span>
    );
  }
  return (
    <button
      type="button"
      className={titleControlVariants({ palette, pressable: true })}
      aria-label={label}
      {...{ [dataAttribute]: true }}
    >
      {children}
    </button>
  );
}

export function MinimiseButton(props: ControlProps) {
  return (
    <TitleControl {...props} label="Minimise window" dataAttribute="data-window-minimise">
      <span aria-hidden="true" className={minimiseGlyphClass} />
    </TitleControl>
  );
}

export function MaximiseButton(props: ControlProps) {
  return (
    <TitleControl {...props} label="Maximise window" dataAttribute="data-window-maximise">
      <span aria-hidden="true" className={maximiseGlyphClass} />
    </TitleControl>
  );
}

export function CloseButton(props: ControlProps) {
  return (
    <TitleControl {...props} label="Close window" dataAttribute="data-window-close">
      <span aria-hidden="true" className="title-glyph-close" />
    </TitleControl>
  );
}

const resizeHandles: Record<HandleDirection, { edge: string; className: string }> = {
  n: { edge: 'top edge', className: 'inset-x-3 top-0 h-2 w-[calc(100%-1.5rem)] cursor-ns-resize' },
  s: { edge: 'bottom edge', className: 'inset-x-3 bottom-0 h-2 w-[calc(100%-1.5rem)] cursor-ns-resize' },
  w: { edge: 'left edge', className: 'inset-y-3 left-0 h-[calc(100%-1.5rem)] w-2 cursor-ew-resize' },
  e: { edge: 'right edge', className: 'inset-y-3 right-0 h-[calc(100%-1.5rem)] w-2 cursor-ew-resize' },
  nw: { edge: 'top-left corner', className: 'left-0 top-0 size-3 cursor-nwse-resize' },
  ne: { edge: 'top-right corner', className: 'right-0 top-0 size-3 cursor-nesw-resize' },
  sw: { edge: 'bottom-left corner', className: 'bottom-0 left-0 size-3 cursor-nesw-resize' },
  se: { edge: 'bottom-right corner', className: 'bottom-0 right-0 size-3 cursor-nwse-resize' },
};

export function ResizeHandle({ direction }: { direction: HandleDirection }) {
  const { edge, className } = resizeHandles[direction];
  return (
    <button
      type="button"
      data-resize-handle={direction}
      aria-label={`Resize window: ${edge}. Arrow keys resize, hold Shift for larger steps.`}
      className={cn('absolute hidden lg:block', className)}
    />
  );
}
