import { Command, CommandFlags } from '@ruinguard/core';
// eslint-disable-next-line no-unused-vars
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Bonk from '../lib/bonk-utilities.js';
import { EmbedColor } from '../lib/constants.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('bonk')
    .setDescription('Select a member to bonk them')
    .addUserOption((option) => option
      .setName('target')
      .setDescription('The member to bonk')
      .setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('Reason to bonk')),

  flags: [CommandFlags.FLAGS.GUILD_ONLY],

  /**
   * bonk a user
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    let reason = interaction.options.getString('reason') || 'none';

    const bonk = new Bonk(reason),
      bonkTarget = interaction.options.getUser('target'),
      embedMsg = new MessageEmbed()
        .setTitle('**Bonked!**')
        .setColor(EmbedColor)
        .setThumbnail(bonkTarget.displayAvatarURL({ dynamic: true })),
      isSelf = bonkTarget === interaction.user;

    if (reason === 'none') {
      reason = bonk.bonkReason();
    }

    if (bonk.isHorny(reason)) {
      if (isSelf) {
        embedMsg.setImage(bonk.selfHornyBonkGif());
      }
      else {
        embedMsg.setImage(bonk.hornyBonkGif());
      }
    }
    else {
      embedMsg.setImage(bonk.bonkGif());
    }

    embedMsg.setDescription(`${bonkTarget} has been bonked!\nReason: ${reason}`);

    await interaction.reply({
      embeds: [embedMsg]
    });
  }
});
