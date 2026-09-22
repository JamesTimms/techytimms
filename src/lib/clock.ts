import { describeSky, solarElevation } from '~/lib/solar';

// Server renders build time; enableClock() corrects it client-side, in the reader's own time zone.

const clockFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

export function formatClockTime(when: Date): string {
  return clockFormat.format(when);
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** A local date-time for `<time datetime>`, which has no offset to state. */
export function clockDateTime(when: Date): string {
  const date = `${when.getFullYear()}-${pad(when.getMonth() + 1)}-${pad(when.getDate())}`;
  return `${date}T${pad(when.getHours())}:${pad(when.getMinutes())}`;
}

const minute = 60_000;

// Re-queries the DOM each tick rather than caching refs — the bars persist across navigation, the rest of the chrome doesn't.
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

export function enableClock(): void {
  // Guards against a second navigation starting a duplicate interval.
  if (started) return;
  started = true;

  document.addEventListener('astro:page-load', render);

  // Aligns the first tick to the minute boundary rather than up to 59s late.
  window.setTimeout(() => {
    render();
    window.setInterval(render, minute);
  }, minute - (Date.now() % minute));
}
