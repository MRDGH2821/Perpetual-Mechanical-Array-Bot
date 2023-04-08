import { TravelerCommandProp } from '../botTypes/types';

export const AMC_TECHS = {
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
export const GMC_TECHS = {
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

export const EMC_TECHS = {
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

export const DMC_TECHS = {
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

export const AMC_PROPS: TravelerCommandProp = {
  shortName: 'amc',
  name: 'Anemo Traveler',
  element: 'anemo',
  skill: {
    name: 'palm_vortex',
    techs: AMC_TECHS.SKILL_TECHS,
  },
  burst: {
    name: 'gust_surge',
    techs: AMC_TECHS.BURST_TECHS,
  },
  guide: 'https://keqingmains.com/anemo-traveler/',
};

export const GMC_PROPS: TravelerCommandProp = {
  shortName: 'gmc',
  name: 'Geo Traveler',
  element: 'geo',
  skill: {
    name: 'starfell_sword',
    techs: GMC_TECHS.SKILL_TECHS,
  },
  burst: {
    name: 'wake_of_earth',
    techs: GMC_TECHS.BURST_TECHS,
  },
  guide: 'https://keqingmains.com/geo-traveler/',
};

export const EMC_PROPS: TravelerCommandProp = {
  shortName: 'emc',
  name: 'Electro Traveler',
  element: 'electro',
  skill: {
    name: 'lightening_blade',
    techs: EMC_TECHS.SKILL_TECHS,
  },
  burst: {
    name: 'bellowing_thunder',
    techs: EMC_TECHS.BURST_TECHS,
  },
  guide: 'https://keqingmains.com/electro-traveler/',
};

export const DMC_PROPS: TravelerCommandProp = {
  shortName: 'dmc',
  name: 'Dendro Traveler',
  element: 'dendro',
  skill: {
    name: 'razor_grass_blade',
    techs: DMC_TECHS.SKILL_TECHS,
  },
  burst: {
    name: 'surgent_manifestation ',
    techs: DMC_TECHS.BURST_TECHS,
  },
  guide: 'https://keqingmains.com/dendro-traveler/',
};