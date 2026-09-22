import { describe, expect, it } from 'vitest';

import { clockDateTime, formatClockTime } from '~/lib/clock';

describe('formatClockTime', () => {
  it('reads as a full date and 12-hour time', () => {
    expect(formatClockTime(new Date(2026, 6, 25, 13, 0))).toBe('Jul 25, 1:00 PM');
    expect(formatClockTime(new Date(2026, 8, 21, 17, 40))).toBe('Sep 21, 5:40 PM');
  });

  it('calls midnight 12:00 AM, not 00:00', () => {
    expect(formatClockTime(new Date(2026, 8, 21, 0, 0))).toBe('Sep 21, 12:00 AM');
  });
});

describe('clockDateTime', () => {
  it('pads every field so the value parses as a local date-time', () => {
    expect(clockDateTime(new Date(2026, 0, 3, 4, 5))).toBe('2026-01-03T04:05');
  });
});
