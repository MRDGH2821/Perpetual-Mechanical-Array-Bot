import CheckRolePerms from '../lib/staff-roles.js';
import { Command } from '@ruinguard/core';
// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { leaderboard_register } from '../subcommands/leaderboard_register.js';
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
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('refresh_cache')
      .setDescription('Refresh leaderboard cache')),

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
      await leaderboard_register(interaction);
      break;
    }

    case 'refresh_cache': {
      console.log('refresh subcommand selected');
      const isMod = new CheckRolePerms(interaction.member);

      if (isMod.isStaff(interaction.member)) {
        await interaction.reply({
          content:
              'Refresh initiated, please wait for some time before viewing leaderboard',
          ephemeral: true
        });
        interaction.client.emit('leaderboardRefresh', interaction.client);
      }
      else {
        await interaction.reply({
          content:
              'Only mods can force a refresh, since it is a time consuming operation',
          ephemeral: true
        });
      }
      break;
    }
      // no default
    }
  }
});
