import { COLORS, EMOJIS, ICONS } from '../../lib/Constants';
import type { ELEMENTS } from '../../typeDefs/typeDefs';

type ValueOf<T> = T[keyof T];

export type CrownProp = {
  icon: ICONS;
  name: string;
  description: string;
  color: COLORS;
  emoji: ValueOf<typeof EMOJIS>;
  plural: string;
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
        plural: 'Arbitrators of Fate',
      };
    case 'anemo':
      return {
        icon: ICONS.PALM_VORTEX_AETHER,
        name: 'Herrscher of Wind',
        description: '*Prepare to get blown away!*',
        color: COLORS.ANEMO,
        emoji: EMOJIS.Anemo,
        plural: 'Herrscher of Wind',
      };
    case 'geo':
      return {
        icon: ICONS.STARFELL_SWORD_LUMINE,
        name: 'Jūnzhǔ of Earth',
        description: '*Shock waves underneath your feet!*',
        color: COLORS.GEO,
        emoji: EMOJIS.Geo,
        plural: 'Jūnzhǔ of Earth',
      };
    case 'electro':
      return {
        icon: ICONS.LIGHTENING_BLADE_AETHER,
        name: "Ten'nō of Thunder",
        description: '*Get Electrocuted!*',
        color: COLORS.ELECTRO,
        emoji: EMOJIS.Electro,
        plural: "Ten'nō of Thunder",
      };
    case 'dendro':
      return {
        icon: ICONS.RAZOR_GRASS_BLADE_AETHER,
        name: 'Raja of Evergreens',
        description: '*Feel the (razor) Grass!*',
        color: COLORS.DENDRO,
        emoji: EMOJIS.Dendro,
        plural: 'Rajas of Evergreens',
      };
    default: {
      throw new Error(`Props for ${element} does not exist`);
    }
  }
}
