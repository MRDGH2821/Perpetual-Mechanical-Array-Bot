import { SlashCommandBuilder } from '@discordjs/builders';
// eslint-disable-next-line no-unused-vars
import { Command, CommandInteraction } from '@ruinguard/core';
import { EMC_TECHS } from '../../lib/TravelerTechnologies.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('emc')
    .setDescription('Electro Main Character')
    .addSubcommand((subcommand) => subcommand
      .setName('bellowing_thunder')
      .setDescription('EMC Burst')
      .addStringOption((option) => option
        .setName('techs')
        .setDescription('Technologies which power burst')
        .setRequired(true)
        .setAutocomplete(true)))
    .addSubcommand((subcommand) => subcommand.setName('guide').setDescription('Guide on AMC')),

  /**
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    const selectedTechId = interaction.options.getString('techs');
    switch (interaction.options.getSubcommand()) {
      case 'bellowing_thunder': {
        const choice = EMC_TECHS.BURST_TECHS.find(
          (tech) => tech.id === selectedTechId,
        );
        await interaction.reply({
          content: `**${choice.name}**\n\n${choice.gif}`,
        });
        break;
      }
      case 'guide': {
        await interaction.reply('https://keqingmains.com/electro-traveler/');
        break;
      }
      // no default
    }
  },
});
