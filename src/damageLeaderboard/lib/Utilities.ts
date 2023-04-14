import { COLORS, ICONS } from '../../lib/Constants';
import type { ELEMENTS } from '../../typeDefs/typeDefs';

export type LBProp = {
  icon: ICONS;
  description: string;
  color: COLORS;
};

export function leaderboardProps(element: ELEMENTS): LBProp {
  switch (element) {
    case 'uni':
      return {
        icon: ICONS.COPIUM,
        description: "Traveler's Normal Attack 5th hit",
        color: COLORS.UNIVERSAL,
      };
    case 'anemo':
      return {
        icon: ICONS.PALM_VORTEX_AETHER,
        description: 'Palm Vortex - Max storm damage',
        color: COLORS.ANEMO,
      };
    case 'geo':
      return {
        icon: ICONS.STARFELL_SWORD_LUMINE,
        description: 'Starfell Sword',
        color: COLORS.GEO,
      };
    case 'electro':
      return {
        icon: ICONS.LIGHTENING_BLADE_AETHER,
        description: 'Lightening Blade',
        color: COLORS.ELECTRO,
      };
    case 'dendro':
      return {
        icon: ICONS.RAZOR_GRASS_BLADE_AETHER,
        description: 'Razor grass Blade',
        color: COLORS.DENDRO,
      };
    default: {
      throw new Error(`Props for ${element} does not exist`);
    }
  }
}
