/*
 * The clock's two strings: the one a reader sees and the one a machine parses.
 *
 * Both are in the reader's own time zone, so the server renders the build
 * machine's time and the client corrects it on load. Only the digits change —
 * two fixed-width fields — so nothing moves.
 */

/* `hourCycle`, not `hour12: false`: that pair renders midnight as 24:00 under
   some ICU builds. */
const clockFormat = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
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
