import { describe, expect, it } from 'vitest';

import { clockDateTime, formatClockTime } from '~/lib/clock';

describe('formatClockTime', () => {
  it('is 24-hour and two digits wide, so the bar never reflows', () => {
    expect(formatClockTime(new Date(2026, 8, 21, 9, 5))).toBe('09:05');
    expect(formatClockTime(new Date(2026, 8, 21, 17, 40))).toBe('17:40');
  });

  it('calls midnight 00:00, not 24:00', () => {
    expect(formatClockTime(new Date(2026, 8, 21, 0, 0))).toBe('00:00');
  });
});

describe('clockDateTime', () => {
  it('pads every field so the value parses as a local date-time', () => {
    expect(clockDateTime(new Date(2026, 0, 3, 4, 5))).toBe('2026-01-03T04:05');
  });
});
