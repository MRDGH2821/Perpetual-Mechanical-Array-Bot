// eslint-disable-next-line no-unused-vars
import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import { AMCTechs } from '../lib/TravelerTechnologies.js';
import { Command } from '@ruinguard/core';
import { SlashCommandBuilder } from '@discordjs/builders';

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
   * show amc techs & guide
   * @function run
   * @param {CommandInteraction | AutocompleteInteraction} interaction - interaction object
   * @returns {Promise<void>} - interaction promise object
   */
  // eslint-disable-next-line consistent-return
  async run(interaction) {
    switch (interaction.options.getSubcommand()) {
    case 'gust_surge': {
      const selectedID = interaction.options.getString('techs'),
        skill = AMCTechs.burstTechs.find((tech) => tech.id === selectedID);
      console.log(selectedID);
      await interaction.reply({
        content: `**${skill.name}**\n\n${skill.gif}`
      });
      break;
    }
    case 'palm_vortex': {
      const selectedID = interaction.options.getString('techs'),
        skill = AMCTechs.skillTechs.find((tech) => tech.id === selectedID);
      console.log(selectedID);
      await interaction.reply({
        content: `**${skill.name}**\n\n${skill.gif}`
      });
      break;
    }
    case 'guide': {
      await interaction.reply('https://keqingmains.com/anemo-traveler/');
      break;
    }
      // no default
    }
  }
});
