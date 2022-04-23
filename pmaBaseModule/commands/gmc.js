import { SlashCommandBuilder } from '@discordjs/builders';
// eslint-disable-next-line no-unused-vars
import { Command, CommandInteraction } from '@ruinguard/core';
import { GMC_TECHS } from '../../lib/TravelerTechnologies.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('gmc')
    .setDescription('Geo Main Character')
    .addSubcommand((subcommand) => subcommand
      .setName('starfell_sword')
      .setDescription('GMC Skill')
      .addStringOption((option) => option
        .setName('techs')
        .setDescription('Technologies which power skill')
        .setRequired(true)
        .setAutocomplete(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('wake_of_earth')
      .setDescription('GMC Burst')
      .addStringOption((option) => option
        .setName('techs')
        .setDescription('Technologies which power burst')
        .setRequired(true)
        .setAutocomplete(true)))
    .addSubcommand((subcommand) => subcommand.setName('guide').setDescription('Guide on GMC')),

  /**
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    const selectedTechId = interaction.options.getString('techs');
    console.log(selectedTechId);
    switch (interaction.options.getSubcommand()) {
      case 'starfell_sword': {
        const choice = GMC_TECHS.burstTechs.find(
          (tech) => tech.id === selectedTechId,
        );
        await interaction.reply({
          content: `**${choice.name}**\n\n${choice.gif}`,
        });
        break;
      }
      case 'wake_of_earth': {
        const choice = GMC_TECHS.skillTechs.find(
          (tech) => tech.id === selectedTechId,
        );
        await interaction.reply({
          content: `**${choice.name}**\n\n${choice.gif}`,
        });
        break;
      }
      case 'guide': {
        await interaction.reply('https://keqingmains.com/geo-traveler/');
        break;
      }
      // no default
    }
  },
});
