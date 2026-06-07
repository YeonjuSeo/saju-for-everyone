import { DateTime } from 'luxon';

// Converts a birth instant given in a specific place (IANA timezone + longitude)
// into the *true (apparent) local solar time* wall-clock used for Saju.
//
// Why: traditional Saju is read from the Sun's actual position at the birthplace,
// not from the political clock. Two corrections are applied to the UTC instant:
//   1. Longitude correction — clock zones are wide; true noon depends on longitude.
//      Each degree of longitude = 4 minutes of time (east = later UTC = earlier solar... handled by sign).
//   2. Equation of time (균시차) — the Sun runs fast/slow vs. a uniform clock over the year (±~16 min).
//
// Historical DST and offset changes are handled by luxon's IANA timezone database,
// so e.g. US wartime/standard-time quirks at the birth date are respected.

export interface CivilDateTime {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number; // 0-59
  second?: number; // 0-59
}

export interface SolarTimeResult {
  /** Corrected true-solar wall-clock, to be fed into the pillar engine. */
  wall: Required<CivilDateTime>;
  /** The underlying UTC instant of birth. */
  utcISO: string;
  /** Minutes added for longitude (relative to the zone's standard meridian effect). */
  longitudeOffsetMinutes: number;
  /** Minutes added for the equation of time. */
  equationOfTimeMinutes: number;
  /** The IANA zone's total offset from UTC at birth (includes DST), in minutes. */
  zoneOffsetMinutes: number;
}

/**
 * Equation of time in minutes for a given day-of-year (1-366).
 * Standard Spencer-style approximation; accurate to ~30 seconds, plenty for Saju.
 * Positive = a sundial is *ahead* of mean clock time.
 */
export function equationOfTimeMinutes(dayOfYear: number): number {
  const b = (2 * Math.PI * (dayOfYear - 81)) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

export class InvalidBirthTimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBirthTimeError';
  }
}

/**
 * @param civil  Local civil date/time as shown on the birthplace clock.
 * @param zone   IANA timezone id, e.g. "America/New_York".
 * @param longitude  Birthplace longitude in degrees, east positive (e.g. Seoul ≈ 126.98, NYC ≈ -74.0).
 */
export function toTrueSolarTime(
  civil: CivilDateTime,
  zone: string,
  longitude: number,
): SolarTimeResult {
  const dt = DateTime.fromObject(
    {
      year: civil.year,
      month: civil.month,
      day: civil.day,
      hour: civil.hour,
      minute: civil.minute,
      second: civil.second ?? 0,
    },
    { zone },
  );

  if (!dt.isValid) {
    throw new InvalidBirthTimeError(
      `Invalid birth time for zone "${zone}": ${dt.invalidExplanation ?? dt.invalidReason ?? 'unknown'}`,
    );
  }

  const utc = dt.toUTC();

  // Longitude correction: solar time = UTC + longitude/15 hours.
  const longitudeOffsetMinutes = (longitude / 15) * 60;

  // Equation of time based on the UTC day-of-year.
  const eot = equationOfTimeMinutes(utc.ordinal);

  // Bake both corrections onto the UTC instant, then read the result as a wall clock.
  const correctedMillis =
    utc.toMillis() + (longitudeOffsetMinutes + eot) * 60_000;
  const solar = DateTime.fromMillis(correctedMillis, { zone: 'utc' });

  return {
    wall: {
      year: solar.year,
      month: solar.month,
      day: solar.day,
      hour: solar.hour,
      minute: solar.minute,
      second: solar.second,
    },
    utcISO: utc.toISO() ?? '',
    longitudeOffsetMinutes,
    equationOfTimeMinutes: eot,
    zoneOffsetMinutes: dt.offset,
  };
}
