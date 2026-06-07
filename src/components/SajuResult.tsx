import { useEffect, useState } from 'react';
import type { SajuResult as SajuResultData } from '../lib/saju';
import { ELEMENT_LABEL } from '../lib/ganzhi';
import { ELEMENT_STYLES } from '../lib/elementStyle';
import { logResultView } from '../lib/log';
import PillarCard from './PillarCard';
import DayPillarImage from './DayPillarImage';

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fmtTime(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function SajuResult({
  data,
  onReset,
}: {
  data: SajuResultData;
  onReset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const { dayPillar } = data;
  const stemStyle = ELEMENT_STYLES[dayPillar.stem.element];

  useEffect(() => {
    logResultView();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Headline: the Day Pillar in Korean romanization */}
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
          Your Day Pillar · 일주 (Ilju)
        </p>
        <h2 className="mt-2 font-serif text-5xl font-black tracking-tight text-ink sm:text-6xl">
          {cap(dayPillar.roman)}
        </h2>
        <p className="mt-1 font-serif text-xl text-ink/50">
          {dayPillar.hangul} · {dayPillar.hanja}
        </p>
        <p className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-medium ${stemStyle.soft}`}>
          {dayPillar.stem.yang ? 'Yang' : 'Yin'}{' '}
          {ELEMENT_LABEL[dayPillar.stem.element].en} {dayPillar.branch.animal}{' '}
          {dayPillar.branch.animalEmoji}
        </p>
      </div>

      {/* Four Pillars */}
      <div>
        <h3 className="mb-2 text-center text-sm font-semibold uppercase tracking-wide text-ink/60">
          Four Pillars · 사주팔자
        </h3>
        {/* Displayed right-to-left in the traditional order: Hour · Day · Month · Year */}
        <div className="grid grid-cols-4 gap-2">
          <PillarCard label="Hour" korean="시주" pillar={data.hourPillar} />
          <PillarCard label="Day" korean="일주" pillar={data.dayPillar} highlight />
          <PillarCard label="Month" korean="월주" pillar={data.monthPillar} />
          <PillarCard label="Year" korean="년주" pillar={data.yearPillar} />
        </div>
      </div>

      {/* Artwork */}
      <DayPillarImage pillar={dayPillar} />

      {/* Transparency: how we corrected the time */}
      <div className="rounded-xl border border-ink/10 bg-white/50 text-sm">
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-ink/70"
        >
          How this was calculated
          <span className="text-ink/40">{showDetails ? '−' : '+'}</span>
        </button>
        {showDetails && (
          <dl className="space-y-1.5 border-t border-ink/10 px-4 py-3 text-ink/70">
            <Row
              label="Birth date (solar)"
              value={`${data.gregorian.year}-${String(data.gregorian.month).padStart(2, '0')}-${String(
                data.gregorian.day,
              ).padStart(2, '0')}`}
            />
            <Row
              label="True solar time used"
              value={fmtTime(data.correction.wall.hour, data.correction.wall.minute)}
            />
            <Row
              label="Longitude correction"
              value={`${signed(data.correction.longitudeOffsetMinutes - data.correction.zoneOffsetMinutes)} min`}
            />
            <Row
              label="Equation of time"
              value={`${signed(data.correction.equationOfTimeMinutes)} min`}
            />
            <Row label="Day boundary" value="Zi hour begins at 23:00 (자시)" />
            <p className="pt-1 text-xs text-ink/45">
              Corrected to the true solar time at your birthplace, including historical
              daylight-saving rules. The Day Pillar is the focus; Year/Month pillars use
              the solar-term calendar and may shift near a term boundary.
            </p>
          </dl>
        )}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="rounded-xl border border-ink/20 px-4 py-3 text-sm font-semibold text-ink transition hover:bg-ink/5"
      >
        Calculate another
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink/50">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function signed(n: number): string {
  const r = Math.round(n);
  return r > 0 ? `+${r}` : `${r}`;
}
