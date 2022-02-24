import { Command } from '@ruinguard/core';
// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const cmd = new SlashCommandBuilder()
  .setName('amc')
  .setDescription('Anemo Main Character')
  .addSubcommand((subcommand) => subcommand
    .setName('gust_surge')
    .setDescription('AMC Burst')
    .addStringOption((option) => option
      .setName('techs')
      .setDescription('Technologies which power burst')
      .setRequired(true)
      .addChoice('Cyronado: Guoba', 'cyronadoguoba')
      .addChoice('Cyronado: Baron Bunny', 'cyronadobaron')))
  .addSubcommand((subcommand) => subcommand.setName('guide').setDescription('Guide on AMC'));

export default new Command({
  data: cmd,

  /**
   * show amc techs & guide
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    await interaction.deferReply();
    switch (await interaction.options.getSubcommand()) {
    case 'gust_surge': {
      const option = interaction.options.getString('techs');
      let gif = '',
        name = '';
      switch (option) {
      case 'cyronadoguoba': {
        gif = 'https://i.imgur.com/v2OWCkz.mp4';
        name = 'Cyronado: Guoba';
        break;
      }
      case 'cyronadobaron': {
        gif = 'https://i.imgur.com/sjEmHjY.gif';
        name = 'Cyronado: Baron Bunny';
        break;
      }
          // no default
      }
      await interaction.editReply({
        content: `**${name}**\n\n${gif}`
      });
      break;
    }
    case 'guide': {
      await interaction.editReply('https://keqingmains.com/anemo-traveler/');
      break;
    }
      // no default
    }
  }
});
