// 干支 (Ganzhi) reference data with Korean hangul + romanization.
// Heavenly Stems (천간, 天干) and Earthly Branches (지지, 地支).

export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export interface Stem {
  /** Chinese/Korean character, e.g. 辛 */
  hanja: string;
  /** Korean hangul, e.g. 신 */
  hangul: string;
  /** Latin romanization for global users, e.g. "sin" */
  roman: string;
  element: Element;
  /** true = 양(陽, yang), false = 음(陰, yin) */
  yang: boolean;
}

export interface Branch {
  hanja: string;
  hangul: string;
  roman: string;
  element: Element;
  yang: boolean;
  /** Western zodiac animal name */
  animal: string;
  animalEmoji: string;
}

// Order matters: index used by the 60-gapja cycle.
export const STEMS: Stem[] = [
  { hanja: '甲', hangul: '갑', roman: 'gap', element: 'wood', yang: true },
  { hanja: '乙', hangul: '을', roman: 'eul', element: 'wood', yang: false },
  { hanja: '丙', hangul: '병', roman: 'byeong', element: 'fire', yang: true },
  { hanja: '丁', hangul: '정', roman: 'jeong', element: 'fire', yang: false },
  { hanja: '戊', hangul: '무', roman: 'mu', element: 'earth', yang: true },
  { hanja: '己', hangul: '기', roman: 'gi', element: 'earth', yang: false },
  { hanja: '庚', hangul: '경', roman: 'gyeong', element: 'metal', yang: true },
  { hanja: '辛', hangul: '신', roman: 'sin', element: 'metal', yang: false },
  { hanja: '壬', hangul: '임', roman: 'im', element: 'water', yang: true },
  { hanja: '癸', hangul: '계', roman: 'gye', element: 'water', yang: false },
];

export const BRANCHES: Branch[] = [
  { hanja: '子', hangul: '자', roman: 'ja', element: 'water', yang: true, animal: 'Rat', animalEmoji: '🐀' },
  { hanja: '丑', hangul: '축', roman: 'chuk', element: 'earth', yang: false, animal: 'Ox', animalEmoji: '🐂' },
  { hanja: '寅', hangul: '인', roman: 'in', element: 'wood', yang: true, animal: 'Tiger', animalEmoji: '🐅' },
  { hanja: '卯', hangul: '묘', roman: 'myo', element: 'wood', yang: false, animal: 'Rabbit', animalEmoji: '🐇' },
  { hanja: '辰', hangul: '진', roman: 'jin', element: 'earth', yang: true, animal: 'Dragon', animalEmoji: '🐉' },
  { hanja: '巳', hangul: '사', roman: 'sa', element: 'fire', yang: false, animal: 'Snake', animalEmoji: '🐍' },
  { hanja: '午', hangul: '오', roman: 'o', element: 'fire', yang: true, animal: 'Horse', animalEmoji: '🐎' },
  { hanja: '未', hangul: '미', roman: 'mi', element: 'earth', yang: false, animal: 'Goat', animalEmoji: '🐐' },
  { hanja: '申', hangul: '신', roman: 'sin', element: 'metal', yang: true, animal: 'Monkey', animalEmoji: '🐒' },
  { hanja: '酉', hangul: '유', roman: 'yu', element: 'metal', yang: false, animal: 'Rooster', animalEmoji: '🐓' },
  { hanja: '戌', hangul: '술', roman: 'sul', element: 'earth', yang: true, animal: 'Dog', animalEmoji: '🐕' },
  { hanja: '亥', hangul: '해', roman: 'hae', element: 'water', yang: false, animal: 'Pig', animalEmoji: '🐖' },
];

export const ELEMENT_LABEL: Record<Element, { en: string; hanja: string; hangul: string }> = {
  wood: { en: 'Wood', hanja: '木', hangul: '목' },
  fire: { en: 'Fire', hanja: '火', hangul: '화' },
  earth: { en: 'Earth', hanja: '土', hangul: '토' },
  metal: { en: 'Metal', hanja: '金', hangul: '금' },
  water: { en: 'Water', hanja: '水', hangul: '수' },
};

const STEM_BY_HANJA = new Map(STEMS.map((s) => [s.hanja, s]));
const BRANCH_BY_HANJA = new Map(BRANCHES.map((b) => [b.hanja, b]));

export interface Pillar {
  stem: Stem;
  branch: Branch;
  /** Two-character hanja, e.g. "辛亥" */
  hanja: string;
  /** Hangul, e.g. "신해" */
  hangul: string;
  /** Romanization, e.g. "sinhae" */
  roman: string;
  /** Index in the 60-gapja cycle, 0–59 */
  sexagenaryIndex: number;
}

/** Build a Pillar from a 2-character 干支 string like "辛亥". */
export function pillarFromHanja(ganzhi: string): Pillar {
  const chars = [...ganzhi];
  if (chars.length !== 2) {
    throw new Error(`Invalid ganzhi string: "${ganzhi}"`);
  }
  const stem = STEM_BY_HANJA.get(chars[0]);
  const branch = BRANCH_BY_HANJA.get(chars[1]);
  if (!stem || !branch) {
    throw new Error(`Unknown stem/branch in "${ganzhi}"`);
  }
  return buildPillar(stem, branch);
}

function buildPillar(stem: Stem, branch: Branch): Pillar {
  return {
    stem,
    branch,
    hanja: stem.hanja + branch.hanja,
    hangul: stem.hangul + branch.hangul,
    roman: stem.roman + branch.roman,
    sexagenaryIndex: sexagenaryIndex(stem, branch),
  };
}

/** The 0–59 position of a stem/branch combination in the 60-gapja cycle. */
function sexagenaryIndex(stem: Stem, branch: Branch): number {
  const s = STEMS.indexOf(stem);
  const b = BRANCHES.indexOf(branch);
  // Solve i ≡ s (mod 10), i ≡ b (mod 12), 0 ≤ i < 60.
  for (let i = 0; i < 60; i++) {
    if (i % 10 === s && i % 12 === b) return i;
  }
  /* istanbul ignore next — unreachable for valid stem/branch */
  throw new Error('Invalid stem/branch combination');
}

/** Full ordered list of the 60 gapja, useful for image manifests and tests. */
export const SIXTY_GAPJA: Pillar[] = Array.from({ length: 60 }, (_, i) =>
  buildPillar(STEMS[i % 10], BRANCHES[i % 12]),
);
