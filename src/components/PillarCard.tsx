import type { Pillar } from '../lib/ganzhi';
import { ELEMENT_LABEL } from '../lib/ganzhi';
import { ELEMENT_STYLES } from '../lib/elementStyle';

interface Props {
  label: string;
  korean: string;
  pillar: Pillar | null;
  highlight?: boolean;
}

function Glyph({
  hanja,
  hangul,
  roman,
  element,
}: {
  hanja: string;
  hangul: string;
  roman: string;
  element: Pillar['stem']['element'];
}) {
  const s = ELEMENT_STYLES[element];
  return (
    <div className={`flex flex-col items-center rounded-xl px-2 py-3 ${s.solid}`}>
      <span className="font-serif text-3xl leading-none sm:text-4xl">{hanja}</span>
      <span className="mt-1 text-xs font-medium opacity-90">{hangul}</span>
      <span className="text-[11px] uppercase tracking-wide opacity-80">{roman}</span>
    </div>
  );
}

export default function PillarCard({ label, korean, pillar, highlight }: Props) {
  return (
    <div
      className={`flex flex-col rounded-2xl border bg-white/70 p-3 text-center shadow-sm ${
        highlight ? 'border-ink/30 ring-2 ring-ink/15' : 'border-ink/10'
      }`}
    >
      <div className="mb-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink/60">
          {label}
        </div>
        <div className="font-serif text-sm text-ink/40">{korean}</div>
      </div>

      {pillar ? (
        <div className="flex flex-col gap-1.5">
          <Glyph
            hanja={pillar.stem.hanja}
            hangul={pillar.stem.hangul}
            roman={pillar.stem.roman}
            element={pillar.stem.element}
          />
          <Glyph
            hanja={pillar.branch.hanja}
            hangul={pillar.branch.hangul}
            roman={pillar.branch.roman}
            element={pillar.branch.element}
          />
          <div className="mt-1 text-[11px] text-ink/50">
            {ELEMENT_LABEL[pillar.stem.element].en} · {pillar.branch.animal}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center py-6 text-sm text-ink/40">
          Unknown
          <br />
          (no birth time)
        </div>
      )}
    </div>
  );
}
