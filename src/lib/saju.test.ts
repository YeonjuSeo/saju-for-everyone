import { describe, it, expect } from 'vitest';
import { computeSaju, imageKeyFor, type SajuInput } from './saju';

// Longitude 135° == the KST standard meridian, so the longitude correction is
// exactly zero and only the (tiny) equation of time remains. This isolates the
// pillar logic from the solar-time shift for precise boundary assertions.
const base = (over: Partial<SajuInput>): SajuInput => ({
  calendar: 'solar',
  year: 2000,
  month: 9,
  day: 1,
  hour: 12,
  minute: 0,
  timeKnown: true,
  timezone: 'Asia/Seoul',
  longitude: 135,
  ...over,
});

describe('computeSaju — day pillar (일주)', () => {
  it('advances the day pillar by exactly one across consecutive days', () => {
    const d1 = computeSaju(base({ day: 1 })).dayPillar;
    const d2 = computeSaju(base({ day: 2 })).dayPillar;
    expect((d1.sexagenaryIndex + 1) % 60).toBe(d2.sexagenaryIndex);
  });

  it('attributes a 23:30 birth to the NEXT day (자시 23:00 boundary)', () => {
    const evening = computeSaju(base({ day: 1, hour: 23, minute: 30 })).dayPillar;
    const nextEarly = computeSaju(base({ day: 2, hour: 0, minute: 30 })).dayPillar;
    const daytime = computeSaju(base({ day: 1, hour: 22, minute: 0 })).dayPillar;

    expect(evening.hanja).toBe(nextEarly.hanja); // 23:30 belongs to day 2
    expect((daytime.sexagenaryIndex + 1) % 60).toBe(evening.sexagenaryIndex);
  });

  it('is stable for a midday birth regardless of unknown time', () => {
    const known = computeSaju(base({ hour: 12, timeKnown: true })).dayPillar;
    const unknown = computeSaju(base({ timeKnown: false })).dayPillar;
    expect(known.hanja).toBe(unknown.hanja);
  });
});

describe('computeSaju — year pillar (년주) and 입춘 boundary', () => {
  it('uses the previous sexagenary year before 입춘 (early February)', () => {
    // 立春 in 2024 was ~Feb 4. Births before it still belong to 癸卯 (2023).
    const beforeIpchun = computeSaju(base({ year: 2024, month: 2, day: 1 }));
    const afterIpchun = computeSaju(base({ year: 2024, month: 2, day: 10 }));
    expect(beforeIpchun.yearPillar.hanja).toBe('癸卯'); // Rabbit year
    expect(afterIpchun.yearPillar.hanja).toBe('甲辰'); // Dragon year (2024)
  });
});

describe('computeSaju — lunar input', () => {
  it('converts a lunar date to the same pillars as its solar equivalent', () => {
    // Lunar 1990-04-18 == Solar 1990-05-12 (verified against the engine).
    const lunar = computeSaju(
      base({ calendar: 'lunar', year: 1990, month: 4, day: 18 }),
    );
    const solar = computeSaju(base({ year: 1990, month: 5, day: 12 }));
    expect(lunar.dayPillar.hanja).toBe(solar.dayPillar.hanja);
    expect(lunar.gregorian).toEqual({ year: 1990, month: 5, day: 12 });
  });
});

describe('computeSaju — output shape', () => {
  it('omits the hour pillar when time is unknown', () => {
    const r = computeSaju(base({ timeKnown: false }));
    expect(r.hourPillar).toBeNull();
  });

  it('returns a full four-pillar set when time is known', () => {
    const r = computeSaju(base({ timeKnown: true }));
    expect(r.hourPillar).not.toBeNull();
    [r.yearPillar, r.monthPillar, r.dayPillar, r.hourPillar!].forEach((p) => {
      expect(p.hanja).toHaveLength(2);
      expect(p.roman.length).toBeGreaterThan(1);
    });
  });

  it('exposes the solar-time correction details', () => {
    const r = computeSaju(base({}));
    expect(r.correction.zoneOffsetMinutes).toBe(540);
    expect(r.dayBoundary).toBe('zi-2300');
  });
});

describe('imageKeyFor', () => {
  it('uses the romanization as the manifest key', () => {
    const r = computeSaju(base({}));
    expect(imageKeyFor(r.dayPillar)).toBe(r.dayPillar.roman);
  });
});
