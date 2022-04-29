// eslint-disable-next-line no-unused-vars
import { AutocompleteInteraction, Event } from '@ruinguard/core';
import {
  amcAutoComplete,
  emcAutoComplete,
  gmcAutoComplete,
} from '../../lib/TravelerTechnologies.js';

export default new Event({
  event: 'interactionCreate',
  name: 'AMC Techs Auto Complete',
  /**
   * @async
   * @function run
   * @param {AutocompleteInteraction} interaction - interaction object
   */
  async run(interaction) {
    if (interaction.isAutocomplete()) {
      let responses = {};

      if (interaction.commandName === 'amc') {
        responses = await amcAutoComplete(interaction);
      }
      if (interaction.commandName === 'gmc') {
        responses = await gmcAutoComplete(interaction);
      }
      if (interaction.commandName === 'emc') {
        responses = await emcAutoComplete(interaction);
      }

      await interaction.respond(responses);
    }
    // eslint-disable-next-line no-underscore-dangle
    await interaction.client._onInteractionCreate(interaction);
  },
});
