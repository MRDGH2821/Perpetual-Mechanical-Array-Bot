import { COLORS, ICONS } from '../../lib/Constants';
import type { LBElements } from '../typeDefs/leaderboardTypeDefs';

export type LBProp = {
  icon: ICONS;
  name: string;
  color: COLORS;
};

export function leaderboardProps(element: LBElements): LBProp {
  switch (element) {
    case 'uni':
      return {
        icon: ICONS.COPIUM,
        name: "Traveler's Normal Attack 5th hit",
        color: COLORS.UNIVERSAL,
      };
    case 'anemo':
      return {
        icon: ICONS.PALM_VORTEX_AETHER,
        name: 'Palm Vortex - Max storm damage',
        color: COLORS.ANEMO,
      };
    case 'geo':
      return {
        icon: ICONS.STARFELL_SWORD_LUMINE,
        name: 'Starfell Sword',
        color: COLORS.GEO,
      };
    case 'electro':
      return {
        icon: ICONS.LIGHTENING_BLADE_AETHER,
        name: 'Lightening Blade',
        color: COLORS.ELECTRO,
      };
    case 'dendro':
      return {
        icon: ICONS.RAZOR_GRASS_BLADE_AETHER,
        name: 'Razor grass Blade',
        color: COLORS.DENDRO,
      };
    default: {
      throw new Error(`Props for ${element} does not exist`);
    }
  }
}
