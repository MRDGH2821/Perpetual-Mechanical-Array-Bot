import { pickRandom } from '@sapphire/utilities';
import { COLORS, EMOJIS, ICONS } from '../../lib/Constants';
import type { SpiralAbyssClearTypes } from '../typeDefs/spiralAbyssTypes';

type ValueOf<T> = T[keyof T];

export interface SpiralAbyssProp {
  icon: ICONS;
  name: string;
  description: string;
  color: COLORS;
  emoji: ValueOf<typeof EMOJIS> | string;
}

export function SAProps(clearType: SpiralAbyssClearTypes): SpiralAbyssProp {
  switch (clearType) {
    case 'traveler':
      return {
        icon: ICONS.DULL_BLADE,
        name: 'Abyssal Traveler',
        description: 'Cleared Spiral Abyss using Traveler',
        color: COLORS.SPIRAL_ABYSS,
        emoji: pickRandom(['🌀', EMOJIS.DullBlade]),
      };
    case 'conqueror':
      return {
        icon: ICONS.SILVER_SWORD,
        name: 'Abyssal Conqueror',
        description: 'Cleared Spiral Abyss Using 3 Traveler Teams',
        color: COLORS.SPIRAL_ABYSS,
        emoji: pickRandom([EMOJIS.DvalinHYPE, EMOJIS.SilverSword]),
      };
    case 'sovereign':
      return {
        icon: ICONS.ORIGINAL_SWORD,
        name: 'Abyssal Sovereign',
        description:
          'Cleared Spiral Abyss Using 4 distinct Traveler Teams with no character repetitions',
        color: COLORS.SPIRAL_ABYSS,
        emoji: EMOJIS.OriginalSword,
      };

    default: {
      throw new Error(`Props for ${clearType} does not exist`);
    }
  }
}
