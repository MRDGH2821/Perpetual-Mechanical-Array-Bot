import { SlashCommandBuilder } from '@discordjs/builders';
// eslint-disable-next-line no-unused-vars
import { Command, CommandInteraction } from '@ruinguard/core';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('emc')
    .setDescription('Electro Main Character')
    .addSubcommand((subcommand) => subcommand.setName('guide').setDescription('Guide on AMC')),

  /**
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'guide': {
        await interaction.reply('https://keqingmains.com/electro-traveler/');
        break;
      }
      // no default
    }
  },
});
