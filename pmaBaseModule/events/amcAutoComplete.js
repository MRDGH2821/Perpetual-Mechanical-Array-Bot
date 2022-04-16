// eslint-disable-next-line no-unused-vars
import { AutocompleteInteraction, Event } from '@ruinguard/core';

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
          // const focused = interaction.options.getFocused();
          const values = [{ name: 'Something', value: 'something' }];
          await interaction.respond(
            values.map((choice) => ({ name: choice.name, value: choice.value })),
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
  },
});
