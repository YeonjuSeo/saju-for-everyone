import { useState } from 'react';
import type { Pillar } from '../lib/ganzhi';
import { ELEMENT_LABEL } from '../lib/ganzhi';
import { ELEMENT_STYLES } from '../lib/elementStyle';
import { imageKeyFor } from '../lib/saju';
import { ILJU_IMAGES } from '../data/iljuImages';

/**
 * Shows the artwork for a given Day Pillar (60-gapja).
 * Resolves the file from the auto-generated manifest (any extension, original
 * 한글(한자) filename). If none exists, renders a styled fallback built from the
 * pillar's elements + zodiac animal — so the site looks complete before all 60
 * illustrations are produced.
 */
export default function DayPillarImage({ pillar }: { pillar: Pillar }) {
  const [errored, setErrored] = useState(false);
  const file = ILJU_IMAGES[imageKeyFor(pillar)];
  const src = file ? `${import.meta.env.BASE_URL}${file}` : null;

  const stemEl = ELEMENT_STYLES[pillar.stem.element];
  const branchEl = ELEMENT_STYLES[pillar.branch.element];

  return (
    <figure className="overflow-hidden rounded-2xl border border-ink/10 bg-white/70 shadow-sm">
      <div className="relative aspect-[4/3] w-full">
        {src && !errored ? (
          <img
            src={src}
            alt={`Illustration for the ${pillar.roman} (${pillar.hanja}) day pillar`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setErrored(true)}
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${stemEl.hex} 0%, ${branchEl.hex} 100%)`,
            }}
            aria-label={`Placeholder for the ${pillar.roman} day pillar`}
          >
            <span className="text-6xl drop-shadow-sm sm:text-7xl">
              {pillar.branch.animalEmoji}
            </span>
            <span className="mt-2 font-serif text-4xl text-white/95 drop-shadow">
              {pillar.hanja}
            </span>
          </div>
        )}
      </div>
      <figcaption className="flex items-center justify-between gap-2 px-4 py-3 text-sm">
        <span className="font-serif text-base capitalize text-ink">
          {pillar.roman}{' '}
          <span className="text-ink/40">
            {pillar.hangul} · {pillar.hanja}
          </span>
        </span>
        <span className="text-ink/50">
          {ELEMENT_LABEL[pillar.stem.element].en} {pillar.branch.animal}
        </span>
      </figcaption>
    </figure>
  );
}
