import { describe, it, expect } from 'vitest';
import {
  STEMS,
  BRANCHES,
  SIXTY_GAPJA,
  pillarFromHanja,
  type Pillar,
} from './ganzhi';

describe('ganzhi reference data', () => {
  it('has 10 stems and 12 branches', () => {
    expect(STEMS).toHaveLength(10);
    expect(BRANCHES).toHaveLength(12);
  });

  it('romanizes 辛亥 to "sinhae" (matches the spec example)', () => {
    const p = pillarFromHanja('辛亥');
    expect(p.roman).toBe('sinhae');
    expect(p.hangul).toBe('신해');
    expect(p.hanja).toBe('辛亥');
  });

  it('places 甲子 at index 0 of the 60-gapja cycle', () => {
    const p = pillarFromHanja('甲子');
    expect(p.sexagenaryIndex).toBe(0);
    expect(p.roman).toBe('gapja');
  });

  it('places 辛亥 at index 47', () => {
    expect(pillarFromHanja('辛亥').sexagenaryIndex).toBe(47);
  });

  it('exposes element and yin/yang for the day stem', () => {
    const p = pillarFromHanja('辛亥');
    expect(p.stem.element).toBe('metal');
    expect(p.stem.yang).toBe(false); // 辛 is yin metal
    expect(p.branch.animal).toBe('Pig'); // 亥
  });

  it('rejects malformed input', () => {
    expect(() => pillarFromHanja('辛')).toThrow();
    expect(() => pillarFromHanja('XX')).toThrow();
  });
});

describe('60 gapja cycle', () => {
  it('contains exactly 60 unique combinations', () => {
    expect(SIXTY_GAPJA).toHaveLength(60);
    const keys = new Set(SIXTY_GAPJA.map((p: Pillar) => p.hanja));
    expect(keys.size).toBe(60);
  });

  it('assigns each entry its own index in order', () => {
    SIXTY_GAPJA.forEach((p, i) => expect(p.sexagenaryIndex).toBe(i));
  });

  it('uses unique romanization keys (safe for image filenames)', () => {
    const romans = new Set(SIXTY_GAPJA.map((p) => p.roman));
    expect(romans.size).toBe(60);
  });
});
