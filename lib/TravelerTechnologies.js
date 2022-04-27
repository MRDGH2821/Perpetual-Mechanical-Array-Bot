// eslint-disable-next-line no-unused-vars
import { AutocompleteInteraction } from '@ruinguard/core';

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
};

/**
 * Auto complete loader for AMC
 * @async
 * @function amcAutoComplete
 * @param {AutocompleteInteraction} interaction - interaction object
 */
export async function amcAutoComplete(interaction) {
  console.log('Loading AMC autocomplete');
  const focused = await interaction.options.getFocused();
  let responses = {};
  switch (interaction.options.getSubcommand()) {
    case 'palm_vortex': {
      console.log('Loading palm vortex');

      const values = AMC_TECHS.SKILL_TECHS.filter((choice) => choice.name.startsWith(focused));
      responses = values.map((choice) => ({
        name: choice.name,
        value: choice.id,
      }));

      break;
    }
    case 'gust_surge': {
      console.log('Loading gust surge');

      const values = AMC_TECHS.BURST_TECHS.filter((choice) => choice.name.startsWith(focused));
      responses = values.map((choice) => ({
        name: choice.name,
        value: choice.id,
      }));
      break;
    }
    // no default
  }
  return responses;
}

/**
 * Auto complete loader for GMC
 * @async
 * @function gmcAutoComplete
 * @param {AutocompleteInteraction} interaction - interaction object
 */
export async function gmcAutoComplete(interaction) {
  console.log('Loading GMC autocomplete');
  const focused = interaction.options.getFocused();
  let responses = {};
  switch (interaction.options.getSubcommand()) {
    case 'starfell_sword': {
      console.log('Loading starfell sword');

      const values = GMC_TECHS.SKILL_TECHS.filter((choice) => choice.name.startsWith(focused));
      responses = values.map((choice) => ({
        name: choice.name,
        value: choice.id,
      }));

      break;
    }
    case 'wake_of_earth': {
      console.log('Loading wake of earth');
      const values = GMC_TECHS.BURST_TECHS.filter((choice) => choice.name.startsWith(focused));
      responses = values.map((choice) => ({
        name: choice.name,
        value: choice.id,
      }));
      break;
    }
    // no default
  }
  return responses;
}

/**
 * Auto complete loader for EMC
 * @async
 * @function emcAutoComplete
 * @param {AutocompleteInteraction} interaction - interaction object
 */
export async function emcAutoComplete(interaction) {
  console.log('Loading EMC autocomplete');
  const focused = interaction.options.getFocused();
  let responses = {};
  switch (interaction.options.getSubcommand()) {
    case 'bellowing_thunder': {
      console.log('Loading bellowing thunder');
      const values = EMC_TECHS.BURST_TECHS.filter((choice) => choice.name.startsWith(focused));
      responses = values.map((choice) => ({
        name: choice.name,
        value: choice.id,
      }));
      break;
    }
    // no default
  }
  return responses;
}
