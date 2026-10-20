import { Tooltip } from '~/components/ui/Tooltip';

export function ThemeToggle() {
  return (
    <button
      id="theme-toggle"
      type="button"
      className="theme-toggle tooltip-anchor inline-flex min-h-8 min-w-8 items-center justify-center rounded-md p-1"
      aria-label="Toggle colour theme"
    >
      <svg
        className="theme-toggle-icon theme-toggle-sun hidden h-6 w-6 dark:block"
        viewBox="4 0 8 8"
        shapeRendering="crispEdges"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="7" y="2" width="2" height="1" />
        <rect x="6" y="3" width="4" height="2" />
        <rect x="7" y="5" width="2" height="1" />
        <rect x="7" y="0" width="2" height="1" />
        <rect x="7" y="7" width="2" height="1" />
        <rect x="4" y="3" width="1" height="2" />
        <rect x="11" y="3" width="1" height="2" />
      </svg>
      <svg
        className="theme-toggle-icon theme-toggle-moon block h-6 w-6 dark:hidden"
        viewBox="4 0 8 8"
        shapeRendering="crispEdges"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="7" y="2" width="2" height="1" />
        <rect x="6" y="3" width="2" height="1" />
        <rect x="6" y="4" width="2" height="1" />
        <rect x="7" y="5" width="2" height="1" />
      </svg>
      <Tooltip label="Switch to light theme" className="hidden dark:block" />
      <Tooltip label="Switch to dark theme" className="block dark:hidden" />
    </button>
  );
}
