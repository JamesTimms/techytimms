import { describe, expect, it } from 'vitest';

import { clockDateTime, formatClockTime } from '~/lib/clock';

describe('formatClockTime', () => {
  it('reads as a full date and 12-hour time', () => {
    expect(formatClockTime(new Date(2026, 6, 25, 13, 0))).toBe('25 Jul, 1:00 pm');
    expect(formatClockTime(new Date(2026, 8, 21, 17, 40))).toBe('21 Sept, 5:40 pm');
  });

  it('calls midnight 12:00 am, not 00:00', () => {
    expect(formatClockTime(new Date(2026, 8, 21, 0, 0))).toBe('21 Sept, 12:00 am');
  });
});

describe('clockDateTime', () => {
  it('pads every field so the value parses as a local date-time', () => {
    expect(clockDateTime(new Date(2026, 0, 3, 4, 5))).toBe('2026-01-03T04:05');
  });
});
