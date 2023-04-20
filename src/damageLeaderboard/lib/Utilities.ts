import { COLORS, EMOJIS, ICONS } from '../../lib/Constants';
import type { ValueOf } from '../../typeDefs/typeDefs';
import type {
  ElementDamageCategories,
  GroupCategoryType,
  LBElements,
} from '../typeDefs/leaderboardTypeDefs';

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
  const possibleElement = element.toLowerCase();

  switch (true) {
    case /\banemo\b/gimu.test(possibleElement):
      return 'anemo';

    case /\bgeo\b/gimu.test(possibleElement):
      return 'geo';

    case /\belectro\b/gimu.test(possibleElement):
      return 'electro';

    case /\bdendro\b/gimu.test(possibleElement):
      return 'dendro';

    case /\buni\b/gimu.test(possibleElement):
      return 'uni';

    default:
      throw new Error(`Invalid element type ${possibleElement}`);
  }
}

export function parseGroupType(groupType: string): GroupCategoryType {
  const possibleGpTp = groupType.toLowerCase();

  switch (true) {
    case /\bopen\b/gimu.test(possibleGpTp):
      return 'open';

    case /\bsolo\b/gimu.test(possibleGpTp):
      return 'solo';

    default:
      throw new Error(`Invalid Group type ${groupType}`);
  }
}

export function extractLinks(str: string) {
  return str.match(
    // eslint-disable-next-line no-useless-escape
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
  );
}

export function parseDamageCategory(element: LBElements): ElementDamageCategories {
  const possibleElement = element.toLowerCase();

  switch (true) {
    case /\banemo\b/gimu.test(possibleElement): {
      return 'anemo-dmg-skill';
    }
    case /\bgeo\b/gimu.test(possibleElement): {
      return 'geo-dmg-skill';
    }
    case /\belectro\b/gimu.test(possibleElement): {
      return 'electro-dmg-skill';
    }
    case /\bdendro\b/gimu.test(possibleElement): {
      return 'dendro-dmg-skill';
    }
    case /\buni\b/gimu.test(possibleElement): {
      return 'uni-dmg-n5';
    }
    default: {
      throw new Error(`This is not a valid element: ${element}`);
    }
  }
}

export function digitEmoji(digit: any) {
  const parsed = digit instanceof Number ? digit : parseInt(digit, 10);
  switch (parsed) {
    case 0:
      return '0️⃣';
    case 1:
      return '1️⃣';
    case 2:
      return '2️⃣';
    case 3:
      return '3️⃣';
    case 4:
      return '4️⃣';
    case 5:
      return '5️⃣';
    case 6:
      return '6️⃣';
    case 7:
      return '7️⃣';
    case 8:
      return '8️⃣';
    case 9:
      return '9️⃣';
    default:
      throw new Error(`Invalid digit provided: ${digit}`);
  }
}
