import { useState } from 'react';
import type { City } from '../data/cities';
import type { CalendarType, SajuInput } from '../lib/saju';
import CityPicker from './CityPicker';

interface Props {
  onSubmit: (input: SajuInput) => void;
}

const thisYear = new Date().getFullYear();

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink/80">
        {label}
        {hint && <span className="ml-1 font-normal text-ink/40">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const selectCls =
  'w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink/40';

export default function BirthForm({ onSubmit }: Props) {
  const [calendar, setCalendar] = useState<CalendarType>('solar');
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [year, setYear] = useState(1995);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [timeKnown, setTimeKnown] = useState(true);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [city, setCity] = useState<City | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!city) {
      setError('Please choose the city closest to your birthplace.');
      return;
    }
    if (year < 1900 || year > thisYear) {
      setError(`Year must be between 1900 and ${thisYear}.`);
      return;
    }
    setError(null);
    onSubmit({
      calendar,
      year,
      month,
      day,
      hour,
      minute,
      timeKnown,
      isLeapMonth: calendar === 'lunar' ? isLeapMonth : undefined,
      timezone: city.tz,
      longitude: city.lng,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Calendar toggle */}
      <div className="flex gap-2">
        {(['solar', 'lunar'] as CalendarType[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCalendar(c)}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium capitalize transition ${
              calendar === c
                ? 'border-ink bg-ink text-paper'
                : 'border-ink/15 bg-white text-ink/70 hover:border-ink/30'
            }`}
          >
            {c === 'solar' ? 'Solar (양력)' : 'Lunar (음력)'}
          </button>
        ))}
      </div>

      {/* Date */}
      <div className="grid grid-cols-3 gap-2">
        <Field label="Year">
          <input
            type="number"
            min={1900}
            max={thisYear}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={selectCls}
          />
        </Field>
        <Field label="Month">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={selectCls}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Day">
          <select value={day} onChange={(e) => setDay(Number(e.target.value))} className={selectCls}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {calendar === 'lunar' && (
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={isLeapMonth}
            onChange={(e) => setIsLeapMonth(e.target.checked)}
            className="h-4 w-4 rounded border-ink/30"
          />
          This was a leap month (윤달)
        </label>
      )}

      {/* Time */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={!timeKnown}
            onChange={(e) => setTimeKnown(!e.target.checked)}
            className="h-4 w-4 rounded border-ink/30"
          />
          I don't know my birth time
        </label>
        {timeKnown && (
          <div className="grid grid-cols-2 gap-2">
            <Field label="Hour" hint="(24h)">
              <select value={hour} onChange={(e) => setHour(Number(e.target.value))} className={selectCls}>
                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, '0')} · {to12h(h)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Minute">
              <select value={minute} onChange={(e) => setMinute(Number(e.target.value))} className={selectCls}>
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}
      </div>

      {/* Birthplace */}
      <Field label="Birthplace" hint="(closest city)">
        <CityPicker value={city} onChange={setCity} />
      </Field>

      {error && (
        <p className="rounded-lg bg-fire/10 px-3 py-2 text-sm text-fire" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-1 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-ink/90"
      >
        Reveal my Saju
      </button>
    </form>
  );
}

function to12h(h: number): string {
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${period}`;
}
