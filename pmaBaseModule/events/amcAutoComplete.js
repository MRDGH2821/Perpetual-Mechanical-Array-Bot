// eslint-disable-next-line no-unused-vars
import { AutocompleteInteraction, Event } from '@ruinguard/core';
import { AMC_TECHS } from '../../lib/TravelerTechnologies.js';

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
      console.log('Loading AMC autocomplete');
      switch (interaction.options.getSubcommand()) {
        case 'palm_vortex': {
          console.log('Loading palm vortex');
          const focused = interaction.options.getFocused();
          const values = AMC_TECHS.skillTechs.filter((choice) => choice.name.startsWith(focused));
          await interaction.respond(
            values.map((choice) => ({
              name: choice.name,
              value: choice.id,
            })),
          );
          break;
        }
        case 'gust_surge': {
          console.log('Loading gust surge');
          const focusedVal = interaction.options.getFocused();
          const values = AMC_TECHS.burstTechs.filter((choice) => choice.name.startsWith(focusedVal));
          await interaction.respond(
            values.map((choice) => ({
              name: choice.name,
              value: choice.id,
            })),
          );
          break;
        }
        default: {
          console.log('There are no techs');
          const values = [{ name: 'No techs found.' }];
          await interaction.respond(
            values.map((choice) => ({ name: choice.name, value: choice.name })),
          );
          break;
        }
      }
    }

    // eslint-disable-next-line no-underscore-dangle
    await interaction.client._onInteractionCreate(interaction);
  },
});
