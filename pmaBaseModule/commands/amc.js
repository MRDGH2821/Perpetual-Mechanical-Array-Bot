import { SlashCommandBuilder } from '@discordjs/builders';
// eslint-disable-next-line no-unused-vars
import { Command, CommandInteraction } from '@ruinguard/core';
import { AMC_TECHS } from '../../lib/TravelerTechnologies.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('amc')
    .setDescription('Anemo Main Character')
    .addSubcommand((subcommand) => subcommand
      .setName('palm_vortex')
      .setDescription('AMC Skill')
      .addStringOption((option) => option
        .setName('techs')
        .setDescription('Technologies which power skill')
        .setRequired(true)
        .setAutocomplete(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('gust_surge')
      .setDescription('AMC Burst')
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
    console.log(selectedTechId);
    switch (interaction.options.getSubcommand()) {
      case 'gust_surge': {
        const choice = AMC_TECHS.burstTechs.find(
          (tech) => tech.id === selectedTechId,
        );
        await interaction.reply({
          content: `**${choice.name}**\n\n${choice.gif}`,
        });
        break;
      }
      case 'palm_vortex': {
        const choice = AMC_TECHS.skillTechs.find(
          (tech) => tech.id === selectedTechId,
        );
        await interaction.reply({
          content: `**${choice.name}**\n\n${choice.gif}`,
        });
        break;
      }
      case 'guide': {
        await interaction.reply('https://keqingmains.com/anemo-traveler/');
        break;
      }
      // no default
    }
  },
});
