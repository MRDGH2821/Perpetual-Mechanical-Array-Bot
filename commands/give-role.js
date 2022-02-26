import { Command } from '@ruinguard/core';
import { EmbedColorHex } from '../lib/constants.js';
import { PepeKekPoint } from '../lib/emoteIDs.js';
import PermCheck from '../lib/staff-roles.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('give-role')
    .setDescription('Gives role to a selected user!')
    .addUserOption((option) => option.setName('user').setDescription('Select user')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('role')
      .setDescription('Select role to give')
      .setRequired(true)
      .addChoice('Abyssal Conqueror 🌀', '804225878685908992')
      .addChoice('Arbitrator of Fate 👑', '859430358419243038')
      .addChoice('Ten\'nō of Thunder 👑⛈️', '856509454970781696')
      .addChoice('Jūnzhǔ of Earth 👑🌏', '816210137613205554')
      .addChoice('Herrscher of Wind 👑🌬️', '815938264875532298')
      .addChoice('Illustrious in Inazuma 🚶⛈️', '809026481112088596')
      .addChoice('Legend in Liyue 🚶🌏', '804595502960214026')
      .addChoice('Megastar in Mondstadt 🚶🌬️', '804595515437613077')
      .addChoice('Affluent Adventurer 💰', '804010525411246140')),

  async run(interaction) {
    const permcheck = new PermCheck(interaction.member),
      role = await interaction.options.getString('role'),
      user = await interaction.options.getMember('user');

    if (permcheck.isStaff() || permcheck.canGibRole()) {
      user.roles.add(role);
      await interaction.reply({
        embeds: [
          {
            color: EmbedColorHex,
            description: `<@&${role}> given to ${user}`,
            title: '**Role Given!**'
          }
        ]
      });
      await interaction.followUp({
        content: `>award ${user.id} 250`,
        ephemeral: true
      });
      await interaction.followUp({
        content:
          'Copy paste that command. And a message by <@!485962834782453762> should come up like [this](https://i.imgur.com/yQvOAzZ.png)',
        ephemeral: true
      });
    }
    else {
      await interaction.reply({
        content: `You can't give roles, not even to yourself ${PepeKekPoint}`,
        ephemeral: true
      });
    }
  }
});
