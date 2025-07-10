import { pickRandom } from "@sapphire/utilities";
import { COLORS, EMOJIS, EMOJIS2, ICONS } from "../../lib/Constants.js";
import type { ELEMENTS, ValueOf } from "../../typeDefs/typeDefs.js";

export type CrownProp = {
  color: COLORS;
  description: string;
  emoji: ValueOf<typeof EMOJIS>;
  icon: ICONS;
  name: string;
  plural: string;
};

export function crownProps(element: ELEMENTS): CrownProp {
  switch (element) {
    case "unaligned":
      return {
        icon: pickRandom([ICONS.VOID, ICONS.ORIGINAL_SWORD]),
        name: "Arbitrator of Fate",
        description: `*These people are the true & attentive MC Mains...*

They went extra mile to crown Unaligned Traveler in Archon Quest Chapter 2: Prologue - Autumn Winds, Scarlet Leaves

***Never** question their Hard work, Dedication ~~& Mora..~~* 
`,
        color: COLORS.UNALIGNED,
        emoji: pickRandom([EMOJIS.Copium, EMOJIS.OriginalSword, EMOJIS2.Void]),
        plural: "Arbitrators of Fate",
      };
    case "anemo":
      return {
        icon: ICONS.ANEMO,
        name: "Herrscher of Wind",
        description: "*Prepare to get blown away!*",
        color: COLORS.ANEMO,
        emoji: EMOJIS.Anemo,
        plural: "Herrscher of Wind",
      };
    case "geo":
      return {
        icon: ICONS.GEO,
        name: "Jūnzhǔ of Earth",
        description: "*Shock waves underneath your feet!*",
        color: COLORS.GEO,
        emoji: EMOJIS.Geo,
        plural: "Jūnzhǔ of Earth",
      };
    case "electro":
      return {
        icon: ICONS.ELECTRO,
        name: "Ten'nō of Thunder",
        description: "*Get Electrocuted!*",
        color: COLORS.ELECTRO,
        emoji: EMOJIS.Electro,
        plural: "Ten'nō of Thunder",
      };
    case "dendro":
      return {
        icon: ICONS.DENDRO,
        name: "Raja of Evergreens",
        description: "*Feel the (razor) Grass!*",
        color: COLORS.DENDRO,
        emoji: EMOJIS.Dendro,
        plural: "Rajas of Evergreens",
      };
    case "hydro":
      return {
        icon: ICONS.HYDRO,
        name: "Monarque of Tides",
        color: COLORS.HYDRO,
        description: "Feel the Tides' Awakening!",
        emoji: EMOJIS.Hydro,
        plural: "Monarques of Tides",
      };
    case "cryo": {
      throw new Error('Not implemented yet: "cryo" case');
    }

    case "pyro": {
      throw new Error('Not implemented yet: "pyro" case');
    }

    case "uni": {
      throw new Error('Not implemented yet: "uni" case');
    }

    default: {
      throw new Error(`Props for ${element} does not exist`);
    }
  }
}
