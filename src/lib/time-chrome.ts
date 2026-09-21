import { clockDateTime, formatClockTime } from '~/lib/clock';
import { describeSky, solarElevation } from '~/lib/solar';

/*
 * The only client JavaScript the bars need.
 *
 * A build-time render of the time is stale the moment it ships, so this is the
 * one thing on the site that genuinely cannot be static. It rides the bundle
 * the desktop chrome already loads rather than adding a request, and it
 * queries the DOM on every pass rather than holding element references: the
 * bars are persisted across navigations, the window chrome is not, and
 * re-querying is correct for both.
 */

const minute = 60_000;

function render(): void {
  const now = new Date();

  for (const clock of document.querySelectorAll<HTMLTimeElement>('[data-clock]')) {
    clock.dateTime = clockDateTime(now);
    clock.textContent = formatClockTime(now);
  }

  const sky = describeSky(solarElevation(now));

  for (const dial of document.querySelectorAll<HTMLElement>('[data-sundial]')) {
    dial.dataset.body = sky.body;
    dial.style.setProperty('--sky-height', String(sky.height));

    const label = dial.querySelector<HTMLElement>('[data-sundial-label]');
    if (label) label.textContent = sky.label;
  }
}

let started = false;

export function enableTimeChrome(): void {
  // The persisted bars arrive already wired, and this module survives a
  // client-side navigation; a second call would leave two intervals running.
  if (started) return;
  started = true;

  // Fires on the first load as well as every navigation, which covers both a
  // bar that was rebuilt and one that was kept.
  document.addEventListener('astro:page-load', render);

  // Aligned to the minute, so the display changes when the minute does rather
  // than up to 59 seconds late.
  window.setTimeout(() => {
    render();
    window.setInterval(render, minute);
  }, minute - (Date.now() % minute));
}
