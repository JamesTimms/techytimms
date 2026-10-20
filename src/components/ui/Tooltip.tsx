export interface TooltipProps {
  label: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ label, placement = 'top', className }: TooltipProps) {
  return (
    <span
      className={['tooltip', className].filter(Boolean).join(' ')}
      data-placement={placement}
      aria-hidden="true"
    >
      {label}
    </span>
  );
}
