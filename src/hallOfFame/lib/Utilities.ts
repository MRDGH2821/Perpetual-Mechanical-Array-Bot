import { COLORS, EMOJIS, ICONS } from '../../lib/Constants';
import type { ELEMENTS } from '../../typeDefs/typeDefs';

type ValueOf<T> = T[keyof T];

export type CrownProp = {
  icon: ICONS;
  name: string;
  description: string;
  color: COLORS;
  emoji: ValueOf<typeof EMOJIS>;
};

export function crownProps(element: ELEMENTS): CrownProp {
  switch (element) {
    case 'unaligned':
      return {
        icon: ICONS.VOID,
        name: 'Arbitrator of Fate',
        description: `*These people are the true & attentive MC Mains...*

They went extra mile to crown Unaligned Traveler in Archon Quest Chapter 2: Prologue - Autumn Winds, Scarlet Leaves

***Never** question their Hard work, Dedication ~~& Mora..~~* 
`,
        color: COLORS.UNALIGNED,
        emoji: EMOJIS.Void,
      };

    case 'anemo':
      return {
        icon: ICONS.PALM_VORTEX_AETHER,
        name: 'Herrscher of Wind',
        description: '*Prepare to grt blown away!*',
        color: COLORS.ANEMO,
        emoji: EMOJIS.Anemo,
      };
    case 'geo':
      return {
        icon: ICONS.STARFELL_SWORD_LUMINE,
        name: 'Junzhu of Earth',
        description: '*Shock waves underneath your feet!*',
        color: COLORS.GEO,
        emoji: EMOJIS.Geo,
      };

    case 'electro':
      return {
        icon: ICONS.LIGHTENING_BLADE_AETHER,
        name: "Ten'no of Thunder",
        description: '*Got Electrocuted?*',
        color: COLORS.ELECTRO,
        emoji: EMOJIS.Electro,
      };
    case 'dendro':
      return {
        icon: ICONS.RAZOR_GRASS_BLADE_AETHER,
        name: 'Raja of Evergreens',
        description: '*Feel the (razor) Grass!*',
        color: COLORS.DENDRO,
        emoji: EMOJIS.Dendro,
      };
    default: {
      throw new Error(`Props for ${element} does not exist`);
    }
  }
}
