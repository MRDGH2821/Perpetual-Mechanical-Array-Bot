import { Command } from '@ruinguard/core';
// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { leaderboard_dmg } from '../subcommands/leaderboard_dmg.js';
import { leaderboard_view } from '../subcommands/leaderboard_view.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Leaderboard commands')
    .addSubcommand((subcommand) => subcommand
      .setName('view')
      .setDescription('view Damage Leaderboard')
      .addStringOption((option) => option
        .setName('category')
        .setDescription('Damage category')
        .setRequired(true)
        .addChoice('Anemo: Palm Vortex', 'anemo-dmg-skill')
        .addChoice('Geo: Starfell Sword', 'geo-dmg-skill')
        .addChoice('Electro: Lightening Blade', 'electro-dmg-skill')
        .addChoice('Universal: 5th Normal Atk dmg', 'uni-dmg-n5')))
    .addSubcommand((subcommand) => subcommand
      .setName('register')
      .setDescription('Register score')
      .addUserOption((option) => option
        .setName('contestant')
        .setDescription('Who made the score? (You can put User ID as well)')
        .setRequired(true))
      .addStringOption((option) => option
        .setName('category')
        .setDescription('Damage category')
        .setRequired(true)
        .addChoice('Anemo: Palm Vortex', 'anemo-dmg-skill')
        .addChoice('Geo: Starfell Sword', 'geo-dmg-skill')
        .addChoice('Electro: Lightening Blade', 'electro-dmg-skill')
        .addChoice('Universal: 5th Normal Atk dmg', 'uni-dmg-n5'))
      .addStringOption((option) => option
        .setName('group_type')
        .setDescription('Type category')
        .setRequired(true)
        .addChoice('Solo', 'solo')
        .addChoice('Open', 'open'))
      .addIntegerOption((option) => option
        .setName('score')
        .setDescription('Score i.e. Damage value')
        .setRequired(true))
      .addStringOption((option) => option
        .setName('proof_link')
        .setDescription('Upload proof on traveler showcase channel & copy link to message')
        .setRequired(true))),

  /**
   *
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    switch (interaction.options.getSubcommand()) {
    case 'view': {
      console.log('view subcommand selected');
      await leaderboard_view(interaction);
      break;
    }

    case 'register': {
      console.log('register subcommand selected');
      await leaderboard_dmg(interaction);
      break;
    }
      // no default
    }
  }
});
