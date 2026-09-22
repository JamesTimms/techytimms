import type { ImageMetadata } from 'astro';
import addressBookUser from '~/assets/icons/win98/address_book_user.png';
import briefcase from '~/assets/icons/win98/briefcase-0.png';
import certificate from '~/assets/icons/win98/certificate_2-0.png';
import computerLarge from '~/assets/icons/win98/computer_explorer_2k-0.png';
import computerSmall from '~/assets/icons/win98/computer_explorer_2k-1.png';
import fileLines from '~/assets/icons/win98/file_lines-1.png';
import globe from '~/assets/icons/win98/globe_map-1.png';
import notepad from '~/assets/icons/win98/notepad_file-0.png';

// Win98 icons (win98icons.alexmeub.com); imported rather than referenced from public/ so a typo fails the build and each icon keeps its intrinsic size.
export const icons = {
  about: addressBookUser,
  work: briefcase,
  cv: certificate,
  blog: notepad,
  home: computerLarge,
  start: computerSmall,
  external: globe,
  document: fileLines,
} satisfies Record<string, ImageMetadata>;

export type IconName = keyof typeof icons;

export type IconAttributes = {
  src: string;
  width: number;
  height: number;
  alt: string;
  decorative: boolean;
};

// Shared by Icon.astro and DesktopShortcut so sizing and the alt/aria rule cannot drift between them.
export function iconAttributes(name: IconName, alt = ''): IconAttributes {
  const { src, width, height } = icons[name];
  return { src, width, height, alt, decorative: alt === '' };
}
