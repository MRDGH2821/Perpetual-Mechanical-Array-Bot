import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '@ruinguard/core';
import PermCheck from '../lib/staff-roles.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('give-role')
    .setDescription('Gives role to a selected user!')
    .addUserOption(option => option.setName('user').setDescription('Select user').setRequired(true))
    .addStringOption(option => option
      .setName('role')
      .setDescription('Select role to give')
      .setRequired(true)
      .addChoice('Abyssal Conqueror 🌀', '804225878685908992')
      .addChoice('Arbitrator of Fate 👑', '859430358419243038')
      .addChoice(`Ten'nō of Thunder 👑⛈️`, '856509454970781696')
      .addChoice(`Jūnzhǔ of Earth 👑🌏`, '816210137613205554')
      .addChoice('Herrscher of Wind 👑🌬️', '815938264875532298')
      .addChoice('Illustrious in Inazuma 🚶⛈️', '809026481112088596')
      .addChoice('Legend in Liyue 🚶🌏', '804595502960214026')
      .addChoice('Megastar in Mondstadt 🚶🌬️', '804595515437613077')
      .addChoice('Affluent Adventurer 💰', '804010525411246140')),

  flags: [1 << 28],

  async run(interaction) {
    const user = await interaction.options.getMember('user');
    const role = await interaction.options.getString('role');
    const permcheck = new PermCheck(interaction.member);

    if (permcheck.isStaff() || permcheck.canGibRole()) {
      user.roles.add(role);
      await interaction.reply({
        embeds: [
          {
            color: 0x524437,
            title: '**Role Given!**',
            description: `<@&${role}> given to ${user}`,
          },
        ],
      });
      await interaction.followUp({
        content: `>award ${user.id} 250`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `You can't give roles, not even to yourself <:PepeKekPoint:849624262625198131>`,
        ephemeral: true,
      });
    }
  },
});
