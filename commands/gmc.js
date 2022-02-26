// eslint-disable-next-line no-unused-vars
import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import { Command } from '@ruinguard/core';
import { GMCTechs } from '../lib/TravelerTechnologies.js';
import { SlashCommandBuilder } from '@discordjs/builders';

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
    .addSubcommand((subcommand) => subcommand.setName('guide').setDescription('Guide on GMC')),

  /**
   * displays GMC techs & guide
   * @function run
   * @param {CommandInteraction | AutocompleteInteraction} interaction - interaction object
   * @returns {Promise<void>} - interaction promise object
   */
  // eslint-disable-next-line consistent-return
  run(interaction) {
    if (interaction.isAutocomplete()) {
      const focusedVal = interaction.options.getFocused(),
        values = GMCTechs.skillTechs.filter((choice) => choice.name.startsWith(focusedVal));
      return interaction.respond(values.map((choice) => ({ name: choice.name, value: choice.id })));
    }

    switch (interaction.options.getSubcommand()) {
    case 'starfell_sword': {
      const selectedID = interaction.options.getString('techs'),
        skill = GMCTechs.skillTechs.find((tech) => tech.id === selectedID);
      console.log(selectedID);
      return interaction.reply({
        content: `**${skill.name}** \n\n${skill.gif}`
      });
    }

    case 'guide': {
      return interaction.reply({
        content: 'https://keqingmains.com/gmc'
      });
    }

      // no default
    }
  }
});
