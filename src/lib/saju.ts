import { Solar, Lunar } from 'lunar-typescript';
import { pillarFromHanja, type Pillar } from './ganzhi';
import { toTrueSolarTime, type SolarTimeResult } from './solarTime';

export type CalendarType = 'solar' | 'lunar';

export interface SajuInput {
  calendar: CalendarType;
  /** For lunar input these are lunar year/month/day; for solar, Gregorian. */
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number; // 0-59
  /** If false, the hour pillar is omitted and time defaults to noon for a stable day pillar. */
  timeKnown: boolean;
  /** Lunar only: whether the given month is a leap (윤달) month. */
  isLeapMonth?: boolean;
  /** IANA timezone of the birthplace, e.g. "America/New_York". */
  timezone: string;
  /** Birthplace longitude, east positive. */
  longitude: number;
}

export interface SajuResult {
  /** 일주 (Day Pillar) — the headline of this app. */
  dayPillar: Pillar;
  /** 년주 (Year Pillar). */
  yearPillar: Pillar;
  /** 월주 (Month Pillar). */
  monthPillar: Pillar;
  /** 시주 (Hour Pillar). null when birth time is unknown. */
  hourPillar: Pillar | null;
  /** Resolved Gregorian date (after any lunar→solar conversion, before solar-time correction). */
  gregorian: { year: number; month: number; day: number };
  /** True-solar-time correction details, for transparency in the UI. */
  correction: SolarTimeResult;
  /** Day-boundary convention used: zi hour begins the day at 23:00. */
  dayBoundary: 'zi-2300';
}

/** Day pillar changes at 23:00 (자시 → next day). lunar-typescript sect 1. */
const ZI_2300_SECT = 1;

/** Filename-safe key for the day-pillar image manifest, e.g. "sinhae". */
export function imageKeyFor(pillar: Pillar): string {
  return pillar.roman;
}

/**
 * Compute the Four Pillars (사주팔자) for a birth event.
 * Pure and deterministic — no I/O, no storage.
 */
export function computeSaju(input: SajuInput): SajuResult {
  // 1. Resolve to a Gregorian (solar) calendar date.
  const gregorian = resolveGregorianDate(input);

  // 2. Choose the clock time. Unknown time → noon, far from the 23:00 boundary.
  const hour = input.timeKnown ? input.hour : 12;
  const minute = input.timeKnown ? input.minute : 0;

  // 3. Correct to the birthplace's true solar time.
  const correction = toTrueSolarTime(
    { ...gregorian, hour, minute },
    input.timezone,
    input.longitude,
  );

  // 4. Feed the corrected wall-clock into the pillar engine.
  const w = correction.wall;
  const eightChar = Solar.fromYmdHms(w.year, w.month, w.day, w.hour, w.minute, w.second)
    .getLunar()
    .getEightChar();
  eightChar.setSect(ZI_2300_SECT);

  return {
    dayPillar: pillarFromHanja(eightChar.getDay()),
    yearPillar: pillarFromHanja(eightChar.getYear()),
    monthPillar: pillarFromHanja(eightChar.getMonth()),
    hourPillar: input.timeKnown ? pillarFromHanja(eightChar.getTime()) : null,
    gregorian,
    correction,
    dayBoundary: 'zi-2300',
  };
}

function resolveGregorianDate(input: SajuInput): {
  year: number;
  month: number;
  day: number;
} {
  if (input.calendar === 'solar') {
    return { year: input.year, month: input.month, day: input.day };
  }
  // Lunar → solar. Leap months are passed as a negative month to lunar-typescript.
  const lunarMonth = input.isLeapMonth ? -input.month : input.month;
  const solar = Lunar.fromYmd(input.year, lunarMonth, input.day).getSolar();
  return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
}
