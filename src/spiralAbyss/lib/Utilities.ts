import { COLORS, EMOJIS, ICONS } from '../../lib/Constants';
import type { SpiralAbyssClearTypes } from '../typeDefs/spiralAbyssTypes';

type ValueOf<T> = T[keyof T];

export type SpiralAbyssProp = {
  icon: ICONS;
  name: string;
  description: string;
  color: COLORS;
  emoji: ValueOf<typeof EMOJIS> | string;
};

export function SAProps(clearType: SpiralAbyssClearTypes): SpiralAbyssProp {
  switch (clearType) {
    case 'traveler':
      return {
        icon: ICONS.SPIRAL_ABYSS,
        name: 'Abyssal Traveler',
        description: 'Cleared Spiral Abyss using Traveler',
        color: COLORS.SPIRAL_ABYSS,
        emoji: '🌀',
      };
    case 'conqueror':
      return {
        icon: ICONS.SPIRAL_ABYSS,
        name: 'Abyssal Conqueror',
        description: 'Cleared Spiral Abyss Using 3 Traveler Teams',
        color: COLORS.SPIRAL_ABYSS,
        emoji: EMOJIS.DvalinHYPE,
      };
    case 'sovereign':
      return {
        icon: ICONS.SPIRAL_ABYSS,
        name: 'Abyssal Sovereign',
        description:
          'Cleared Spiral Abyss Using 4 distinct Traveler Teams with no character repetitions',
        color: COLORS.SPIRAL_ABYSS,
        emoji: EMOJIS.DullBlade,
      };

    default: {
      throw new Error(`Props for ${clearType} does not exist`);
    }
  }
}
