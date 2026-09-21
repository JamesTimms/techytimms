import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/*
 * The shadcn `cn()` helper: clsx resolves conditionals and arrays, twMerge then
 * drops utilities a later one overrides. Needed because variant classes and
 * caller-supplied `class` can both set the same property, and the CSS cascade
 * would otherwise pick by source order rather than by intent.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
