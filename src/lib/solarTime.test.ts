import { describe, it, expect } from 'vitest';
import {
  toTrueSolarTime,
  equationOfTimeMinutes,
  InvalidBirthTimeError,
} from './solarTime';

const SEOUL_LNG = 126.978;

describe('equationOfTimeMinutes', () => {
  it('stays within the physical ±17 minute envelope all year', () => {
    for (let n = 1; n <= 366; n++) {
      expect(Math.abs(equationOfTimeMinutes(n))).toBeLessThan(17);
    }
  });

  it('is strongly negative in mid-February and positive in early November', () => {
    expect(equationOfTimeMinutes(42)).toBeLessThan(-12); // ~Feb 11
    expect(equationOfTimeMinutes(307)).toBeGreaterThan(14); // ~Nov 3
  });
});

describe('toTrueSolarTime', () => {
  it('applies the famous ~32-minute Seoul correction (solar time < clock time)', () => {
    // Noon in Seoul becomes roughly 11:28 solar (KST is ahead of true Seoul time).
    const r = toTrueSolarTime(
      { year: 2000, month: 9, day: 1, hour: 12, minute: 0 },
      'Asia/Seoul',
      SEOUL_LNG,
    );
    expect(r.zoneOffsetMinutes).toBe(540);
    expect(r.longitudeOffsetMinutes).toBeCloseTo(507.912, 2);
    // Net shift = longitude(507.91) + EoT(~0.97) - zone(540) ≈ -31.1 min.
    const shift =
      (r.wall.hour - 12) * 60 + r.wall.minute + r.wall.second / 60;
    expect(shift).toBeLessThan(-25);
    expect(shift).toBeGreaterThan(-40);
  });

  it('respects historical DST — Korea was UTC+10 during the 1988 Olympics', () => {
    const r = toTrueSolarTime(
      { year: 1988, month: 8, day: 1, hour: 12, minute: 0 },
      'Asia/Seoul',
      SEOUL_LNG,
    );
    expect(r.zoneOffsetMinutes).toBe(600);
  });

  it('respects US daylight saving across summer vs winter births', () => {
    const summer = toTrueSolarTime(
      { year: 1990, month: 7, day: 4, hour: 12, minute: 0 },
      'America/New_York',
      -74.006,
    );
    const winter = toTrueSolarTime(
      { year: 1990, month: 1, day: 4, hour: 12, minute: 0 },
      'America/New_York',
      -74.006,
    );
    expect(summer.zoneOffsetMinutes).toBe(-240); // EDT
    expect(winter.zoneOffsetMinutes).toBe(-300); // EST
  });

  it('throws on an impossible birth time/zone', () => {
    expect(() =>
      toTrueSolarTime(
        { year: 2000, month: 1, day: 1, hour: 12, minute: 0 },
        'Not/AZone',
        0,
      ),
    ).toThrow(InvalidBirthTimeError);
  });
});
