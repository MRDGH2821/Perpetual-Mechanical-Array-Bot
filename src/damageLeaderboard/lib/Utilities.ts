import { COLORS, EMOJIS, ICONS } from '../../lib/Constants';
import type { ValueOf } from '../../typeDefs/typeDefs';
import type {
  ElementDamageCategories,
  GroupCategoryType,
  LBElements,
} from '../typeDefs/leaderboardTypeDefs';
import { LEADERBOARD_ELEMENTS } from './Constants';

export type LBProp = {
  icon: ICONS;
  name: string;
  color: COLORS;
  emoji: ValueOf<typeof EMOJIS>;
};

export function leaderboardProps(element: LBElements): LBProp {
  switch (element) {
    case 'uni':
      return {
        icon: ICONS.COPIUM,
        name: "Traveler's Normal Attack 5th hit",
        color: COLORS.UNIVERSAL,
        emoji: EMOJIS.Copium,
      };
    case 'anemo':
      return {
        icon: ICONS.PALM_VORTEX_AETHER,
        name: 'Palm Vortex - Max storm damage',
        color: COLORS.ANEMO,
        emoji: EMOJIS.Anemo,
      };
    case 'geo':
      return {
        icon: ICONS.STARFELL_SWORD_LUMINE,
        name: 'Starfell Sword',
        color: COLORS.GEO,
        emoji: EMOJIS.Geo,
      };
    case 'electro':
      return {
        icon: ICONS.LIGHTENING_BLADE_AETHER,
        name: 'Lightening Blade',
        color: COLORS.ELECTRO,
        emoji: EMOJIS.Electro,
      };
    case 'dendro':
      return {
        icon: ICONS.RAZOR_GRASS_BLADE_AETHER,
        name: 'Razor grass Blade',
        color: COLORS.DENDRO,
        emoji: EMOJIS.Dendro,
      };
    default: {
      throw new Error(`Props for ${element} does not exist`);
    }
  }
}

export function parseElement(element: string): LBElements {
  const possibleElement = element.toLowerCase() as LBElements;

  if (LEADERBOARD_ELEMENTS.includes(possibleElement)) {
    return possibleElement;
  }
  throw new Error(`Invalid element type ${element}`);
}

export function parseGroupType(groupType: string): GroupCategoryType {
  const possibleGpTp = groupType.toLowerCase() as GroupCategoryType;

  const validType: GroupCategoryType[] = ['open', 'solo'];

  if (validType.includes(possibleGpTp)) {
    return possibleGpTp;
  }
  throw new Error(`Invalid Group type ${groupType}`);
}

export function extractLinks(str: string) {
  return str.match(
    // eslint-disable-next-line no-useless-escape
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
  );
}

export function parseDamageCategory(element: LBElements): ElementDamageCategories {
  const possibleElement = element.toLowerCase();

  switch (possibleElement) {
    case 'anemo': {
      return 'anemo-dmg-skill';
    }
    case 'geo': {
      return 'geo-dmg-skill';
    }
    case 'electro': {
      return 'electro-dmg-skill';
    }
    case 'dendro': {
      return 'dendro-dmg-skill';
    }
    case 'uni': {
      return 'uni-dmg-n5';
    }
    default: {
      throw new Error(`This is not a valid element: ${element}`);
    }
  }
}
