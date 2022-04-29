import { SlashCommandBuilder } from '@discordjs/builders';
import { Command, MessageEmbed } from '@ruinguard/core';
import BonkUtilities from '../../lib/BonkUtilities.js';
import { EMBED_COLOR } from '../../lib/Constants.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('bonk')
    .setDescription('Select a member to bonk them')
    .addUserOption((option) => option
      .setName('target')
      .setDescription('The member to bonk')
      .setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('Reason to bonk'))
    .addBooleanOption((option) => option.setName('is_horny').setDescription('Is the target horny?')),

  /**
   * bonk a user
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    let reason = interaction.options.getString('reason') || 'none';

    const bonk = new BonkUtilities(reason);
    const bonkTarget = interaction.options.getUser('target');
    const embedMsg = new MessageEmbed()
      .setTitle('**Bonked!**')
      .setColor(EMBED_COLOR)
      .setThumbnail(bonkTarget.displayAvatarURL({ dynamic: true }));
    const isSelf = bonkTarget === interaction.user;
    const isHorny = interaction.options.getBoolean('is_horny') || false;

    if (reason === 'none') {
      if (isHorny) {
        reason = bonk.bonkHornyReason();
      } else {
        reason = bonk.bonkReason();
      }
    }

    if (isHorny || bonk.isHorny(reason)) {
      if (isSelf) {
        embedMsg.setImage(bonk.selfHornyBonkGif());
      } else {
        embedMsg.setImage(bonk.hornyBonkGif());
      }
    } else {
      embedMsg.setImage(bonk.bonkGif());
    }

    embedMsg.setDescription(
      `${bonkTarget} has been bonked!\nReason: ${reason}`,
    );

    await interaction.reply({
      embeds: [embedMsg],
    });
  },
});
