import type {
  DamageType,
  ELEMENTS,
  KitProp,
  KitTechnology,
  TravelerKitTechs,
  TravelerTechProp,
} from '../../typeDefs/typeDefs';

export const AMC_TECHS: TravelerKitTechs = {
  BURST_TECHS: [
    {
      gif: 'https://i.imgur.com/v2OWCkz.mp4',
      id: 'cyronadoguoba',
      name: 'Cyronado: Guoba',
    },
    {
      gif: 'https://i.imgur.com/sjEmHjY.gif',
      id: 'cyronadobaron',
      name: 'Cyronado: Baron Bunny',
    },
    {
      gif: 'https://cdn.discordapp.com/attachments/803769761476509726/946588197574561852/amc_q_3_swirls_wall.mp4',
      id: 'stopnado',
      name: 'Stopnado',
    },
  ],
  SKILL_TECHS: [
    {
      gif: 'https://i.imgur.com/QjJzkHg.mp4',
      id: 'frozen_vortex',
      name: 'Frozen Vortex',
    },
  ],
};
export const GMC_TECHS: TravelerKitTechs = {
  BURST_TECHS: [
    {
      gif: 'https://www.reddit.com/r/Genshin_Impact/comments/raxz1e/a_cool_thing_you_can_do_with_geo_travelers/',
      id: 'dragonride',
      name: 'Dragon Ride',
    },
  ],
  SKILL_TECHS: [
    {
      gif: 'https://i.imgur.com/Hwqb8ng.mp4',
      id: 'rockstep',
      name: 'Rock step',
    },
    {
      gif: 'https://i.imgur.com/QIzK4LH.mp4',
      id: 'rockstep_icefire',
      name: 'Rockstep: Ice & Fire',
    },
    {
      gif: 'https://i.imgur.com/mtTFyzo.mp4',
      id: 'rockstep_noelle',
      name: 'Rockstep: Using Noelle',
    },
    {
      gif: 'https://i.imgur.com/R1l9a1e.mp4',
      id: 'phantom_step',
      name: 'Phantom step',
    },
    {
      gif: 'https://i.imgur.com/kUzqUF1.mp4',
      id: 'phantom_step_noelle',
      name: 'Phantom step: Using Noelle',
    },
    {
      gif: 'https://i.imgur.com/1cbBwCr.mp4',
      id: 'phantom_step_diluc',
      name: 'Phantom step: Using Diluc',
    },
    {
      gif: 'https://i.imgur.com/6zhpNF3.mp4',
      id: 'solarstep',
      name: 'Solar Step',
    },
    {
      gif: 'https://i.imgur.com/bF1lrtI.mp4',
      id: 'star_wall',
      name: 'Star Wall',
    },
    {
      gif: 'https://i.imgur.com/1xn1Cd9.mp4',
      id: 'aimrock',
      name: 'Aim Starfell sword',
    },
    {
      gif: 'https://i.imgur.com/5SlIiEk.mp4',
      id: 'wolfdown',
      name: 'Wolf Melt Down',
    },
    {
      gif: 'https://i.imgur.com/MGWptJr.mp4',
      id: 'na_wolfdown',
      name: 'Wolf Melt Down: Using Normal Attack',
    },
  ],
};

export const EMC_TECHS: TravelerKitTechs = {
  BURST_TECHS: [
    {
      gif: 'https://www.reddit.com/r/Genshin_Impact/comments/oqphhp/a_cool_thing_you_can_do_with_electro_travelers/',
      id: 'cope_thunder_balance',
      name: 'Cope-Arts: Balance Upon thundering bellows',
    },
  ],
  SKILL_TECHS: [
    {
      gif: 'https://tenor.com/view/aaaa-gif-22162888',
      id: 'no_techs',
      name: 'No Techs Found',
    },
  ],
};

export const DMC_TECHS: TravelerKitTechs = {
  BURST_TECHS: [
    {
      gif: 'https://tenor.com/view/aaaa-gif-22162888',
      id: 'no_techs',
      name: 'No Techs Found',
    },
  ],
  SKILL_TECHS: [
    {
      gif: 'https://tenor.com/view/aaaa-gif-22162888',
      id: 'no_techs',
      name: 'No Techs Found',
    },
  ],
};

export const AMC_PROPS: TravelerTechProp = {
  shortName: 'amc',
  name: 'Anemo Traveler',
  element: 'anemo',
  description: 'Traveler aligned with the power of Anemo',
  skill: {
    name: 'palm_vortex',
    description: 'Anemo Traveler Skill',
    techs: AMC_TECHS.SKILL_TECHS,
  },
  burst: {
    name: 'gust_surge',
    description: 'Anemo Traveler burst',
    techs: AMC_TECHS.BURST_TECHS,
  },
  guide: 'https://keqingmains.com/anemo-traveler/',
};

export const GMC_PROPS: TravelerTechProp = {
  shortName: 'gmc',
  name: 'Geo Traveler',
  element: 'geo',
  description: 'Traveler aligned with the power of Geo',
  skill: {
    name: 'starfell_sword',
    description: 'Geo Traveler Skill',
    techs: GMC_TECHS.SKILL_TECHS,
  },
  burst: {
    name: 'wake_of_earth',
    description: 'Geo Traveler Burst',
    techs: GMC_TECHS.BURST_TECHS,
  },
  guide: 'https://keqingmains.com/geo-traveler/',
};

export const EMC_PROPS: TravelerTechProp = {
  shortName: 'emc',
  name: 'Electro Traveler',
  element: 'electro',
  description: 'Traveler aligned with the power of Electro',
  skill: {
    name: 'lightning_blade',
    description: 'Electro Traveler Skill',
    techs: EMC_TECHS.SKILL_TECHS,
  },
  burst: {
    name: 'bellowing_thunder',
    description: 'Electro Traveler Burst',
    techs: EMC_TECHS.BURST_TECHS,
  },
  guide: 'https://keqingmains.com/electro-traveler/',
};

export const DMC_PROPS: TravelerTechProp = {
  shortName: 'dmc',
  name: 'Dendro Traveler',
  element: 'dendro',
  description: 'Traveler aligned with the power of Dendro',
  skill: {
    name: 'razor_grass_blade',
    description: 'Dendro Traveler Skill',
    techs: DMC_TECHS.SKILL_TECHS,
  },
  burst: {
    name: 'surgent_manifestation',
    description: 'Dendro Traveler Burst',
    techs: DMC_TECHS.BURST_TECHS,
  },
  guide: 'https://keqingmains.com/dendro-traveler/',
};

const availableProps: {
  [x in ELEMENTS]?: TravelerTechProp;
} = {
  anemo: AMC_PROPS,
  geo: GMC_PROPS,
  electro: EMC_PROPS,
  dendro: DMC_PROPS,
};

export const SKILL_NAMES = Object.values(availableProps).map((prop) => prop.skill.name);

export const BURST_NAMES = Object.values(availableProps).map((prop) => prop.burst.name);

export function isSkill(input: string) {
  return !!SKILL_NAMES.find((name) => name.toLowerCase().includes(input.toLowerCase()));
}
export function isBurst(input: string) {
  return !!BURST_NAMES.find((name) => name.toLowerCase().includes(input.toLowerCase()));
}

interface FindTechArgs {
  element: ELEMENTS;
  type: DamageType;
  id: KitTechnology['id'];
}
type FindPropArgs = Omit<FindTechArgs, 'id'>;
export function getKitProp(options: FindPropArgs): KitProp {
  const { element, type } = options;
  const prop = availableProps[element];

  if (prop) {
    const kitProp = prop[type];
    if (kitProp) {
      return kitProp;
    }
    throw new Error(`Invalid damage type: ${type}\nAllowed types: 'skill', 'burst'`);
  }

  throw new Error(`Props for ${element}-${type} does not exist`, {
    cause: `${element} is not released, thus no props`,
  });
}

export function getTech(options: FindTechArgs) {
  const kit = getKitProp(options);
  return kit.techs.find((tech) => tech.id.toLowerCase().includes(options.id.toLowerCase()));
}

export function getElementProp(element: ELEMENTS) {
  const eleProp = availableProps[element];
  if (eleProp) {
    return eleProp;
  }

  throw new Error(`Element props for ${element} does not exist`, {
    cause: `${element} is not released, thus no props`,
  });
}
