import { SlashCommandBuilder } from '@discordjs/builders';
// eslint-disable-next-line no-unused-vars
import { Command, CommandInteraction } from '@ruinguard/core';
import { ROLE_IDS } from '../../lib/Constants.js';
import giveRoleMulti from '../subcommands/giveRoleMulti.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('give-role')
    .setDescription('Gives role to selected user!')
    .addSubcommand((subcommand) => subcommand
      .setName('multi')
      .setDescription('Give multiple roles')
      .addUserOption((option) => option.setName('user').setDescription('Select User')))
    .addSubcommand((subcommand) => subcommand
      .setName('one')
      .setDescription('Give one role')
      .addUserOption((option) => option.setName('user').setDescription('Select user'))
      .addStringOption((option) => option
        .setName('role')
        .setDescription('Give one role')
        .setRequired(true)
        .addChoices(
          {
            name: 'Abyssal Conqueror 🌀',
            value: ROLE_IDS.ABYSSAL_CONQUEROR,
          },
          {
            name: "Ten'nō of Thunder 👑⛈️",
            value: ROLE_IDS.CROWN.ELECTRO,
          },
          {
            name: 'Jūnzhǔ of Earth 👑🌏',
            value: ROLE_IDS.CROWN.GEO,
          },
          {
            name: 'Herrscher of Wind 👑🌬️',
            value: ROLE_IDS.CROWN.ANEMO,
          },
          {
            name: 'Illustrious in Inazuma 🚶⛈️',
            value: ROLE_IDS.REPUTATION.INAZUMA,
          },
          {
            name: 'Legend in Liyue 🚶🌏',
            value: ROLE_IDS.REPUTATION.LIYUE,
          },
          {
            name: 'Megastar in Mondstadt 🚶🌬️',
            value: ROLE_IDS.REPUTATION.MONDSTADT,
          },
          {
            name: 'Affluent Adventurer 💰',
            value: ROLE_IDS.WHALE,
          },
          {
            name: 'Arbitrator of Fate 👑',
            value: ROLE_IDS.CROWN.NON_ELE,
          },
        ))),

  /**
   * @async
   * @function run
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'multi': {
        giveRoleMulti(interaction);
      }
      // no default
    }
  },
});
