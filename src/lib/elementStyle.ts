import type { Element } from './ganzhi';

// Static Tailwind class strings (kept whole so the JIT scanner can see them).
export interface ElementStyle {
  /** Solid fill with readable foreground — used for the stem/branch tiles. */
  solid: string;
  /** Soft tinted chip. */
  soft: string;
  /** Foreground text color. */
  text: string;
  /** Border color. */
  border: string;
  /** Hex for inline use (e.g. SVG fallback gradients). */
  hex: string;
}

export const ELEMENT_STYLES: Record<Element, ElementStyle> = {
  wood: {
    solid: 'bg-wood text-white',
    soft: 'bg-wood/10 text-wood',
    text: 'text-wood',
    border: 'border-wood/40',
    hex: '#2f7d52',
  },
  fire: {
    solid: 'bg-fire text-white',
    soft: 'bg-fire/10 text-fire',
    text: 'text-fire',
    border: 'border-fire/40',
    hex: '#c4452f',
  },
  earth: {
    solid: 'bg-earth text-ink',
    soft: 'bg-earth/15 text-[#8a6d22]',
    text: 'text-[#8a6d22]',
    border: 'border-earth/50',
    hex: '#caa14a',
  },
  metal: {
    solid: 'bg-metal text-ink',
    soft: 'bg-metal/15 text-[#5b636c]',
    text: 'text-[#5b636c]',
    border: 'border-metal/50',
    hex: '#9aa3ad',
  },
  water: {
    solid: 'bg-water text-white',
    soft: 'bg-water/10 text-water',
    text: 'text-water',
    border: 'border-water/40',
    hex: '#2b3a67',
  },
};
