import { Command } from '@ruinguard/core';
// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { giveRoleMulti } from '../subcommands/give-role_multi.js';
import { giveRoleOne } from '../subcommands/give-role_one.js';
import roleIDs from '../lib/roleIDs.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('give-role')
    .setDescription('Gives role to a selected user!')
    .addSubcommand((subcommand) => subcommand
      .setName('multi')
      .setDescription('Give multiple roles')
      .addUserOption((option) => option.setName('user').setDescription('Select user')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('give-one-role')
      .setDescription('Gives role to a selected user!')
      .addUserOption((option) => option.setName('user').setDescription('Select user')
        .setRequired(true))
      .addStringOption((option) => option
        .setName('one')
        .setDescription('Give one role')
        .setRequired(true)
        .addChoice('Abyssal Conqueror 🌀', '804225878685908992')
        .addChoice('Ten\'nō of Thunder 👑⛈️', '856509454970781696')
        .addChoice('Jūnzhǔ of Earth 👑🌏', '816210137613205554')
        .addChoice('Herrscher of Wind 👑🌬️', '815938264875532298')
        .addChoice('Illustrious in Inazuma 🚶⛈️', '809026481112088596')
        .addChoice('Legend in Liyue 🚶🌏', '804595502960214026')
        .addChoice('Megastar in Mondstadt 🚶🌬️', '804595515437613077')
        .addChoice('Affluent Adventurer 💰', '804010525411246140')
        .addChoice('Arbitrator of Fate 👑', roleIDs.NonEleCrownID))),

  /**
   * gives role to selected user
   * @async
   * @function run
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    switch (interaction.options.getSubcommand) {
    case 'multi': {
      await giveRoleMulti(interaction);
      break;
    }
    case 'one': {
      await giveRoleOne(interaction);
      break;
    }
      // no default
    }
  }
});
